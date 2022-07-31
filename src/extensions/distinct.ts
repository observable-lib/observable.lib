import { ValueAccessor } from "value-accessor";

import { Observable } from "../core";
import { pipe } from "../utils";

Observable.prototype.distinct = function () {
    return pipe(this, ({ next }) => {
        const prev = new ValueAccessor<any>();

        return {
            next(value) {
                if (prev.hasValue && value === prev.value) return;

                prev.value = value;

                next(value);
            },
            finalize() {
                (prev as any) = null;
            },
        };
    });
};
