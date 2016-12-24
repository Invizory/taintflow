import "mocha";

import {should} from "chai";
should();

import {run} from "./sandbox";
import {Reflection} from "./taintflow-runtime";

xdescribe("Reflection.isInstrumented", () => {
    context("when FunctionDeclaration", () => {
        it("should be recognized as instrumented", () => {
            run(() => {
                // tslint:disable-next-line: no-empty
                function foo() {}
                return Reflection.isInstrumented(foo);
            }).should.be.true;
        });
    });

    context("when FunctionExpression", () => {
        it("should be recognized as instrumented", () => {
            run(() => Reflection.isInstrumented(() => 0)).should.be.true;
        });
    });

    context("when built-in function", () => {
        it("should not be recognized as instrumented", () => {
            run(() => Reflection.isInstrumented(Function)).should.be.false;
        });
    });
});
