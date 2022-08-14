import { Observable } from "../core";

export function of<T>(value: T): Observable<T> {
    return new Observable(({ next }) => next(value));
}
