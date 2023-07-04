import { DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseProvider } from '@modules/database/providers';

export class DatabaseModule {
  databaseProvider = new DatabaseProvider();

  async init(): Promise<DynamicModule> {
    const options = await this.databaseProvider.createTypeOrmOptions();

    return TypeOrmModule.forRoot(options);
  }
}
