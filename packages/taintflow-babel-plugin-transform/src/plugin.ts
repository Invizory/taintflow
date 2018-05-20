import {Visitor} from "babel-core";

import * as visitor from "./visitor";

export function plugin(): {visitor: Visitor} {
    return {visitor};
}
