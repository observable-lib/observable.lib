import { Subscription } from "../core";

export class Subscriptions {
    get closed() {
        return this.#closed;
    }

    #subscriptions: Subscription[] = [];
    #closed = false;

    constructor(...subscriptions: Subscription[] | [Subscription[]]) {
        this.append(...subscriptions);
    }

    append(...subscriptions: Subscription[] | [Subscription[]]): void {
        if (this.#closed) return;

        const items = Array.isArray(subscriptions[0])
            ? subscriptions[0]
            : (subscriptions as Subscription[]);

        this.#subscriptions.push(...items);
    }

    unsubscribe(): void {
        this.#closed = true;

        this.#subscriptions.forEach(subscription => subscription.unsubscribe());
        this.#subscriptions.length = 0;
    }
}
