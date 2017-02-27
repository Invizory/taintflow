import "chai/should";
import "mocha";
import {Identifier, PropertyReference, RValue} from "taintflow-core";

import {evaluators} from "../../src";

describe("evaluators.CallExpression", () => {
    context("like `id(\"x\")`", () => {
        function id<T>(x: T) {
            return x;
        }

        it("should evaluate to `x`", () => {
            const x = "x";
            new evaluators.CallExpression({
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
            new evaluators.CallExpression({
                callee: () => new PropertyReference<Foo, Function>(foo, "bar"),
                arguments: () => [],
            }).evaluate().value.should.equal(foo);
        });
    });
});
