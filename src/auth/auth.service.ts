import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { AuthDto } from './dto';
import { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

// import { Prisma } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  // create the user
  async signup(authDto: AuthDto) {
    try {
      const hashedPassword = await argon.hash(authDto.password);

      const user = await this.prismaService.user.create({
        data: {
          email: authDto.email,
          hash: hashedPassword,
        },
        select: {
          id: true,
          email: true,
          createdAt: true,
        },
      });

      return user;
    } catch (error) {
      console.error('Caught error:', error); // 🐛 for debugging

      if (
        // error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Email already exists');
      }

      throw new InternalServerErrorException('Something went wrong');
    }
  }

  // lgoin
  async signin(authDto: AuthDto){
   // find user
    const user = await this.prismaService.user.findFirst({
        where:{
            email: authDto.email
        }
    })
    // if user not found throw exceptio
    if (!user) throw new ForbiddenException('User not found');

    // match passwrod
    const matched = await argon.verify(user.hash, authDto.password); // match the password
    // if password unmatched throw exception
    if(!matched) throw new ForbiddenException('Credentials invalid');
    return this.signToken(user.id, user.email);    
  }

  async signToken(
    userId: number,
    email: string
  ): Promise<{access_token: string}>{
    const data = {
      sub: userId,
      email
    }
    const secret = this.configService.get('JWT_SECRET');
    const access_token = await this.jwtService.signAsync(data, {
      expiresIn: '15m',
      secret
    });
    return {access_token};
  }
}
