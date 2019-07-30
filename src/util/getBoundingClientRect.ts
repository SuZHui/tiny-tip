import { IRect } from "@/types/IRect";

/**
 * Get the size of the element and its position relative to the viewport
 * @param {HTMLElement} element dom node
 * @returns {object}
 */

export function getBoundingClientRect(element: HTMLElement)
    : IRect {
    const rect = element.getBoundingClientRect();

    return {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
        bottom: rect.bottom,
        right: rect.width
    }
}