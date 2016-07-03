import {should} from 'chai';
should();

import {run} from './sandbox';
import {Flow} from './taintflow-runtime';

describe('Flow', () => {
    context('ordinary string', () => {
        it('should not be recognized as tainted', () => {
            run(() => new Flow('').isTainted).should.be.false;
        });

        it('should be released as it is', () => {
            run(() => new Flow('').give).should.equal('');
        });
    });
});
