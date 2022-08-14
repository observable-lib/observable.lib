import { Observable } from "../core";

export function error<T, E>(error: E): Observable<T> {
    return new Observable(observer => observer.error(error));
}
