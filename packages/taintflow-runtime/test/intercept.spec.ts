import {should} from "chai";
import "mocha";

import {run} from "./sandbox";

should();

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
                // tslint:disable-next-line:binary-expression-operand-order
                false && (() => isEvaluated = true)();
                return isEvaluated;
            }).should.be.false;
        });
    });

    context("when UnaryExpression", () => {
        context("like delete", () => {
            it("should support property references", () => {
                run(() => {
                    const object = {property: 1};
                    delete object.property;
                    return object.hasOwnProperty("property");
                }).should.be.false;
            });
        });

        context("like typeof", () => {
            const x = "";

            it("should support unresolved identifiers", () => {
                run(() => typeof x).should.be.equal("undefined");
            });

            context("like `typeof void x` with unresolved `x`", () => {
                it("should throw", () => {
                    run(() => {
                        try {
                            typeof void x;
                        } catch (e) {
                            return e.name;
                        }
                    }).should.be.equal("ReferenceError");
                });
            });
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

    context("when NewExpression", () => {
        context("like `new Error(\"message\")`", () => {
            it("should set own properties", () => {
                run(() => new Error("message").message).should.equal("message");
            });
        });
    });
});
