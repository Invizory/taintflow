import {transform, types} from "babel-core";
import {default as generate} from "babel-generator";

import {taintflowed} from "../src";

export function original<T>(func: () => T) {
    const {ast} = transform(func.toString());
    return generate(returnExpression(ast)).code;
}

export function transformed<T>(func: () => T) {
    const {ast} = taintflowed(func.toString());
    return generate(returnExpression(ast)).code;
}

function returnExpression(ast?: types.Node) {
    if (!ast) {
        throw new Error("BabelFileResult.ast is undefined.");
    }
    if (!types.isFile(ast)) {
        throw new AstError("File");
    }
    const exprStatement = ast.program.body[0];
    if (!types.isExpressionStatement(exprStatement)) {
        throw new AstError("ExpressionStatement");
    }
    const expr = exprStatement.expression;
    if (!types.isFunction(expr)) {
        throw new AstError("Function");
    }
    const {body} = expr;
    if (!types.isBlockStatement(body)) {
        throw new AstError("BlockStatement");
    }
    const lastStatement = [...body.body].pop();
    if (!lastStatement || !types.isReturnStatement(lastStatement)) {
        throw new Error(
            "Body of given function should end with ReturnStatement.",
        );
    }
    if (!lastStatement.argument) {
        throw new Error(
            "ReturnStatement of given function should contain argument.",
        );
    }
    return lastStatement.argument;
}

class AstError extends Error {
    public readonly name = "AstError";

    constructor(nodeType: string) {
        super(
            "AST of given function was transformed to something different " +
            `from ${nodeType}.`,
        );
    }
}
