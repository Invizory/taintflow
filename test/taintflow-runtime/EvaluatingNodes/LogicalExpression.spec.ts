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
});
