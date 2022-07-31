import { ValueAccessor } from "value-accessor";

import { Mediator } from "../core";
import { Stream } from "./stream";

export class Store<T> extends Stream<T> {
    get value() {
        return this.#valueAccessor.value;
    }

    #valueAccessor: ValueAccessor<T>;

    constructor(mediator: Mediator<T>, initial: T) {
        const valueAccessor = new ValueAccessor<T>();

        valueAccessor.value = initial;

        super(mediator, valueAccessor);

        this.#valueAccessor = valueAccessor;
    }
}
