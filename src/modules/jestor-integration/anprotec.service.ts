import { FindOptionsWhere } from 'typeorm';
import { Injectable } from '@nestjs/common';

import { getEnv } from '@shared/configuration/constants';
import { SerializerRepository } from '@modules/database/repositories';
import { JestorService } from '@modules/global/services';
import {
  IJestorObjectCreateRequest,
  IJestorObjectListRequest,
} from '@src/shared/interfaces/jestor.interface';
import { SerializerEntity } from '@src/modules/database/entities';
import { toSerialize } from '@src/shared/utilities/utils';

@Injectable()
export class AnprotecService {
  constructor(
    private readonly serializerRepository: SerializerRepository,
    private readonly jestorService: JestorService,
  ) {}

  async getAllAddress(): Promise<any> {
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

  async getAllJobRole(): Promise<any> {
    const resultData = [];
    const { jobRole } = getEnv().jestor.anprotec.objectList;

    const request: IJestorObjectListRequest = {
      object_type: jobRole,
      page: 1,
      size: 100,
    };

    let allJobRoles = await this.jestorService.getObjectList(request);

    if (allJobRoles.data?.items?.length)
      resultData.push(...allJobRoles.data.items);

    while (allJobRoles.data?.has_more) {
      request.page++;

      allJobRoles = await this.jestorService.getObjectList(request);

      if (allJobRoles.data?.items?.length) {
        resultData.push(...allJobRoles.data.items);
      }
    }

    return { jobRoles: await this.mountObject(resultData, 'getJobRole') };
  }

  async getAllPeople(): Promise<any> {
    const resultData = [];
    const { people } = getEnv().jestor.anprotec.objectList;

    const request: IJestorObjectListRequest = {
      object_type: people,
      page: 1,
      size: 100,
    };

    let allPeople = await this.jestorService.getObjectList(request);

    if (allPeople.data?.items?.length) resultData.push(...allPeople.data.items);

    while (allPeople.data?.has_more) {
      request.page++;

      allPeople = await this.jestorService.getObjectList(request);

      if (allPeople.data?.items?.length) {
        resultData.push(...allPeople.data.items);
      }
    }

    return { people: await this.mountObject(resultData, 'getPeople') };
  }

  async createJobRole(data: object): Promise<any> {
    const { jobRole } = getEnv().jestor.anprotec.objectList;

    const request: IJestorObjectCreateRequest = {
      object_type: jobRole,
      data,
    };

    return await this.jestorService.createObject(request);
  }

  async createAddress(data: object): Promise<any> {
    const { address } = getEnv().jestor.anprotec.objectList;

    const request: IJestorObjectCreateRequest = {
      object_type: address,
      data,
    };

    return await this.jestorService.createObject(request);
  }

  async createPeople(data: object): Promise<any> {
    const { people } = getEnv().jestor.anprotec.objectList;

    const request: IJestorObjectCreateRequest = {
      object_type: people,
      data,
    };

    return await this.jestorService.createObject(request);
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
