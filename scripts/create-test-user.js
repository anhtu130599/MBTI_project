// Script để tạo user test với username
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Kết nối đến MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mbti_db';

// Định nghĩa schema User với username
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Email không hợp lệ']
  },
  firstName: {
    type: String,
    required: false,
    trim: true
  },
  lastName: {
    type: String,
    required: false,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', UserSchema);

async function createTestUser() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Đã kết nối MongoDB');

    // Kiểm tra user đã tồn tại chưa
    const existingUser = await User.findOne({ username: 'testuser' });
    if (existingUser) {
      console.log('User test đã tồn tại:');
      console.log('Username: testuser');
      console.log('Password: 123456');
      return;
    }

    // Hash mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('123456', salt);

    // Tạo user test
    const testUser = new User({
      username: 'testuser',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      password: hashedPassword,
      role: 'user',
      isVerified: true
    });

    await testUser.save();
    console.log('Đã tạo user test thành công!');
    console.log('Username: testuser');
    console.log('Password: 123456');
    console.log('Email: test@example.com');

  } catch (error) {
    console.error('Lỗi:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('Đã ngắt kết nối MongoDB');
  }
}

createTestUser(); 