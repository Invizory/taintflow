import {EvaluatedExpression, Mixed, nodes} from "@taintflow/types";

import * as evaluators from "./evaluators";

export function intercept(node: nodes.Node): EvaluatedExpression<Mixed> {
    const evaluator = <EvaluatorConstructor> evaluators[node.type];
    return new evaluator(node).evaluate();
}

interface EvaluatorConstructor {
    new (node: nodes.Node): evaluators.EvaluatingNode<Mixed>;
}
