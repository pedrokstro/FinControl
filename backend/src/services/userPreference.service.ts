import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { UserPreference } from '../entities/UserPreference';

export class UserPreferenceService {
  private repository: Repository<UserPreference>;

  constructor() {
    this.repository = AppDataSource.getRepository(UserPreference);
  }

  /**
   * Obter uma preferência específica do usuário
   */
  async get(userId: string, key: string): Promise<string | null> {
    const preference = await this.repository.findOne({
      where: { userId, key },
    });
    return preference?.value || null;
  }

  /**
   * Obter todas as preferências do usuário
   */
  async getAll(userId: string): Promise<Record<string, string>> {
    const preferences = await this.repository.find({
      where: { userId },
    });

    return preferences.reduce((acc, pref) => {
      acc[pref.key] = pref.value;
      return acc;
    }, {} as Record<string, string>);
  }

  /**
   * Definir uma preferência do usuário
   */
  async set(userId: string, key: string, value: string): Promise<UserPreference> {
    // Usar upsert para inserir ou atualizar
    await this.repository.upsert(
      { userId, key, value },
      ['userId', 'key']
    );

    // Buscar e retornar a preferência atualizada
    const preference = await this.repository.findOne({
      where: { userId, key },
    });

    if (!preference) {
      throw new Error('Erro ao salvar preferência');
    }

    return preference;
  }

  /**
   * Definir múltiplas preferências do usuário
   */
  async setMany(userId: string, preferences: Record<string, string>): Promise<void> {
    const entries = Object.entries(preferences).map(([key, value]) => ({
      userId,
      key,
      value,
    }));

    if (entries.length === 0) {
      return;
    }

    await this.repository.upsert(entries, ['userId', 'key']);
  }

  /**
   * Excluir uma preferência do usuário
   */
  async delete(userId: string, key: string): Promise<void> {
    await this.repository.delete({ userId, key });
  }

  /**
   * Excluir todas as preferências do usuário
   */
  async deleteAll(userId: string): Promise<void> {
    await this.repository.delete({ userId });
  }
}
