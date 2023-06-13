import { NestFactory } from '@nestjs/core';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NextFunction, Request, Response } from 'express';
import * as bodyParser from 'body-parser';
import compress from 'compression';
import helmet from 'helmet';
import { v4 } from 'uuid';
import { getEnv } from '@shared/configuration/constants';

export default async function setup(
  module: unknown,
): Promise<INestApplication> {
  const application = await NestFactory.create(module, { cors: true });

  // add body parser
  application.use(bodyParser.urlencoded({ extended: true, limit: '500mb' }));

  application.use(bodyParser.json({ limit: '500mb' }));

  application.use(compress());

  // secure apps by setting various HTTP headers
  application.use(helmet());

  // enable request ID
  application.use((req: Request, _res: Response, next: NextFunction) => {
    req.headers['X-Request-ID'] = v4();
    next();
  });

  // Set default pipes.
  application.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  if (getEnv().api.env !== 'production') {
    swaggerSetup(application);
  }

  return application;
}

function swaggerSetup(application: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Duit BFF')
    .setDescription('The Duit BFF API Description')
    .setVersion('1.0.0')
    .addBasicAuth({ type: 'apiKey', in: 'header', name: 'api-access-key' })
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(application, config);

  SwaggerModule.setup('docs', application, document, {
    customSiteTitle: 'Duit BFF Swagger',
  });
}
