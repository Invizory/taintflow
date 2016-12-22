import {types} from "babel-core";
import {NodePath} from "babel-traverse";
import * as _ from "lodash";

import {NodeInterceptor} from "../interception";
import {quotedArrayOfExpressions} from "../interception/quoted";
import {NodePathInterceptor} from "./NodePathInterceptor";

const interceptor = new NodePathInterceptor(
    (node) => CallExpressionInterceptor.intercepted(node)
);

export namespace CallExpression {
    export function exit(path: NodePath<types.CallExpression>) {
        interceptor.intercept(path);
    }
}

class CallExpressionInterceptor extends NodeInterceptor<types.CallExpression> {
    protected description() {
        return Object.assign(super.description(), {
            arguments: this.quotedArguments(),
        });
    }

    private quotedArguments() {
        const args = this.node.arguments;
        if (!isExpressions(args)) {
            throw new TranspilationError(
                "Some argument of CallExpression is not Expression."
            );
        }
        return quotedArrayOfExpressions(args);
    }
}

function isExpressions(nodes: types.Node[]): nodes is types.Expression[] {
    return _(nodes).every(types.isExpression);
}

class TranspilationError extends Error {
    public readonly name = "TranspilationError";

    constructor(message: string) {
        super(message + " " +
              "Make sure you properly transpiled your source to ES5 before.");
    }
}
