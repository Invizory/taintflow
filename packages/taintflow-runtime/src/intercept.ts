import * as EvaluatingNodes from "./EvaluatingNodes";
import {EvaluatedExpression, Mixed} from "./taxonomy";

// tslint:disable-next-line: no-any
const nodes = <NodeDictionary> <any> EvaluatingNodes;

export interface Description {
    readonly ["type"]: string;
    [param: string]: Mixed;
}

export function intercept(description: Description):
                EvaluatedExpression<Mixed> {
    const node = nodes[description.type];
    if (!node) {
        throw new TypeError(`Unknown type '${description.type}'.`);
    }
    return new node(description).evaluate();
}

type NodeDictionary = {[node: string]: NodeConstructor};

interface NodeConstructor {
    new (description: {}): EvaluatingNodes.EvaluatingNode<Mixed>;
}
