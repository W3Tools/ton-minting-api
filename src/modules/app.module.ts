import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();

import { Module } from '@nestjs/common';
import { AppService } from 'src/services/app.service';
import { AppController } from 'src/controllers/app.controller';

@Module({
    imports: [],
    controllers: [AppController],
    providers: [AppService],
    exports: [],
})
export class AppModule {}
