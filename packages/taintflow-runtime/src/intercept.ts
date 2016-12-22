import {EvaluatedExpression} from "./taxonomy";

export function intercept(_: {}): EvaluatedExpression<{}> {
    throw new Error("Interception is not implemented.");
}
