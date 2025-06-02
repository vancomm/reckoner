import React from 'react';

type JSONPrimitive = string | number | boolean | null;

type JSONValue = JSONPrimitive | JSONValue[] | { [key: string]: JSONValue };

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
type NotAssignableToJSON = bigint | symbol | Function | Date;

type Serializable<T> = unknown extends T
    ? never
    : {
          [P in keyof T]: T[P] extends JSONValue ? T[P] : T[P] extends NotAssignableToJSON ? never : Serializable<T[P]>;
      };

export default function usePersistentState<T>(key: string, initialValue: Serializable<T>): [Serializable<T>, React.Dispatch<React.SetStateAction<Serializable<T>>>] {
    const [state, setState] = React.useState(() => {
        const value = window.localStorage.getItem(key);
        if (value !== null) {
            return JSON.parse(value) as Serializable<T>;
        }
        return initialValue;
    });

    React.useEffect(() => {
        window.localStorage.setItem(key, JSON.stringify(state));
    }, [key, state]);

    return [state, setState];
}
