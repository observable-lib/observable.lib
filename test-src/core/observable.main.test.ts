import { Observable } from "../../package/core/observable";
import { Observer } from "../../package/core/observer";

test("case 001", () => {
    const onSubscribe = jest.fn();

    const observable = new Observable(onSubscribe);

    observable.subscribe();

    expect(onSubscribe).toHaveBeenCalledTimes(1);
});

test("case 002", () => {
    const finalize = jest.fn();
    const onSubscribe = jest.fn(() => finalize);

    const observable = new Observable(onSubscribe);

    observable.subscribe().unsubscribe();

    expect(onSubscribe).toHaveBeenCalledTimes(1);
    expect(finalize).toHaveBeenCalledTimes(1);
});

test("case 003", () => {
    const onSubscribe = jest.fn();

    const observable = new Observable(onSubscribe);

    observable.subscribe();

    const [[observer]] = onSubscribe.mock.calls as [[Observer<unknown>]];

    expect(typeof observer.next).toBe("function");
    expect(typeof observer.error).toBe("function");
    expect(typeof observer.complete).toBe("function");
});

test("case 004", () => {
    const onSubscribe = jest.fn();

    new Observable(onSubscribe);

    expect(onSubscribe).not.toHaveBeenCalled();
});
