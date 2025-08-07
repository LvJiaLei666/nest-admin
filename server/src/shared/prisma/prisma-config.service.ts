import { Injectable, Logger } from '@nestjs/common';
import {
  loggingMiddleware,
  PrismaOptionsFactory,
  PrismaServiceOptions,
  QueryInfo,
} from 'nestjs-prisma';

@Injectable()
export class PrismaConfigService implements PrismaOptionsFactory {
  constructor() { }

  createPrismaOptions(): Promise<PrismaServiceOptions> | PrismaServiceOptions {
    return {
      prismaOptions: {
        // 控制台会打印warn和error
        log: ['warn', 'error'],
      },
      // 创建连接池
      explicitConnect: true,
      // 日志中间件
      middlewares: [
        loggingMiddleware({
          logger: new Logger('PrismaMiddleware'),
          logLevel: 'log', // default is `debug`
          logMessage: (query: QueryInfo) => {
            // 返回值就是日志内容
            return `[Prisma Query] ${query.model}.${query.action} - ${query.executionTime}ms`;
          },
        }),
      ],
    };
  }
}
