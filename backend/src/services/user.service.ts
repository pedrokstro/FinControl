import { AppDataSource } from '@/config/database';
import { User } from '@/models/User';
import { NotFoundError, ConflictError, UnauthorizedError } from '@/utils/errors';
import cloudinary from '@/config/cloudinary';
import fs from 'fs/promises';

export class UserService {
  private userRepository = AppDataSource.getRepository(User);

  async getProfile(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundError('Usuário não encontrado');
    }
    return user.toJSON();
  }

  async updateProfile(userId: string, data: { name?: string; email?: string }) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundError('Usuário não encontrado');
    }

    if (data.email && data.email !== user.email) {
      const existing = await this.userRepository.findOne({ where: { email: data.email } });
      if (existing) {
        throw new ConflictError('Email já em uso');
      }
    }

    Object.assign(user, data);
    await this.userRepository.save(user);
    return user.toJSON();
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundError('Usuário não encontrado');
    }

    if (!(await user.comparePassword(currentPassword))) {
      throw new UnauthorizedError('Senha atual incorreta');
    }

    user.password = newPassword;
    await this.userRepository.save(user);
  }

  async uploadAvatar(userId: string, file: any) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundError('Usuário não encontrado');
    }

    try {
      // Upload para Cloudinary
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'fincontrol/avatars',
        public_id: `avatar-${userId}`,
        overwrite: true,
        transformation: [
          { width: 400, height: 400, crop: 'fill', gravity: 'face' },
          { quality: 'auto', fetch_format: 'auto' }
        ]
      });

      // Deletar arquivo temporário
      await fs.unlink(file.path);

      // Deletar avatar anterior do Cloudinary se existir e for diferente
      if (user.avatar && user.avatar.includes('cloudinary')) {
        try {
          const publicId = user.avatar.split('/').slice(-2).join('/').split('.')[0];
          await cloudinary.uploader.destroy(publicId);
        } catch (error) {
          console.log('Erro ao deletar avatar anterior:', error);
        }
      }

      // Salvar URL do Cloudinary
      user.avatar = result.secure_url;
      await this.userRepository.save(user);
      return user.toJSON();
    } catch (error) {
      // Deletar arquivo temporário em caso de erro
      try {
        await fs.unlink(file.path);
      } catch {}
      throw error;
    }
  }

  async deleteAccount(userId: string, password: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundError('Usuário não encontrado');
    }

    // Verificar senha
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error('Senha incorreta');
    }

    // Deletar avatar do Cloudinary se existir
    if (user.avatar && user.avatar.includes('cloudinary')) {
      try {
        const publicId = user.avatar.split('/').slice(-2).join('/').split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      } catch (error) {
        console.log('Erro ao deletar avatar:', error);
      }
    }

    // Deletar usuário (cascade vai deletar transações, categorias, etc)
    await this.userRepository.remove(user);
  }
}
