import {Visitor} from "babel-core";

import * as visitor from "./visitor";

// We should disable this warning because exporting default function is required
// for a Babel plugin.
//
// tslint:disable-next-line: no-default-export
export default function(): {visitor: Visitor} {
    return {visitor};
}
