/**
 * Gets the parent element of a given element
 * @param {Element|null} element
 * @returns {Element|null}
 */
export function getOffsetParent(element: Element | null = null): Element | null {
    if (!element) {
        return document.documentElement;
    }

    const noOffsetParent = null;
    let offsetParent = (element as HTMLElement).offsetParent || (element as HTMLElement).parentElement || null;
    while (offsetParent === noOffsetParent && element.nextElementSibling) {
        element = (element.nextElementSibling as HTMLElement);
        offsetParent = (element as HTMLElement).offsetParent;
    }

    const nodeName = offsetParent && offsetParent.nodeName;
    
    if (!nodeName || nodeName === 'BODY'|| nodeName === 'HTML') {
        return element ? element.ownerDocument!.documentElement : document.documentElement;
    }

    return offsetParent;
}