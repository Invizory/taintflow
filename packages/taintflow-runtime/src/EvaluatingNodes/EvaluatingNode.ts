import {EvaluatedExpression} from "../taxonomy";

export interface EvaluatingNode<Value> {
    readonly kind: string;
    evaluate(): EvaluatedExpression<Value>;
}
