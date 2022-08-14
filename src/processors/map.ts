import { Processor } from "../core";

export function map<T, U>(callback: (value: T) => U): Processor<T, U> {
    return ({ next }) => ({
        next(value) {
            next(callback(value));
        },
    });
}
