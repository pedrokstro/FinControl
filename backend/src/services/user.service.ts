import { AppDataSource } from '@/config/database';
import { User } from '@/models/User';
import { NotFoundError, ConflictError, UnauthorizedError } from '@/utils/errors';
// import sharp from 'sharp'; // Temporariamente desabilitado
import path from 'path';
import fs from 'fs/promises';
import { config } from '@/config/env';

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

    // TODO: Processar imagem com sharp (temporariamente desabilitado)
    // Por enquanto, apenas salva o arquivo original
    const filename = `avatar-${userId}-${Date.now()}${path.extname(file.originalname)}`;
    const avatarDir = path.join(config.upload.dir, 'avatars');
    const outputPath = path.join(avatarDir, filename);

    // Copiar arquivo para o destino
    await fs.copyFile(file.path, outputPath);
    
    // Deletar arquivo original
    await fs.unlink(file.path);

    // Deletar avatar anterior se existir
    if (user.avatar) {
      try {
        const oldAvatarPath = path.join(config.upload.dir, user.avatar);
        await fs.unlink(oldAvatarPath);
      } catch (error) {
        // Ignora se arquivo não existir
      }
    }

    // Salvar apenas o caminho relativo com barras normais (/)
    const relativePath = `avatars/${filename}`;
    user.avatar = relativePath;
    await this.userRepository.save(user);
    return user.toJSON();
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

    // Deletar avatar se existir
    if (user.avatar) {
      try {
        const avatarPath = path.join(config.upload.dir, user.avatar);
        await fs.unlink(avatarPath);
      } catch (error) {
        // Ignora se arquivo não existir
      }
    }

    // Deletar usuário (cascade vai deletar transações, categorias, etc)
    await this.userRepository.remove(user);
  }
}
