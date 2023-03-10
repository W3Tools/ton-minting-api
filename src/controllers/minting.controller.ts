import { Request } from 'express';
import { ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Post, Req } from '@nestjs/common';
import { CreateCollectionReqDto, CreateCollectionRspDto, MintNFTViacollectionReqDto, MintNFTViacollectionRspDto, MintSingleNFTReqDto, MintSingleNFTRspDto } from 'src/dto/minting.dto';
import { MintingService } from 'src/services/minting.service';
import { IResponse, ResponseInternalError, ResponseSucc } from 'src/lib/interfaces/response.interface';

@ApiTags('Minting') // swagger tag category
@ApiSecurity('session') // swagger authentication, in header.session
@Controller()
export class MintingController {
    constructor(private readonly mintingService: MintingService) {}

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

    @ApiResponse({
        status: 200,
        description: 'mint single nft',
        type: MintSingleNFTRspDto,
    })
    @Post('/mint_single_nft')
    async mintSingleNFT(@Req() req: Request, @Body() body: MintSingleNFTReqDto): Promise<IResponse> {
        try {
            const rsp = await this.mintingService.mintSingleNFT(body);
            return new ResponseSucc(rsp);
        } catch (err) {
            return new ResponseInternalError((err as Error).message);
        }
    }
}
