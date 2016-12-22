import {types} from "babel-core";
import * as _ from "lodash";

export type Literals = {readonly [name: string]: types.Literal};

export function literals(node: types.Node) {
    return <Literals> _(node).mapValues(literal).pickBy().value();
}

function literal(value?: {}) {
    if (typeof value === "string") {
        return types.stringLiteral(value);
    }
}
