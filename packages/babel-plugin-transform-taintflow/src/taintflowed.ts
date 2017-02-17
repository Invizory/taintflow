import {transform} from "babel-core";

import {plugin} from "./plugin";

export function taintflowed(code: string) {
    return transform(code, {
        plugins: [
            "transform-es2015-arrow-functions",
            plugin,
        ],
    });
}
