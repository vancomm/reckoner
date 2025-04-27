type ReceiptDocument = ReceiptDocumentItem[];

export default ReceiptDocument;

export interface ReceiptDocumentItem {
    ticket: Ticket;
}

export interface Ticket {
    document: Document;
}

export interface Document {
    receipt: Receipt;
}

export interface Receipt {
    items: Item[];
}

export interface Item {
    quantity: number;
    productType: number;
    nds: number;
    price: number;
    paymentType: number;
    name: string;
    sum: number;
}
