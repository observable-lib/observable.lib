import { ValueAccessor } from "value-accessor";

import { Observer } from "../core";
import { Stream } from "./stream";

export class Memo<T> extends Stream<T> {
    constructor(observer: Observer<T>) {
        super(observer, new ValueAccessor<T>());
    }
}
