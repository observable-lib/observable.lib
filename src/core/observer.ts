export interface Observer<T> {
    next(value: T): void;
    error<Error>(error: Error): void;
    complete(): void;
}
