import {Mixed, QuotedExpression, RValue} from "../taxonomy";
import {EvaluatingNode} from "./EvaluatingNode";
import {UnaryOperator, unaryOperators} from "./operators/unary";

export interface UnaryExpressionDescription<Argument> {
    readonly operator: string;
    readonly argument: QuotedExpression<Argument>;
}

export class UnaryExpression<Argument>
       implements EvaluatingNode<Mixed>,
                  UnaryExpressionDescription<Argument> {
    public readonly kind = "UnaryExpression";
    public readonly operator: string;
    public readonly argument: QuotedExpression<Argument>;
    private readonly compiledOperator: UnaryOperator<Argument>;

    constructor(description: UnaryExpressionDescription<Argument>) {
        Object.assign(this, description);
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
