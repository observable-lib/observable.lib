import { Observable } from "../core";
import { pipe } from "../utils";

Observable.prototype.onFinalize = function (callback) {
    return pipe(this, () => ({
        finalize() {
            callback();
        },
    }));
};
