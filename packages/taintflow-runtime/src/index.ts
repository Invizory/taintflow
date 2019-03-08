import {Interceptor} from "@taintflow/types";
import {intercept as interceptor} from "./tainter";

import * as _ from "lodash";

export * from "@taintflow/types";
export {reflection} from "./reflection";

export {Flow} from "./tainter";

export type Extension = (intercept: Interceptor) => Interceptor;

export interface EnabledExtension {
    remove(): void;
}

export let intercept: Interceptor = interceptor;

export function extend(extension: Extension): EnabledExtension {
    intercept = extension(intercept);
    extensions.push(extension);
    return {
        remove() {
            _.remove(extensions, extension);
            intercept = _(extensions).reduce((int, ext) => ext(int),
                                             interceptor);
        },
    };
}

const extensions: Extension[] = [];
