import { Emitter, Stream } from "./stream";

export class Store<T> extends Stream<T> {
    #value: T;

    constructor(emitter: Emitter<T>, initial: T) {
        super(emitter, ({ next }) => next(this.#value));

        this.#value = initial;

        this.subscribe({
            next: value => {
                this.#value = value;
            },
        });
    }
}
