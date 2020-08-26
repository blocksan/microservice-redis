import { Controller } from '@nestjs/common';
import { Transport, ClientProxy, MessagePattern, EventPattern, Payload, ClientProxyFactory } from '@nestjs/microservices';
import { ApplicationLoggerService } from 'src/logger/logger.service';
import { AppService } from './app.service';

/**
 * @Remarks
 * App controller which will accept all the Event and Message Patterns
 * 1. cacheContent  - saves the content to REDIS
 * 2. fetchContent  - fetch the content from REDIS
 * 3. clearCache    - clear the content from REDIS
 */
@Controller('app')
export class AppController {

  private client: ClientProxy;

  constructor(private appLogger: ApplicationLoggerService, private appService: AppService) {
    this.appLogger.setContext('AppController');
    this.client = ClientProxyFactory.create({
      transport: Transport.REDIS, options: {
        url: process.env.REDIS_SERVER,
      }
    })
  }


  /**
   * @Remarks
   * EventPattern based function because the consumer doesn't need to wait for the response. It's fire and forget strategy
   * Cache the content in REDIS store 
   * @param payload : IRedisPayload
   * @returns void
   */
  @EventPattern('cacheContent')
  async cacheContent(@Payload() payload: { key: string, data: string }) {
    await this.appService.saveContent(payload)
  }

  /**
   * @Remarks
   * MessagePattern based function because the consumer needs to wait for the data, 
   * hence sending response is critical
   * @param payload : IRedisPayload
   * @returns string|null
   */
  @MessagePattern('fetchContent')
  async fetchContent(@Payload() payload: { key: string }): Promise<string | null> {
    return this.appService.fetchContent(payload)
  }


  /**
   * @Remarks
   * EventPattern based function because the consumer doesn't need to wait for the response. It's fire and forget strategy
   * Clear the cache from the REDIS store
   * @param payload : {}
   * @returns void
   */
  @EventPattern('clearCache')
  async clearCache() {
    await this.appService.clearContent()
  }
}
