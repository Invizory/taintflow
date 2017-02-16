import {EvaluatedExpression} from "taintflow-core";

export interface EvaluatingNode<Value> {
    readonly kind: string;
    evaluate(): EvaluatedExpression<Value>;
}
