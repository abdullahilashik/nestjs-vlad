import { Module } from '@nestjs/common';
import {AuthModule} from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { NestController } from './nest/nest.controller';
import { BookmarkModule } from './bookmark/bookmark.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true
    }),
    AuthModule,
    PrismaModule,
    UserModule,
    BookmarkModule,
  ],
  controllers: [NestController]
})
export class AppModule {}
