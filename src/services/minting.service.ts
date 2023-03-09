import * as fs from 'fs';
import { Injectable } from '@nestjs/common';
import { TonCenter } from 'scripts/lib/ton-center';
import { Address, Builder, Cell, toNano } from 'ton';
import { CollectionOpCode } from 'scripts/op-code';
import BasicContract from 'scripts/lib/base-contract';
import { CreateCollectionReqDto, CreateCollectionRspDto, MintNFTViacollectionReqDto, MintNFTViacollectionRspDto, MintSingleNFTReqDto, MintSingleNFTRspDto } from 'src/dto/minting.dto';
import { ICollectionDeployData, IMintNFTViaCollectionData, IMintSingleNFTData } from 'src/lib/interfaces/minting.interface';

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

    async mintNFTViaCollection(args: MintNFTViacollectionReqDto) {
        const tonCenter = new TonCenter();
        await tonCenter.getWallet();

        const ownerAddress = Address.parse(args.ownerAddress);

        const deployData: IMintNFTViaCollectionData = {
            contentBuffer: Buffer.from(args.suffixOfNFTMeta),
            queryId: args.queryId,
            itemId: args.itemId,
        };

        const bodyCell = this.buildNFTDataViaColletion(ownerAddress, deployData);

        const contractAddress = Address.parse(args.colletionAddress);
        const collection = new BasicContract(contractAddress);

        // get wallet params
        const walletC = tonCenter.ton.open(tonCenter.wallet);
        const seqno = await walletC.getSeqno();

        // send message
        const sender = walletC.sender(tonCenter.keyPair.secretKey);
        const contract = tonCenter.ton.open(collection);
        await contract.sendMessage(sender, bodyCell);

        let rsp: MintNFTViacollectionRspDto = {
            seqno: seqno,
        };
        return rsp;
    }

    buildNFTDataViaColletion(owner: Address, args: IMintNFTViaCollectionData) {
        let itemCell: Builder = new Builder();
        itemCell.storeBuffer(args.contentBuffer);

        let nftItemCell: Builder = new Builder();
        nftItemCell.storeAddress(owner);
        nftItemCell.storeRef(itemCell);

        let bodyCell: Builder = new Builder();
        bodyCell.storeUint(CollectionOpCode.Mint, 32); // op code
        bodyCell.storeUint(args.queryId, 64); // query id -> for royalty
        bodyCell.storeUint(args.itemId, 64); // index
        bodyCell.storeCoins(toNano('0.01')); // amount
        bodyCell.storeRef(nftItemCell);
        return bodyCell.endCell();
    }

    async mintSingleNFT(args: MintSingleNFTReqDto) {
        const tonCenter = new TonCenter();
        await tonCenter.getWallet();

        const ownerAddress = Address.parse(args.ownerAddress);

        // let contentCell = tonCenter.encodeContent('https://file-8sgle4kt.w3tools.app/ton/1.json');
        const deployData: IMintSingleNFTData = {
            contentBuffer: tonCenter.encodeContent(args.NFTMetaUrl),
            royaltyFactor: args.royaltyFactor,
            royaltyBase: args.royaltyBase,
        };
        const dataCell = this.buildSingleNFTData(ownerAddress, deployData);

        // get new contract address
        const newContract = await tonCenter.createContract(dataCell, "nft-single.cell");

        // get wallet params
        const walletC = tonCenter.ton.open(tonCenter.wallet);
        const seqno = await walletC.getSeqno();
        console.log('seqno: ', seqno);

        // deploy
        const sender = walletC.sender(tonCenter.keyPair.secretKey);
        const contract = tonCenter.ton.open(newContract);
        await contract.sendDeploy(sender);
        console.log('done');

        let rsp: MintSingleNFTRspDto = {
            nftAddress: newContract.address.toString(),
            owner: ownerAddress.toString(),
            nftDetail: `${tonCenter.uri}/${newContract.address.toString()}`,
            ownerDetail: `${tonCenter.uri}/${ownerAddress.toString()}`,
            seqno: seqno,
        };
        return rsp;
    }

    buildSingleNFTData(owner: Address, args: IMintSingleNFTData) {
        let royaltyCell: Builder = new Builder();
        royaltyCell.storeUint(args.royaltyFactor, 16);
        royaltyCell.storeUint(args.royaltyBase, 16);
        royaltyCell.storeAddress(owner);

        let dataCell: Builder = new Builder();
        dataCell.storeAddress(owner); // owner address
        dataCell.storeAddress(owner); // editor_address
        dataCell.storeRef(args.contentBuffer); // content
        dataCell.storeRef(royaltyCell); // royalty_param

        return dataCell.endCell();
    }
}
