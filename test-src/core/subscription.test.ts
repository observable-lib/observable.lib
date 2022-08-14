import { Subscription } from "../../package/core/subscription";

test("case 001", () => {
    const finalize = jest.fn();

    new Subscription(finalize).unsubscribe();

    expect(finalize).toHaveBeenCalled();
});

test("case 002", () => {
    const finalize = jest.fn();

    const subscription = new Subscription(finalize);

    subscription.unsubscribe();
    subscription.unsubscribe();

    expect(finalize).toHaveBeenCalledTimes(1);
});
