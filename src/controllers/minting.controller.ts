import { Request } from 'express';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Post, Req } from '@nestjs/common';
import { CreateCollectionReqDto, CreateCollectionRspDto, MintNFTViacollectionReqDto, MintNFTViacollectionRspDto } from 'src/dto/minting.dto';
import { Public } from 'src/lib/decorators/public.decorator';
import { MintingService } from 'src/services/minting.service';
import { IResponse, ResponseInternalError, ResponseSucc } from 'src/lib/interfaces/response.interface';

@Public() // decorator: this api is public, no identity verification required
@ApiTags('Minting') // swagger tag category
@Controller()
export class MintingController {
    constructor(private readonly mintingService: MintingService) {}

    @Public()
    @ApiResponse({
        status: 200,
        description: 'create collection',
        type: CreateCollectionRspDto,
    })
    @Post('/create_collection')
    async createCollection(@Req() req: Request, @Body() body: CreateCollectionReqDto): Promise<IResponse> {
        try {
            const rsp = await this.mintingService.createCollection(body);
            return new ResponseSucc(rsp);
        } catch (err) {
            return new ResponseInternalError((err as Error).message);
        }
    }

    @Public()
    @ApiResponse({
        status: 200,
        description: 'Mint nft via collection',
        type: MintNFTViacollectionRspDto,
    })
    @Post('/mint_nft_via_collection')
    async mintNFTViaCollection(@Req() req: Request, @Body() body: MintNFTViacollectionReqDto): Promise<IResponse> {
        try {
            const rsp = await this.mintingService.mintNFTViaCollection(body);
            return new ResponseSucc(rsp);
        } catch (err) {
            return new ResponseInternalError((err as Error).message);
        }
    }
}
