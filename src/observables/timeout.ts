import { Observable } from "../core";
import { create } from "../utils";

export function timeout(ms: number): Observable<void> {
    return create(({ next, complete }) => {
        const id = setTimeout(() => {
            next();
            complete();
        }, ms);

        return () => clearTimeout(id);
    });
}
