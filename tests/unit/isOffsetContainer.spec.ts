import { isOffsetContainer } from '../../src/util/isOffsetContainer';
describe('[Method] isOffsetContainer', () => {
    document.body.innerHTML = `
        <div id="parent">
            <div id="child"></div>
        </div>
    `;

    test('Verify the body is not the root element', () => {
        const body = document.body;
        expect(isOffsetContainer(body)).toBeFalsy();
    });

    test('Verify the html is the root element', () => {
        const html = document.documentElement;
        expect(isOffsetContainer(html)).toBeTruthy();
    });

    test('Verify the custom element is the root element', () => {
        const parent = document.getElementById('parent');
        expect(isOffsetContainer(parent!)).toBeTruthy();
    });
});