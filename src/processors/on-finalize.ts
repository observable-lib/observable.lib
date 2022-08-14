import { Processor } from "../core";

export function onFinalize<T>(callback: () => void): Processor<T, T> {
    return () => ({
        finalize() {
            callback();
        },
    });
}
