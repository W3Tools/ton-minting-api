import { Request } from 'express';
import { AuthService } from '../services/auth.service.js';
import { Controller, Req, Post, Body } from '@nestjs/common';
import { LoginReqDto, LoginRspDto } from '../dto/auth.dto.js';
import { Public } from '../lib/decorators/public.decorator.js';
import { ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { IResponse, ResponseInternalError, ResponseSucc } from '../lib/interfaces/response.interface.js';

@ApiTags('Auth') // swagger tag category
@Controller({
    path: 'auth',
    version: '1',
})
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Public()
    @ApiResponse({
        status: 200,
        type: LoginRspDto,
    })
    @Post('login')
    public async login(@Body() body: LoginReqDto): Promise<IResponse> {
        try {
            var rsp = await this.authService.login(body);
            return new ResponseSucc(rsp);
        } catch (error) {
            return new ResponseInternalError((error as Error).message);
        }
    }

    @ApiResponse({
        status: 200,
        description: 'logout and delete session',
        type: Boolean,
    })
    @Post('logout')
    @ApiSecurity('session') // swagger authentication, in header.session
    public async logout(@Req() req: Request): Promise<IResponse> {
        try {
            var rsp = await this.authService.logout();
            return new ResponseSucc(rsp);
        } catch (err) {
            return new ResponseInternalError((err as Error).message);
        }
    }
}
