import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(config: ConfigService, private prismaService: PrismaService){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.get('JWT_SECRET') || '',
        });
    }

    async validate(payload: any) {        
        const user = await this.prismaService.user.findFirst({
            where:{
                email: payload.email
            },
            select:{
                id: true,
                first_name: true,
                last_name: true,
                email: true,
                createdAt: true,
                updatedAt: true,
                hash: false
            }
        });
        
        return user;
    }
}