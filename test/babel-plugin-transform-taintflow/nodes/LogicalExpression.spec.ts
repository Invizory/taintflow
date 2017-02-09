import "mocha";

import {should} from "chai";
should();

import * as taintflow from "../../taintflow-runtime";
import {ReturnExpressionCode} from "../transform";

describe("LogicalExpression transformer", () => {
    it("should transform `true && false`", () => {
        const actual = ReturnExpressionCode.transformed(() => true && false);
        const expected = ReturnExpressionCode.original(() => {
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
