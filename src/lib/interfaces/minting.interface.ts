import { Cell } from 'ton';

export interface ICollectionDeployData {
    contentBuffer: Cell;
    commonBuffer: Buffer;
    beginId: number;
    royaltyFactor: number;
    royaltyBase: number;
}

export interface IMintNFTViaCollectionData {
    contentBuffer: Buffer;
    queryId: number;
    itemId: number;
}

export interface IMintSingleNFTData {
    contentBuffer: Cell;
    royaltyFactor: number;
    royaltyBase: number;
}
