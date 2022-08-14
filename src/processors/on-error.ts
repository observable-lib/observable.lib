import { Processor } from "../core";

export function onError<T>(
    callback: <Error>(error: Error) => void,
): Processor<T, T> {
    return ({ error }) => ({
        error(value) {
            callback(value);

            error(value);
        },
    });
}
