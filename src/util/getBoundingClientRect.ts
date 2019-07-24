/**
 * Get the size of the element and its position relative to the viewport
 * @param {HTMLElement} element dom node
 * @returns {object}
 */

export function getBoundingClientRect(element: HTMLElement)
    : { left: number; top: number; width: number; height: number; } {
    const rect = element.getBoundingClientRect();

    return {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height
    }
}