import { not } from "logical-not";
import { ValueAccessor } from "value-accessor";

import { Processor } from "../core";

class Store<T> extends ValueAccessor<T> {
    get value(): T {
        const value = super.value;

        this.clear();

        return value;
    }

    set value(value: T) {
        super.value = value;
    }

    constructor() {
        super();
    }
}

export function debounce<T>(ms?: number): Processor<T, T> {
    return ({ next, complete }) => {
        const store = new Store<T>();

        let timer: ReturnType<typeof setTimeout>;

        return {
            next(value) {
                clearTimeout(timer);

                store.value = value;

                timer = setTimeout(() => next(store.value as any), ms);
            },
            complete() {
                if (not(store.hasValue)) complete();
            },
            finalize() {
                clearTimeout(timer);
            },
        };
    };
}
