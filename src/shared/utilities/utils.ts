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

export function toSerialize(data, serializer, result = {}): any {
  if (!serializer) return;

  // Run each key
  for (const key in data) {
    // Check object is array and run function again for each item
    if (data[key] instanceof Array) {
      for (const cont in data[key]) {
        if (typeof data[key][cont] !== 'object') {
          Object.assign(result, { [key]: data[key] });
          return;
        }

        if (!serializer[key]) continue;

        if (!result[key]) {
          Object.assign(result, { [key]: [{}] });
        } else {
          result[key].push({});
        }

        toSerialize(data[key][cont], serializer[key], result[key][cont]);
      }
    }
    if (key in serializer) {
      // Check if is object and run function again for each item
      if (data[key] instanceof Object) {
        if (!result[key]) {
          Object.assign(result, { [key]: {} });
        }

        toSerialize(data[key], serializer[key], result[key]);
      } else {
        Object.assign(result, { [key]: data[key] });
      }
    }
  }
  return result;
}
