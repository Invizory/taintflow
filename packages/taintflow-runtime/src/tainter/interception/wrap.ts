import {
    EvaluatedExpression,
    Identifier,
    PropertyReference,
    RValue,
    ValueKind,
} from "@taintflow/types";

export type Wrapper<T> = (value: T) => T;

export function wrap<T>(evaluated: EvaluatedExpression<T>, wrapper: Wrapper<T>):
                typeof evaluated {
    switch (evaluated.kind) {
        case ValueKind.RValue:
            return new RValue(wrapper(evaluated.value));
        case ValueKind.Identifier:
            return new Identifier(() => wrapper(evaluated.value));
        case ValueKind.PropertyReference:
            return new WrappedPropertyReference(evaluated, wrapper);
        default:
            throw new Error("Invalid kind of EvaluatedExpression.");
    }
}

class WrappedPropertyReference<Base, T> extends PropertyReference<Base, T> {
    private readonly origin: PropertyReference<Base, T>;
    private readonly wrapper: Wrapper<T>;

    constructor(origin: PropertyReference<Base, T>, wrapper: Wrapper<T>) {
        super(origin.base, origin.propertyKey);
        this.origin = origin;
        this.wrapper = wrapper;
    }

    public get value() {
        return this.wrapper(this.origin.value);
    }
}
