import { Processor } from "../core";

export function onNext<T>(callback: (value: T) => void): Processor<T, T> {
    return ({ next }) => ({
        next(value) {
            callback(value);

            next(value);
        },
    });
}
