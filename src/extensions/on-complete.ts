import { Observable } from "../core";
import { pipe } from "../utils";

Observable.prototype.onComplete = function (callback) {
    return pipe(this, ({ complete }) => ({
        complete() {
            callback();

            complete();
        },
    }));
};
