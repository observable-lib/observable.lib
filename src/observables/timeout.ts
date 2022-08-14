import { Observable } from "../core";

export function timeout(ms: number): Observable<void> {
    return new Observable(({ next, complete }) => {
        const id = setTimeout(() => {
            next();
            complete();
        }, ms);

        return () => clearTimeout(id);
    });
}
