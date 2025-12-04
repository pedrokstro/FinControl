import { AppDataSource } from '@/config/database';
import { User } from '@/models/User';
import { RefreshToken } from '@/models/RefreshToken';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '@/utils/jwt';
import { ConflictError, UnauthorizedError, NotFoundError } from '@/utils/errors';

export class AuthService {
  private userRepository = AppDataSource.getRepository(User);
  private refreshTokenRepository = AppDataSource.getRepository(RefreshToken);

  async register(name: string, email: string, password: string) {
    const existingUser = await this.userRepository.findOne({ where: { email } });
    
    if (existingUser) {
      throw new ConflictError('Email já cadastrado');
    }

    const user = this.userRepository.create({ name, email, password });
    await this.userRepository.save(user);

    const tokens = await this.generateTokens(user);
    
    return { user: user.toJSON(), ...tokens };
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    
    if (!user || !(await user.comparePassword(password))) {
      throw new UnauthorizedError('Email ou senha inválidos');
    }

    if (!user.isActive) {
      throw new UnauthorizedError('Usuário inativo');
    }

    const tokens = await this.generateTokens(user);
    
    return { user: user.toJSON(), ...tokens };
  }

  async refreshAccessToken(refreshToken: string) {
    const payload = verifyRefreshToken(refreshToken);
    
    const storedToken = await this.refreshTokenRepository.findOne({
      where: { token: refreshToken, userId: payload.userId },
      relations: ['user'],
    });

    if (!storedToken || storedToken.isRevoked || new Date() > storedToken.expiresAt) {
      throw new UnauthorizedError('Refresh token inválido ou expirado');
    }

    const accessToken = generateAccessToken({
      userId: storedToken.user.id,
      email: storedToken.user.email,
      role: storedToken.user.role,
    });

    return { accessToken };
  }

  async logout(refreshToken: string) {
    const storedToken = await this.refreshTokenRepository.findOne({
      where: { token: refreshToken },
    });

    if (storedToken) {
      storedToken.isRevoked = true;
      await this.refreshTokenRepository.save(storedToken);
    }
  }

  private async generateTokens(user: User) {
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const refreshTokenEntity = this.refreshTokenRepository.create({
      token: refreshToken,
      userId: user.id,
      expiresAt,
    });

    await this.refreshTokenRepository.save(refreshTokenEntity);

    return { accessToken, refreshToken };
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async verifyEmail(email: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { email } });
    
    if (!user) {
      throw new NotFoundError('Usuário não encontrado');
    }

    user.emailVerified = true;
    await this.userRepository.save(user);
  }

  async resetPassword(email: string, newPassword: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { email } });
    
    if (!user) {
      throw new NotFoundError('Usuário não encontrado');
    }

    user.password = newPassword;
    await this.userRepository.save(user);
  }
}
