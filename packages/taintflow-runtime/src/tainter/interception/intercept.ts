import {intercept as simulate} from "@taintflow/simulator";
import {EvaluatedExpression, Mixed, nodes} from "@taintflow/types";

import {PropagationStrategy} from "./PropagationStrategy";

export function intercept(node: nodes.Node): EvaluatedExpression<Mixed> {
    const strategy = new PropagationStrategy();
    const result = simulate(strategy.attach(node));
    return strategy.propagate(result);
}
