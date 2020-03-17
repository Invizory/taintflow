import * as _ from "lodash";

import {
    EvaluatedExpression,
    Mixed,
    nodes,
    QuotedExpression,
} from "@taintflow/types";

import {reflection} from "../../reflection";
import {Boxed, Flow} from "../Flow";
import {wrap} from "./wrap";

export class PropagationStrategy {
    private flow?: Flow<Mixed>;
    private shouldReleaseArguments?: boolean;

    public attach(node: nodes.Node): typeof node {
        const attached = this.attachGeneric(node);
        if (!nodes.isCallable(attached)) {
            return attached;
        }
        return this.attachCallable(attached);
    }

    public propagate<T>(result: EvaluatedExpression<T>): typeof result {
        const {flow} = this;
        if (!flow) {
            return result;
        }
        return wrap(result, (value) => flow.alter(value).watch());
    }

    private attachGeneric(node: nodes.Node): typeof node {
        return <nodes.Node> <unknown> _(node)
            .mapValues(this.attachIfQuoted.bind(this))
            .value();
    }

    private attachCallable(node: nodes.CallableNode): typeof node {
        return {
            ...node,
            callee: () => this.attachCallee(node.callee()),
            arguments: () => this.attachArguments(node.arguments()),
        };
    }

    private attachCallee(callee: EvaluatedExpression<Mixed>) {
        return wrap(callee, (func) => {
            this.shouldReleaseArguments =
                _.isFunction(func) &&
                !reflection.isInstrumented(func);
            return func;
        });
    }

    private attachArguments(args: ReadonlyArray<EvaluatedExpression<Mixed>>) {
        return args.map((evaluated) => this.attachArgument(evaluated));
    }

    private attachArgument<T>(argument: EvaluatedExpression<T>) {
        return wrap(argument, (value) => {
            if (_.isUndefined(this.shouldReleaseArguments)) {
                throw new Error(
                    '"callee" should be unquoted before "arguments".',
                );
            }
            return this.shouldReleaseArguments ? this.release(value) : value;
        });
    }

    private attachIfQuoted(value: Mixed, property: nodes.NodeProperty) {
        if (!isQuotedExpression(value, property)) {
            return value;
        }
        return this.attachQuoted(value);
    }

    private attachQuoted<T>(quoted: QuotedExpression<T>) {
        return () => this.attachEvaluated(quoted());
    }

    private attachEvaluated<T>(evaluated: EvaluatedExpression<T>) {
        return wrap(evaluated, (value) => this.release(value));
    }

    private release<T>(value: Boxed<T> | T) {
        if (value instanceof Boxed) {
            this.flow = value.flow;
            return value.flow.release();
        }
        return value;
    }
}

function isQuotedExpression<T>(value: Mixed, property: nodes.NodeProperty):
         value is QuotedExpression<T> {
    return _.isFunction(value) && property !== "arguments";
}
