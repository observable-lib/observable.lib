import { Observable } from "../core";

export function empty<T>(): Observable<T> {
    return new Observable(({ complete }) => complete());
}
