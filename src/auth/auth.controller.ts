
import { Controller, Request, Post, UseGuards, Get, Put, Delete, Param, Body, Res, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, ResponseMessage } from './decorators/public.decorator';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { JwtAuthGuard } from './passport/jwt-auth.guard';
import { User } from './decorators/user.decorator';
import { IUser } from 'src/users/users.interface';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { Request as ExpressRequest, Response } from 'express';



@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ) { }

    @Public()
    @ResponseMessage("Login success!")
    @UseGuards(LocalAuthGuard)
    @Post('/login')
    async handleLogin(@Request() req,
        @Res({ passthrough: true }) res: Response
    ) {
        return this.authService.login(req.user, res);
    }

    @Public()
    @ResponseMessage("Register a new user success!")
    @Post('/register')
    handleRegister(@Body() registerUserDTO: RegisterUserDto) {
        return this.authService.register(registerUserDTO);
    }

    @ResponseMessage("Create a user success!")
    @UseGuards(JwtAuthGuard)
    @Post('/users')
    async handleCreate(@Request() req, @User() user: IUser) {
        return this.authService.create(req.body, user);
    }

    @ResponseMessage("Update a user success!")
    @UseGuards(JwtAuthGuard)
    @Put('/users')
    async handleUpdate(@Request() req, @User() user: IUser) {
        return this.authService.update(req.body, user);
    }

    @ResponseMessage("Delete a user success!")
    @UseGuards(JwtAuthGuard)
    @Delete('/users/:id')
    async handleDelete(@Param('id') id: string, @User() user: IUser) {
        return this.authService.delete(id, user);
    }

    @ResponseMessage("Get user infor")
    @Get('/account')
    getProfile(@User() user: IUser) {
        return user;
    }

    @Public()
    @ResponseMessage("Get User By Refresh Token")
    @Get('/refresh')
    handleRefreshToken(
        @Req() request: ExpressRequest,
        @Res({ passthrough: true }) res: Response
    ) {
        const refreshToken = request.cookies['refresh_token']
        return this.authService.processNewToken(refreshToken, res);
    }

    @ResponseMessage("Logout success!")
    @Post('/logout')
    @UseGuards(JwtAuthGuard)
    async handleLogout(@User() user: IUser,
        @Res({ passthrough: true }) res: Response
    ) {
        return this.authService.logout(user, res)
    }
}
