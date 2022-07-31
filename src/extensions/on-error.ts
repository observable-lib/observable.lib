import { Observable } from "../core";
import { pipe } from "../utils";

Observable.prototype.onError = function (callback) {
    return pipe(this, ({ error }) => ({
        error(value) {
            callback(value);

            error(value);
        },
    }));
};
