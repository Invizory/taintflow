import {types} from "babel-core";
import {NodePath} from "babel-traverse";

import {NodeInterceptor} from "../interception";
import {NodePathInterceptor} from "./NodePathInterceptor";

const interceptor = new NodePathInterceptor(
    (node) => NodeInterceptor.intercepted(node),
);

export namespace MemberExpression {
    export function exit(path: NodePath<types.MemberExpression>) {
        ensureHasComputedProperty(path.node);
        interceptor.intercept(path);
    }
}

function ensureHasComputedProperty(node: types.MemberExpression) {
    if (!types.isIdentifier(node.property)) {
        return;
    }
    const {name} = node.property;
    Object.assign(node, {
        property: types.stringLiteral(name),
        computed: true,
    });
}
