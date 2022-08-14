import { Processor } from "../core";

export function take<T>(quantity: number): Processor<T, T[]> {
    return ({ next, complete }) => {
        const values: any[] = [];

        return {
            next(value) {
                if (values.push(value) < quantity) return;

                next(values.slice());
                complete();
            },
            finalize() {
                values.length = 0;
            },
        };
    };
}
