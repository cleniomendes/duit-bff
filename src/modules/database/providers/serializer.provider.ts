import { DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SerializerEntity } from '@modules/database/entities';

export class SerializerProvider {
  init(): DynamicModule {
    return TypeOrmModule.forFeature([SerializerEntity]);
  }
}
