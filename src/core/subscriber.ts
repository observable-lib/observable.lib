export interface Subscriber<T> {
    next(value: T): void;
    error<Error>(error: Error): void;
    complete(): void;
    finalize(): void;
}
