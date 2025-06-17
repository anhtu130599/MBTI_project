import { IUserRepository } from '@/core/application/repositories/IUserRepository';
import { LoginDto, AuthResponse } from '@/core/domain/entities/User';

export class LoginUseCase {
  constructor(
    private userRepository: IUserRepository,
    private hashService: { compare: (password: string, hash: string) => Promise<boolean> },
    private tokenService: { generateToken: (userId: string) => string }
  ) {}

  async execute(loginData: LoginDto): Promise<AuthResponse> {
    // Find user by username
    const user = await this.userRepository.findByUsername(loginData.username);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await this.hashService.compare(loginData.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // Check if user is verified
    if (!user.isVerified) {
      throw new Error('Please verify your email before logging in');
    }

    // Generate token
    const token = this.tokenService.generateToken(user.id);

    // Create user response object without password
    const { ...userWithoutPassword } = user;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    delete userWithoutPassword.password;

    return {
      user: userWithoutPassword,
      token
    };
  }
} 
