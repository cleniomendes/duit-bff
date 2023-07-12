import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

import * as ENTITIES from '@modules/database/entities';
import * as MIGRATIONS from '@modules/database/migrations';

import { getEnv } from '@shared/configuration/constants';
import { IDatabaseCredentials } from '@shared/interfaces';
import LoggerManager from '@shared/utilities/logger-manager';

export class DatabaseProvider implements TypeOrmOptionsFactory {
  async createTypeOrmOptions(): Promise<TypeOrmModuleOptions> {
    const credentials: IDatabaseCredentials = {};
    const { database } = getEnv();

    const entities = Object.values(ENTITIES).map((o) => o);
    const migrations = Object.values(MIGRATIONS).map((o) => o);

    return {
      type: 'postgres',

      ...(credentials.ca && {
        ssl: {
          rejectUnauthorized: false,
          ca: credentials.ca,
        },
      }),

      host: database.hostWrite,
      username: database.user,
      database: database.name,
      port: 5432,
      password: database.password,
      logging: true,
      logger: LoggerManager.databaseLogger,

      migrationsRun: true,
      synchronize: false,

      migrations,
      entities,

      poolSize: database.pool.max,

      poolErrorHandler: (err: unknown) => {
        LoggerManager.log('application', {
          type: 'database',
          action: 'pool-error-handler',
          data: err,
        });
      },
    };
  }
}
