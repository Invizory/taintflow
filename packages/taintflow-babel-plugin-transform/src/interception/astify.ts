import {types} from "babel-core";
import * as _ from "lodash";

export type NamedExpressions = {readonly [property: string]: types.Expression};

export function astify(expressions: NamedExpressions) {
    const properties = <types.ObjectProperty[]> _(expressions)
        .mapValues((expr: types.Expression, property) =>
                   types.objectProperty(types.identifier(property), expr))
        .values()
        .value();
    return types.objectExpression(properties);
}
