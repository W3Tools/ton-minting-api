import { JWTService } from './jwt.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginReqDto, LoginRspDto } from '../dto/auth.dto';

export const SESSION_PERFIX = 'login_session';

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JWTService) {}

    async login(args: LoginReqDto): Promise<LoginRspDto> {
        let username = process.env.USERNAME;
        let password = process.env.PASSWORD;
        if (!username || !password) throw Error('username or password not set');
        if (username != args.username || password != args.password) throw new HttpException('password verification failure', HttpStatus.BAD_REQUEST);

        const accessToken = this.jwtService.createToken(args.username, args.password);

        return { session: accessToken };
    }

    async logout(): Promise<boolean> {
        return true;
    }
}

export interface AuthPayload {
    username: string;
    password: string;
}
