import { Observable } from "../core";
import { pipe } from "../utils";

Observable.prototype.filter = function (predicate) {
    return pipe(this, ({ next }) => ({
        next(value) {
            if (predicate(value)) next(value);
        },
    }));
};
