import { IConstants } from '@shared/interfaces';

const DEBUG = process.env.DEBUG && process.env.DEBUG.toLowerCase();

export const getEnv = (): IConstants => ({
  api: {
    env: process.env.NODE_ENV as 'production' | 'stg' | 'development',
    port: Number(process.env.PORT || '3000'),
    debug: DEBUG === 'true' || false,
  },
  integration: {
    integration1: {
      url: process.env.INTEGRATION1_URL,
    },
  },
  database: {
    hostWrite: process.env.DATABASE_HOST,
    name: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    pool: {
      max: Number(process.env.DATABASE_POOL_MAX || '10'),
      min: Number(process.env.DATABASE_POOL_MIN || '1'),
      acquire: Number(process.env.DATABASE_ACQUIRE || '10000'),
      idle: Number(process.env.DATABASE_IDLE || '20000'),
    },
  },
});
