import { Subscription } from "./subscription";

export class Subscriptions {
    get destroyed() {
        return this.#destroyed;
    }

    #subscriptions: Subscription[] = [];
    #destroyed = false;

    constructor(...subscriptions: Subscription[] | [Subscription[]]) {
        this.append(...subscriptions);
    }

    append(...subscriptions: Subscription[] | [Subscription[]]): void {
        if (this.#destroyed) return;

        const items = Array.isArray(subscriptions[0])
            ? subscriptions[0]
            : (subscriptions as Subscription[]);

        this.#subscriptions.push(...items);
    }

    destroy(): void {
        this.#destroyed = true;

        this.#subscriptions.forEach(subscription => subscription.unsubscribe());
        this.#subscriptions.length = 0;
    }
}
