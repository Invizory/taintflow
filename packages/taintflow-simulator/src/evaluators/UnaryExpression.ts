import {Mixed, nodes, QuotedExpression, RValue} from "taintflow-core";

import {EvaluatingNode} from "./EvaluatingNode";
import {UnaryOperator, unaryOperators} from "./operators/unary";

export class UnaryExpression<Argument>
       implements EvaluatingNode<Mixed>,
                  nodes.UnaryExpression<Argument> {
    public readonly kind = "UnaryExpression";
    public readonly operator: nodes.UnaryOperator;
    public readonly argument: QuotedExpression<Argument>;
    private readonly compiledOperator: UnaryOperator<Argument>;

    constructor(node: nodes.UnaryExpression<Argument>) {
        Object.assign(this, node);
        this.compiledOperator = unaryOperators[this.operator];
        if (!this.compiledOperator) {
            throw new TypeError(
                `Unary operator '${this.operator}' is not supported.`,
            );
        }
    }

    public evaluate() {
        return new RValue(this.compiledOperator(this.argument));
    }
}
