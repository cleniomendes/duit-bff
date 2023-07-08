import { AxiosError } from 'axios';
import { IRequestError } from '@shared/interfaces';

export function handleError(err: AxiosError, toLog = false): IRequestError {
  const error: IRequestError = {
    domain: err.config && err.config.baseURL,
    url: err.config && err.config.url,
    method: err.config && err.config.method,
    headers: err.config && err.config.headers,
    data: err.config && err.config.data,
    response: null,
    status: null,
    timeout: err.code && err.code === 'ECONNABORTED',
    message: err.message,
    code: err.code,
  };

  if (err.response) {
    error.response = err.response.data;
    error.status = err.response.status;
  }

  if (toLog) {
    delete error.data;
    delete error.headers;
    delete error.timeout;
  }

  return error;
}

export function toSerialize(result, serializer, data = {}): any {
  if (!serializer) return;

  for (const key in result) {
    if (result[key] instanceof Array) {
      for (const cont in result[key]) {
        if (typeof result[key][cont] !== 'object') {
          Object.assign(data, { [key]: result[key] });
          return;
        }

        if (!serializer[key]) continue;

        if (!data[key]) {
          Object.assign(data, { [key]: [{}] });
        } else {
          data[key].push({});
        }

        toSerialize(result[key][cont], serializer[key], data[key][cont]);
      }
    }
    if (key in serializer) {
      if (result[key] instanceof Object) {
        if (!data[key]) {
          Object.assign(data, { [key]: {} });
        }

        toSerialize(result[key], serializer[key], data[key]);
      } else {
        Object.assign(data, { [key]: result[key] });
      }
    }
  }
  return data;
}
