import { ValueAccessor } from "value-accessor";

import { Observable } from "../core";
import { pipe } from "../utils";

Observable.prototype.last = function () {
    return pipe(this, ({ next, complete }) => {
        const store = new ValueAccessor<any>();

        return {
            next(value) {
                store.value = value;
            },
            complete() {
                if (store.hasValue) next(store.value);

                complete();
            },
            finalize() {
                store.clear();
            },
        };
    });
};
