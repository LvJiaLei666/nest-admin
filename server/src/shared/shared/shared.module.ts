import { Global, Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import config from '@/config';
import { CustomPrismaModule, PrismaModule } from 'nestjs-prisma';
import { PrismaConfigService } from '../prisma/prisma-config.service';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import dayjs from 'dayjs';
import { ExtendedPrismaConfigService } from '../prisma/extended-prisma-config.service';
import { APP_PIPE } from '@nestjs/core';

@Global()
@Module({
  imports: [
    // 日志模块
    WinstonModule.forRoot({
      transports: [
        // 可添加其他的传输方式，如文件传输，用于将日志保存到文件中
        new winston.transports.DailyRotateFile({
          filename: 'logs/info-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '35d',
          level: 'info',
          format: winston.format.combine(
            winston.format.timestamp({
              //格式化日志记录的时间为当前时区
              format: () => dayjs().format('YYYY-MM-DDTHH:mm:ss.SSS'),
            }),
            winston.format.json(),
          ),
        }),
      ],
    }),
    // 配置模块
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    // prisma模块
    PrismaModule.forRootAsync({
      useClass: PrismaConfigService,
    }),
    /**
     * 增加prisma扩展客户端，方便业务操作
     * 可以自定义各种数据库操作方法。
     * 可以在数据库操作前做参数修改，在查询后做结果修改。
     */
    CustomPrismaModule.forRootAsync({
      name: 'customPrisma',
      isGlobal: true,
      useClass: ExtendedPrismaConfigService,
    }),
  ],
  providers: [
    // 全局参数校验以及转换管道
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    },
  ],
})
export class SharedModule {}
