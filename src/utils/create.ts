import {
    Finalize,
    Observable,
    Mediator,
    MediatorActions,
    Subscription,
} from "../core";

export interface ObservableFactory<T> {
    (actions: MediatorActions<T>): Subscription | Finalize | void;
}

export function create<T>(factory: ObservableFactory<T>): Observable<T> {
    return new Observable<T>(actions => {
        const mediator = new Mediator<T>();
        const mediatorSubscription = mediator.subscribe(actions);

        const teardownSource = factory({
            next(value) {
                mediator.next(value);
            },
            error(error) {
                mediator.error(error);
            },
            complete() {
                mediator.complete();
            },
        });

        const teardown = pickTeardown(teardownSource) || (() => {});
        const subscription = new Subscription(() => {
            mediatorSubscription.unsubscribe();

            teardown();
        });

        if (mediator.closed) subscription.unsubscribe();

        return subscription;
    });
}

function pickTeardown<T>(
    source: ReturnType<ObservableFactory<T>>,
): Finalize | undefined {
    if (typeof source === "function") return source;
    if (source instanceof Subscription) return source.unsubscribe.bind(source);
}
