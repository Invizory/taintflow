import "mocha";

import {should} from "chai";
should();

import * as taintflow from "../../taintflow-runtime";
import {ReturnExpressionCode} from "../transform";

describe("CallExpression transformer", () => {
    function foo(..._: {}[]) {
        return null;
    }

    it("should transform `foo()`", () => {
        const actual = ReturnExpressionCode.transformed(() => foo());
        const expected = ReturnExpressionCode.original(() => {
            return taintflow.intercept({
                type: "CallExpression",
                callee: () => new taintflow.Identifier(() => foo),
                arguments: () => [],
            }).value;
        });
        actual.should.equal(expected);
    });

    it("should transform `foo(identifier, \"rvalue\")`", () => {
        const identifier = "identifier";
        const actual = ReturnExpressionCode.transformed(() => {
            return foo(identifier, "rvalue");
        });
        const expected = ReturnExpressionCode.original(() => {
            return taintflow.intercept({
                type: "CallExpression",
                callee: () => new taintflow.Identifier(() => foo),
                arguments: () => [
                    new taintflow.Identifier(() => identifier),
                    new taintflow.RValue("rvalue"),
                ],
            }).value;
        });
        actual.should.equal(expected);
    });

    it("should transform `context.foo()`", () => {
        const context = {foo};
        const actual = ReturnExpressionCode.transformed(() => context.foo());
        const expected = ReturnExpressionCode.original(() => {
            return taintflow.intercept({
                type: "CallExpression",
                callee: () => taintflow.intercept({
                    type: "MemberExpression",
                    object: () => new taintflow.Identifier(() => context),
                    property: () => new taintflow.RValue("foo"),
                }),
                arguments: () => [],
            }).value;
        });
        actual.should.equal(expected);
    });
});
