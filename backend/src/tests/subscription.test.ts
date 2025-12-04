import { User } from '../models/User';
import { subscriptionService } from '../services/subscription.service';

// Mock do repositório
jest.mock('../config/database', () => ({
  AppDataSource: {
    getRepository: jest.fn(),
  },
}));

describe('Subscription Service', () => {
  let mockUserRepository: any;
  let mockUser: Partial<User>;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Mock user
    mockUser = {
      id: 'test-user-id',
      name: 'Test User',
      email: 'test@example.com',
      planType: 'free',
      planStartDate: null,
      planEndDate: null,
      isPremium: false,
      isPlanActive: jest.fn().mockReturnValue(false),
      hasFeatureAccess: jest.fn((feature: string) => {
        const premiumFeatures = ['advanced_emojis', 'custom_categories'];
        return !premiumFeatures.includes(feature);
      }),
    };

    // Mock repository
    mockUserRepository = {
      findOne: jest.fn().mockResolvedValue(mockUser),
      save: jest.fn().mockResolvedValue(mockUser),
      createQueryBuilder: jest.fn().mockReturnValue({
        update: jest.fn().mockReturnThis(),
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue({ affected: 5 }),
      }),
    };

    const { AppDataSource } = require('../config/database');
    AppDataSource.getRepository.mockReturnValue(mockUserRepository);
  });

  describe('getSubscriptionStatus', () => {
    it('should return subscription status for free user', async () => {
      const status = await subscriptionService.getSubscriptionStatus('test-user-id');

      expect(status).toHaveProperty('planType', 'free');
      expect(status).toHaveProperty('isPremium', false);
      expect(status).toHaveProperty('isActive', false);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'test-user-id' },
      });
    });

    it('should throw error if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(
        subscriptionService.getSubscriptionStatus('invalid-id')
      ).rejects.toThrow('Usuário não encontrado');
    });
  });

  describe('activatePremiumPlan', () => {
    it('should activate premium plan for 1 month', async () => {
      const result = await subscriptionService.activatePremiumPlan('test-user-id', 1);

      expect(mockUserRepository.save).toHaveBeenCalled();
      expect(result).toHaveProperty('planType', 'premium');
      expect(result).toHaveProperty('isPremium', true);
    });

    it('should activate premium plan for custom duration', async () => {
      await subscriptionService.activatePremiumPlan('test-user-id', 12);

      expect(mockUserRepository.save).toHaveBeenCalled();
    });

    it('should throw error if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(
        subscriptionService.activatePremiumPlan('invalid-id')
      ).rejects.toThrow('Usuário não encontrado');
    });
  });

  describe('cancelPremiumPlan', () => {
    it('should cancel premium plan', async () => {
      mockUser.planType = 'premium';
      mockUser.isPremium = true;

      const result = await subscriptionService.cancelPremiumPlan('test-user-id');

      expect(mockUserRepository.save).toHaveBeenCalled();
      expect(result).toHaveProperty('planType', 'free');
      expect(result).toHaveProperty('isPremium', false);
    });

    it('should throw error if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(
        subscriptionService.cancelPremiumPlan('invalid-id')
      ).rejects.toThrow('Usuário não encontrado');
    });
  });

  describe('renewPremiumPlan', () => {
    it('should renew premium plan', async () => {
      const result = await subscriptionService.renewPremiumPlan('test-user-id', 1);

      expect(mockUserRepository.save).toHaveBeenCalled();
      expect(result).toHaveProperty('planType', 'premium');
      expect(result).toHaveProperty('isPremium', true);
    });

    it('should extend existing active plan', async () => {
      const futureDate = new Date();
      futureDate.setMonth(futureDate.getMonth() + 2);

      mockUser.planType = 'premium';
      mockUser.planEndDate = futureDate;
      (mockUser.isPlanActive as jest.Mock).mockReturnValue(true);

      await subscriptionService.renewPremiumPlan('test-user-id', 1);

      expect(mockUserRepository.save).toHaveBeenCalled();
    });
  });

  describe('expireOldPlans', () => {
    it('should expire old premium plans', async () => {
      const affected = await subscriptionService.expireOldPlans();

      expect(affected).toBe(5);
      expect(mockUserRepository.createQueryBuilder).toHaveBeenCalled();
    });
  });
});

describe('User Model - Premium Methods', () => {
  let user: User;

  beforeEach(() => {
    user = new User();
    user.id = 'test-id';
    user.name = 'Test User';
    user.email = 'test@example.com';
    user.planType = 'free';
    user.isPremium = false;
  });

  describe('isPlanActive', () => {
    it('should return false for free plan', () => {
      expect(user.isPlanActive()).toBe(false);
    });

    it('should return false if no end date', () => {
      user.planType = 'premium';
      user.planEndDate = null;

      expect(user.isPlanActive()).toBe(false);
    });

    it('should return true for active premium plan', () => {
      const futureDate = new Date();
      futureDate.setMonth(futureDate.getMonth() + 1);

      user.planType = 'premium';
      user.planEndDate = futureDate;

      expect(user.isPlanActive()).toBe(true);
    });

    it('should return false for expired premium plan', () => {
      const pastDate = new Date();
      pastDate.setMonth(pastDate.getMonth() - 1);

      user.planType = 'premium';
      user.planEndDate = pastDate;

      expect(user.isPlanActive()).toBe(false);
    });
  });

  describe('hasFeatureAccess', () => {
    it('should allow access to free features', () => {
      expect(user.hasFeatureAccess('basic_categories')).toBe(true);
      expect(user.hasFeatureAccess('basic_transactions')).toBe(true);
    });

    it('should deny access to premium features for free user', () => {
      expect(user.hasFeatureAccess('advanced_emojis')).toBe(false);
      expect(user.hasFeatureAccess('custom_categories')).toBe(false);
      expect(user.hasFeatureAccess('advanced_reports')).toBe(false);
    });

    it('should allow access to premium features for premium user', () => {
      const futureDate = new Date();
      futureDate.setMonth(futureDate.getMonth() + 1);

      user.planType = 'premium';
      user.planEndDate = futureDate;

      expect(user.hasFeatureAccess('advanced_emojis')).toBe(true);
      expect(user.hasFeatureAccess('custom_categories')).toBe(true);
      expect(user.hasFeatureAccess('advanced_reports')).toBe(true);
    });
  });

  describe('toJSON', () => {
    it('should not include password in JSON', () => {
      user.password = 'hashed-password';
      const json = user.toJSON();

      expect(json).not.toHaveProperty('password');
    });

    it('should include isPremium based on plan status', () => {
      const json = user.toJSON();

      expect(json).toHaveProperty('isPremium');
    });
  });
});
