const mongoose = require('mongoose');

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mbti_career_test';

async function cleanupDuplicateQuestions() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully');

    // Get the questions collection
    const db = mongoose.connection.db;
    const questionsCollection = db.collection('questions');

    console.log('🔍 Finding duplicate questions...');
    
    // Find duplicate questions using aggregation
    const duplicates = await questionsCollection.aggregate([
      {
        $group: {
          _id: { $toLower: "$text" }, // Case-insensitive grouping
          count: { $sum: 1 },
          docs: { $push: "$$ROOT" }
        }
      },
      {
        $match: {
          count: { $gt: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]).toArray();

    if (duplicates.length === 0) {
      console.log('✅ No duplicate questions found!');
      return;
    }

    console.log(`⚠️  Found ${duplicates.length} groups of duplicate questions:`);
    
    let totalDuplicates = 0;
    let keptQuestions = 0;
    let removedQuestions = 0;

    for (const group of duplicates) {
      const questionText = group.docs[0].text;
      const count = group.count;
      totalDuplicates += count;
      
      console.log(`\n📝 Question: "${questionText}"`);
      console.log(`   Found ${count} duplicates`);
      
      // Sort by creation date (keep the oldest one)
      const sortedDocs = group.docs.sort((a, b) => 
        new Date(a.createdAt) - new Date(b.createdAt)
      );
      
      const toKeep = sortedDocs[0];
      const toRemove = sortedDocs.slice(1);
      
      console.log(`   ✅ Keeping: ${toKeep._id} (created: ${toKeep.createdAt})`);
      console.log(`   🗑️  Removing: ${toRemove.length} duplicates`);
      
      // Remove duplicate questions
      const idsToRemove = toRemove.map(doc => doc._id);
      const deleteResult = await questionsCollection.deleteMany({
        _id: { $in: idsToRemove }
      });
      
      keptQuestions++;
      removedQuestions += deleteResult.deletedCount;
      
      console.log(`   ✅ Removed ${deleteResult.deletedCount} duplicates`);
    }

    console.log(`\n📊 Summary:`);
    console.log(`   Total duplicate groups: ${duplicates.length}`);
    console.log(`   Total duplicate questions: ${totalDuplicates}`);
    console.log(`   Questions kept: ${keptQuestions}`);
    console.log(`   Questions removed: ${removedQuestions}`);

    console.log('\n✅ Cleanup completed successfully!');
    console.log('💡 You can now run the create-unique-index.js script to prevent future duplicates');

  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the script
cleanupDuplicateQuestions(); 