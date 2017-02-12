import "mocha";

import {expect} from "chai";

import {EvaluatingNodes, RValue} from "../../taintflow-runtime";

describe("EvaluatingNodes.UnaryExpression", () => {
    context("like `!false`", () => {
        it("should evaluate to `true`", () => {
            expect(new EvaluatingNodes.UnaryExpression({
                operator: "!",
                argument: () => new RValue(false),
            }).evaluate().value).to.be.true;
        });
    });
});
