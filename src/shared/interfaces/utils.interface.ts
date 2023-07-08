export interface IDatabaseCredentials {
  ca?: Buffer;
  token?: string;
}

export interface IRequestError {
  domain?: string;
  url?: string;
  method?: string;
  headers?: unknown;
  data?: unknown;
  response?: unknown;
  timeout?: boolean;
  message?: string;
  code?: string;
  status?: number;
}
