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
});
