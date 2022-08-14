import { Observable, Subscription } from "../core";
import { never } from "../observables";
import { Subscriptions } from "./subscriptions";

export function merge<T>(...observables: Observable<T>[]): Observable<T> {
    if (observables.length === 0) return never<T>();

    return new Observable(subscriber => {
        const subscriptions = new Subscriptions(
            observables.map(item => item.subscribe(subscriber)),
        );

        return new Subscription(() => subscriptions.unsubscribe());
    });
}
