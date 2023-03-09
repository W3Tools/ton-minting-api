import { Module } from '@nestjs/common';
import { MintingController } from 'src/controllers/minting.controller';
import { MintingService } from 'src/services/minting.service';

@Module({
    imports: [],
    controllers: [MintingController],
    providers: [MintingService],
    exports: [],
})
export class MintingModule {}
