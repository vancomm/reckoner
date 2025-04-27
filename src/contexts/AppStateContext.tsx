import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { get, set } from '../helpers/cacheHelper';
import { handleOption } from '../utils/Optional';
import { UniqueItem } from '../utils/parseReceiptDocument';

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

const AppStateContext = createContext<AppStateInterface>({} as AppStateInterface);

interface StateProviderProps {
    children: React.ReactNode;
}

export function AppStateProvider({ children }: StateProviderProps) {
    const [initialized, setInitialized] = useState(false);

    const [names, setNames] = useState<string[]>([]);

    const saveNames = (value: React.SetStateAction<string[]>) => {
        setNames(value);
        setInputRecords([]);
    };

    const [receiptData, setReceiptData] = useState<ReceiptData>();

    const saveReceiptData = (value: React.SetStateAction<ReceiptData | undefined>) => {
        setReceiptData(value);
        setInputRecords([]);
    };

    const [inputRecords, setInputRecords] = useState<InputRecord[]>([]);

    const getRecords: ManyInputsGetter = useMemo(
        () =>
            ({ item, name }) => {
                return inputRecords.filter((r) =>
                    !item
                        ? !name
                            ? true
                            : r.name === name
                        : !name
                          ? r.item === item
                          : r.item === item && r.name === name
                );
            },
        [inputRecords]
    );

    const getRecord: SingleInputGetter = useMemo(
        () =>
            ({ item, name }) => {
                return inputRecords.find((r) => r.item === item && r.name === name);
            },
        [inputRecords]
    );

    const getShares: InputAggregator<number> = useMemo(
        () => (item) =>
            getRecords({ item })
                .map((r) => r.share)
                .reduce((sum, add) => sum + add, 0),
        [getRecords]
    );

    const [showManual, setShowManual] = useState(false);

    const uiState: UIState = useMemo(() => ({ showManual, setShowManual }), [showManual]);

    const value = useMemo(
        () => ({
            names,
            setNames: saveNames,
            receiptData,
            setReceiptData: saveReceiptData,
            inputRecords,
            inputRecordsInterface: {
                getRecords,
                getRecord,
                getShares,
            },
            setInputRecords,
            uiState,
        }),
        [names, receiptData, inputRecords, getRecords, getRecord, getShares, uiState]
    );

    const init = async () =>
        Promise.all([
            get('names').then(handleOption(setNames)),
            get('showManual').then(
                handleOption(
                    (value) => setShowManual(value),
                    () => {
                        setShowManual(true);
                        set('showManual', true);
                    }
                )
            ),
        ]);

    useEffect(() => {
        init().then(() => setInitialized(true));
    }, []);

    useEffect(() => {
        if (initialized) set('names', names); // otherwise dafault value [] overwrites cache
    }, [initialized, names]);

    return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export const useAppState = () => useContext(AppStateContext);
