import { findCommonOffsetParent } from '../../src/util/findCommonOffsetParent';

describe('[Method] findCommonOffsetParent', () => {
    document.body.innerHTML = `
        <div id="parent">
            <div id="child1"></div>
            <div id="child2"></div>
        </div>
    `;
    test('Get common parent node', () => {
        const element1 = document.getElementById('child1');
        const element2 = document.getElementById('child2');
        const parent = document.getElementById('parent');
        expect(findCommonOffsetParent(element1!, element2!)).toEqual(parent);
    });
});