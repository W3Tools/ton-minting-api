import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { JWTService } from '../services/jwt.service.js';
import { jwtConfig } from '../lib/configs/jwt.config.js';
import { JwtStrategy } from '../lib/strategies/jwt.strategy.js';
import { JwtAuthGuard } from '../lib/guards/jwt-auth.guard.js';
import { LocalStrategy } from '../lib/strategies/local.strategy.js';

@Module({
    imports: [
        JwtModule.register({
            secret: jwtConfig.secretKey,
            signOptions: { expiresIn: `${jwtConfig.maxAge}s` },
        }),
    ],
    providers: [
        JWTService,
        LocalStrategy,
        JwtStrategy,
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
    ],
    controllers: [],
    exports: [JWTService],
})
export class JWTModule {}
