import { Module, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { ApplicationLoggerModule } from '../logger/logger.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpErrorFilter } from 'src/shared/filter/http-error.util';
import { LoggerInterceptor } from 'src/logger/logger.interceptor';
import { ReqestMiddleware } from 'src/shared/middlewares';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { dbconfig } from 'src/shared/config/database.config';
import { AppService } from './app.service';
import { RedisModule} from 'nestjs-redis'

@Module({
  imports: [ApplicationLoggerModule,ConfigModule.forRoot({
    isGlobal: true,
    load: [dbconfig]
  }), RedisModule.forRootAsync({
    useFactory: (configService: ConfigService) => configService.get('redis'),         // or use async method
    inject:[ConfigService]
})],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_FILTER,
    useClass: HttpErrorFilter
  }, {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor
    }],
})
export class AppModule {
  /**
   * Adding middleware configuration
   */
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ReqestMiddleware)
      .forRoutes('*');
  }
}