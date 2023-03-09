import * as fs from 'fs';
import { Injectable } from '@nestjs/common';
import { TonCenter } from 'scripts/lib/ton-center';
import { Address, Builder, Cell } from 'ton';
import { CreateCollectionReqDto, CreateCollectionRspDto } from 'src/dto/minting.dto';
import { ICollectionDeployData } from 'src/lib/interfaces/minting.interface';

@Injectable()
export class MintingService {
    constructor() {}

    async createCollection(args: CreateCollectionReqDto): Promise<CreateCollectionRspDto> {
        const tonCenter = new TonCenter();
        await tonCenter.getWallet();

        let baseUri = args.nftBaseUri.endsWith('/') ? args.nftBaseUri : `${args.nftBaseUri}/`;

        const deployData: ICollectionDeployData = {
            contentBuffer: tonCenter.encodeContent(args.collectionMetaUrl),
            commonBuffer: Buffer.from(baseUri),
            beginId: args.nftBeginId,
            royaltyFactor: args.royaltyFactor,
            royaltyBase: args.royaltyBase,
        };

        const dataCell = this.buildCollectionDeployData(tonCenter.wallet.address, deployData);

        // get new contract address
        const newContract = await tonCenter.createContract(dataCell);

        // get wallet params
        const walletC = tonCenter.ton.open(tonCenter.wallet);
        const seqno = await walletC.getSeqno();

        // deploy
        const sender = walletC.sender(tonCenter.keyPair.secretKey);
        const contract = tonCenter.ton.open(newContract);
        await contract.sendDeploy(sender);

        let rsp: CreateCollectionRspDto = {
            collectionAddress: newContract.address.toString(),
            owner: tonCenter.wallet.address.toString(),
            collectionDetail: `${tonCenter.uri}/${newContract.address.toString()}`,
            ownerDetail: `${tonCenter.uri}/${tonCenter.wallet.address.toString()}`,
            seqno: seqno,
        };
        return rsp;
    }

    buildCollectionDeployData(owner: Address, args: ICollectionDeployData) {
        let commonContent: Builder = new Builder();
        commonContent.storeBuffer(args.commonBuffer);

        let contentCell: Builder = new Builder();
        contentCell.storeRef(args.contentBuffer);
        contentCell.storeRef(commonContent.endCell());

        let royaltyCell: Builder = new Builder();
        royaltyCell.storeUint(args.royaltyFactor, 16);
        royaltyCell.storeUint(args.royaltyBase, 16);
        royaltyCell.storeAddress(owner);

        let dataCell: Builder = new Builder();
        dataCell.storeAddress(owner); // owner_address
        dataCell.storeUint(args.beginId, 64); // next_item_index
        dataCell.storeRef(contentCell.endCell());
        dataCell.storeRef(Cell.fromBoc(fs.readFileSync(`output/nft.cell`))[0]); // nft_item_code
        dataCell.storeRef(royaltyCell); // royalty_params

        return dataCell.endCell();
    }
}
