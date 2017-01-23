import * as vm from "vm";

import {taintflowed} from "./babel-plugin-transform-taintflow/transform";
import * as runtime from "./taintflow-runtime";

export type Primitive = boolean | number | string | symbol | void;

export function run<T extends Primitive>(func: () => T, context?: {}): T {
    const {code} = taintflowed(`(${func.toString()})()`);
    if (!code) {
        throw new Error("BabelFileResult.code is undefined.");
    }
    return new vm.Script(code).runInNewContext({
        "taintflow_runtime_1": runtime,
        taintflow: runtime,
        ...context,
    });
}
