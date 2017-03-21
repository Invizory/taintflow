import {EvaluatedExpression} from "taintflow-types";

export interface EvaluatingNode<Value> {
    readonly kind: string;
    evaluate(): EvaluatedExpression<Value>;
}
