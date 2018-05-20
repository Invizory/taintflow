import {types} from "babel-core";
import {NodePath} from "babel-traverse";

import {NodeInterceptor} from "../interception";
import {NodePathInterceptor} from "./NodePathInterceptor";

const interceptor = new NodePathInterceptor(
    (node) => NodeInterceptor.intercepted(node),
);

export namespace BinaryExpression {
    export function exit(path: NodePath<types.BinaryExpression>) {
        interceptor.intercept(path);
    }
}
