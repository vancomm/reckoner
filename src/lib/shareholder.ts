import { UniqueItem } from '@/lib/receiptDocument';

export interface Shareholder {
    id: string;
    name: string;
}

export interface ItemShare {
    item: UniqueItem;
    share: number;
    shareholder: Shareholder;
}

const shareholderClassNames = [
    { border: 'border-orange-500', bg: 'bg-orange-300 hover:bg-orange-500', shareBar: 'bg-orange-500' },
    { border: 'border-yellow-500', bg: 'bg-yellow-300 hover:bg-yellow-500', shareBar: 'bg-yellow-500' },
    { border: 'border-cyan-500', bg: 'bg-cyan-300 hover:bg-cyan-500', shareBar: 'bg-cyan-500' },
    { border: 'border-green-500', bg: 'bg-green-300 hover:bg-green-500', shareBar: 'bg-green-500' },
    { border: 'border-red-500', bg: 'bg-red-300 hover:bg-red-500', shareBar: 'bg-red-500' },
    { border: 'border-lime-500', bg: 'bg-lime-300 hover:bg-lime-500', shareBar: 'bg-lime-500' },
    { border: 'border-pink-400', bg: 'bg-pink-300 hover:bg-pink-400', shareBar: 'bg-pink-500' },
    // { border: 'border-amber-500' },
    // { border: 'border-rose-500' },
    // { border: 'border-emerald-500' },
    // { border: 'border-teal-500' },
    // { border: 'border-sky-500' },
    // { border: 'border-blue-500' },
    // { border: 'border-indigo-500' },
    // { border: 'border-violet-500' },
    // { border: 'border-purple-500' },
    // { border: 'border-fuchsia-500' },
] as const;

export function getShareholderClassNames(i: number) {
    return shareholderClassNames[i % shareholderClassNames.length];
}
