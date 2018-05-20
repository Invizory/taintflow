import {
    Mixed,
    nodes,
    QuotedArgumentsExpression,
    QuotedExpression,
    RValue,
} from "@taintflow/types";

import {EvaluatingNode} from "./EvaluatingNode";

export class NewExpression
       implements EvaluatingNode<Mixed>,
                  nodes.NewExpression {
    public readonly kind = "NewExpression";
    public readonly callee!: QuotedExpression<Function>;
    public readonly arguments!: QuotedArgumentsExpression;

    constructor(node: nodes.NewExpression) {
        Object.assign(this, node);
    }

    public evaluate() {
        const returnValue = Reflect.construct(
            this.callee().value,
            this.unquotedArguments(),
        );
        return new RValue(returnValue);
    }

    private unquotedArguments() {
        return this.arguments().map((arg) => arg.value);
    }
}
