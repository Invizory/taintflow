export type QuotedExpression<Value> =
    () => EvaluatedExpression<Value>;

export type EvaluatedExpression<Value>
    = RValue<Value>
    | Reference<Value>;

export type Reference<Value>
    = Identifier<Value>
    | PropertyReference<{}, Value>;

export interface HasValue<T> {
    readonly value: T;
}

export class RValue<T> implements HasValue<T> {
    public readonly kind: "RValue";
    public readonly value: T;

    constructor(value: T) {
        this.value = value;
    }
}

export class Identifier<T> implements HasValue<T> {
    public readonly kind: "Identifier";
    private readonly quotedValue: () => T;

    constructor(quotedValue: () => T) {
        this.quotedValue = quotedValue;
    }

    get value() {
        return this.quotedValue();
    }
}

export class PropertyReference<Base, T> implements HasValue<T> {
    public readonly kind: "PropertyReference";
    private readonly base: Base;
    private readonly propertyKey: PropertyKey;

    constructor(base: Base, propertyKey: PropertyKey) {
        this.base = base;
        this.propertyKey = propertyKey;
    }

    get value() {
        return Reflect.get(Object(this.base), this.propertyKey);
    }

    set value(value: T) {
        Reflect.set(Object(this.base), this.propertyKey, value);
    }
}
