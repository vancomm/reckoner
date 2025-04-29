export interface ReceiptItem {
    quantity: number;
    productType: number;
    nds: number;
    price: number;
    paymentType: number;
    name: string;
    sum: number;
}

export interface Receipt {
    items: ReceiptItem[];
}

export interface Document {
    receipt: Receipt;
}

export interface Ticket {
    document: Document;
}

export interface ReceiptDocumentItem {
    ticket: Ticket;
}

export type ReceiptDocument = ReceiptDocumentItem[];
