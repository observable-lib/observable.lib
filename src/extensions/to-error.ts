import { Observable } from "../core";
import { pipe } from "../utils";

Observable.prototype.toError = function <Error>(
    predicate: (value: any) => Error | void,
) {
    return pipe(this, ({ next, error: errorFn }) => ({
        next(value) {
            const error = predicate(value);

            if (typeof value === "undefined") errorFn(error);
            else next(value);
        },
    }));
};
