import {types} from "babel-core";

export interface EvaluatedExpressionValueAccessor
       extends types.MemberExpression {
    object: types.Expression;
    property: ValueIdentifier;
}

export interface ValueIdentifier extends types.Identifier {
    name: "value";
}

export function isEvaluatedExpressionValueAccessor(expr: types.Expression):
                expr is EvaluatedExpressionValueAccessor {
    return types.isMemberExpression(expr);
}

export function removeAccessor(accessor: EvaluatedExpressionValueAccessor) {
    return accessor.object;
}
