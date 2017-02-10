import "mocha";

import {should} from "chai";
should();

import {EvaluatingNodes, RValue} from "../../taintflow-runtime";

describe("EvaluatingNodes.BinaryExpression", () => {
    context("like `2 + 2`", () => {
        it("should evaluate to `4`", () => {
            new EvaluatingNodes.BinaryExpression({
                operator: "+",
                left: () => new RValue(2),
                right: () => new RValue(2),
            }).evaluate().value.should.equal(4);
        });
    });
});
