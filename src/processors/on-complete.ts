import { Processor } from "../core";

export function onComplete<T>(callback: () => void): Processor<T, T> {
    return ({ complete }) => ({
        complete() {
            callback();

            complete();
        },
    });
}
