export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role: 'user' | 'admin';
  isVerified: boolean;
  personalityType?: string;
  profilePicture?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role: 'user' | 'admin';
  isVerified: boolean;
  personalityType?: string;
  profilePicture?: string;
}

export interface UpdateUserDto {
  username?: string;
  firstName?: string;
  lastName?: string;
  personalityType?: string;
  profilePicture?: string;
}

export interface LoginDto {
  username: string;
  password: string;
}

export type UserResponse = Omit<User, 'password'>;

export interface AuthResponse {
  user: UserResponse;
  token: string;
} 
