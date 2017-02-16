import "chai";
import "mocha";
import {Runtime} from "taintflow-core";

import {original, transformed} from "../return-expression";

declare const taintflow: Runtime;

describe("LogicalExpression transformer", () => {
    it("should transform `true && false`", () => {
        const actual = transformed(() => true && false);
        const expected = original(() => {
            return taintflow.intercept({
                type: "LogicalExpression",
                operator: "&&",
                left: () => new taintflow.RValue(true),
                right: () => new taintflow.RValue(false),
            }).value;
        });
        actual.should.equal(expected);
    });
});