import { ValueAccessor } from "value-accessor";

import { Processor } from "../core";

export function last<T>(): Processor<T, T> {
    return ({ next, complete }) => {
        const store = new ValueAccessor<any>();

        return {
            next(value) {
                store.value = value;
            },
            complete() {
                if (store.hasValue) next(store.value);

                complete();
            },
            finalize() {
                store.clear();
            },
        };
    };
}
