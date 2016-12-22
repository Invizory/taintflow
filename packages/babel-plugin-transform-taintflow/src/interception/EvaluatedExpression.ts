import {template, types} from "babel-core";

import {
    isEvaluatedExpressionValueAccessor,
    removeAccessor,
} from "./EvaluatedExpressionValueAccessor";

export class EvaluatedExpression {
    private readonly origin: types.Expression;

    constructor(origin: types.Expression) {
        this.origin = origin;
    }

    public get ast() {
        if (isEvaluatedExpressionValueAccessor(this.origin)) {
            return removeAccessor(this.origin);
        }
        if (types.isIdentifier(this.origin)) {
            return Expressions.identifier(this.origin);
        }
        return Expressions.rvalue(this.origin);
    }
}

namespace Templates {
    export type Identifier =
        (nodes: {identifier: types.Identifier}) => types.ExpressionStatement;
    export type RValue =
        (nodes: {expression: types.Expression}) => types.ExpressionStatement;

    export const identifier = <Identifier>
        template("new taintflow.Identifier(() => identifier)");
    export const rvalue = <RValue>
        template("new taintflow.RValue(expression)");
}

namespace Expressions {
    export function identifier(id: types.Identifier) {
        return Templates.identifier({identifier: id}).expression;
    }

    export function rvalue(expression: types.Expression) {
        return Templates.rvalue({expression}).expression;
    }
}
