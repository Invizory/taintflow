import {expect} from "chai";
import "mocha";
import {RValue} from "taintflow-types";

import {evaluators} from "../../src";

describe("evaluators.LogicalExpression", () => {
    context("like `false || true`", () => {
        it("should evaluate to `true`", () => {
            expect(new evaluators.LogicalExpression({
                operator: "||",
                left: () => new RValue(false),
                right: () => new RValue(true),
            }).evaluate().value).to.be.true;
        });
    });

    context("like `false && expression`", () => {
        it("should not evaluate `expression`", () => {
            let isEvaluated = false;
            new evaluators.LogicalExpression({
                operator: "&&",
                left: () => new RValue(false),
                right: () => new RValue(isEvaluated = true),
            }).evaluate();
            expect(isEvaluated).to.be.false;
        });
    });
});
