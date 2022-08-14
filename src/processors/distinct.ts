import { ValueAccessor } from "value-accessor";

import { Processor } from "../core";

export function distinct<T>(): Processor<T, T> {
    return ({ next }) => {
        const prev = new ValueAccessor<any>();

        return {
            next(value) {
                if (prev.hasValue && value === prev.value) return;

                prev.value = value;

                next(value);
            },
            finalize() {
                (prev as any) = null;
            },
        };
    };
}
