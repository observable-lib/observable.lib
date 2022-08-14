import { Processor } from "../core";

export function filter<T>(predicate: (value: T) => boolean): Processor<T, T> {
    return ({ next }) => ({
        next(value) {
            if (predicate(value)) next(value);
        },
    });
}
