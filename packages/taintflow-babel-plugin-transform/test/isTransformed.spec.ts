import {should} from "chai";
import "mocha";

import {isTransformed, taintflowed} from "../src";

should();

describe("isTransformed", () => {
    const code = "2 + 2";

    it("should be `false` on ordinary code", () => {
        isTransformed(code).should.be.false;
    });

    it("should be `true` on transformed code", () => {
        isTransformed(taintflowed(code).code).should.be.true;
    });
});
