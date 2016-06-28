import {should} from 'chai';
should();

import {run} from './sandbox';

describe('intercept', () => {
    context('when BinaryExpression', () => {
        it('should not change visible behaviour', () => {
            run(() => 2 + 2).should.be.equal(4);
        });
    });
});
