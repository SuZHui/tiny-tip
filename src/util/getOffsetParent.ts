/**
 * Gets the parent element of a given element
 * @param {HTMLElement|null} element
 * @returns {HTMLElement}
 */
export function getOffsetParent(element: HTMLElement): HTMLElement {
    if (!element) {
        return document.documentElement;
    }

    const noOffsetParent = null;

    let offsetParent = element.offsetParent || null;
    while (offsetParent === noOffsetParent && element.nextElementSibling) {
        element = <HTMLElement>element!.nextElementSibling;
        offsetParent = element.offsetParent;
    }

    const nodeName = offsetParent && offsetParent.nodeName;
    
    if (!nodeName || nodeName === 'BODY'|| nodeName === 'HTML') {
        return element ? element.ownerDocument!.documentElement : document.documentElement;
    }

    return <HTMLElement>offsetParent;
}