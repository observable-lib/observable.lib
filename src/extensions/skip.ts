import { Observable } from "../core";
import { pipe } from "../utils";

Observable.prototype.skip = function (quantity) {
    return pipe(this, ({ next }) => {
        let counter = 0;

        return {
            next(value) {
                if (counter < quantity) counter++;
                else next(value);
            },
        };
    });
};
