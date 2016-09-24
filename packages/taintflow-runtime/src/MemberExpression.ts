import {
    QuotedExpression,
    EvaluatedExpression,
    PropertyReference,
} from "./taxonomy";

export interface EvaluatingNode<Value> {
    readonly kind: string;
    evaluate(): EvaluatedExpression<Value>;
}

export interface MemberExpressionDescription<Object, Property> {
    readonly object: QuotedExpression<Object>;
    readonly property: QuotedExpression<Property>;
}

export class MemberExpression<Object, Property extends PropertyKey>
    implements EvaluatingNode<{}>,
               MemberExpressionDescription<Object, Property> {
    public readonly kind: "MemberExpression";
    public readonly object: QuotedExpression<Object>;
    public readonly property: QuotedExpression<Property>;

    constructor(node: MemberExpressionDescription<Object, Property>) {
        Object.assign(this, node);
    }

    public evaluate() {
        return new PropertyReference(
            this.object().value,
            this.property().value,
        );
    }
}
