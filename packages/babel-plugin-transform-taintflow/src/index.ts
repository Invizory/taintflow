import {plugin} from "./plugin";

// We should disable warnings because exporting default function is required
// for a Babel plugin.
//
// tslint:disable-next-line: no-default-export export-name
export default plugin;

export {taintflowed} from "./taintflowed";
