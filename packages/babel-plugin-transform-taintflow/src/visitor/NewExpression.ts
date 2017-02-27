import {types} from "babel-core";
import {NodePath} from "babel-traverse";

import {CallableExpression} from "./CallableExpression";

export namespace NewExpression {
    export function exit(path: NodePath<types.NewExpression>) {
        CallableExpression.exit(path);
    }
}
