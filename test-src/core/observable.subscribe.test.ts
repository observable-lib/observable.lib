import { Observable } from "../../package/core/observable";
import { Subscriber } from "../../package/core/subscriber";
import { Subscription } from "../../package/core/subscription";

test("case 001", () => {
    const observable = new Observable();
    const subscription = observable.subscribe();

    expect(subscription).toBeInstanceOf(Subscription);
});

test("case 002", () => {
    const value = 42;
    const onNext = jest.fn();

    const observable = new Observable(({ next }) => next(42));

    observable.subscribe(onNext);

    expect(onNext).toBeCalledTimes(1);
    expect(onNext).toHaveBeenCalledWith(value);
});

test("case 003", () => {
    const values = ["a", "b", "c"];
    const onNext = jest.fn();

    const observable = new Observable(({ next }) =>
        values.forEach(value => next(value)),
    );

    observable.subscribe(onNext);

    expect(onNext).toBeCalledTimes(3);

    const actual = onNext.mock.calls.map(args => {
        expect(args.length).toBe(1);

        return args[0];
    });

    expect(actual).toEqual(values);
});

test("case 004", () => {
    const next = jest.fn();
    const observable = new Observable(({ next }) => next(1));

    observable.subscribe({ next });

    expect(next).toHaveBeenCalled();
});

test("case 005", () => {
    const subscriber: Partial<Subscriber<unknown>> = {
        next: jest.fn(),
        complete: jest.fn(),
    };

    const observable = new Observable(({ next, complete }) => {
        complete();
        next(1);
    });

    observable.subscribe(subscriber);

    expect(subscriber.next).not.toHaveBeenCalled();
    expect(subscriber.complete).toHaveBeenCalled();
});

test("case 006", () => {
    const subscriber: Partial<Subscriber<unknown>> = {
        next: jest.fn(),
        error: jest.fn(),
    };
    const errorValue = new Error();

    const observable = new Observable(({ next, error }) => {
        error(errorValue);
        next(1);
    });

    observable.subscribe(subscriber);

    expect(subscriber.next).not.toHaveBeenCalled();
    expect(subscriber.error).toHaveBeenCalledWith(errorValue);
});

test("case 006", () => {
    const subscriber: Partial<Subscriber<unknown>> = {
        error: jest.fn(),
        complete: jest.fn(),
    };

    const observable = new Observable(({ error, complete }) => {
        error(1);
        complete();
    });

    observable.subscribe(subscriber);

    expect(subscriber.error).toHaveBeenCalled();
    expect(subscriber.complete).not.toHaveBeenCalled();
});

test("case 007", () => {
    const subscriber: Partial<Subscriber<unknown>> = {
        error: jest.fn(),
        complete: jest.fn(),
    };

    const observable = new Observable(({ error, complete }) => {
        complete();
        error(1);
    });

    observable.subscribe(subscriber);

    expect(subscriber.error).not.toHaveBeenCalled();
    expect(subscriber.complete).toHaveBeenCalled();
});

test("case 008", () => {
    const order = [] as string[];

    const subscriber: Partial<Subscriber<unknown>> = {
        complete: jest.fn(() => order.push("complete")),
    };
    const finalize = jest.fn(() => order.push("finalize"));

    const observable = new Observable(({ complete }) => {
        complete();

        return finalize;
    });

    observable.subscribe(subscriber);

    expect(order).toEqual(["complete", "finalize"]);
});

test("case 009", () => {
    const order = [] as string[];

    const subscriber: Partial<Subscriber<unknown>> = {
        complete: jest.fn(() => order.push("complete")),
        finalize: jest.fn(() => order.push("finalize")),
    };

    const teardown = jest.fn(() => order.push("teardown"));

    const observable = new Observable(({ complete }) => {
        complete();

        return teardown;
    });

    observable.subscribe(subscriber);

    expect(order).toEqual(["complete", "finalize", "teardown"]);
});
