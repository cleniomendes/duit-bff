import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, map } from 'rxjs';
import { AxiosError } from 'axios';

import { REST_SERVICES } from '@modules/global/services/constants.service';
import { IntegrationError } from '@shared/errors/integration';
import { getEnv } from '@shared/configuration/constants';
import { handleError } from '@shared/utilities/utils';
import {
  IJestorObjectCreateRequest,
  IJestorObjectListRequest,
  IJestorObjectListResponse,
} from '@src/shared/interfaces/jestor.interface';

const { LIST_ALL, CREATE } = REST_SERVICES.JESTOR;

@Injectable()
export class JestorService {
  constructor(private readonly instance: HttpService) {}

  async getObjectList(
    params: IJestorObjectListRequest,
  ): Promise<IJestorObjectListResponse> {
    let response = null;

    const { baseUrl, headers } = this.getConfigs();

    try {
      const { data } = await lastValueFrom(
        this.instance
          .post(`${baseUrl}/${LIST_ALL}`, params, {
            headers: {
              ...headers,
            },
          })
          .pipe(map((res) => res)),
      );

      response = data;
    } catch (err) {
      throw new IntegrationError('jestor', handleError(err as AxiosError));
    }

    return response;
  }

  async createObject(params: IJestorObjectCreateRequest): Promise<unknown> {
    let response = null;

    const { baseUrl, headers } = this.getConfigs();

    try {
      const { data } = await lastValueFrom(
        this.instance
          .post(`${baseUrl}/${CREATE}`, params, {
            headers: {
              ...headers,
            },
          })
          .pipe(map((res) => res)),
      );

      response = data;
    } catch (err) {
      throw new IntegrationError('jestor', handleError(err as AxiosError));
    }

    return response;
  }

  private getConfigs() {
    const { url: baseUrl, token } = getEnv().jestor.anprotec;

    const configs = {
      baseUrl,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    return configs;
  }
}
