import {types} from "babel-core";
import {NodePath} from "babel-traverse";

import {NodeInterceptor} from "../interception";
import {NodePathInterceptor} from "./NodePathInterceptor";

const interceptor = new NodePathInterceptor(
    (node) => NodeInterceptor.intercepted(node),
);

export namespace LogicalExpression {
    export function exit(path: NodePath<types.LogicalExpression>) {
        interceptor.intercept(path);
    }
}
