import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();

import { Module } from '@nestjs/common';
import { AuthModule } from './auth.module';
import { AppService } from 'src/services/app.service';
import { AppController } from 'src/controllers/app.controller';
import { MintingModule } from './minting.module';

@Module({
    imports: [MintingModule, AuthModule],
    controllers: [AppController],
    providers: [AppService],
    exports: [],
})
export class AppModule {}
