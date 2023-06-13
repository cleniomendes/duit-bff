import { Logger } from '@nestjs/common';
import { getEnv } from '@shared/configuration/constants';
import { AppModule } from '@src/app.module';
import setup from '@src/setup';

async function bootstrap() {
  const app = await setup(AppModule);
  const { env, port } = getEnv().api;

  await app.listen(port, () => {
    Logger.log(`ONLINE ${env} ${port}`);
  });
}

bootstrap();
