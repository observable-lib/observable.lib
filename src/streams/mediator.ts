import { Emitter, Stream } from "./stream";

export class Mediator<T> extends Stream<T> {
    #emitter: Emitter<T>;

    constructor() {
        const emitter: Emitter<T> = Stream.createEmitter();

        super(emitter);

        this.#emitter = emitter;
    }

    emit(value: T): void {
        this.#emitter(value);
    }
}
