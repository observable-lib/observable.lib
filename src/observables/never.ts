import { Observable } from "../core";
import { create } from "../utils";

export function never<T>(): Observable<T> {
    return create(() => {});
}
