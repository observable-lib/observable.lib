import { Processor } from "../core";

export function onSubscribe<T>(callback: () => void): Processor<T, T> {
    return () => {
        callback();

        return {};
    };
}
