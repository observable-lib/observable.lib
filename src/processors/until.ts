import { Observable, Processor } from "../core";
import { never } from "../observables";

export function until<T>(
    trigger: Observable<unknown> | ((value: any) => boolean),
): Processor<T, T> {
    // if (trigger instanceof Observable) return create(() => {});

    if (typeof trigger === "function")
        return ({ next, complete }) => ({
            next(value) {
                if (trigger(value)) complete();
                else next(value);
            },
        });

    // return never();
    return () => ({});
}
