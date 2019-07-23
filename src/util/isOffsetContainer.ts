import { getOffsetParent } from "./getOffsetParent";

/**
 * Verify that the given element is the root container
 * @param {Element} element
 * @returns {boolean}
 */
export function isOffsetContainer(element: Element): boolean {
    const { nodeName } = element;
    if (nodeName === 'BODY') {
        return false;
    }
    return (
        nodeName === 'HTML' || getOffsetParent(element.firstElementChild) === element
    );
}