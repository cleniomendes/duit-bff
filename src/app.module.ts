import { Module } from '@nestjs/common';
import { FirstIntegrationModule } from '@modules/first-integration';

const imports = [FirstIntegrationModule];

const controllers = [];

const providers = [FirstIntegrationModule];

@Module({
  imports,
  controllers,
  providers,
})
export class AppModule {}
