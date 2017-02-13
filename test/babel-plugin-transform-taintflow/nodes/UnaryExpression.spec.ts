import "mocha";

import {should} from "chai";
should();

import * as taintflow from "../../taintflow-runtime";
import {ReturnExpressionCode} from "../transform";

describe("UnaryExpression transformer", () => {
    it("should transform `typeof Function`", () => {
        const actual = ReturnExpressionCode.transformed(() => typeof Function);
        const expected = ReturnExpressionCode.original(() => {
            return taintflow.intercept({
                type: "UnaryExpression",
                operator: "typeof",
                argument: () => new taintflow.Identifier(() => Function),
            }).value;
        });
        actual.should.equal(expected);
    });
});
