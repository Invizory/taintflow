import * as babel from 'babel-core';
import * as vm from 'vm';

// tslint:disable-next-line: import-name
import plugin from '../packages/babel-plugin-transform-taintflow/src';
import * as runtime from './taintflow-runtime';

type Primitive = boolean | number | string | symbol | void;

// tslint:disable-next-line: export-name
export function run<T extends Primitive>(func: () => T): T {
    const {code} = transform(`(${func.toString()})()`);
    return new vm.Script(code).runInNewContext({
        'taintflow_runtime_1': runtime,
    });
}

function transform(code: string) {
    return babel.transform(code, {
        presets: ['node5', 'stage-0'],
        plugins: [plugin],
    });
}
