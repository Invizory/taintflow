import {should} from "chai";
import "mocha";

import {transformed} from "../return-expression";

should();

describe("ForStatement transformer", () => {
    it("should transform `for (0 || 0; ; );`", () => {
        transformed(() => {
            // tslint:disable-next-line: curly
            return () => { for (0 || 0; ; ); };
        });
    });
});
