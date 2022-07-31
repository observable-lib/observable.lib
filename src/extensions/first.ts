import { Observable } from "../core";
import { pipe } from "../utils";

Observable.prototype.first = function () {
    return pipe(this, ({ next, complete }) => ({
        next(value) {
            next(value);
            complete();
        },
    }));
};
