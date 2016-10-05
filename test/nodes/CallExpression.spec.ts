import "mocha";

import {should} from "chai";
should();

import {CallExpression, Identifier, RValue} from "../taintflow-runtime";

describe("CallExpression", () => {
    context("like id(x)", () => {
        function id<T>(x: T) {
            return x;
        }

        it("should evaluate to x", () => {
            const x = "x";
            new CallExpression({
                callee: () => new Identifier(() => id),
                arguments: () => [new RValue(x)],
            }).evaluate().value.should.equal(x);
        });
    });
});
