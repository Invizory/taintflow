import "chai";
import "mocha";
import {EvaluatedExpression, Runtime} from "taintflow-types";

import {original, transformed} from "../return-expression";

declare const taintflow: Runtime;

describe("CallExpression transformer", () => {
    function foo(..._: {}[]) {
        return null;
    }

    it("should transform `foo()`", () => {
        const actual = transformed(() => foo());
        const expected = original(() => {
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
        const actual = transformed(() => {
            return foo(identifier, "rvalue");
        });
        const expected = original(() => {
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
        const actual = transformed(() => context.foo());
        const expected = original(() => {
            return taintflow.intercept({
                type: "CallExpression",
                callee: () =>
                    <EvaluatedExpression<Function>> taintflow.intercept({
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
