import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response } from 'express';
import { CustomReq } from '../interfaces/IRequest';
import { v4 as uuid } from 'uuid';



@Injectable()
export class ReqestMiddleware implements NestMiddleware {
  use(req: CustomReq, res: Response, next: Function) {
    /**
     * @Remarks
     * Utility to add unique requestId to every request
     * Easier to debug in docker or kubernetes cluster
     * Can be extended to use services like Tracer to track the API behaviour
     */
    req.requestId = uuid()
    next();
  }
}
