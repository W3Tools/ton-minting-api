import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { AuthPayload } from './auth.service.js';
import { jwtConfig } from '../lib/configs/jwt.config.js';

@Injectable()
export class JWTService {
    constructor(private jwt: JwtService) {}

    createToken(username, password): string {
        const payload: AuthPayload = {
            username: username,
            password: password,
        };

        const token = this.jwt.sign(payload);
        return token;
    }

    parseToken(token: string | string[]) {
        try {
            const _token = typeof token == 'string' ? token : token[0];
            const res = this.jwt.verify<AuthPayload>(_token, { secret: jwtConfig.secretKey });
            return res;
        } catch (err) {}
    }
}
