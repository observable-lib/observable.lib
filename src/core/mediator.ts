import { Observable } from "./observable";
import { Subscriber } from "./subscriber";
import { Subscription } from "./subscription";

export type MediatorActions<T> = Pick<
    Mediator<T>,
    "next" | "error" | "complete"
>;

export class Mediator<T> extends Observable<T> {
    get closed() {
        return this.#closed;
    }

    #closed = false;
    #items = new Set<Item<T>>();

    constructor() {
        super(subscriber => {
            const item: Item<T> = {
                subscriber,
                subscription: new Subscription(() => {
                    this.#items.delete(item);

                    this.#finalize();
                }),
            };

            this.#items.add(item);

            return item.subscription;
        });
    }

    next(value: T): void {
        if (this.#closed) return;

        this.#getCallbacks("next").forEach(next => next(value));
    }

    error<Error>(error: Error): void {
        if (this.#closed) return;

        this.#getCallbacks("error").forEach(error => error(error));

        const errorbacks = this.#getCallbacks("error");

        this.#finalize();

        errorbacks.forEach(errorback => errorback(error));
    }

    complete(): void {
        if (this.#closed) return;

        const callbacks = this.#getCallbacks("complete");

        this.#finalize();

        callbacks.forEach(callback => callback());
    }

    #getCallbacks<Key extends keyof Subscriber<T>>(
        key: Key,
    ): Subscriber<T>[Key][] {
        return Array.from(this.#items).map(({ subscriber }) => subscriber[key]);
    }

    #finalize(): void {
        this.#closed = true;

        const items = Array.from(this.#items);

        this.#items.clear();

        items.forEach(({ subscriber, subscription }) => {
            subscriber.finalize();
            subscription.unsubscribe();
        });
    }
}

interface Item<T> {
    subscriber: Subscriber<T>;
    subscription: Subscription;
}
