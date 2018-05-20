import {Mixed, nodes, QuotedExpression, RValue} from "@taintflow/types";

import {EvaluatingNode} from "./EvaluatingNode";
import {logicalOperators} from "./operators/logical";

export class LogicalExpression<Left, Right>
       implements EvaluatingNode<Mixed>,
                  nodes.LogicalExpression<Left, Right> {
    public readonly kind = "LogicalExpression";
    public readonly operator!: nodes.LogicalOperator;
    public readonly left!: QuotedExpression<Left>;
    public readonly right!: QuotedExpression<Right>;

    constructor(node: nodes.LogicalExpression<Left, Right>) {
        Object.assign(this, node);
    }

    public evaluate() {
        const operator = logicalOperators[this.operator];
        return new RValue(operator(this.left, this.right));
    }
}
