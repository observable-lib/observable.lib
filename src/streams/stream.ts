import { Finalize, Observable, Observer } from "../core";

export interface Emitter<T> {
    (value: T): void;
}

export class Stream<T> extends Observable<T> {
    static createEmitter<T>(): Emitter<T> {
        const emitter: Emitter<T> = value => {
            const stream = Stream.#streams.get(emitter);

            if (stream) stream.#next(value);
        };

        return emitter;
    }

    static #streams = new WeakMap<Emitter<any>, Stream<any>>();

    #observers = new Set<Observer<T>>();

    constructor(
        emitter: Emitter<T>,
        onSubscribe?: (observer: Observer<T>) => Finalize | void,
    ) {
        super(observer => {
            this.#observers.add(observer);

            let finalize: Finalize | void;

            if (onSubscribe) finalize = onSubscribe(observer);

            return () => {
                this.#observers.delete(observer);

                if (typeof finalize === "function") finalize();
            };
        });

        Stream.#streams.set(emitter, this);
    }

    #next(value: T) {
        this.#observers.forEach(observer => observer.next(value));
    }
}

export const createEmitter = Stream.createEmitter;
