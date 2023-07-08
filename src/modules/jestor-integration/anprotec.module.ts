import { Module } from '@nestjs/common';
import { AnprotecService } from '@modules/jestor-integration/anprotec.service';
import { AnprotecController } from '@modules/jestor-integration/anprotec.controller';
import { GlobalModule } from '@modules/global';
import { SerializerProvider } from '@modules/database/providers';
import { SerializerRepository } from '@modules/database/repositories';
import { JestorService } from '@modules/global/services';

const imports = [GlobalModule, new SerializerProvider().init()];

const controllers = [AnprotecController];

const providers = [AnprotecService, SerializerRepository, JestorService];

@Module({ imports, controllers, providers })
export class AnprotecModule {}
