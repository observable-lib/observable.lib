import { Observable } from "../core";
import { pipe } from "../utils";

class Store {
    hasValue = false;

    #value: any;

    get value() {
        this.hasValue = false;

        return this.#value;
    }

    set value(value: any) {
        this.hasValue = true;

        this.#value = value;
    }
}

Observable.prototype.debounce = function (ms) {
    return pipe(this, ({ next, complete }) => {
        const store = new Store();

        let timer: ReturnType<typeof setTimeout>;

        return {
            next(value) {
                clearTimeout(timer);

                store.value = value;

                timer = setTimeout(() => next(store.value), ms);
            },
            complete() {
                if (store.hasValue) next(store.value);

                complete();
            },
            finalize() {
                clearTimeout(timer);
            },
        };
    });
};
