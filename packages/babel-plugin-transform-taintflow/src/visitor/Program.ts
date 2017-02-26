import {types} from "babel-core";
import {NodePath} from "babel-traverse";

export const comment = " https://taintflow.org/transformed ";

export namespace Program {
    export function enter(path: NodePath<types.Program>) {
        path.addComment("leading", comment);
    }
}
