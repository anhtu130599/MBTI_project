const mongoose = require('mongoose');

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mbti_career_test';

async function createUniqueIndex() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully');

    // Get the questions collection
    const db = mongoose.connection.db;
    const questionsCollection = db.collection('questions');

    console.log('🔍 Checking existing indexes...');
    const indexes = await questionsCollection.indexes();
    console.log('Current indexes:', indexes.map(idx => idx.name));

    // Check if unique index on text field already exists
    const textIndexExists = indexes.some(idx => 
      idx.key && idx.key.text === 1 && idx.unique === true
    );

    if (textIndexExists) {
      console.log('✅ Unique index on text field already exists');
      return;
    }

    console.log('📝 Creating unique index on text field...');
    
    // Create unique index on text field
    await questionsCollection.createIndex(
      { text: 1 }, 
      { 
        unique: true,
        name: 'text_unique_index',
        collation: { locale: 'en', strength: 2 } // Case-insensitive
      }
    );

    console.log('✅ Unique index created successfully on text field');
    console.log('📊 This will prevent duplicate questions from being added');

  } catch (error) {
    console.error('❌ Error creating unique index:', error);
    
    if (error.code === 11000) {
      console.log('⚠️  Duplicate key error detected');
      console.log('💡 This means there are already duplicate questions in the database');
      console.log('🔧 You may need to clean up duplicate questions first');
    }
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the script
createUniqueIndex(); 