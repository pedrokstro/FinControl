import 'reflect-metadata';
import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { config } from '@/config/env';
import { errorHandler, notFoundHandler } from '@/middlewares/error.middleware';
import { logger } from '@/utils/logger';

const app: Application = express();

// Trust proxy (necessário para Render, Heroku, etc)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" }
}));

// CORS configuration
const allowedOrigins = [
  'https://fincontrolefinanceiro.com',
  'https://www.fincontrolefinanceiro.com',
  'http://localhost:3000',
  'http://localhost:5173'
];

app.use(cors({
  origin: function (origin, callback) {
    // Permite requisições sem origin (como apps mobile ou curls)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1 || origin.includes('onrender.com')) {
      callback(null, true);
    } else {
      // Em produção, ser um pouco mais restrito mas permitir para debug se necessário
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 600,
  optionsSuccessStatus: 204
}));

// Handle preflight requests explicitly for all routes
app.options('*', cors());

// Rate limiting (apenas em produção)
if (config.nodeEnv === 'production') {
  const limiter = rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.maxRequests,
    message: 'Muitas requisições, tente novamente mais tarde',
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use(limiter);
  logger.info('Rate limiting habilitado');
} else {
  logger.info('Rate limiting desabilitado (desenvolvimento)');
}

// Body parsing customizado para não converter strings ISO para Date
app.use((req, res, next) => {
  if (req.is('application/json')) {
    let data = '';
    req.setEncoding('utf8');
    req.on('data', chunk => {
      data += chunk;
    });
    req.on('end', () => {
      try {
        // Parse JSON com reviver customizado
        req.body = JSON.parse(data, (key, value) => {
          // Detectar strings ISO de data e converter para YYYY-MM-DD
          if (typeof value === 'string') {
            const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/;
            if (isoDateRegex.test(value)) {
              console.log(`🔄 [MIDDLEWARE] Convertendo data ISO para string: ${value} -> ${value.split('T')[0]}`);
              return value.split('T')[0];
            }
          }
          return value;
        });
        next();
      } catch (error) {
        res.status(400).json({ error: 'Invalid JSON' });
      }
    });
  } else {
    next();
  }
});
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware para converter Date objects de volta para strings
app.use((req, _res, next) => {
  const convertDatesToStrings = (obj: any): any => {
    if (obj === null || obj === undefined) return obj;

    if (obj instanceof Date) {
      // Converter Date para string YYYY-MM-DD
      const year = obj.getFullYear();
      const month = String(obj.getMonth() + 1).padStart(2, '0');
      const day = String(obj.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }

    if (Array.isArray(obj)) {
      return obj.map(convertDatesToStrings);
    }

    if (typeof obj === 'object') {
      const converted: any = {};
      for (const key in obj) {
        converted[key] = convertDatesToStrings(obj[key]);
      }
      return converted;
    }

    return obj;
  };

  if (req.body) {
    req.body = convertDatesToStrings(req.body);
  }

  next();
});

// Compression
app.use(compression());

// HTTP request logging
if (config.nodeEnv !== 'test') {
  app.use(
    morgan('combined', {
      stream: {
        write: (message: string) => logger.info(message.trim()),
      },
    })
  );
}

// Servir arquivos estáticos (uploads)
import path from 'path';
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.nodeEnv,
  });
});

// Swagger documentation
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FinControl API',
      version: '1.0.0',
      description: 'API de controle financeiro pessoal com suporte completo a UTF-8',
    },
    servers: [
      {
        url: `http://localhost:${config.port}${config.apiPrefix}`,
        description: 'Servidor de desenvolvimento',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API Routes
import routes from '@/routes';
app.use(config.apiPrefix, routes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
