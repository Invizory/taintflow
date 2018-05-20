import {should} from "chai";
import "mocha";

import {Identifier, RValue} from "@taintflow/types";

import {evaluators} from "../../src";

should();

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
