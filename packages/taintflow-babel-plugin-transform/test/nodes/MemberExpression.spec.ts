import {should} from "chai";
import "mocha";

import {Runtime} from "@taintflow/types";

import {original, transformed} from "../return-expression";

declare const taintflow: Runtime;

should();

describe("MemberExpression transformer", () => {
    const foo = {bar: "bar"};

    it("should transform `foo.bar`", () => {
        const actual = transformed(() => foo.bar);
        const expected = original(() => {
            return taintflow.intercept({
                type: "MemberExpression",
                object: () => new taintflow.Identifier(() => foo),
                property: () => new taintflow.RValue("bar"),
            }).value;
        });
        actual.should.equal(expected);
    });

    it("should transform `foo[key]`", () => {
        const key = "bar";
        const actual = transformed(() => foo[key]);
        const expected = original(() => {
            return taintflow.intercept({
                type: "MemberExpression",
                object: () => new taintflow.Identifier(() => foo),
                property: () => new taintflow.Identifier(() => key),
            }).value;
        });
        actual.should.equal(expected);
    });
});
