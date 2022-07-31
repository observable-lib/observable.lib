import {
    Finalize,
    Observable,
    Observer,
    ObserverActions,
    Subscription,
} from "../core";

export interface ObservableFactory<T> {
    (actions: ObserverActions<T>): Subscription | Finalize | void;
}

export function create<T>(factory: ObservableFactory<T>): Observable<T> {
    return new Observable<T>(actions => {
        const observer = new Observer<T>();
        const observerSubscription = observer.subscribe(actions);

        const teardownSource = factory({
            next(value) {
                observer.next(value);
            },
            error(error) {
                observer.error(error);
            },
            complete() {
                observer.complete();
            },
        });

        const teardown = pickTeardown(teardownSource) || (() => {});
        const subscription = new Subscription(() => {
            observerSubscription.unsubscribe();

            teardown();
        });

        if (observer.closed) subscription.unsubscribe();

        return subscription;
    });
}

function pickTeardown<T>(
    source: ReturnType<ObservableFactory<T>>,
): Finalize | undefined {
    if (typeof source === "function") return source;
    if (source instanceof Subscription) return source.unsubscribe.bind(source);
}
