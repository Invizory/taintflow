import {taintflowed} from "@taintflow/babel-plugin-transform";
import * as vm from "vm";

import * as runtime from "../src";

export type Primitive = boolean | number | string | symbol | void;

export function run<T extends Primitive>(func: () => T, context?: {}): T {
    const {code} = taintflowed(`const run = (${func.toString()});`);
    if (!code) {
        throw new Error("BabelFileResult.code is undefined.");
    }
    const runnerCode = `${code} taintflow.Flow.of(run()).release`;
    return new vm.Script(runnerCode).runInNewContext({
        src_1: runtime,
        taintflow: runtime,
        ...context,
    });
}
