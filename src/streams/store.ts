import { ValueAccessor } from "value-accessor";

import { Observer } from "../core";
import { Stream } from "./stream";

export class Store<T> extends Stream<T> {
    get value() {
        return this.#valueAccessor.value;
    }

    #valueAccessor: ValueAccessor<T>;

    constructor(observer: Observer<T>, initial: T) {
        const valueAccessor = new ValueAccessor<T>();

        valueAccessor.value = initial;

        super(observer, valueAccessor);

        this.#valueAccessor = valueAccessor;
    }
}
