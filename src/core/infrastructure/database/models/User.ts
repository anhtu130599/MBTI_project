import mongoose, { Schema, Document } from 'mongoose';
import { User as UserEntity } from '@/core/domain/entities/User';

export interface UserDocument extends Omit<UserEntity, 'id'>, Document {
  _id: mongoose.Types.ObjectId;
  lastLogin?: Date;
}

const UserSchema = new Schema<UserDocument>({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30,
    match: /^[a-zA-Z0-9_]+$/,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: false,
    trim: true,
  },
  lastName: {
    type: String,
    required: false,
    trim: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  personalityType: {
    type: String,
    optional: true,
  },
  profilePicture: {
    type: String,
    optional: true,
  },
  lastLogin: {
    type: Date,
    optional: true,
  },
}, {
  timestamps: true,
});

const User = mongoose.models.User || mongoose.model<UserDocument>('User', UserSchema);

export default User; 