# [![TaintFlow][taintflow-logo]][TaintFlow]

[![Build status][travis-image]][travis-url]
[![Coverage][coverage-image]][coverage-url]
[![License][license-image]][license]

**TaintFlow**, a framework for JavaScript dynamic information flow analysis.

## About

TaintFlow performs prior source code instrumentation which allows you to:

* Find DOM XSS vulnerabilities and unvalidated redirects with taint analysis.
* Improve your debugging experience since TaintFlow can observe any data flow
in code and intercept it.

## Command Line Interface

### Install

To install TaintFlow [Transformer] command line interface, you must have
[Node.js] with [`yarn`] installed. Run:

```bash
yarn
PATH="$PATH:$(yarn bin)"
```

In the near future, after the initial release of TaintFlow, we will also
provide the following way to install it from the [`npm`] global registry:

```bash
npm install --global @taintflow/cli
```

[Node.js]: https://nodejs.org
[`npm`]: https://www.npmjs.com
[`yarn`]: https://yarnpkg.com

### Usage

Transform `script.js` with source code instrumentation and output to `stdout`:

```bash
taintflow script.js
```

If you would like to transform the entire `src` directory and output it to the
`out` directory you may use `-d`:

```bash
taintflow src -d out
```

There are many more options available, see `taintflow --help` for more
information.

## Components

TaintFlow primarily consists of the following two components:

* [Transformer] is responsible for source code instrumentation.
* [Runtime] is responsible for runtime support of instrumented code.

In order to use TaintFlow features, you should firstly perform prior source code
instrumentation with [Transformer] and then provide required [Runtime]
dependency.

[Runtime] also provides extension point that can be used by another—maybe
user-supplied—components which takes advantage of the source code
instrumentation.

## Transformer

Given, for example, a JavaScript code like

```javascript
const foo = bar();
```

TaintFlow transforms it into the following form:

```javascript
const foo = taintflow.intercept({
    type: "CallExpression",
    callee: () => new taintflow.Identifier(() => bar),
    arguments: () => [],
}).value;
```

> Note: The [Runtime] namespace `taintflow` here should be exported globally
> for this code to work.

Of course, such instrumentation also implies significant slowdown (around 3-5
times), so it makes no sense to transform code for running in production
environment.

## Runtime

By default, the `intercept` function does nothing but evaluate intercepted
expressions in a standard way JavaScript behaves. However, it can be extended
to provide custom non-standard behaviour.

Example for brevity:

```javascript
import * as taintflow from "@taintflow/runtime";

taintflow.extend((intercept) => (node) => {
    // if we are calling some function from instrumented code,
    // then just return "ha-ha!" instead
    if (node.type === "CallExpression") {
        return new taintflow.RValue("ha-ha!");
    }
    // otherwise, evaluate as usual
    return intercept(node);
});
```

Obviously, such extensions can be chained to provide some complex behaviour.

## Taint Analysis

To intercept and taint any data flow in the instrumented environment, you can
use [`Flow`]:

```javascript
import {Flow} from "@taintflow/runtime";

const hello = Flow.tainted("hello");
console.log(Flow.of(hello + "world").isTainted); // ⇒ true
```

You can also find some usage examples in the [specification of `Flow`].

[`Flow`]: packages/taintflow-runtime/src/tainter/Flow.ts
[specification of `Flow`]: packages/taintflow-runtime/test/tainter/Flow.spec.ts

## Copyright

Copyright © 2018—2019 [Arthur Khashaev]. See [license] for details.

[Arthur Khashaev]: https://khashaev.ru
[TaintFlow]: https://taintflow.org
[license]: LICENSE.txt
[Transformer]: #transformer
[Runtime]: #runtime

[taintflow-logo]: https://taintflow.org/logo.svg
[travis-image]: https://travis-ci.com/Invizory/taintflow.svg?token=WkVhXoQxLrMaL8YrwSfP&branch=master
[travis-url]: https://travis-ci.com/Invizory/taintflow
[license-image]: https://img.shields.io/badge/license-MIT-green.svg
[coverage-image]: https://codecov.io/gh/Invizory/taintflow/branch/master/graph/badge.svg?token=4tjFZ3dqMH
[coverage-url]: https://codecov.io/gh/Invizory/taintflow
