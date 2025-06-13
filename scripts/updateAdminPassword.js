const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mbti_db';

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: String,
});
const User = mongoose.model('User', userSchema);

async function updateAdminPassword() {
  await mongoose.connect(MONGODB_URI);
  const hash = await bcrypt.hash('1234567', 10);
  const result = await User.updateOne(
    { username: 'admin' },
    { $set: { password: hash } }
  );
  console.log('Update result:', result);
  await mongoose.disconnect();
}

updateAdminPassword(); 