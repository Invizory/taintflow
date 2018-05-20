import {types} from "babel-core";

export interface EvaluatedExpressionValueAccessor
       extends types.MemberExpression {
    object: types.Expression;
    property: ValueIdentifier;
}

export interface ValueIdentifier extends types.Identifier {
    name: "value";
}

export function removeAccessor(accessor: EvaluatedExpressionValueAccessor) {
    return accessor.object;
}

export function isEvaluatedExpressionValueAccessor(expr: types.Expression):
                expr is EvaluatedExpressionValueAccessor {
    return types.isMemberExpression(expr) &&
           isValueIdentifier(expr.property);
}

function isValueIdentifier(expr: types.Expression): expr is ValueIdentifier {
    return types.isIdentifier(expr) && expr.name === "value";
}
