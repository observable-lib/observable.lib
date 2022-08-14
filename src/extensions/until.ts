import { Observable } from "../core";
import { never } from "../observables";
import { create, pipe } from "../utils";

Observable.prototype.until = function (
    trigger: Observable<unknown> | ((value: any) => boolean),
) {
    if (trigger instanceof Observable) return create(() => {});

    if (typeof trigger === "function")
        return pipe(this, ({ next, complete }) => ({
            next(value) {
                if (trigger(value)) complete();
                else next(value);
            },
        }));

    return never();
};
