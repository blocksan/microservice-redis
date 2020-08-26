import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ApplicationLoggerService } from './logger/logger.service';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.REDIS,
      options: {
        url: process.env.REDIS_SERVER,
      },
    },
  );
  
  app.useLogger(new ApplicationLoggerService())
  app.useGlobalPipes(new ValidationPipe({ disableErrorMessages: false, dismissDefaultMessages: false }));

  app.listen(() => Logger.log(`Redis Microservice started`));
}
bootstrap();
