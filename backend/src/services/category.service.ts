import { AppDataSource } from '@/config/database';
import { Category, CategoryType } from '@/models/Category';
import { NotFoundError } from '@/utils/errors';

export class CategoryService {
  private categoryRepository = AppDataSource.getRepository(Category);

  async create(userId: string, data: { name: string; type: CategoryType; color: string; icon: string }) {
    const category = this.categoryRepository.create({ ...data, userId });
    await this.categoryRepository.save(category);
    return category;
  }

  async findAll(userId: string, type?: CategoryType) {
    const where: any = { userId };
    if (type) {
      where.type = type;
    }
    
    return this.categoryRepository.find({ 
      where, 
      order: { name: 'ASC' } 
    });
  }

  async findById(id: string, userId: string) {
    const category = await this.categoryRepository.findOne({ 
      where: { id, userId } 
    });
    
    if (!category) {
      throw new NotFoundError('Categoria não encontrada');
    }
    
    return category;
  }

  async update(id: string, userId: string, data: Partial<Category>) {
    const category = await this.findById(id, userId);
    Object.assign(category, data);
    await this.categoryRepository.save(category);
    return category;
  }

  async delete(id: string, userId: string) {
    const category = await this.findById(id, userId);
    await this.categoryRepository.remove(category);
  }
}
