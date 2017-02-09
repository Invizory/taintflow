import {
    Mixed,
    QuotedExpression,
    RValue,
} from "../taxonomy";
import {EvaluatingNode} from "./EvaluatingNode";

const binaryOperators: BinaryOperators = {};

export interface BinaryExpressionDescription<Left, Right> {
    readonly operator: string;
    readonly left: QuotedExpression<Left>;
    readonly right: QuotedExpression<Right>;
}

export class BinaryExpression<Left, Right>
       implements EvaluatingNode<{}>,
                  BinaryExpressionDescription<Left, Right> {
    public readonly kind = "BinaryExpression";
    public readonly operator: string;
    public readonly left: QuotedExpression<Left>;
    public readonly right: QuotedExpression<Right>;
    private readonly compiledOperator: BinaryOperator<Left, Right>;

    constructor(description: BinaryExpressionDescription<Left, Right>) {
        Object.assign(this, description);
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

interface BinaryOperators {
    readonly [operator: string]: BinaryOperator<Mixed, Mixed>;
}

type BinaryOperator<Left, Right> =
    (left: QuotedExpression<Left>, right: QuotedExpression<Right>) => {};
