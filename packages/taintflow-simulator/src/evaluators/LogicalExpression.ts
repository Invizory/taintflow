import {Mixed, nodes, QuotedExpression, RValue} from "taintflow-core";

import {EvaluatingNode} from "./EvaluatingNode";
import {LogicalOperator, logicalOperators} from "./operators/logical";

export class LogicalExpression<Left, Right>
       implements EvaluatingNode<Mixed>,
                  nodes.LogicalExpression<Left, Right> {
    public readonly kind = "LogicalExpression";
    public readonly operator: nodes.LogicalOperator;
    public readonly left: QuotedExpression<Left>;
    public readonly right: QuotedExpression<Right>;
    private readonly compiledOperator: LogicalOperator<Left, Right>;

    constructor(node: nodes.LogicalExpression<Left, Right>) {
        Object.assign(this, node);
        this.compiledOperator = logicalOperators[this.operator];
        if (!this.compiledOperator) {
            throw new TypeError(
                `Logical operator '${this.operator}' is not supported.`,
            );
        }
    }

    public evaluate() {
        return new RValue(this.compiledOperator(this.left, this.right));
    }
}
