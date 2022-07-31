import { Observable } from "../core";
import { pipe } from "../utils";

Observable.prototype.onNext = function (callback) {
    return pipe(this, ({ next }) => ({
        next(value) {
            callback(value);

            next(value);
        },
    }));
};
