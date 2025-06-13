// Script để kiểm tra dữ liệu trong MongoDB
const mongoose = require('mongoose');

// Kết nối đến MongoDB
mongoose.connect('mongodb://localhost:27017/mbti_db')
  .then(async () => {
    console.log('Connected to MongoDB!');
    
    // Kiểm tra collection personalitytypes
    const personalityTypes = await mongoose.connection.db.collection('personalitytypes').find({}).toArray();
    console.log(`\nFound ${personalityTypes.length} personality types in the database:`);
    personalityTypes.forEach((type, index) => {
      console.log(`${index + 1}. ${type.id} - ${type.name}`);
    });
    
    // Kiểm tra collection testresults
    const testResults = await mongoose.connection.db.collection('testresults').find({}).toArray();
    console.log(`\nFound ${testResults.length} test results in the database:`);
    testResults.forEach((result, index) => {
      console.log(`${index + 1}. Type: ${result.personalityType}, Created: ${result.createdAt}`);
    });
    
    // Đóng kết nối
    await mongoose.connection.close();
    console.log('\nMongoDB connection closed.');
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  }); 