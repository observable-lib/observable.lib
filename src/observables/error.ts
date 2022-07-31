import { Observable } from "../core";
import { create } from "../utils";

export function error<T, E>(error: E): Observable<T> {
    return create(actions => actions.error(error));
}
