import { Module } from '@nestjs/common';
import { FirstIntegrationService } from '@modules/first-integration/first-integration.service';
import { FirstIntegrationController } from '@modules/first-integration/first-integration.controller';
import { HttpModule } from '@nestjs/axios';
import { HttpProvider } from '@src/shared/providers/http.provider';

const imports = [
  HttpModule.register({ ...new HttpProvider().createHttpOptions() }),
];

const controllers = [FirstIntegrationController];

const providers = [FirstIntegrationService];

@Module({ imports, controllers, providers })
export class FirstIntegrationModule {}
