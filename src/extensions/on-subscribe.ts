import { Observable } from "../core";
import { pipe } from "../utils";

Observable.prototype.onSubscribe = function (callback) {
    return pipe(this, () => {
        callback();

        return {};
    });
};
