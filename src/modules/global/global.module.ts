import { Global, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { HttpProvider } from '@modules/global/providers/http.provider';

import { JestorService } from '@modules/global/services';

const imports = [
  HttpModule.register({ ...new HttpProvider().createHttpOptions() }),
];

const providers = [JestorService];

@Global()
@Module({
  imports,
  providers,
  exports: [HttpModule.register({ ...new HttpProvider().createHttpOptions() })],
})
export class GlobalModule {}
