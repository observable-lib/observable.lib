import { Observable } from "../core";

export function never<T>(): Observable<T> {
    return new Observable(() => {});
}
