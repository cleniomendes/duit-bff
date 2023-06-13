interface IConstants {
  api: IConstantsAPI;
  integration: IIntegrationAPI;
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

export { IConstants, IConstantsAPI, IIntegrationAPI };
