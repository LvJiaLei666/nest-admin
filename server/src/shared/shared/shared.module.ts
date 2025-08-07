import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import config from '@/config';
import { PrismaModule } from 'nestjs-prisma';
import { PrismaConfigService } from '../prisma/prisma-config.service';

@Global()
@Module({
  imports: [
    // 配置模块
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    // prisma模块
    PrismaModule.forRootAsync({
      useClass: PrismaConfigService,
    }),
  ],
})
export class SharedModule { }
