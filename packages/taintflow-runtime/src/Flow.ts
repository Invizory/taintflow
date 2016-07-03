export class Flow<T> {
    private value: T;

    constructor(value: T) {
        this.value = value;
    }

    public get isTainted() {
        return false;
    }

    public get give() {
        return this.value;
    }
}
