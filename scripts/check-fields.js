const { MongoClient } = require('mongodb');

async function checkFields() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/mbti_test';
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    const collection = db.collection('personalitydetailinfos');
    
    // Lấy 1 record để xem cấu trúc
    const sampleRecord = await collection.findOne();
    
    console.log('\n=== Cấu trúc dữ liệu thực tế ===');
    console.log('Các trường có sẵn:', Object.keys(sampleRecord));
    console.log('\nGiá trị các trường:');
    console.log('_id:', sampleRecord._id);
    console.log('type:', sampleRecord.type);
    console.log('name:', sampleRecord.name);
    console.log('title:', sampleRecord.title);
    console.log('description:', sampleRecord.description?.substring(0, 100) + '...');
    
    // Kiểm tra 3 records đầu
    console.log('\n=== 3 records đầu ===');
    const records = await collection.find().limit(3).toArray();
    records.forEach((record, index) => {
      console.log(`Record ${index + 1}:`);
      console.log('  type:', record.type);
      console.log('  name:', record.name);
      console.log('  title:', record.title);
      console.log('  description preview:', record.description?.substring(0, 50) + '...');
      console.log('');
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
    console.log('Database connection closed');
  }
}

checkFields(); 