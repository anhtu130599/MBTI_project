const mongoose = require('mongoose');

// Kết nối database
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mbti_db';

async function testManualSave() {
  try {
    console.log('🧪 Testing manual save functionality...');
    console.log('🔌 Connecting to MongoDB...');
    
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Kiểm tra User và TestResult collections
    const User = mongoose.model('User', new mongoose.Schema({
      username: String,
      email: String,
      password: String,
      role: String,
      isVerified: Boolean
    }, { timestamps: true }));

    const TestResult = mongoose.model('TestResult', new mongoose.Schema({
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      personalityType: String,
      scores: Object,
      percentages: Object,
      careerRecommendations: [String],
      answers: Object,
      totalQuestions: Number
    }, { timestamps: true }));

    // Tìm test user
    const testUser = await User.findOne({ username: 'testuser' });
    if (!testUser) {
      console.log('❌ Test user not found. Run: node scripts/create-test-user.js');
      return;
    }

    console.log('👤 Test user found:', testUser.username);

    // Đếm số test hiện tại
    const currentTestCount = await TestResult.countDocuments({ userId: testUser._id });
    console.log('📊 Current test count:', currentTestCount);

    console.log('\n✅ Manual save test setup completed!');
    console.log('\n📝 How to test:');
    console.log('   1. Take the MBTI test (logged out or logged in)');
    console.log('   2. Go to result page');
    console.log('   3. Click "Lưu vào lịch sử" button');
    console.log('   4. If not logged in → redirects to login');
    console.log('   5. If logged in → saves to database + shows success message');
    console.log('   6. Check Profile page for saved results');

    console.log('\n🎯 Expected behavior:');
    console.log('   - Guest user: Button shows "Đăng nhập và lưu kết quả"');
    console.log('   - Logged user: Button shows "Lưu vào lịch sử tài khoản"');
    console.log('   - After save: Button shows "Đã lưu thành công"');
    console.log('   - No auto-save, only manual save');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

testManualSave().catch(console.error); 