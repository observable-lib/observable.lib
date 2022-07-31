import { Observable, MediatorActions, Subscriber } from "../core";
import { create } from "./create";

export interface PipeHandler<In, Out> {
    (actions: MediatorActions<Out extends unknown ? In : Out>): Partial<
        Subscriber<In>
    >;
}

export function pipe<In, Out>(
    observable: Observable<In>,
    handler: PipeHandler<In, Out>,
): Observable<Out extends unknown ? In : Out> {
    return create(actions => {
        const callbacks = handler(actions);

        observable.subscribe(callbacks);
    });
}
