import {types} from "babel-core";
import * as _ from "lodash";

import {EvaluatedExpression} from "./EvaluatedExpression";

export type QuotedExpression = types.ArrowFunctionExpression;
export type QuotedExpressions = {readonly [name: string]: QuotedExpression};

export function quotedExpressions(node: types.Node): QuotedExpressions {
    return _(node)
        .pickBy((value) => types.isExpression(value))
        .mapValues(quotedExpression)
        .value();
}

export function quotedExpression(expression: types.Expression) {
    return quotation(evaluated(expression));
}

export function quotedArrayOfExpressions(expressions: types.Expression[]) {
    return quotation(types.arrayExpression(expressions.map(evaluated)));
}

function quotation(expression: types.Expression) {
    return types.arrowFunctionExpression([], expression);
}

function evaluated(expression: types.Expression) {
    return new EvaluatedExpression(expression).ast;
}
