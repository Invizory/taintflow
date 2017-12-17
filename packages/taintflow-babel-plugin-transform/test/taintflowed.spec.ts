import {should} from "chai";
import "mocha";

import {taintflowed} from "../src";

should();

describe("taintflowed", () => {
    it("should be idempotent", () => {
        const {code} = taintflowed("2 + 2");
        code.should.be.equal(taintflowed(code).code);
    });
});
