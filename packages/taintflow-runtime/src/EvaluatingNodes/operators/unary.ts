import {UNARY_OPERATORS} from "babel-types";

import {Mixed, QuotedExpression} from "../../taxonomy";
import {compile, Operators} from "./compilation";

export type UnaryOperators = Operators<UnaryOperator<Mixed>>;

export type UnaryOperator<Argument> =
    (argument: QuotedExpression<Argument>) => Mixed;

export const unaryOperators = <UnaryOperators> compile({
    operators: UNARY_OPERATORS,
    expression(operator: string) {
        return `(function taintflowUnaryOperator(argument) {
            return ${operator} argument().value;
        })`;
    },
});

declare module "babel-types" {
    export const UNARY_OPERATORS: ReadonlyArray<string>;
}
