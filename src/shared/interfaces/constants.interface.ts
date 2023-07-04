interface IConstants {
  api: IConstantsAPI;
  integration: IIntegrationAPI;
  database: IConstantsDatabase;
}

interface IConstantsAPI {
  env: 'production' | 'stg' | 'development';
  debug: boolean;
  port: number;
}

interface IIntegrationAPI {
  integration1: {
    url: string;
  };
}

interface IConstantsDatabase {
  hostWrite: string;
  name: string;
  user: string;
  password: string;
  pool: {
    max: number;
    min: number;
    acquire: number;
    idle: number;
  };
}

export { IConstants, IConstantsAPI, IIntegrationAPI };
