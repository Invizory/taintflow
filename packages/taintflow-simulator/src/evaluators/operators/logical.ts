import {LOGICAL_OPERATORS} from "babel-types";
import {Mixed, QuotedExpression} from "taintflow-core";

import {compile, Operators} from "./compilation";

export type LogicalOperators = Operators<LogicalOperator<Mixed, Mixed>>;

export type LogicalOperator<Left, Right> =
    (left: QuotedExpression<Left>, right: QuotedExpression<Right>) => Mixed;

export const logicalOperators = <LogicalOperators> compile({
    operators: LOGICAL_OPERATORS,
    expression(operator: string) {
        return `(function taintflowLogicalOperator(left, right) {
            return left().value ${operator} right().value;
        })`;
    },
});

declare module "babel-types" {
    export const LOGICAL_OPERATORS: ReadonlyArray<string>;
}
