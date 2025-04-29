import { z } from 'zod';

export const receiptItemSchema = z.object({
    quantity: z.number(),
    productType: z.number(),
    nds: z.number(),
    price: z.number(),
    paymentType: z.number(),
    name: z.string(),
    sum: z.number(),
});

export type ReceiptItem = z.infer<typeof receiptItemSchema>;

export const receiptDocumentItemSchema = z.object({
    ticket: z.object({
        document: z.object({
            receipt: z.object({
                items: receiptItemSchema.array(),
            }),
        }),
    }),
});

export const receiptDocumentSchema = receiptDocumentItemSchema.array();

export type ReceiptDocument = z.infer<typeof receiptDocumentSchema>;
