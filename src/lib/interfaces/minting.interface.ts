import { Cell } from 'ton';

export interface ICollectionDeployData {
    contentBuffer: Cell;
    commonBuffer: Buffer;
    beginId: number;
    royaltyFactor: number;
    royaltyBase: number;
}
