import { ValueAccessor } from "value-accessor";

import { Observable, Mediator, Subscriber, Subscription } from "../core";

export class Stream<T> extends Observable<T> {
    constructor(mediator: Mediator<T>, valueAccessor?: ValueAccessor<T>) {
        super(subscriber => {
            subscribers.add(subscriber);

            const subscription = new Subscription(() => {
                subscribers.delete(subscriber);
            });

            if (valueAccessor?.hasValue) subscriber.next(valueAccessor.value);

            return subscription;
        });

        const subscribers = new Set<Subscriber<T>>();
        const subscription = mediator.subscribe({
            next(value) {
                if (valueAccessor) valueAccessor.value = value;

                subscribers.forEach(subscriber => subscriber.next(value));
            },
            finalize() {
                subscription.unsubscribe();
            },
        });
    }
}
