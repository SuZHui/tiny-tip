import { getOffsetParent } from '../../src/util/getOffsetParent';

describe('[Method] getOffsetParent', () => {
    document.body.innerHTML = `
        <div id="parent">
            <div id="child"></div>
        </div>
    `;
    test('Get the parent element correctly', () => {
        const parent = document.getElementById('parent');
        const child = document.getElementById('child');
        expect(getOffsetParent(child)!.id).toBe(parent!.id);
    });
})