import { User, CreateUserDto, UpdateUserDto } from '@/core/domain/entities/User';

export interface IUserRepository {
  create(userData: CreateUserDto): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  update(id: string, userData: UpdateUserDto): Promise<User>;
  delete(id: string): Promise<void>;
  findAll(page?: number, limit?: number): Promise<{
    users: User[];
    total: number;
    page: number;
    limit: number;
  }>;
  verifyUser(id: string): Promise<User>;
  updatePassword(id: string, hashedPassword: string): Promise<void>;
} 
