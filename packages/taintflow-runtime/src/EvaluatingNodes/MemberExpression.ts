import {
    Mixed,
    PropertyReference,
    QuotedExpression,
} from "../taxonomy";
import {EvaluatingNode} from "./EvaluatingNode";

export interface MemberExpressionDescription<Object, Property> {
    readonly object: QuotedExpression<Object>;
    readonly property: QuotedExpression<Property>;
}

export class MemberExpression<Object, Property extends PropertyKey>
       implements EvaluatingNode<Mixed>,
                  MemberExpressionDescription<Object, Property> {
    public readonly kind = "MemberExpression";
    public readonly object: QuotedExpression<Object>;
    public readonly property: QuotedExpression<Property>;

    constructor(description: MemberExpressionDescription<Object, Property>) {
        Object.assign(this, description);
    }

    public evaluate() {
        return new PropertyReference(
            this.object().value,
            this.property().value,
        );
    }
}
