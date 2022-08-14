import { Processor } from "../core";

export function skip<T>(quantity: number): Processor<T, T> {
    return ({ next }) => {
        let counter = 0;

        return {
            next(value) {
                if (counter < quantity) counter++;
                else next(value);
            },
        };
    };
}
