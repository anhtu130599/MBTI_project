// Script để debug user object từ database
const mongoose = require('mongoose');

// Kết nối đến MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mbti_db';

// Định nghĩa schema User
const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  firstName: String,
  lastName: String,
  password: String,
  role: String,
  isVerified: Boolean,
  lastLogin: Date
}, {
  timestamps: true
});

const User = mongoose.model('User', UserSchema);

async function debugUser() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Đã kết nối MongoDB');

    // Tìm user test
    const user = await User.findOne({ username: 'testuser' }).select('-password');
    
    if (user) {
      console.log('User object từ database:');
      console.log(JSON.stringify(user.toObject(), null, 2));
      
      console.log('\nCác properties của user:');
      console.log('username:', user.username);
      console.log('firstName:', user.firstName);
      console.log('lastName:', user.lastName);
      console.log('email:', user.email);
      console.log('role:', user.role);
    } else {
      console.log('Không tìm thấy user testuser');
    }

  } catch (error) {
    console.error('Lỗi:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('Đã ngắt kết nối MongoDB');
  }
}

debugUser(); 