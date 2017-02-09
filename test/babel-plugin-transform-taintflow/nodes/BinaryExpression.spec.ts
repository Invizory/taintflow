import "mocha";

import {should} from "chai";
should();

import * as taintflow from "../../taintflow-runtime";
import {ReturnExpressionCode} from "../transform";

describe("BinaryExpression transformer", () => {
    it("should transform `2 + 2`", () => {
        const actual = ReturnExpressionCode.transformed(() => 2 + 2);
        const expected = ReturnExpressionCode.original(() => {
            return taintflow.intercept({
                type: "BinaryExpression",
                operator: "+",
                left: () => new taintflow.RValue(2),
                right: () => new taintflow.RValue(2),
            }).value;
        });
        actual.should.equal(expected);
    });

    it("should transform `eval instanceof Function`", () => {
        const actual = ReturnExpressionCode.transformed(
            () => eval instanceof Function,
        );
        const expected = ReturnExpressionCode.original(() => {
            return taintflow.intercept({
                type: "BinaryExpression",
                operator: "instanceof",
                left: () => new taintflow.Identifier(() => eval),
                right: () => new taintflow.Identifier(() => Function),
            }).value;
        });
        actual.should.equal(expected);
    });
});
