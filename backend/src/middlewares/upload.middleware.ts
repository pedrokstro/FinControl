import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { config } from '@/config/env';
import { BadRequestError } from '@/utils/errors';

// Configuração de armazenamento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.upload.dir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

// Filtro de tipos de arquivo
const fileFilter = (req: any, file: any, cb: multer.FileFilterCallback) => {
  if (config.upload.allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new BadRequestError('Tipo de arquivo não permitido. Use JPEG, PNG ou WebP.'));
  }
};

// Configuração do multer
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.upload.maxFileSize,
  },
});

// Middleware para upload de avatar
export const uploadAvatar = upload.single('avatar');

// Middleware para múltiplos arquivos
export const uploadMultiple = upload.array('files', 10);
