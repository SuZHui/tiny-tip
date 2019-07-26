import { isOffsetContainer } from "./isOffsetContainer";
import { getOffsetParent } from "./getOffsetParent";

/**
 * Find the offset parent common to the two provided nodes
 * 获取传入nodes的共有祖先元素
 * @param {Element} element1
 * @param {Element} element2
 * @returns {Element} common offset parent
 */
export function findCommonOffsetParent(element1: HTMLElement, element2: HTMLElement): HTMLElement {
    if (!element1 || !element1.nodeType || !element2 || !element2.nodeType) {
        return document.documentElement;
    }
    // Calculates the position of given elements
    const order = 
        element1.compareDocumentPosition(element2)
        & Node.DOCUMENT_POSITION_FOLLOWING;
    const start = order ? element1 : element2;
    const end = order ? element2 : element1;

    // Get common ancestor container
    const range = document.createRange();
    range.setStart(start, 0);
    range.setEnd(end, 0);
    const { commonAncestorContainer } = range;

    if ((element1 !== commonAncestorContainer && element2 !== commonAncestorContainer)
        || start.contains(end)) {
        if (isOffsetContainer(<HTMLElement>commonAncestorContainer)) {
            return <HTMLElement>commonAncestorContainer;
        }
        return getOffsetParent(<HTMLElement>commonAncestorContainer);
    }

    // TODO: if element is shadowDOM , todo it
   return <HTMLElement>commonAncestorContainer;
}