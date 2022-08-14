import { Observable } from "../../package/core/observable";
import { Observer } from "../../package/core/observer";
import { Subscriber } from "../../package/core/subscriber";

test("case 001", () => {
    const finalize = jest.fn();
    const observable = new Observable(() => finalize);

    observable.subscribe().unsubscribe();

    expect(finalize).toHaveBeenCalled();
});

test("case 002", () => {
    const finalize = jest.fn();
    const observable = new Observable();

    observable.subscribe({ finalize }).unsubscribe();

    expect(finalize).toHaveBeenCalled();
});

test("case 003", () => {
    const observable = new Observable();
    const subscriber: Partial<Subscriber<unknown>> = {
        complete: jest.fn(),
        finalize: jest.fn(),
    };

    observable.subscribe(subscriber).unsubscribe();

    expect(subscriber.complete).not.toHaveBeenCalled();
    expect(subscriber.finalize).toHaveBeenCalled();
});

test("case 004", () => {
    let observer: Observer<unknown> = null as any;

    const observable = new Observable(source => {
        observer = source;
    });
    const subscriber: Partial<Subscriber<unknown>> = {
        next: jest.fn(),
        complete: jest.fn(),
    };

    observable.subscribe(subscriber).unsubscribe();

    observer.next(1);
    observer.complete();

    expect(subscriber.next).not.toHaveBeenCalled();
    expect(subscriber.complete).not.toHaveBeenCalled();
});
