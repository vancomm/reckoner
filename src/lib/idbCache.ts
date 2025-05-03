import * as idb from 'idb-keyval';
import { Result, err, ok } from 'neverthrow';

import { Shareholder } from './shareholder';

const version = 1;
const hoursUntilStale = -1;

const HOURS_IN_MS = 60 * 60 * 1000;

function addHours(date: Date, hours: number): Date {
    const added = new Date(date);
    added.setTime(added.getTime() + hours * HOURS_IN_MS);
    return added;
}

export interface IDBCache<T> {
    version: number;
    date: Date;
    data: T;
}

export interface CacheKeyMap {
    names: string[];
    shareholders: Shareholder[];
    hideWelcomeMessage: boolean;
}

export type CacheKey = keyof CacheKeyMap;

async function get<K extends keyof CacheKeyMap, T extends CacheKeyMap[K]>(key: K): Promise<Result<T, string>> {
    const value: IDBCache<T> | undefined = await idb.get(key);

    if (!value) return err('No cached data');

    if (value.version !== version) {
        await del(key);
        return err('Cache version outdated');
    }

    if (hoursUntilStale < 0) return ok(value.data);

    const now = new Date();
    const staleTime = addHours(value.date, hoursUntilStale);

    if (now > staleTime) {
        await del(key);
        return err('Data stale');
    }

    return ok(value.data);
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

const cache = { get, set, del, clear };

export default cache;
