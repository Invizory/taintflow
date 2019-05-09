import {should} from "chai";
import "mocha";

import {reflection} from "../src";
import {run} from "./sandbox";

should();

describe("reflection.isInstrumented", () => {
    context("when FunctionDeclaration", () => {
        it("should be recognized as instrumented", () => {
            run(() => {
                function id<T>(x: T) {
                    return x;
                }
                return reflection.isInstrumented(id);
            }).should.be.true;
        });
    });

    context("when FunctionExpression", () => {
        it("should be recognized as instrumented", () => {
            run(() => reflection.isInstrumented(() => 0)).should.be.true;
        });
    });

    context("when built-in function", () => {
        it("should not be recognized as instrumented", () => {
            run(() => reflection.isInstrumented(Function)).should.be.false;
        });
    });
});
