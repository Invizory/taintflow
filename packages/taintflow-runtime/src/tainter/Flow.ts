export class Flow<T> {
    private readonly value: T;
    private isTaintedValue: boolean;

    public static ["of"]<T>(watchable: Watchable<T>): Flow<T>;
    public static ["of"]<T>(value: T): Flow<T>;

    public static ["of"]<T>(value: Watchable<T> | T) {
        if (value instanceof Watchable) {
            return value.flow;
        }
        return new Flow(value);
    }

    public static tainted<T>(value: T) {
        return Flow.of(value).taint.watch;
    }

    private constructor(value: T, isTainted: boolean = false) {
        this.value = value;
        this.isTaintedValue = isTainted;
    }

    public get isTainted() {
        return this.isTaintedValue;
    }

    public get taint() {
        this.isTaintedValue = true;
        return this;
    }

    public get release() {
        return this.value;
    }

    public alter<V>(value: V) {
        return new Flow(value, this.isTainted);
    }

    public get watch(): T {
        // We're intentionally tricking the type system at this point.
        // tslint:disable-next-line: no-any
        return <any> new Watchable(this);
    }
}

export class Watchable<T> {
    public readonly flow: Flow<T>;

    constructor(flow: Flow<T>) {
        this.flow = flow;
    }
}
