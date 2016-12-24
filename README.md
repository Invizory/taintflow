# [![TaintFlow][taintflow-logo]][TaintFlow]

[![Build status][travis-image]][travis-url]
[![License][license-image]][license]

**TaintFlow**, a framework for JavaScript dynamic information flow analysis.

## About

TaintFlow performs prior source code instrumentation which allows you to:

* Find DOM XSS vulnerabilities with taint analysis.
* Improve your debugging experience since TaintFlow can observe any data flow
in code and intercept it.

## Components

TaintFlow primarily consists of the following two components:

* [Transformer] is responsible for source code instrumentation.
* [Runtime] is responsible for runtime support of instrumented code.

In order to use TaintFlow features, you should firstly perform prior source code
instrumentation with [Transformer] and then provide required [Runtime]
dependency.

However, these components used alone don't provide any useful features, since
[Runtime] itself does nothing but provide extension point that can be used by
another—maybe user-supplied—components which takes advantage of the source code
instrumentation.

## Transformer

Given, for example, a JavaScript code like

```javascript
var foo = bar();
```

TaintFlow transforms it into the following form:

```javascript
var foo = taintflow.intercept({
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

By default, the `intercept` function do nothing but evaluate intercepted
expressions in a standard way JavaScript behaves. However, it can be extended
to provide custom non-standard behaviour.

Example for brevity:

```javascript
import {RValue, extend} from "taintflow-runtime";

extend((description, intercept) => {
    // if we are calling some function from instrumented code,
    // then just return "ha-ha!" instead
    if (description.type === "CallExpression") {
        return new RValue("ha-ha!");
    }
    // otherwise, evaluate as usual
    return intercept(description);
});
```

Obviously, such extensions can be chained to provide some complex behaviour.

## Copyright

Copyright © 2016 [Arthur Khashaev]. See [license] for details.

[Arthur Khashaev]: https://khashaev.ru
[TaintFlow]: https://github.com/Invizory/taintflow
[license]: LICENSE.txt
[Transformer]: #transformer
[Runtime]: #runtime

[taintflow-logo]: https://khashaev.ru/static/taintflow.svg
[travis-image]: https://travis-ci.com/Invizory/taintflow.svg?token=WkVhXoQxLrMaL8YrwSfP&branch=master
[travis-url]: https://travis-ci.com/Invizory/taintflow
[license-image]: https://img.shields.io/badge/license-MIT-green.svg
