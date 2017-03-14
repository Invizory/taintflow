import * as _ from "lodash";
import {
    EvaluatedExpression,
    Mixed,
    nodes,
    QuotedExpression,
} from "taintflow-core";

import {Flow, Watchable} from "../Flow";
import {wrap} from "./wrap";

export class PropagationStrategy {
    private flow?: Flow<Mixed>;

    public attach(node: nodes.Node) {
        return <nodes.Node> _(node)
            .mapValues(this.attachIfQuoted.bind(this))
            .value();
    }

    public propagate<T>(result: EvaluatedExpression<T>) {
        const {flow} = this;
        if (!flow) {
            return result;
        }
        return wrap(result, (value) => flow.alter(value).watch);
    }

    private attachIfQuoted(value: Mixed, property: nodes.NodeProperty) {
        if (!isQuotedExpression(value, property)) {
            return value;
        }
        return this.attachQuoted(value);
    }

    private attachQuoted<T>(quoted: QuotedExpression<T>) {
        return () => this.propagated(quoted());
    }

    private propagated<T>(evaluated: EvaluatedExpression<T>): typeof evaluated {
        return wrap(evaluated, (value) => this.onUnquote(value));
    }

    private onUnquote<T>(value: Watchable<T> | T) {
        if (value instanceof Watchable) {
            this.flow = value.flow;
            return value.flow.release;
        }
        return value;
    }
}

function isQuotedExpression<T>(value: Mixed, property: nodes.NodeProperty):
         value is QuotedExpression<T> {
    return _.isFunction(value) && property !== "arguments";
}
