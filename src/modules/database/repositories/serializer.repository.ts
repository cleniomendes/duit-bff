import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository, UpdateResult } from 'typeorm';
import { SerializerEntity } from '@modules/database/entities';
import {
  PersistenceError,
  PersistenceErrorCodes,
} from '@shared/errors/persistence';

@Injectable()
export class SerializerRepository {
  constructor(
    @InjectRepository(SerializerEntity)
    private serializerRepository: Repository<SerializerEntity>,
  ) {}

  async create(serializer: SerializerEntity): Promise<SerializerEntity> {
    let response: SerializerEntity | null = null;

    try {
      response = await this.serializerRepository.save(serializer);
    } catch (err) {
      throw new PersistenceError(PersistenceErrorCodes.CREATE_ENTITY, err);
    }

    return response;
  }

  async updateById(
    id: string,
    serializer: SerializerEntity,
  ): Promise<UpdateResult> {
    let response: UpdateResult | null = null;

    try {
      response = await this.serializerRepository.update(id, serializer);
    } catch (err) {
      throw new PersistenceError(PersistenceErrorCodes.UPDATE_ENTITY, err);
    }

    return response;
  }

  async selectById(id: string): Promise<SerializerEntity> {
    let response: SerializerEntity | null = null;

    try {
      response = await this.serializerRepository.findOne({ where: { id } });
    } catch (err) {
      throw new PersistenceError(PersistenceErrorCodes.GET_ENTITY, err);
    }

    return response;
  }

  async selectByWhere(
    where: FindOptionsWhere<SerializerEntity>,
  ): Promise<SerializerEntity | null> {
    let response: SerializerEntity | null = null;

    try {
      response = await this.serializerRepository.findOne({ where });
    } catch (err) {
      throw new PersistenceError(PersistenceErrorCodes.GET_ENTITY, err);
    }

    return response;
  }
}
