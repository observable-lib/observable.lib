import { Finalize } from "./finalize";
import { Observer } from "./observer";
import { Subscriber } from "./subscriber";
import { Subscription } from "./subscription";

export class Observable<T> {
    #pipeline: Processor<any, any>[] = [];
    #onSubscribe: (observer: Observer<T>) => Finalize | void;

    constructor(onSubscribe?: (observer: Observer<T>) => Finalize | void) {
        this.#onSubscribe = fn(onSubscribe);
    }

    subscribe(
        subscriber?:
            | Subscriber<T>
            | Partial<Subscriber<T>>
            | Subscriber<T>["next"],
    ): Subscription {
        const target = new Subscriber(subscriber);

        let closed = false;
        let subscription = new Subscription(() => {
            closed = true;
        });

        const teardown = fn(
            this.#onSubscribe({
                next(value) {
                    if (closed) return;

                    target.next(value);
                },
                error(error) {
                    if (closed) return;

                    target.error(error);

                    subscription.unsubscribe();
                },
                complete() {
                    if (closed) return;

                    target.complete();

                    subscription.unsubscribe();
                },
            })!,
        );

        const finalize = () => {
            closed = true;

            target.finalize();

            teardown();
        };

        if (closed) finalize();
        else subscription = new Subscription(finalize);

        return subscription;
    }

    connect(source: Observable<T>): Observable<T> {
        const observable = new Observable<T>();

        observable.#pipeline = source.#pipeline.concat(
            this.#toPipeline(),
            this.#pipeline,
        );

        return observable;
    }

    switchTo<Out>(
        callbackOrObservable: (value: T) => Observable<Out> | Observable<Out>,
    ): Observable<Out> {
        return null as any;
    }

    pipe<Out, A, B, C, D, E, F, G, H, I, J, K>(
        ...pipeline: Processors<T, Out, A, B, C, D, E, F, G, H, I, J, K>
    ): Observable<Out> {
        const observable = new Observable<Out>(observer => {
            const pipeline = new Pipeline(
                observable.#pipeline.concat(() => observer),
            );

            const subscription = this.subscribe(pipeline.controller);

            return () => {
                pipeline.finalize();

                subscription.unsubscribe();
            };
        });

        observable.#pipeline = this.#pipeline.concat(
            this.#toPipeline(),
            pipeline,
        );

        return observable;
    }

    #toPipeline(): Processor<any, any> {
        return observer => {
            const finalize = fn(this.#onSubscribe(observer)!);

            return { finalize };
        };
    }
}

export interface Processor<In, Out> {
    (controller: Observer<Out>): Partial<Subscriber<In>>;
}

// Extensions

export interface Observable<T> {
    debounce(ms: number): Observable<T>;
    distinct(): Observable<T>;
    filter(predicate: (value: T) => boolean): Observable<T>;
    first(): Observable<T>;
    last(): Observable<T>;
    map<U>(callback: (value: T) => U): Observable<U>;
    onComplete(callback: () => void): Observable<T>;
    onError(callback: <Error>(error: Error) => void): Observable<T>;
    onFinalize(callback: () => void): Observable<T>;
    onNext(callback: (value: T) => void): Observable<T>;
    onSubscribe(callback: () => void): Observable<T>;
    skip(quantity: number): Observable<T>;
    switch<U>(callback: (value: T) => Observable<U>): Observable<U>;
    take(quantity: number): Observable<T>;
    toError<Error>(predicate: (value: T) => Error | void): Observable<T>;
    until(
        trigger: Observable<unknown> | ((value: T) => boolean),
    ): Observable<T>;
}

// Internal

function fn<T extends (...args: any[]) => any>(source?: T): T {
    return typeof source === "function" ? source : ((() => {}) as any);
}

enum State {
    Next = 1,
    Error,
    Complete,
}

class Pipeline {
    readonly controller = new Subscriber<any>({
        next: value => {
            this.toQueue(State.Next, 0, value);
        },
        error: error => {
            this.toQueue(State.Error, 0, error);
        },
        complete: () => {
            this.toQueue(State.Complete, 0);
        },
    });

    private pipeline: Subscriber<any>[] = [];
    private queue: QueueItem[] = [];

