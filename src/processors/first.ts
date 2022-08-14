import { Processor } from "../core";

export function first<T>(): Processor<T, T> {
    return ({ next, complete }) => ({
        next(value) {
            next(value);
            complete();
        },
    });
}
