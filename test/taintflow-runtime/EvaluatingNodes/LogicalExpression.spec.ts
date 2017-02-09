import "mocha";

import {expect} from "chai";

import {EvaluatingNodes, RValue} from "../../taintflow-runtime";

describe("EvaluatingNodes.LogicalExpression", () => {
    context("like `false || true`", () => {
        it("should evaluate to `true`", () => {
            expect(new EvaluatingNodes.LogicalExpression({
                operator: "||",
                left: () => new RValue(false),
                right: () => new RValue(true),
            }).evaluate().value).to.be.true;
        });
    });

    context("like `false && expression`", () => {
        it("should not evaluate `expression`", () => {
            let isEvaluated = false;
            new EvaluatingNodes.LogicalExpression({
                operator: "&&",
                left: () => new RValue(false),
                right: () => new RValue(isEvaluated = true),
            }).evaluate();
            expect(isEvaluated).to.be.false;
        });
    });
});
