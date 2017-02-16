import {nodes, QuotedExpression, RValue} from "taintflow-core";

import {EvaluatingNode} from "./EvaluatingNode";
import {
    BinaryOperator,
    BinaryOperatorResult,
    binaryOperators,
} from "./operators/binary";

export class BinaryExpression<Left, Right>
       implements EvaluatingNode<BinaryOperatorResult>,
                  nodes.BinaryExpression<Left, Right> {
    public readonly kind = "BinaryExpression";
    public readonly operator: nodes.BinaryOperator;
    public readonly left: QuotedExpression<Left>;
    public readonly right: QuotedExpression<Right>;
    private readonly compiledOperator: BinaryOperator<Left, Right>;

    constructor(node: nodes.BinaryExpression<Left, Right>) {
        Object.assign(this, node);
        this.compiledOperator = binaryOperators[this.operator];
        if (!this.compiledOperator) {
            throw new TypeError(
                `Binary operator '${this.operator}' is not supported.`,
            );
        }
    }

    public evaluate() {
        return new RValue(this.compiledOperator(this.left, this.right));
    }
}
