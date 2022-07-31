import { Observable } from "../core";
import { pipe } from "../utils";

Observable.prototype.map = function (callback) {
    return pipe<any, any>(this, ({ next }) => ({
        next(value) {
            next(callback(value));
        },
    }));
};
