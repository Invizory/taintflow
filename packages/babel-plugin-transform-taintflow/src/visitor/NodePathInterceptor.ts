import {types} from "babel-core";
import {NodePath} from "babel-traverse";

export class NodePathInterceptor<T extends types.Node> {
    private readonly intercepted: (node: T) => types.Node;

    constructor(interceptor: (node: T) => types.Node) {
        this.intercepted = interceptor;
    }

    public intercept(path: NodePath<T>) {
        path.replaceWith(this.intercepted(path.node));
        path.shouldSkip = true;
    }
}
