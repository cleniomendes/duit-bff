import { v4 } from 'uuid';
import { AxiosError, AxiosInstance } from 'axios';
import * as fs from 'fs';
import * as mime from 'mime-types';
import crypto from 'crypto';
import { cnpj, cpf } from 'cpf-cnpj-validator';
import Cache from 'memory-cache';
import validator from 'validator';

import { SettingsEntity } from '@modules/database/entities';
import { DataType, DayOfWeek, FileExtension } from '@shared/enumerators';
import LoggerManager from '@shared/utilities/logger-manager';
import { BusinessError, ErrorCodes } from '@shared/errors/business';
import { IntegrationError } from '@shared/errors/integration';
import { IJSON, IRequestError, ISearchParameterBase } from '@shared/interfaces';
import { MomentTimezoneHelper } from '@shared/helpers';

const { getCurrentMoment, diffInMonths, getMomentFormatted } =
  MomentTimezoneHelper;

export function controllerPaginationHelper(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: any,
  isPage = false,
): ISearchParameterBase {
  const searchParameter: ISearchParameterBase = {
    offset: query.offset
      ? parseInt(query.offset, 10) * parseInt(query.limit || '10', 10)
      : 0,
    orderBy: query.orderBy || 'createdAt',
    isDESC: query.isDESC === 'true',
    limit: Math.min(parseInt(query.limit || '10', 10), 100),
  };

  if (isPage) {
    searchParameter.offset = query.offset ? query.offset : 0;
  }

  return searchParameter;
}

export function encodeBase64(data: string): string {
  const buffer = Buffer.from(data);

  return buffer.toString('base64');
}

export function decodeBase64(base64: string): string {
  const buffer = Buffer.from(base64, 'base64');

  return buffer.toString('ascii');
}

export function renameJSONKeys(
  data: string,
  keys: Map<string, string>,
): string {
  Object.keys(data).forEach((o) => {
    data[keys.get(o)] = data[o];
    delete data[o];
  });

  return data;
}

