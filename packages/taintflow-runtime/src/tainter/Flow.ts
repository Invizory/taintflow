export class Flow<T> {
    private readonly value: T;
    private isTaintedValue: boolean;

    public static ["of"]<T>(flow: Flow<T>): Flow<T>;
    public static ["of"]<T>(value: T): Flow<T>;

    public static ["of"]<T>(value: Flow<T> | T) {
        if (value instanceof this) {
            return value;
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

    public get watch(): T {
        // We're tricking the type system at this point.
        // tslint:disable-next-line: no-any
        return <any> this;
    }
}
