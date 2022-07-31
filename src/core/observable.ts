import { Subscriber } from "./subscriber";
import { Subscription } from "./subscription";

export class Observable<T> {
    #onSubscribe: (subscriber: Subscriber<T>) => Subscription;

    constructor(onSubscribe: (subscriber: Subscriber<T>) => Subscription) {
        this.#onSubscribe = fn(onSubscribe);
    }

    subscribe(
        subscriber?: Partial<Subscriber<T>> | Subscriber<T>["next"],
    ): Subscription {
        const source: Partial<Subscriber<T>> =
            typeof subscriber === "function"
                ? { next: subscriber }
                : subscriber || {};

        return this.#onSubscribe({
            next: fn(source.next),
            error: fn(source.error),
            complete: fn(source.complete),
            finalize: fn(source.finalize),
        });
    }
}

function fn<T extends (...args: any[]) => void>(source?: T): T {
    return typeof source === "function" ? source : ((() => {}) as any);
}

// Extensions

export interface Observable<T> {
    debounce(ms: number): Observable<T>;
    distinct(): Observable<T>;
    filter(predicate: Extensions.Predicate<T>): Observable<T>;
    first(): Observable<T>;
    last(): Observable<T>;
    map<U>(callback: (value: T) => U): Observable<U>;
    onComplete(callback: () => void): Observable<T>;
    onError(callback: <Error>(error: Error) => void): Observable<T>;
    onFinalize(callback: () => void): Observable<T>;
    onNext(callback: (value: T) => void): Observable<T>;
    onSubscribe(callback: () => void): Observable<T>;
    skip(quantity: number): Observable<T>;
    switch<U>(callback: (value: T) => Observable<U>): Observable<U>;
    take(quantity: number): Observable<T>;
}

export namespace Extensions {
    export interface Predicate<T> {
        (value: T): boolean;
    }
}
