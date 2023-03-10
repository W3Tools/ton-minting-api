import { Module } from '@nestjs/common';
import { JWTModule } from './jwt.module.js';
import { AuthService } from '../services/auth.service.js';
import { AuthController } from '../controllers/auth.controller.js';

@Module({
    imports: [JWTModule],
    providers: [AuthService],
    controllers: [AuthController],
    exports: [],
})
export class AuthModule {}
