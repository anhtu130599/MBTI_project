import { User } from '@/core/domain/entities/User';
import { IUserRepository } from '@/core/application/repositories/IUserRepository';

interface LoginCredentials {
  username: string;
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

export class AuthService {
  constructor(private userRepository: IUserRepository) {}

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const user = await this.userRepository.findByUsername(credentials.username);
    if (!user) {
      throw new Error('User not found');
    }

    // TODO: Implement password verification
    // const isValid = await this.verifyPassword(credentials.password, user.password);
    // if (!isValid) {
    //   throw new Error('Invalid password');
    // }

    const token = this.generateToken(user);
    return { user, token };
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const existingUsername = await this.userRepository.findByUsername(data.username);
    if (existingUsername) {
      throw new Error('Username already exists');
    }

    // TODO: Implement password hashing
    // const hashedPassword = await this.hashPassword(data.password);
    const user = await this.userRepository.create({
      username: data.username,
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      role: 'user',
      isVerified: false,
    });

    const token = this.generateToken(user);
    return { user, token };
  }

  private generateToken(user: User): string {
    // TODO: Implement JWT token generation
    return 'dummy-token';
  }
}

// Create a default instance - you might want to inject dependencies differently
const defaultUserRepository: IUserRepository = {
  async create(): Promise<User> { throw new Error('Not implemented'); },
  async findById(): Promise<User | null> { throw new Error('Not implemented'); },
  async findByEmail(): Promise<User | null> { throw new Error('Not implemented'); },
  async findByUsername(): Promise<User | null> { throw new Error('Not implemented'); },
  async update(): Promise<User> { throw new Error('Not implemented'); },
  async delete(): Promise<void> { throw new Error('Not implemented'); },
  async findAll(): Promise<any> { throw new Error('Not implemented'); },
  async verifyUser(): Promise<User> { throw new Error('Not implemented'); },
  async updatePassword(): Promise<void> { throw new Error('Not implemented'); },
};

export const authService = new AuthService(defaultUserRepository); 
