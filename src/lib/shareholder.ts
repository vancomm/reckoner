import { UniqueItem } from './receiptDocument';

export interface Shareholder {
    id: string;
    name: string;
}

export interface ItemShare {
    item: UniqueItem;
    share: number;
    // shareholder: Shareholder;
    name: string;
}
