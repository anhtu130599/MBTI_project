// Script để tạo tài khoản admin đầu tiên
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const readline = require('readline');

// Kết nối đến MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mbti_db';

// Định nghĩa schema User
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
  lastLogin: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Hash mật khẩu trước khi lưu
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Tạo model User
const User = mongoose.model('User', UserSchema);

// Tạo interface để nhập thông tin từ người dùng
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Hàm để hỏi thông tin
function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

// Hàm chính để tạo tài khoản admin
async function createAdmin() {
  try {
    console.log('=== Tạo tài khoản Admin ===');
    
    // Kết nối đến MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Đã kết nối đến MongoDB');
    
    // Kiểm tra xem đã có admin chưa
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('Đã tồn tại tài khoản admin trong hệ thống:');
      console.log(`Username: ${existingAdmin.username}`);
      console.log(`Email: ${existingAdmin.email}`);
      
      const createAnother = await askQuestion('Bạn có muốn tạo thêm tài khoản admin khác? (y/n): ');
      if (createAnother.toLowerCase() !== 'y') {
        console.log('Thoát chương trình.');
        rl.close();
        await mongoose.connection.close();
        return;
      }
    }
    
    // Nhập thông tin admin
    const username = await askQuestion('Nhập tên đăng nhập: ');
    const email = await askQuestion('Nhập email: ');
    const password = await askQuestion('Nhập mật khẩu (ít nhất 6 ký tự): ');
    
    // Kiểm tra thông tin
    if (!username || !email || !password) {
      console.log('Vui lòng cung cấp đầy đủ thông tin!');
      rl.close();
      await mongoose.connection.close();
      return;
    }
    
    if (password.length < 6) {
      console.log('Mật khẩu phải có ít nhất 6 ký tự!');
      rl.close();
      await mongoose.connection.close();
      return;
    }
    
    // Kiểm tra xem username hoặc email đã tồn tại chưa
    const existingUser = await User.findOne({
      $or: [{ username }, { email }]
    });
    
    if (existingUser) {
      console.log('Tên đăng nhập hoặc email đã tồn tại!');
      rl.close();
      await mongoose.connection.close();
      return;
    }
    
    // Tạo tài khoản admin
    const admin = new User({
      username,
      email,
      password,
      role: 'admin'
    });
    
    await admin.save();
    
    console.log('\nĐã tạo tài khoản admin thành công:');
    console.log(`Username: ${username}`);
    console.log(`Email: ${email}`);
    console.log('Role: admin');
    
    rl.close();
    await mongoose.connection.close();
    console.log('Đã đóng kết nối MongoDB.');
  } catch (error) {
    console.error('Lỗi:', error);
    rl.close();
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('Đã đóng kết nối MongoDB.');
    }
  }
}

// Chạy hàm tạo admin
createAdmin(); 