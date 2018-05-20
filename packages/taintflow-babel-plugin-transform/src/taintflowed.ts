import {transform, types} from "babel-core";

import {plugin} from "./plugin";

export function taintflowed(source: string) {
    const {ast, code} = transform(source, {
        plugins: [
            "transform-es2015-arrow-functions",
            plugin,
        ],
    });
    return {
        ast: <types.Node> ast,
        code: <string> code,
    };
}
