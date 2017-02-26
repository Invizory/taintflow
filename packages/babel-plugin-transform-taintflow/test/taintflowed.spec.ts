import "chai";
import "mocha";

import {taintflowed} from "../src";

describe("taintflowed", () => {
    it("should be idempotent", () => {
        const code = <string> taintflowed("2 + 2").code;
        code.should.be.equal(taintflowed(code).code);
    });
});
