import { Observable } from "../core";

export function interval(ms: number): Observable<number> {
    return new Observable(({ next }) => {
        let counter = 0;

        const id = setInterval(() => next(counter++), ms);

        return () => clearInterval(id);
    });
}
