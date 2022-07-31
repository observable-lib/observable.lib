import { Observable } from "../core";
import { create } from "../utils";

export function interval(ms: number): Observable<number> {
    return create(({ next }) => {
        let counter = 0;

        const id = setInterval(() => next(counter++), ms);

        return () => clearInterval(id);
    });
}
