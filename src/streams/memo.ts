import { ValueAccessor } from "value-accessor";

import { Mediator } from "../core";
import { Stream } from "./stream";

export class Memo<T> extends Stream<T> {
    constructor(mediator: Mediator<T>) {
        super(mediator, new ValueAccessor<T>());
    }
}
