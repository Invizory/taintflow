import {Mixed, QuotedExpression, ValueKind} from "@taintflow/types";
import {UNARY_OPERATORS} from "babel-types";

import {compile, Operators} from "./compilation";

export type UnaryOperators = Operators<UnaryOperator<Mixed>>;

export type UnaryOperator<Argument> =
    (argument: QuotedExpression<Argument>) => Mixed;

export const unaryOperators: UnaryOperators = {
    ...compile({
        operators: UNARY_OPERATORS,
        expression(operator: string) {
            return `(function taintflowUnaryOperator(argument) {
                /* taintflow:ignore */
                return ${operator} argument().value;
            })`;
        },
    }),
    typeof: (argument: QuotedExpression<Mixed>) => {
        const evaluated = argument();
        if (evaluated.kind === ValueKind.Identifier && !evaluated.isDeclared) {
            return "undefined";
        }
        return typeof evaluated.value;
    },
    delete: (argument: QuotedExpression<Mixed>) => {
        const evaluated = argument();
        if (evaluated.kind === ValueKind.PropertyReference) {
            return Reflect.deleteProperty(
                Object(evaluated.base),
                evaluated.propertyKey,
            );
        }
        return true;
    },
};

declare module "babel-types" {
    // tslint:disable-next-line: no-shadowed-variable
    export const UNARY_OPERATORS: ReadonlyArray<string>;
}
