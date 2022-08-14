import { Observable } from "../core";
import { never } from "../observables";
import { Subscriptions } from "./subscriptions";

export function merge<T>(...observables: Observable<T>[]): Observable<T> {
    if (observables.length === 0) return never<T>();

    return new Observable(observer => {
        const subscriptions = new Subscriptions(
            observables.map(item => item.subscribe(observer)),
        );

        return () => subscriptions.unsubscribe();
    });
}