export function isArrayEmpty(arr: (string | JSON | number)[]): boolean {
  if (!arr.length) {
    return true;
  }

  return false;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function stringReplace(base: any, params: { [key: string]: unknown }) {
  Object.keys(params).forEach((opt) => {
    const value = params[opt] ? params[opt] : '';

    base = base.replace(new RegExp(`\\{${opt}\\}`, 'g'), value);
  });

  return base;
}

export function keepOnlyText(text: string): string {
  return text.replace(/[^A-Za-z\s]/g, '');
}

export const ofuscateJSON = (data: JSON): JSON => {
  Object.keys(data).forEach((key) => {
    data[key] = '**** ****';
  });

  return data;
};

export function msToTime(s: number): string {
  function pad(n: number, z = 2) {
    return `00${n}`.slice(-z);
  }

  s = (s - (s % 1000)) / 1000;
  const secs = s % 60;

  s = (s - secs) / 60;
  const mins = s % 60;

  return `${pad((s - mins) / 60)}:${pad(mins)}:${pad(secs)}`;
}

export function getMemoryUsage() {
  const { rss, heapTotal, heapUsed } = process.memoryUsage();

  return {
    rss: `${Math.round((rss / 1024 / 1024) * 100) / 100} MB`,
    heapTotal: `${Math.round((heapTotal / 1024 / 1024) * 100) / 100} MB`,
    heapUsed: `${Math.round((heapUsed / 1024 / 1024) * 100) / 100} MB`,
  };
}

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

export const addLoggers = (
  instance: AxiosInstance,
  origin: string,
  ofuscate = false,
): AxiosInstance => {
  const requestID = v4();

  instance.interceptors.request.use((request) => {
    LoggerManager.log('application', {
      origin,
      type: 'request',
      timestamp: getMomentFormatted(getCurrentMoment()),
      request: {
        id: requestID,
        url: request.url,
        baseUrl: request.baseURL,
        method: request.method,
        params: request.params,
        body: request.data && JSON.stringify(request.data),
        headers: request.headers,
      },
    });

    return request;
  });

  instance.interceptors.response.use(
    (response) => {
      LoggerManager.log('application', {
        origin,
        type: 'success',
        req: requestID,
        timestamp: getMomentFormatted(getCurrentMoment()),
        response: {
          status: response.status,
          method: response.config.method,
          headers: response.config.headers,
          url: response.config.url,
          params: response.config.params,
          reqBody: ofuscate
            ? ofuscateJSON(response.config.data)
            : response.config.data,
        },
      });

      return response;
    },
    (err) => {
      LoggerManager.log('application', {
        origin,
        type: 'error',
        req: requestID,
        timestamp: getMomentFormatted(getCurrentMoment()),
        err: handleError(err),
      });

      return Promise.reject(err);
    },
  );

  return instance;
};

export const readTemplate = (templatePath: string, encoding: unknown) =>
  new Promise((resolve, reject) => {
    fs.readFile(templatePath, encoding, (err, template) => {
      if (err) {
        reject(new BusinessError(ErrorCodes.TEMPLATE_NOT_FOUND));
      }

      resolve(template);
    });
  });

export function getUniqueFilename(extension?: string): string {
  const timestamp = new Date().getTime();
  const random = Math.random().toString().substring(3, 13);

  if (extension) {
    return `${timestamp}_${random}.${extension}`;
  }

  return `${timestamp}_${random}`;
}

export function removeSpecialCharacters(data: string): string {
  return data ? data.replace(/[^A-Za-z0-9]/g, '').replace(/\/s/g, '') : '';
}

export function removePhoneCharacters(data: string): string {
  return data ? data.replace('+', '').replace(/^(55)/, '') : '';
}

export function uniqueArrayElements(arr: unknown[]): unknown[] {
  return Array.from(new Set(arr.map((o) => JSON.stringify(o)))).map((o) =>
    JSON.parse(o),
  );
}

export function sleep(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export function normalizeString(text: string): string {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export function isCPF(document: string): boolean {
  return cpf.isValid(document);
}

export function isCNPJ(document: string): boolean {
  return cnpj.isValid(document);
}

export function isDocument(document: string): boolean {
  if (!isCNPJ(document) && !isCPF(document)) {
    return false;
  }

  return true;
}

export function maskText(input: string, pattern: string): string {
  if (!input || !pattern) return '--';

  let index = 0;
  return pattern.replace(/#/g, () => input[index++]).replace(/undefined/g, '');
}

export function maskPhone(phone: string): string {
  return maskText(phone, '### (##) ####-####');
}

export function maskCPF(document: string): string {
  return maskText(document, '###.###.###-##');
}

export function maskCNPJ(document: string): string {
  return maskText(document, '##.###.###/####-##');
}

export function maskDocument(document: string): string {
  return isCPF(document) ? maskCPF(document) : maskCNPJ(document);
}

export function calculateDiffMonths(date: Date | string) {
  const startDate = getCurrentMoment(date as string);
  const endDate = getCurrentMoment();

  return diffInMonths(startDate, endDate);
}

export function formatDiffMonths(date: Date | string): string {
  const result = calculateDiffMonths(date);

  return result > 0 ? `${result} meses` : '0 mês';
}

export function toJSON(raw: string): JSON | string {
  try {
    return JSON.parse(raw);
  } catch (err) {
    return raw;
  }
}

export function dataParser(
  value: string,
  type: number,
): string | number | boolean | JSON {
  switch (type) {
    case DataType.STRING:
      return value;
    case DataType.BOOLEAN:
      return value === 'true';
    case DataType.NUMBER:
      return Number(value);
    case DataType.JSON:
      return toJSON(value);
  }
}

export function getFileExtension(mimeType: string): string {
  const extension = mime.extension(mimeType);

  return extension ? extension : FileExtension.PNG;
}

export function transformToJSON(keys: string[], values: unknown[]): IJSON {
  const object = {};

  values.forEach((value, index) => {
    Object.assign(object, {
      [keys[index]]: value,
    });
  });

  return object;
}

export function toArray(data: unknown[][]): IJSON[] {
  const arr = [];

  // eslint-disable-next-line prefer-destructuring
  const keys: string[] = data[0] as string[];

  data.forEach((o, i) => {
    if (i === 0) return;

    arr.push(transformToJSON(keys, o));
  });

  return arr;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function handleTimeout(err: any) {
  if (err instanceof IntegrationError && err.getOptions().timeout) {
    throw new BusinessError(ErrorCodes.TIMEOUT);
  }
}

export function sha256(text: string, algorithm = 'sha256'): string {
  return crypto.createHash(algorithm).update(text).digest('hex');
}

export function hmac(
  text: string,
  secret: string,
  algorithm = 'sha256',
): string {
  return crypto.createHmac(algorithm, secret).update(text).digest('hex');
}

export function generateRandomCode(start: number, end: number): string {
  const code: string = Math.random().toString().substring(start, end);

  return code;
}

export function formatCurrency(value: number, currency: string) {
  return value.toLocaleString('pt-br', {
    style: 'currency',
    currency,
  });
}

export function convertToCents(value: string) {
  const cents = parseFloat(value) * 100;

  return parseInt(cents.toString(), 10);
}

export function convertToDecimal(value: string) {
  const decimal = parseFloat(value) / 100;
  const fixed = parseFloat(decimal.toFixed(2));

  return parseFloat(fixed.toString());
}

export function convertFloatToDecimal(value: number, decimals = 2): number {
  return parseFloat(value.toFixed(decimals));
}

export function changeArrayToObject(array: unknown[]) {
  let response = {};

  const hasLength = !!(array && array.length);

  if (hasLength) {
    array.forEach((data) => {
      response = {
        ...response,
        ...(data as Record<string, unknown>),
      };
    });
  }

  return response;
}

export function changeObjectToArray(object: IJSON) {
  let response = [];

  const notEmpty = !!(object && Object.values(object).length);

  if (notEmpty) {
    response = Object.entries(object).map(([key, value]) => ({ [key]: value }));
  }

  return response;
}

export function hideEmail(email: string): string {
  if (!email.includes('@')) return '****';

  const [username, domain] = email.split('@');

  const firstChars = username.substring(0, 4);
  const hiddenChars = Array(username[0].length - 4)
    .fill('*')
    .join('');

  return firstChars.concat(hiddenChars, '@', domain);
}

export function hideCellphone(cellphone: string): string {
  const hiddenChars = Array(cellphone.length - 4)
    .fill('*')
    .join('');
  const lastChars = cellphone.substring(cellphone.length - 4, cellphone.length);

  return hiddenChars.concat(lastChars);
}

export function splitQueryParam(queryParam: string, delimiter = ',') {
  const splitted = queryParam
    .split(delimiter)
    .map((param) => param.toString().trim());

  return splitted;
}

export function getNextBusinessDay(days: number, toAdd = true) {
  let current = getCurrentMoment();

  while (days > 0) {
    current = current.add(toAdd ? 1 : -1, 'd');
    const weekDay = current.day();

    if (weekDay !== DayOfWeek.SATURDAY && weekDay !== DayOfWeek.SUNDAY) {
      days -= 1;
    }
  }

  return current.format('YYYY-MM-DD');
}

export function getLastElementFromArray(arr: unknown[]): unknown {
  return arr[arr.length - 1];
}

export function randomNumber(max: number) {
  return Math.floor(Math.random() * max);
}

export function randomElement(arr: unknown[]) {
  return arr[randomNumber(arr.length - 1)];
}

export function shuffle(arr: unknown[]) {
  let result = [];

  while (arr.length) {
    result = result.concat(arr.splice(randomNumber[arr.length - 1]));
  }

  return result;
}

export function clearCache(): void {
  Cache.clear();
}

export function getCacheByKey(key: string) {
  return Cache.get(key);
}

export function setCacheByKey(
  key: string,
  value: unknown,
  time?: number,
  cb?: (key: string, value: unknown) => void,
) {
  return Cache.put(key, value, time || 1000 * 120, cb);
}

export function calculatePercentage(valueFrom: number, valueTo: number) {
  const percentage = ((valueFrom / valueTo) * 100).toFixed(2);

  return Number(percentage);
}

export function toCapitalize(text: string): string {
  return text
    .split(' ')
    .map((word) =>
      word.charAt(0).toUpperCase().concat(word.substring(1).toLowerCase()),
    )
    .join(' ');
}

export function isBlank(str: string): boolean {
  if (!str || /^\s*$/.test(str)) {
    return true;
  }

  return false;
}

export function isUUID(str: string): boolean {
  return validator.isUUID(str);
}

export function isEmail(str: string): boolean {
  return validator.isEmail(str);
}

export function isBase64(str: string): boolean {
  return validator.isBase64(str);
}

export function isPhone(str: string): boolean {
  return validator.isMobilePhone(str);
}

export function parseNumber(value: number): number {
  return Math.round(value * 100) / 100;
}

export function isValidFileExtension(filename: string): boolean {
  let response = false;

  if (filename) {
    const fileExtensions: string[] = [
      FileExtension.CSV,
      FileExtension.HTML,
      FileExtension.JPG,
      FileExtension.JPEG,
      FileExtension.MJML,
      FileExtension.PNG,
    ];

    const extension = filename.split('.').pop().toLowerCase();

    response = fileExtensions.includes(extension);
  }

  return response;
}

export function isEmptyText(text: string) {
  if (!text || !text.trim().length) return true;

  return false;
}

export function settingsReduce(settings: SettingsEntity[]): SettingsEntity {
  return settings.reduce(
    (obj, item) => Object.assign(obj, { [item.key]: item.value }),
    {},
  );
}
