import { Observable } from "../core";
import { Input, Output } from "./on.interfaces";

export function onComplete<Source extends Input>(
    source: Source,
): Observable<Output<Source>> {
    return new Observable(({ next, error, complete }) => {
        const target: Output<Source> = {} as any;
        const entries: [keyof Source, Observable<any>][] = Object.entries(
            source,
        ) as any;

        let counter = entries.length;

        entries.forEach(([key, observable]) => {
            let noError = true;

            observable.subscribe({
                next(value) {
                    target[key] = value;
                },
                error(value) {
                    noError = false;

                    error(value);
                },
                complete() {
                    if (noError && --counter === 0) {
                        next(target);
                        complete();
                    }
                },
            });
        });
    });
}
