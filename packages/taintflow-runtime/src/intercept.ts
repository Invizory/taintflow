import {EvaluatedExpression} from "./taxonomy";

export function intercept(description: {}): EvaluatedExpression<{}> {
    throw new Error("Interception is not implemented.");
}
