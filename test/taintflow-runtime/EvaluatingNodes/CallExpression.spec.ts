import "mocha";

import {should} from "chai";
should();

import {
    EvaluatingNodes,
    Identifier,
    PropertyReference,
    RValue,
} from "../../taintflow-runtime";

describe("EvaluatingNodes.CallExpression", () => {
    context("like `id(\"x\")`", () => {
        function id<T>(x: T) {
            return x;
        }

        it("should evaluate to `x`", () => {
            const x = "x";
            new EvaluatingNodes.CallExpression({
                callee: () => new Identifier(() => id),
                arguments: () => [new RValue(x)],
            }).evaluate().value.should.equal(x);
        });
    });

    context("like `foo.bar()`", () => {
        class Foo {
            public bar() {
                return this;
            }
        }

        it("should preserve context", () => {
            const foo = new Foo();
            new EvaluatingNodes.CallExpression({
                callee: () => new PropertyReference<Foo, Function>(foo, "bar"),
                arguments: () => [],
            }).evaluate().value.should.equal(foo);
        });
    });
});
