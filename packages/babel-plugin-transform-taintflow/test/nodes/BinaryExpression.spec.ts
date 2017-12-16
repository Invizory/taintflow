import {should} from "chai";
import "mocha";
import {Runtime} from "taintflow-types";

import {original, transformed} from "../return-expression";

declare const taintflow: Runtime;

should();

describe("BinaryExpression transformer", () => {
    it("should transform `2 + 2`", () => {
        const actual = transformed(() => 2 + 2);
        const expected = original(() => {
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
        const actual = transformed(
            () => eval instanceof Function,
        );
        const expected = original(() => {
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
