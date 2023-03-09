import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    constructor() {}

    getHealth(): string {
        return 'ok';
    }
}
