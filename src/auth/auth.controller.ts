import {Controller, Get, Post, Delete, Patch, Put, Req, Body} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';
import {
    AuthDto
} from './dto'
@Controller('auth')
export class AuthController {
    // initialize with dependency injection
    constructor(private authService: AuthService){}

    // login
    @Post('signin')
    async signin(@Body() authDto: AuthDto){                
        const isLoggedIn = await this.authService.signin(authDto);
        if(isLoggedIn){
            return 'Logged in';
        }
        return 'Failed to loign';
    }

    // register
    @Post('signup')
    signup(@Body() authDto: AuthDto){
        return this.authService.signup(authDto);
    }
}