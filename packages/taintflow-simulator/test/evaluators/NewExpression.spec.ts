import "chai/should";
import "mocha";
import {Identifier, RValue} from "taintflow-core";

import {evaluators} from "../../src";

describe("evaluators.NewExpression", () => {
    context("like `new Error(\"message\")`", () => {
        it("should set own properties", () => {
            const message = "message";
            new evaluators.NewExpression({
                callee: () => new Identifier(() => Error),
                arguments: () => [new RValue(message)],
            }).evaluate().value.message.should.equal(message);
        });
    });
});
