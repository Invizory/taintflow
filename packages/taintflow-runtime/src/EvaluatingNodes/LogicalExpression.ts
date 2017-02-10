import {Mixed, QuotedExpression, RValue} from "../taxonomy";
import {BinaryExpressionDescription} from "./BinaryExpression";
import {EvaluatingNode} from "./EvaluatingNode";
import {LogicalOperator, logicalOperators} from "./operators/logical";

export type LogicalExpressionDescription<Left, Right> =
    BinaryExpressionDescription<Left, Right>;

export class LogicalExpression<Left, Right>
       implements EvaluatingNode<Mixed>,
                  LogicalExpressionDescription<Left, Right> {
    public readonly kind = "LogicalExpression";
    public readonly operator: string;
    public readonly left: QuotedExpression<Left>;
    public readonly right: QuotedExpression<Right>;
    private readonly compiledOperator: LogicalOperator<Left, Right>;

    constructor(description: BinaryExpressionDescription<Left, Right>) {
        Object.assign(this, description);
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
