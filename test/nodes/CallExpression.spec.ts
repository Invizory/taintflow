import "mocha";

import {should} from "chai";
should();

import {
    CallExpression,
    RValue,
    Identifier,
    PropertyReference,
} from "../taintflow-runtime";

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

    context("like foo.bar()", () => {
        class Foo {
            public bar() {
                return this;
            }
        }

        it("should preserve context", () => {
            const foo = new Foo();
            new CallExpression({
                callee: () => new PropertyReference<Foo, Function>(foo, "bar"),
                arguments: () => [],
            }).evaluate().value.should.equal(foo);
        });
    });
});
