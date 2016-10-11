import {
    EvaluatingNode,
    QuotedExpression,
    QuotedArgumentsExpression,
    EvaluatedExpression,
    ValueKind,
    RValue,
} from "../taxonomy";

export interface CallExpressionDescription {
    readonly callee: QuotedExpression<Function>;
    readonly arguments: QuotedArgumentsExpression;
}

export class CallExpression
    implements EvaluatingNode<{}>,
               CallExpressionDescription {
    public readonly kind: "CallExpression";
    public readonly callee: QuotedExpression<Function>;
    public readonly arguments: QuotedArgumentsExpression;

    constructor(description: CallExpressionDescription) {
        Object.assign(this, description);
    }

    public evaluate() {
        const {target, context} = this.dereference();
        const returnValue = Reflect.apply(
            target,
            context,
            this.unquotedArguments(),
        );
        return new RValue(returnValue);
    }

    private dereference() {
        const callee = this.callee();
        return {target: callee.value, context: resolveContext(callee)};
    }

    private unquotedArguments() {
        return this.arguments().map((arg) => arg.value);
    }
}

function resolveContext(callee: EvaluatedExpression<Function>) {
    if (callee.kind === ValueKind.PropertyReference) {
        return callee.base;
    }
}
