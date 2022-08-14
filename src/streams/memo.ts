import { ValueAccessor } from "value-accessor";

import { Emitter, Stream } from "./stream";

export class Memo<T> extends Stream<T> {
    #value = new ValueAccessor<T>();

    constructor(emitter: Emitter<T>) {
        super(emitter, ({ next }) => {
            if (this.#value.hasValue) next(this.#value.value);
        });

        this.subscribe({
            next: value => {
                this.#value.value = value;
            },
        });
    }
}
