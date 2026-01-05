import { AppDataSource } from '@/config/database';
import { User } from '@/models/User';
import { NotFoundError, ConflictError, UnauthorizedError, BadRequestError } from '@/utils/errors';
import fs from 'fs/promises';
import path from 'path';
import { supabase } from '@/config/supabase';
import { config } from '@/config/env';

export class UserService {
  private userRepository = AppDataSource.getRepository(User);
  private readonly bucket = config.supabase.bucket || 'avatars';

  private getStoragePathFromUrl(url?: string | null) {
    if (!url || !config.supabase.url) return null;
    const normalizedUrl = config.supabase.url.replace(/\/$/, '');
    const publicPrefix = `${normalizedUrl}/storage/v1/object/public/${this.bucket}/`;
    if (url.startsWith(publicPrefix)) {
      return url.replace(publicPrefix, '');
    }
    return null;
  }

  private async removeAvatarFromStorage(url?: string | null) {
    const path = this.getStoragePathFromUrl(url);
    if (!path) return;
    const { error } = await supabase.storage.from(this.bucket).remove([path]);
    if (error) {
      console.warn('Erro ao remover avatar anterior do Supabase:', error.message);
    }
  }

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

    if (typeof data.name === 'string') {
      user.name = data.name;
    }

    if (typeof data.email === 'string') {
      user.email = data.email;
    }
    await this.userRepository.save(user);
    return user.toJSON();
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundError('Usuário não encontrado');
    }

    // Verificar senha atual
    if (!(await user.comparePassword(currentPassword))) {
      throw new UnauthorizedError('Senha atual incorreta');
    }

    // Verificar se a nova senha é diferente da atual
    if (currentPassword === newPassword) {
      throw new BadRequestError('A nova senha deve ser diferente da senha atual');
    }

    // Validar força da nova senha
    const { PasswordValidator } = await import('@/utils/passwordValidator');
    const validation = PasswordValidator.validate(newPassword);
    
    if (!validation.isValid) {
      throw new BadRequestError(validation.errors.join('. '));
    }

    // Calcular e logar força da senha
    const strength = PasswordValidator.calculateStrength(newPassword);
    const description = PasswordValidator.getStrengthDescription(strength);
    console.log(`🔐 Nova senha: ${description} (${strength}%)`);

    user.password = newPassword;
    await this.userRepository.save(user);
  }

  async uploadAvatar(userId: string, file: any) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundError('Usuário não encontrado');
    }

    try {
      if (!config.supabase.url || !config.supabase.serviceRoleKey) {
        throw new Error('Supabase Storage não configurado');
      }

      const fileExt = path.extname(file.originalname) || '.png';
      const fileName = `avatar-${userId}-${Date.now()}${fileExt}`;
      const filePath = `${userId}/${fileName}`;
      const fileBuffer = await fs.readFile(file.path);

      // Upload para Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from(this.bucket)
        .upload(filePath, fileBuffer, {
          upsert: true,
          contentType: file.mimetype,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Obter URL pública
      const { data: publicData } = supabase.storage.from(this.bucket).getPublicUrl(filePath);
      const publicUrl = publicData?.publicUrl;

      if (!publicUrl) {
        throw new Error('Erro ao gerar URL pública do avatar');
      }

      // Remover avatar anterior se existia
      await this.removeAvatarFromStorage(user.avatar);

      user.avatar = publicUrl;
      await this.userRepository.save(user);

      // Deletar arquivo temporário
      await fs.unlink(file.path);

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

    // Deletar avatar armazenado no Supabase (se houver)
    await this.removeAvatarFromStorage(user.avatar);

    // Deletar usuário (cascade vai deletar transações, categorias, etc)
    await this.userRepository.remove(user);
  }
}
