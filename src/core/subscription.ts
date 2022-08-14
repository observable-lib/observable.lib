import { Finalize } from "./finalize";

export class Subscription {
    #finalize?: Finalize;

    constructor(finalize?: Finalize) {
        this.#finalize = finalize;
    }

    unsubscribe(): void {
        this.#finalize?.();

        this.#finalize = void 0;
    }
}
