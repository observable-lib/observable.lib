import { Observable } from "../core";

export type Input = {
    [Property in string | number | symbol]: Observable<unknown>;
};

export type Output<Source extends Input> = {
    [Property in keyof Source]: Source[Property] extends Observable<
        unknown,
        infer Out
    >
        ? Out
        : never;
};