    private readonly queueItems: Iterable<QueueItem> = {
        [Symbol.iterator]: () => {
            const { queue } = this;

            return {
                next() {
                    if (queue.length === 0) return { done: true, value: null };

                    return {
                        value: queue.pop()!,
                        done: false,
                    };
                },
            };
        },
    };

    constructor(pipeline: Processor<any, any>[]) {
        this.pipeline = pipeline.map((processor, i) => {
            const next = i + 1;
            const last = i === pipeline.length - 1;

            let state: State = State.Next;

            const controller: Observer<any> = {
                next: value => {
                    if (state !== State.Next || last) return;

                    this.toQueue(State.Next, next, value);
                },

                error: error => {
                    if (state === State.Complete || last) return;

                    this.toQueue(State.Error, next, error);
                },

                complete: () => {
                    if (state === State.Error || last) return;

                    this.toQueue(State.Complete, next);
                },
            };

            const defaults: Partial<Subscriber<any>> = {
                next: value => controller.next(value),
                error: error => controller.error(error),
                complete: () => controller.complete(),
            };
            const source = processor(controller);

            return new Subscriber({ ...defaults, ...source });
        });
    }

    finalize(): void {
        const { pipeline } = this;

        this.pipeline = this.pipeline.map(() => new Subscriber());

        for (let subscriber of pipeline) subscriber.finalize();
    }

    private toQueue(state: State, offset: number, value?: any): void {
        const item: QueueItem = { state, offset, value };

        if (this.queue.push(item) === 1)
            for (let { state, offset, value } of this.queueItems)
                switch (state) {
                    case State.Next:
                        this.pipeline[offset].next(value);
                        break;
                    case State.Error:
                        this.pipeline[offset].error(value);
                        break;
                    case State.Complete:
                        this.pipeline[offset].complete();
                        break;
                }
    }
}

interface QueueItem {
    state: State;
    offset: number;
    value?: any;
}

type Processors<In, Out, A, B, C, D, E, F, G, H, I, J, K> =
    | [Processor<In, Out>]
    | [Processor<In, A>, Processor<A, Out>]
    | [Processor<In, A>, Processor<A, B>, Processor<B, Out>]
    | [Processor<In, A>, Processor<A, B>, Processor<B, C>, Processor<C, Out>]
    | [
          Processor<In, A>,
          Processor<A, B>,
          Processor<B, C>,
          Processor<C, D>,
          Processor<D, Out>,
      ]
    | [
          Processor<In, A>,
          Processor<A, B>,
          Processor<B, C>,
          Processor<C, D>,
          Processor<D, E>,
          Processor<E, Out>,
      ]
    | [
          Processor<In, A>,
          Processor<A, B>,
          Processor<B, C>,
          Processor<C, D>,
          Processor<D, E>,
          Processor<E, F>,
          Processor<F, Out>,
      ]
    | [
          Processor<In, A>,
          Processor<A, B>,
          Processor<B, C>,
          Processor<C, D>,
          Processor<D, E>,
          Processor<E, F>,
          Processor<F, G>,
          Processor<G, Out>,
      ]
    | [
          Processor<In, A>,
          Processor<A, B>,
          Processor<B, C>,
          Processor<C, D>,
          Processor<D, E>,
          Processor<E, F>,
          Processor<F, G>,
          Processor<G, H>,
          Processor<H, Out>,
      ]
    | [
          Processor<In, A>,
          Processor<A, B>,
          Processor<B, C>,
          Processor<C, D>,
          Processor<D, E>,
          Processor<E, F>,
          Processor<F, G>,
          Processor<G, H>,
          Processor<H, I>,
          Processor<I, Out>,
      ]
    | [
          Processor<In, A>,
          Processor<A, B>,
          Processor<B, C>,
          Processor<C, D>,
          Processor<D, E>,
          Processor<E, F>,
          Processor<F, G>,
          Processor<G, H>,
          Processor<H, I>,
          Processor<I, J>,
          Processor<J, Out>,
      ]
    | [
          Processor<In, A>,
          Processor<A, B>,
          Processor<B, C>,
          Processor<C, D>,
          Processor<D, E>,
          Processor<E, F>,
          Processor<F, G>,
          Processor<G, H>,
          Processor<H, I>,
          Processor<I, J>,
          Processor<J, K>,
          Processor<K, Out>,
      ];
