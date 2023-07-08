import { FindOptionsWhere } from 'typeorm';
import { Injectable } from '@nestjs/common';

import { getEnv } from '@shared/configuration/constants';
import { SerializerRepository } from '@modules/database/repositories';
import { JestorService } from '@modules/global/services';
import { IJestorObjectListRequest } from '@src/shared/interfaces/jestor.interface';
import { SerializerEntity } from '../database/entities';
import { BusinessError } from '@src/shared/errors';
import { ErrorCodes } from '@src/shared/errors/business';
import { toSerialize } from '@src/shared/utilities/utils';

@Injectable()
export class AnprotecService {
  constructor(
    private readonly serializerRepository: SerializerRepository,
    private readonly jestorService: JestorService,
  ) {}

  async getAddress(): Promise<any> {
    const resultData = [];
    const { address } = getEnv().jestor.anprotec.objectList;

    const request: IJestorObjectListRequest = {
      object_type: address,
      page: 1,
      size: 100,
    };

    let allAddress = await this.jestorService.getObjectList(request);

    if (allAddress.data?.items?.length)
      resultData.push(...allAddress.data.items);

    while (allAddress.data?.has_more) {
      request.page++;

      allAddress = await this.jestorService.getObjectList(request);

      if (allAddress.data?.items?.length) {
        resultData.push(...allAddress.data.items);
      }
    }

    return { address: await this.mountObject(resultData, 'getAddress') };
  }

  async mountObject(resultData: any[], method: string): Promise<any> {
    const where: FindOptionsWhere<SerializerEntity> = {
      method,
    };

    const serializer = await this.serializerRepository.selectByWhere(where);

    if (!serializer) {
      return resultData;
    }

    const serializerObject = serializer.objectField;

    return resultData.map((el) => {
      return toSerialize(el, serializerObject);
    });
  }
}
