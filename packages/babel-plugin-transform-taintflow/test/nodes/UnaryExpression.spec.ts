import "chai";
import "mocha";
import {Runtime} from "taintflow-types";

import {original, transformed} from "../return-expression";

declare const taintflow: Runtime;

describe("UnaryExpression transformer", () => {
    it("should transform `typeof Function`", () => {
        const actual = transformed(() => typeof Function);
        const expected = original(() => {
            return taintflow.intercept({
                type: "UnaryExpression",
                operator: "typeof",
                argument: () => new taintflow.Identifier(() => Function),
            }).value;
        });
        actual.should.equal(expected);
    });
});
