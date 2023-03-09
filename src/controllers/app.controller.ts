import { Controller, Get } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from '../services/app.service';
import { Public } from 'src/lib/decorators/public.decorator';

@Public() // decorator: this api is public, no identity verification required
@ApiTags('App') // swagger tag category
@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Public() // not need session in header
    @ApiResponse({
        status: 200,
        description: 'health check',
        type: String,
    }) // swagger configure: api response description
    @Get('/health')
    getHealth(): string {
        return this.appService.getHealth();
    }
}
