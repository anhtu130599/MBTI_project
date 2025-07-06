const { MongoClient } = require('mongodb');

async function checkCollections() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/mbti_test';
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    
    // List all collections
    const collections = await db.listCollections().toArray();
    console.log('\n=== Các collection có sẵn ===');
    collections.forEach(collection => {
      console.log('- ' + collection.name);
    });
    
    // Check personalitydetailinfos collection
    const personalityCollection = db.collection('personalitydetailinfos');
    const count = await personalityCollection.countDocuments();
    console.log(`\n=== Collection personalitydetailinfos ===`);
    console.log(`Số lượng documents: ${count}`);
    
    if (count > 0) {
      const sample = await personalityCollection.findOne();
      console.log('\nSample document:');
      console.log(JSON.stringify(sample, null, 2));
    }
    
    // Check other possible collections
    const otherCollections = ['personalitytypes', 'personality_types', 'mbti_types'];
    for (const collName of otherCollections) {
      const coll = db.collection(collName);
      const count = await coll.countDocuments();
      if (count > 0) {
        console.log(`\n=== Collection ${collName} ===`);
        console.log(`Số lượng documents: ${count}`);
        const sample = await coll.findOne();
        console.log('Sample document:');
        console.log(JSON.stringify(sample, null, 2));
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
    console.log('\nDatabase connection closed');
  }
}

checkCollections(); 