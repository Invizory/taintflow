import "mocha";

import {should} from "chai";
should();

import * as taintflow from "../../taintflow-runtime";
import {ReturnExpressionCode} from "../transform";

describe("MemberExpression transformer", () => {
    it("should transform `foo.bar`", () => {
        const foo = {bar: "bar"};
        const actual = ReturnExpressionCode.transformed(() => foo.bar);
        const expected = ReturnExpressionCode.original(() => {
            return taintflow.intercept({
                type: "MemberExpression",
                object: () => new taintflow.Identifier(() => foo),
                property: () => new taintflow.RValue("bar"),
            }).value;
        });
        actual.should.equal(expected);
    });
});
