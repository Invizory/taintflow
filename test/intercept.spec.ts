import "mocha";

import {should} from "chai";
should();

import {run} from "./sandbox";

describe("intercept", () => {
    context("when BinaryExpression", () => {
        it("should not change visible behaviour", () => {
            run(() => 2 + 2).should.be.equal(4);
        });
    });

    context("when LogicalExpression", () => {
        it("should not change visible behaviour", () => {
            run(() => false || true).should.be.true;
        });

        it("should follow short-circuit evaluation", () => {
            run(() => {
                let isEvaluated = false;
                false && (() => isEvaluated = true)();
                return isEvaluated;
            }).should.be.false;
        });
    });

    context("when MemberExpression", () => {
        context("like `foo.bar`", () => {
            const foo = {bar: "bar"};

            it("should evaluate", () => {
                run(() => foo.bar, {foo}).should.equal(foo.bar);
            });

            it("should be assignable", () => {
                run(() => {
                    foo.bar = "new";
                    return foo.bar;
                }, {foo}).should.equal("new");
            });
        });

        it("should wrap string to object when getting length", () => {
            run(() => "".length).should.equal(0);
        });
    });

    context("when CallExpression", () => {
        context("like `id(\"x\")`", () => {
            function id<T>(x: T) {
                return x;
            }

            it("should preserve argument", () => {
                run(() => id("x"), {id}).should.be.equal("x");
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
                run(() => foo.bar() === foo, {foo}).should.be.true;
            });
        });

        context("like `foo()()`", () => {
            function foo() {
                return () => true;
            }

            it("should process double call", () => {
                run(() => foo()(), {foo}).should.be.true;
            });
        });
    });
});
