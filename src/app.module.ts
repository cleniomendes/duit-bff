import { Module } from '@nestjs/common';
import { AnprotecModule } from '@modules/jestor-integration';
import { GlobalModule } from '@modules/global';
import { DatabaseModule } from '@modules/database';

const imports = [
  new DatabaseModule().init().then((o) => o),
  AnprotecModule,
  GlobalModule,
];

const controllers = [];

const providers = [AnprotecModule, GlobalModule];

@Module({
  imports,
  controllers,
  providers,
})
export class AppModule {}
