import { Observable } from "../core";
import { Input, Output } from "./on.interfaces";

export function onNext<Source extends Input>(
    source: Source,
): Observable<Output<Source>> {
    return new Observable(({ next, error, complete }) => {
        const target: Output<Source> = {} as any;
        const entries: [keyof Source, Observable<any>][] = Object.entries(
            source,
        ) as any;
        const keys = new Set<keyof Source>(Object.keys(source));

        entries.forEach(([key, observable]) => {
            observable.subscribe({
                next(value) {
                    target[key] = value;

                    if (keys.size === 0) next(target);
                    else keys.delete(key);
                },
                error,
                complete,
            });
        });
    });
}
