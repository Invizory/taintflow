import {types} from "babel-core";
import {NodePath} from "babel-traverse";

const content = " https://taintflow.org/transformed ";

export namespace Program {
    export function enter(path: NodePath<types.Program>) {
        if (isAlreadyTransformed(path.node)) {
            path.stop();
            return;
        }
        path.addComment("leading", content);
    }
}

function isAlreadyTransformed(program: types.Program) {
    return program.body.some(hasLeadingComment);
}

function hasLeadingComment(node: types.Node) {
    const {leadingComments} = node;
    if (!leadingComments) {
        return false;
    }
    return leadingComments.some(({value}) => value === content);
}

export const comment = `/*${content}*/`;
