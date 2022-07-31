import { Observer } from "../core";
import { Stream } from "./stream";

export class Event<T> extends Stream<T> {
    constructor(observer: Observer<T>) {
        super(observer);
    }
}
