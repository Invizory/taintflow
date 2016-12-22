import "mocha";

import {should} from "chai";
should();

import {run} from "./sandbox";
import {isInstrumented} from "./taintflow-runtime";

xdescribe("isInstrumented", () => {
    context("when FunctionDeclaration", () => {
        it("should be recognized as instrumented", () => {
            run(() => {
                // tslint:disable-next-line
                function foo() {}
                return isInstrumented(foo);
            }).should.be.true;
        });
    });

    context("when FunctionExpression", () => {
        it("should be recognized as instrumented", () => {
            run(() => isInstrumented(() => 0)).should.be.true;
        });
    });

    context("when built-in function", () => {
        it("should not be recognized as instrumented", () => {
            run(() => isInstrumented(Function)).should.be.false;
        });
    });
});
