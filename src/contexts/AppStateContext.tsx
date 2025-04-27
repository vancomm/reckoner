import { createContext, useContext } from 'react';

import { UniqueItem } from '../lib/parseReceiptDocument';

export interface ReceiptData {
    items: UniqueItem[];
}

export interface InputRecord {
    item: UniqueItem;
    name: string;
    share: number;
}

export type InputSetter = () => React.Dispatch<React.SetStateAction<InputRecord[]>>;

interface SingleInputGetterProps {
    item: UniqueItem;
    name: string;
}

type SingleInputGetter = (props: SingleInputGetterProps) => InputRecord | undefined;

interface ManyInputsGetterProps {
    item?: UniqueItem;
    name?: string;
}

type ManyInputsGetter = (props: ManyInputsGetterProps) => InputRecord[];

export type InputGetter = SingleInputGetter | ManyInputsGetter;

type InputAggregator<T> = (item: UniqueItem) => T;

interface UIState {
    showManual: boolean;
    setShowManual: React.Dispatch<React.SetStateAction<boolean>>;
}

interface AppStateInterface {
    names: string[];
    setNames: React.Dispatch<React.SetStateAction<string[]>>;
    receiptData?: ReceiptData;
    setReceiptData: React.Dispatch<React.SetStateAction<ReceiptData | undefined>>;
    inputRecords: InputRecord[];
    setInputRecords: React.Dispatch<React.SetStateAction<InputRecord[]>>;
    inputRecordsInterface: {
        getRecords: ManyInputsGetter;
        getRecord: SingleInputGetter;
        getShares: InputAggregator<number>;
    };
    uiState: UIState;
}

export const AppStateContext = createContext<AppStateInterface>({} as AppStateInterface);

export const useAppState = () => useContext(AppStateContext);
