import "mocha";

import {should} from "chai";
should();

import {EvaluatingNodes, Identifier, RValue} from "../../taintflow-runtime";

describe("EvaluatingNodes.MemberExpression", () => {
    context("like `foo.bar`", () => {
        type Foo = {bar: string};

        let foo: Foo;
        let expr: EvaluatingNodes.MemberExpression<Foo, string>;

        beforeEach(() => {
            foo = {bar: "baz"};
            expr = new EvaluatingNodes.MemberExpression({
                object: () => new Identifier(() => foo),
                property: () => new RValue("bar"),
            });
        });

        it("should evaluate", () => {
            expr.evaluate().value.should.equal(foo.bar);
        });

        it("should be assignable", () => {
            const next = "next";
            expr.evaluate().value = next;
            foo.bar.should.equal(next);
        });
    });
});
