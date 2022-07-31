import { Observable } from "../core";
import { create } from "./create";

export function of<T>(value: T): Observable<T> {
    return create(({ next, complete }) => {
        next(value);
        complete();
    });
}
