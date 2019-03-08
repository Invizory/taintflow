import {should} from "chai";
import "mocha";

import * as taintflow from "../src";
import {run} from "./sandbox";

should();

describe("extend", () => {
    it("should extend `intercept` as in `README.md`", () => {
        const extension = taintflow.extend((intercept) => (node) => {
            if (node.type === "CallExpression") {
                return new taintflow.RValue("ha-ha!");
            }
            return intercept(node);
        });
        afterEach(() => extension.remove());
        run(() => {
            const id = <T>(x: T) => x;
            return id("hello");
        }).should.equal("ha-ha!");
    });
});
