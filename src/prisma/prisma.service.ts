import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from 'generated/prisma';
import { config, env } from 'process';
@Injectable()
export class PrismaService extends PrismaClient {
    constructor(configService: ConfigService){
        super({
            datasources: {
                db: {
                    url: configService.get('DATABASE_URL')
                }
            }
        });
    }
}