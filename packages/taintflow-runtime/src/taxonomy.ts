export interface EvaluatingNode<Value> {
    readonly kind: string;
    evaluate(): EvaluatedExpression<Value>;
}

export type QuotedExpression<Value> =
    () => EvaluatedExpression<Value>;

export type QuotedArgumentsExpression =
    () => ReadonlyArray<EvaluatedExpression<{}>>;

export type EvaluatedExpression<Value>
    = RValue<Value>
    | Reference<Value>;

export type Reference<Value>
    = Identifier<Value>
    | PropertyReference<{}, Value>;

export interface HasValue<T> {
    readonly value: T;
    readonly kind: ValueKind;
}

export enum ValueKind {
    RValue,
    Identifier,
    PropertyReference,
}

export class RValue<T> implements HasValue<T> {
    public readonly kind: ValueKind.RValue;
    public readonly value: T;

    constructor(value: T) {
        this.value = value;
    }
}

export class Identifier<T> implements HasValue<T> {
    public readonly kind: ValueKind.Identifier;
    private readonly quotedValue: () => T;

    constructor(quotedValue: () => T) {
        this.quotedValue = quotedValue;
    }

    get value() {
        return this.quotedValue();
    }
}

export class PropertyReference<Base, T> implements HasValue<T> {
    public readonly kind: ValueKind.PropertyReference;
    public readonly base: Base;
    public readonly propertyKey: PropertyKey;

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
