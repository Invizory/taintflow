import {should} from "chai";
import "mocha";

import {Runtime} from "@taintflow/types";

import {original, transformed} from "../return-expression";

declare const taintflow: Runtime;

should();

describe("NewExpression transformer", () => {
    class Foo {
        public bar: string = "bar";
    }

    it("should transform `new Foo()`", () => {
        const actual = transformed(() => new Foo());
        const expected = original(() => {
            return taintflow.intercept({
                type: "NewExpression",
                callee: () => new taintflow.Identifier(() => Foo),
                arguments: () => [],
            }).value;
        });
        actual.should.equal(expected);
    });
});
