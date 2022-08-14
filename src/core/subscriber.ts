export class Subscriber<T> {
    constructor(
        subscriber?:
            | Subscriber<T>
            | Partial<Subscriber<T>>
            | Subscriber<T>["next"],
    ) {
        const source: Partial<Subscriber<T>> =
            subscriber instanceof Subscriber
                ? subscriber
                : typeof subscriber === "function"
                ? { next: subscriber }
                : subscriber || {};

        this.next = fn(source.next);
        this.error = fn(source.error);
        this.complete = fn(source.complete);
        this.finalize = fn(source.finalize);
    }

    next(value: T): void {}
    error<Error>(error: Error): void {}
    complete(): void {}
    finalize(): void {}
}

function fn<T extends (...args: any[]) => void>(source?: T): T {
    return typeof source === "function" ? source : ((() => {}) as any);
}
