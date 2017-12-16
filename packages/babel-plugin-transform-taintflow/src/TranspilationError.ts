const advice = "Make sure you properly transpiled your source to ES5 before.";

export class TranspilationError extends Error {
    public readonly name = "TranspilationError";

    constructor(message: string) {
        super(`${message} ${advice}`);
    }
}
