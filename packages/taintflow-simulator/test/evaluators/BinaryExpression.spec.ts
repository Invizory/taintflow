import "chai/should";
import "mocha";
import {RValue} from "taintflow-core";

import {evaluators} from "../../src";

describe("evaluators.BinaryExpression", () => {
    context("like `2 + 2`", () => {
        it("should evaluate to `4`", () => {
            new evaluators.BinaryExpression({
                operator: "+",
                left: () => new RValue(2),
                right: () => new RValue(2),
            }).evaluate().value.should.equal(4);
        });
    });
});
