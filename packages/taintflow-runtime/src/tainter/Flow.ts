export class Boxed<T> {
    public readonly flow: Flow<T>;

    constructor(flow: Flow<T>) {
        this.flow = flow;
    }
}

export class Flow<T> {
    public readonly value: T;
    public readonly source?: Source;

    private constructor(value: T, source?: Source) {
        this.value = value;
        this.source = source;
    }

    public static ["of"]<T>(value: Boxed<T> | T): Flow<T> {
        if (value instanceof Boxed) {
            return value.flow;
        }
        return new Flow(value);
    }

    public static tainted<T>(value: T): T {
        return Flow.of(value).taint().watch();
    }

    public get isTainted() {
        return this.source !== undefined;
    }

    public taint(meta?: {}): Flow<T> {
        let {source} = this;
        if (source === undefined) {
            source = {
                error: new Error(),
                meta,
            };
        }
        return new Flow(this.value, source);
    }

    public alter<V>(value: V): Flow<V> {
        return new Flow(value, this.source);
    }

    public release(): T {
        let {value} = this;
        while (value instanceof Boxed) {
            value = value.flow.value;
        }
        return value;
    }

    public watch(): T {
        // We're intentionally tricking the type system at this point.
        // tslint:disable-next-line: no-any
        return <any> new Boxed(this);
    }
}

interface Source {
    error: Error;
    meta?: {};
}
