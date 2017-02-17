import {
    Mixed,
    nodes,
    PropertyReference,
    QuotedExpression,
} from "taintflow-core";

import {EvaluatingNode} from "./EvaluatingNode";

export class MemberExpression<Object, Property extends PropertyKey>
       implements EvaluatingNode<Mixed>,
                  nodes.MemberExpression<Object, Property> {
    public readonly kind = "MemberExpression";
    public readonly object: QuotedExpression<Object>;
    public readonly property: QuotedExpression<Property>;

    constructor(node: nodes.MemberExpression<Object, Property>) {
        Object.assign(this, node);
    }

    public evaluate() {
        return new PropertyReference(
            this.object().value,
            this.property().value,
        );
    }
}
