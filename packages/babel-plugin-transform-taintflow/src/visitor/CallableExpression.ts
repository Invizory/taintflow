import {types} from "babel-core";
import {NodePath} from "babel-traverse";

import {NodeInterceptor} from "../interception";
import {quotedArrayOfExpressions} from "../interception/quoted";
import {TranspilationError} from "../TranspilationError";
import {NodePathInterceptor} from "./NodePathInterceptor";

const interceptor = new NodePathInterceptor(
    (node) => CallableExpressionInterceptor.intercepted(node),
);

export type CallableExpression = types.CallExpression | types.NewExpression;

export namespace CallableExpression {
    export function exit(path: NodePath<CallableExpression>) {
        interceptor.intercept(path);
    }
}

class CallableExpressionInterceptor
      extends NodeInterceptor<CallableExpression> {
    protected description() {
        return Object.assign(super.description(), {
            arguments: this.quotedArguments(),
        });
    }

    private quotedArguments() {
        const args = this.node.arguments;
        if (!isExpressions(args)) {
            throw new TranspilationError(
                `Some argument of ${this.node.type} is not Expression.`,
            );
        }
        return quotedArrayOfExpressions(args);
    }
}

function isExpressions(nodes: types.Node[]): nodes is types.Expression[] {
    return nodes.every((node) => types.isExpression(node));
}
