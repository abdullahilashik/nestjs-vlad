import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { User } from 'generated/prisma';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';

@Controller('users')
export class UsersController {

    @UseGuards(JwtGuard)
    @Get('me')
    getMe(@GetUser() user: User, @GetUser('email') email: string){        
        console.log("Email: ", email);
        return user;
    }
}
