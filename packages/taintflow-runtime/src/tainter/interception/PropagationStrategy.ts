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
            .mapValues((x) => this.attachValue(x))
            .value();
    }

    public propagate<T>(result: EvaluatedExpression<T>) {
        const {flow} = this;
        if (!flow) {
            return result;
        }
        return wrap(result, (value) => flow.alter(value).watch);
    }

    private attachValue(value: Mixed) {
        return isQuotedExpression(value) ? this.attachQuoted(value) : value;
    }

    private attachQuoted<T>(quoted: QuotedExpression<T>) {
        return () => this.propagated(quoted());
    }

    private propagated<T>(evaluated: EvaluatedExpression<T>):
            EvaluatedExpression<T> {
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

function isQuotedExpression(value: Mixed): value is QuotedExpression<Mixed> {
    return _.isFunction(value);
}
