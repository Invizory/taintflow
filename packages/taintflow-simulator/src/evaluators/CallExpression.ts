import {
    EvaluatedExpression,
    Mixed,
    nodes,
    QuotedArgumentsExpression,
    QuotedExpression,
    RValue,
    ValueKind,
} from "taintflow-types";

import {EvaluatingNode} from "./EvaluatingNode";

export class CallExpression
       implements EvaluatingNode<Mixed>,
                  nodes.CallExpression {
    public readonly kind = "CallExpression";
    public readonly callee: QuotedExpression<Function>;
    public readonly arguments: QuotedArgumentsExpression;

    constructor(node: nodes.CallExpression) {
        Object.assign(this, node);
    }

    public evaluate() {
        const {target, context} = this.dereference();
        const returnValue = Reflect.apply(
            target,
            context,
            this.unquotedArguments(),
        );
        return new RValue(returnValue);
    }

    private dereference() {
        const callee = this.callee();
        return {target: callee.value, context: resolveContext(callee)};
    }

    private unquotedArguments() {
        return this.arguments().map((arg) => arg.value);
    }
}

function resolveContext(callee: EvaluatedExpression<Function>) {
    if (callee.kind === ValueKind.PropertyReference) {
        return callee.base;
    }
}
