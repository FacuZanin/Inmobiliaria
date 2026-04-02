// backend\src\common\middleware\request-logger.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AppLogger } from '../logger/logger.service';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: AppLogger) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;

    res.on('finish', () => {
      const { statusCode } = res;
      this.logger.log(
        `${method} ${originalUrl} → ${statusCode}`,
        'HTTP'
      );
    });

    next();
  }
}
