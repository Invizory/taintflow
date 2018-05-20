import {Mixed} from "@taintflow/types";
import * as _ from "lodash";

export interface Template {
    operators: ReadonlyArray<string>;
    expression(operator: string): string;
}

export interface Operators<Operator> {
    readonly [operator: string]: Operator;
}

export function compile({operators, expression}: Template): Operators<Mixed> {
    return _(operators)
        .keyBy()
        .mapValues(expression)
        .mapValues(eval)
        .value();
}
