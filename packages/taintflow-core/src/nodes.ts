import * as types from "babel-types";

import {Mixed, QuotedArgumentsExpression, QuotedExpression} from "./taxonomy";

export type Node
    = CallableNode
    | {["type"]: "MemberExpression"} & MemberExpression<Mixed, PropertyKey>
    | {["type"]: "UnaryExpression"} & UnaryExpression<Mixed>
    | {["type"]: "BinaryExpression"} & BinaryExpression<Mixed, Mixed>
    | {["type"]: "LogicalExpression"} & LogicalExpression<Mixed, Mixed>;

export type CallableNode
    = {["type"]: "CallExpression"} & CallExpression
    | {["type"]: "NewExpression"} & NewExpression;

export function isCallable(node: Node): node is CallableNode {
    return node.type === "CallExpression" ||
           node.type === "NewExpression";
}

export type NodeProperty
    = keyof Node
    | keyof CallExpression
    | keyof NewExpression
    | keyof MemberExpression<Mixed, PropertyKey>
    | keyof UnaryExpression<Mixed>
    | keyof BinaryExpression<Mixed, Mixed>
    | keyof LogicalExpression<Mixed, Mixed>;

export type CallExpression = CallableExpression;

export type NewExpression = CallableExpression;

export interface CallableExpression {
    readonly callee: QuotedExpression<Function>;
    readonly arguments: QuotedArgumentsExpression;
}

export interface MemberExpression<Object, Property extends PropertyKey> {
    readonly object: QuotedExpression<Object>;
    readonly property: QuotedExpression<Property>;
}

export interface UnaryExpression<Argument> {
    readonly operator: UnaryOperator;
    readonly argument: QuotedExpression<Argument>;
}

export interface BinaryExpression<Left, Right> {
    readonly operator: BinaryOperator;
    readonly left: QuotedExpression<Left>;
    readonly right: QuotedExpression<Right>;
}

export interface LogicalExpression<Left, Right> {
    readonly operator: LogicalOperator;
    readonly left: QuotedExpression<Left>;
    readonly right: QuotedExpression<Right>;
}

export type UnaryOperator = types.UnaryExpression["operator"];
export type BinaryOperator = types.BinaryExpression["operator"];
export type LogicalOperator = types.LogicalExpression["operator"];
