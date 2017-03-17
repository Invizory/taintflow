import {Mixed, nodes, QuotedExpression, RValue} from "taintflow-types";

import {EvaluatingNode} from "./EvaluatingNode";
import {unaryOperators} from "./operators/unary";

export class UnaryExpression<Argument>
       implements EvaluatingNode<Mixed>,
                  nodes.UnaryExpression<Argument> {
    public readonly kind = "UnaryExpression";
    public readonly operator: nodes.UnaryOperator;
    public readonly argument: QuotedExpression<Argument>;

    constructor(node: nodes.UnaryExpression<Argument>) {
        Object.assign(this, node);
    }

    public evaluate() {
        const operator = unaryOperators[this.operator];
        return new RValue(operator(this.argument));
    }
}
