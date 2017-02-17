import "chai";
import "mocha";

import {Flow} from "../../src";
import {run} from "../sandbox";

describe("Flow", () => {
    context("ordinary string", () => {
        it("should not be recognized as tainted", () => {
            run(() => Flow.of("").isTainted).should.be.false;
        });

        it("should be released as it is", () => {
            run(() => Flow.of("test").release).should.equal("test");
        });

        it("should be watched as it is", () => {
            run(() => Flow.of("test").watch).should.equal("test");
        });
    });

    context("tainted string", () => {
        it("should be recognized as tainted", () => {
            run(() => Flow.of(Flow.tainted("")).isTainted).should.be.true;
        });

        it("should have string type", () => {
            run(() => typeof Flow.tainted("")).should.equal("string");
        });

        it("should proxify `toString` method call", () => {
            run(() => Flow.tainted("test").toString()).should.equal("test");
        });

        it("should propagate after concatenation", () => {
            run(() => Flow.of(Flow.tainted("") + "").isTainted).should.be.true;
        });

        it("should propagate when getting property", () => {
            run(() => {
                return Flow.of(Flow.tainted("").length).isTainted;
            }).should.be.true;
        });

        it("should propagate to called function as an argument", () => {
            run(() => {
                const isFlowedInto = <T>(x: T) => Flow.of(x).isTainted;
                return isFlowedInto(Flow.tainted(""));
            }).should.be.true;
        });
    });

    it("should propagate when getting property by tainted name", () => {
        run(() => {
            const method = {}[Flow.tainted("toString")];
            return Flow.of(method).isTainted;
        }).should.be.true;
    });
});
