import { Injectable, Inject, Logger } from '@nestjs/common';
import { ApplicationLoggerService } from '../logger/logger.service';
import { RedisService } from 'nestjs-redis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {

  /**
   * Initializer for the config service
   */
  @Inject()
  private configService: ConfigService

  /**
   * 
   * @param appLogger : ApplicationLoggerService ( Custom logger built for the application )
   * @param redisService : RedisService (Redis service which returns the utility functions to interact with redis )
   */
  constructor(private appLogger: ApplicationLoggerService, private readonly redisService: RedisService){
    this.appLogger.setContext('AppService')
  }


  /**
   * @Remarks
   * Save the content to redis store
   * @param payload : IRedisPayload
   * @return void
   */
  async saveContent(payload: {key: string, data: string}): Promise<void>{
    try{
      const client = await this.redisService.getClient(this.configService.get("REDIS_CLIENT_NAME"))
      let expiryTime = this.configService.get("REDIS_EXPIRY")
      expiryTime = parseInt(expiryTime)
      console.log("OUTPUT: AppService -> expiryTime", expiryTime)
      const {key, data} = payload
      client.setex(key, expiryTime, data)
      this.appLogger.log('Content saved in redis')
    }catch(err){
      this.appLogger.log('Exception in saving content to redis', err)
    }
  }


   /**
   * @Remarks
   * Fetch the content from redis store
   * @param payload : IRedisPayload
   * @return string | null
   */

  async fetchContent(payload: {key: string}): Promise<string|null>{
    const client = await this.redisService.getClient(this.configService.get("REDIS_CLIENT_NAME"))
    const {key} = payload
    this.appLogger.log(`Content fetched from redis for key -> ${key}`)
    return client.get(key)
  }


  /**
   * @Remarks
   * Clear the content from redis store
   * @return void
   */
  async clearContent(): Promise<void>{
    const client = await this.redisService.getClient(this.configService.get("REDIS_CLIENT_NAME"))
    await client.flushall()
  }
}
