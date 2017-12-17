import {nodes, QuotedExpression, RValue} from "@taintflow/types";

import {EvaluatingNode} from "./EvaluatingNode";
import {BinaryOperatorResult, binaryOperators} from "./operators/binary";

export class BinaryExpression<Left, Right>
       implements EvaluatingNode<BinaryOperatorResult>,
                  nodes.BinaryExpression<Left, Right> {
    public readonly kind = "BinaryExpression";
    public readonly operator: nodes.BinaryOperator;
    public readonly left: QuotedExpression<Left>;
    public readonly right: QuotedExpression<Right>;

    constructor(node: nodes.BinaryExpression<Left, Right>) {
        Object.assign(this, node);
    }

    public evaluate() {
        const operator = binaryOperators[this.operator];
        return new RValue(operator(this.left, this.right));
    }
}
