import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

import { getEnv } from '@shared/configuration/constants';
import { lastValueFrom, map } from 'rxjs';

@Injectable()
export class FirstIntegrationService {
  constructor(private readonly instance: HttpService) {}

  async getIntegration(): Promise<any> {
    let response: any | null = null;

    const { integration } = getEnv();

    try {
      const { data } = await lastValueFrom(
        this.instance
          .get(`${integration.integration1.url}`)
          .pipe(map((res) => res)),
      );

      if (!data) throw new Error();

      response = data;
    } catch (err) {
      throw new Error();
    }

    return response;
  }
}
