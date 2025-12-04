export interface SavingsGoal {
  id: string;
  userId: string;
  targetAmount: number;
  currentAmount: number;
  month: number;
  year: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSavingsGoalData {
  targetAmount: number;
  month: number;
  year: number;
  description?: string;
}

export interface UpdateSavingsGoalData {
  targetAmount?: number;
  description?: string;
}
