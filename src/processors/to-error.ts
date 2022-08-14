import { Processor } from "../core";

export function toError<T>(
    predicate: <Error>(value: any) => Error | void,
): Processor<T, T> {
    return ({ next, error: errorFn }) => ({
        next(value) {
            const error = predicate(value);

            if (typeof value === "undefined") errorFn(error);
            else next(value);
        },
    });
}
