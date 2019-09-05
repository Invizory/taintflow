import {expect, should} from "chai";
import "mocha";

import {Identifier, RValue} from "@taintflow/types";

import {evaluators} from "../../src";

should();

describe("evaluators.MemberExpression", () => {
    context("like `foo.bar`", () => {
        type Foo = {bar: string};

        let foo: Foo;
        let expr: evaluators.MemberExpression<Foo, string>;

        beforeEach(() => {
            foo = {bar: "baz"};
            expr = new evaluators.MemberExpression({
                object: () => new Identifier(() => foo),
                property: () => new RValue("bar"),
            });
        });

        it("should evaluate", () => {
            expect(expr.evaluate().value).equal(foo.bar);
        });

        it("should be assignable", () => {
            const next = "next";
            expr.evaluate().value = next;
            foo.bar.should.equal(next);
        });
    });
});
