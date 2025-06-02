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

export const shareholderColors = [
    {
        control: 'group-hover:border-black/10 group-hover:text-black/80',
        pill: 'border-orange-300',
        input: 'border-orange-300 bg-orange-500 text-black selection:bg-orange-100 selection',
        checkbox:
            'has-checked:bg-orange-300 has-checked:border-orange-500 has-checked:text-black active:text-black active:bg-orange-300 has-checked:active:bg-orange-300 border-orange-300',
        shareBar: 'bg-orange-500',
        collapsibleHeader: 'text-black bg-orange-500 border-orange-500 text-white',
        collapsibleContent: 'text-black bg-orange-100/90 border-orange-100',
    },
    {
        control: 'group-hover:border-black/10 group-hover:text-black/80',
        pill: 'border-yellow-300',
        input: 'border-yellow-300 bg-yellow-500 text-black selection:bg-yellow-100 selection',
        checkbox:
            'has-checked:bg-yellow-300 has-checked:border-yellow-500 has-checked:text-black active:text-black active:bg-yellow-300 has-checked:active:bg-yellow-300 border-yellow-300',
        shareBar: 'bg-yellow-500',
        collapsibleHeader: 'text-black bg-yellow-500 border-yellow-500 text-white',
        collapsibleContent: 'text-black bg-yellow-100/90 border-yellow-100',
    },
    {
        control: 'group-hover:border-black/10 group-hover:text-black/80',
        pill: 'border-cyan-300',
        input: 'border-cyan-300 bg-cyan-500 text-black selection:bg-cyan-100 selection',
        checkbox: 'has-checked:bg-cyan-300 has-checked:border-cyan-500 has-checked:text-black active:text-black active:bg-cyan-300 has-checked:active:bg-cyan-300 border-cyan-300',
        shareBar: 'bg-cyan-500',
        collapsibleHeader: 'text-black bg-cyan-500 border-cyan-500 text-white',
        collapsibleContent: 'text-black bg-cyan-100/90 border-cyan-100',
    },
    {
        control: 'group-hover:border-black/10 group-hover:text-black/80',
        pill: 'border-green-300',
        input: 'border-green-300 bg-green-500 text-black selection:bg-green-100 selection',
        checkbox:
            'has-checked:bg-green-300 has-checked:border-green-500 has-checked:text-black active:text-black active:bg-green-300 has-checked:active:bg-orange-300 border-green-300',
        shareBar: 'bg-green-500',
        collapsibleHeader: 'text-black bg-green-500 border-green-500 text-white',
        collapsibleContent: 'text-black bg-green-100/90 border-green-100',
    },
    {
        control: 'group-hover:border-black/10 group-hover:text-black/80',
        pill: 'border-red-300',
        input: 'border-red-300 bg-red-500 text-black selection:bg-red-100 selection',
        checkbox: 'has-checked:bg-red-300 has-checked:border-red-500 has-checked:text-black active:text-black active:bg-red-300 has-checked:active:bg-red-300 border-red-300',
        shareBar: 'bg-red-500',
        collapsibleHeader: 'text-black bg-red-500 border-red-500 text-white',
        collapsibleContent: 'text-black bg-red-100/90 border-red-100',
    },
    {
        control: 'group-hover:border-black/10 group-hover:text-black/80',
        pill: 'border-lime-300',
        input: 'border-lime-300 bg-lime-500 text-black selection:bg-lime-100 selection',
        checkbox: 'has-checked:bg-lime-300 has-checked:border-lime-500 has-checked:text-black active:text-black active:bg-lime-300 has-checked:active:bg-lime-300 border-lime-300',
        shareBar: 'bg-lime-500',
        collapsibleHeader: 'text-black bg-lime-500 border-lime-500 text-white',
        collapsibleContent: 'text-black bg-lime-100/90 border-lime-100',
    },
    {
        control: 'group-hover:border-black/10 group-hover:text-black/80',
        pill: 'border-pink-300',
        input: 'border-pink-300 bg-pink-500 text-black selection:bg-pink-100 selection',
        checkbox: 'has-checked:bg-pink-300 has-checked:border-pink-500 has-checked:text-black active:text-black active:bg-pink-300 has-checked:active:bg-pink-300 border-pink-300',
        shareBar: 'bg-pink-500',
        collapsibleHeader: 'text-black bg-pink-500 border-pink-500 text-white',
        collapsibleContent: 'text-black bg-pink-100/90 border-pink-100',
    },
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

export type ShareholderColors = Partial<(typeof shareholderColors)[number]>;

export function getShareholderColors(index: number): ShareholderColors {
    return shareholderColors[index % shareholderColors.length];
}
