import { getOffsetParent } from "./getOffsetParent";

/**
 * Verify that the given element is the root container
 * @param {HTMLElement} element
 * @returns {boolean}
 */
export function isOffsetContainer(element: HTMLElement): boolean {
    const { nodeName } = element;
    if (nodeName === 'BODY') {
        return false;
    }
    return (
        nodeName === 'HTML' 
        || element.firstElementChild ? getOffsetParent(<HTMLElement>element.firstElementChild) === element : false
    );
}