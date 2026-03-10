import { AppDataSource } from '@/config/database';
import { CreditCard } from '@/models/CreditCard';
import { NotFoundError } from '@/utils/errors';

export class CreditCardService {
  private repository = AppDataSource.getRepository(CreditCard);

  async create(userId: string, data: Partial<CreditCard>): Promise<CreditCard> {
    const card = this.repository.create({
      ...data,
      userId,
    });
    return await this.repository.save(card);
  }

  async findAll(userId: string): Promise<CreditCard[]> {
    return await this.repository.find({
      where: { userId },
      order: { name: 'ASC' },
    });
  }

  async findById(id: string, userId: string): Promise<CreditCard> {
    const card = await this.repository.findOne({
      where: { id, userId },
    });

    if (!card) {
      throw new NotFoundError('Cartão não encontrado');
    }

    return card;
  }

  async update(id: string, userId: string, data: Partial<CreditCard>): Promise<CreditCard> {
    const card = await this.findById(id, userId);
    
    Object.assign(card, data);
    card.updatedAt = new Date();
    
    return await this.repository.save(card);
  }

  async delete(id: string, userId: string): Promise<void> {
    const card = await this.findById(id, userId);
    await this.repository.remove(card);
  }
}
