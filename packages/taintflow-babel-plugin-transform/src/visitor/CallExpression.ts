import {types} from "babel-core";
import {NodePath} from "babel-traverse";

import {CallableExpression} from "./CallableExpression";

export namespace CallExpression {
    export function exit(path: NodePath<types.CallExpression>) {
        CallableExpression.exit(path);
    }
}
