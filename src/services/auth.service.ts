import { JWTService } from './jwt.service';
import { Injectable } from '@nestjs/common';
import { LoginReqDto, LoginRspDto } from '../dto/auth.dto';

export const SESSION_PERFIX = 'login_session';

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JWTService) {}

    async login(args: LoginReqDto): Promise<LoginRspDto> {
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
