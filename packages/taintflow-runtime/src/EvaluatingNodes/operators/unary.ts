import {UNARY_OPERATORS} from "babel-types";

import {Mixed, QuotedExpression, ValueKind} from "../../taxonomy";
import {compile, Operators} from "./compilation";

export type UnaryOperators = Operators<UnaryOperator<Mixed>>;

export type UnaryOperator<Argument> =
    (argument: QuotedExpression<Argument>) => Mixed;

export const unaryOperators = <UnaryOperators> {
    ...compile({
        operators: UNARY_OPERATORS,
        expression(operator: string) {
            return `(function taintflowUnaryOperator(argument) {
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
                evaluated.base,
                evaluated.propertyKey,
            );
        }
        return delete evaluated.value;
    },
};

declare module "babel-types" {
    export const UNARY_OPERATORS: ReadonlyArray<string>;
}
