import { JwtPayload } from '@/utils/jwt';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
      file?: Multer.File;
      files?: Multer.File[];
      transactionUsage?: {
        currentCount: number;
        limit: number;
      };
    }
  }
}

export {};
