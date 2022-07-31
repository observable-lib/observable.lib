import { Observable, Subscription, Subscriptions } from "../core";
import { never } from "../observables";

export function merge<T>(...observables: Observable<T>[]): Observable<T> {
    if (observables.length === 0) return never<T>();

    return new Observable(subscriber => {
        const subscriptions = new Subscriptions(
            observables.map(item => item.subscribe(subscriber)),
        );

        return new Subscription(() => subscriptions.unsubscribe());
    });
}
