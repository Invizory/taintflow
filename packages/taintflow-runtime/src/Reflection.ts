export namespace Reflection {
    export function isInstrumented(f: Function) {
        return !/{ \[native code\] }$/.test(f.toString());
    }
}
