import * as idb from 'idb-keyval';

import { Optional, makeFailed, makeSuccessful } from '../../utils/Optional';
import addHours from '../../utils/addHours';
import IDBCache from './IDBCache';

const version = 1;

const hoursUntilStale = -1;

export interface CacheKeyMap {
    names: string[];
    showManual: boolean;
}

export type CacheKey = keyof CacheKeyMap;

async function get<K extends keyof CacheKeyMap, T extends CacheKeyMap[K]>(key: K): Promise<Optional<T>> {
    const value: IDBCache<T> | undefined = await idb.get(key);

    if (!value) return makeFailed('No cached data');

    if (value.version !== version) {
        await del(key);
        return makeFailed('Cache version outdated');
    }

    if (hoursUntilStale < 0) return makeSuccessful(value.data);

    const now = new Date();
    const staleTime = addHours(value.date, hoursUntilStale);

    if (now > staleTime) {
        await del(key);
        return makeFailed('Data stale');
    }

    return makeSuccessful(value.data);
}

async function set<K extends keyof CacheKeyMap, T extends CacheKeyMap[K]>(key: K, value: T) {
    const cacheValue: IDBCache<T> = {
        date: new Date(),
        version,
        data: value,
    };
    return idb.set(key, cacheValue);
}

async function del<K extends keyof CacheKeyMap>(key: K) {
    return idb.del(key);
}

async function clear() {
    return idb.clear();
}

export { get, set, del, clear };
