import { Observable } from "../core";
import { create } from "../utils";

export function empty<T>(): Observable<T> {
    return create(({ complete }) => complete());
}
