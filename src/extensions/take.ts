import { Observable } from "../core";
import { create, pipe } from "../utils";

Observable.prototype.take = function (quantity) {
    if (quantity <= 0)
        return create(({ next, complete }) => {
            next([]);
            complete();
        });

    return pipe(this, ({ next, complete }) => {
        const values: any[] = [];

        return {
            next(value) {
                if (values.push(value) < quantity) return;

                next(values.slice);
                complete();
            },
            finalize() {
                values.length = 0;
            },
        };
    });
};
