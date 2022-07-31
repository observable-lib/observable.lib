import { Mediator } from "../core";
import { Stream } from "./stream";

export class Event<T> extends Stream<T> {
    constructor(mediator: Mediator<T>) {
        super(mediator);
    }
}
