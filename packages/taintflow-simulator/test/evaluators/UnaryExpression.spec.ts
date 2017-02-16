import {expect} from "chai";
import "mocha";
import {RValue} from "taintflow-core";

import {evaluators} from "../../src";

describe("evaluators.UnaryExpression", () => {
    context("like `!false`", () => {
        it("should evaluate to `true`", () => {
            expect(new evaluators.UnaryExpression({
                operator: "!",
                argument: () => new RValue(false),
            }).evaluate().value).to.be.true;
        });
    });
});
