import {BINARY_OPERATORS} from "babel-types";
import {Mixed, QuotedExpression} from "taintflow-types";

import {compile, Operators} from "./compilation";

export type BinaryOperators = Operators<BinaryOperator<Mixed, Mixed>>;

export type BinaryOperator<Left, Right> =
    (left: QuotedExpression<Left>, right: QuotedExpression<Right>)
    => BinaryOperatorResult;

export type BinaryOperatorResult = string | number | boolean;

export const binaryOperators = <BinaryOperators> compile({
    operators: BINARY_OPERATORS,
    expression(operator: string) {
        return `(function taintflowBinaryOperator(left, right) {
            return left().value ${operator} right().value;
        })`;
    },
});

declare module "babel-types" {
    // tslint:disable-next-line: no-shadowed-variable
    export const BINARY_OPERATORS: ReadonlyArray<string>;
}
