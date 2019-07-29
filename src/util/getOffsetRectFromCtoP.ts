import { IRect } from "@/types/IRect";
import { getBoundingClientRect } from "./getBoundingClientRect";
import { getStyleComputedProperty } from "./getStyleComputedProperty";

/**
 * 从给定的child 和 parent 节点
 * 生成一个包含相对offset信息的对象
 */
export function getOffsetRectFromCtoP(child: HTMLElement, parent: HTMLElement)
: IRect {
    const childRect = getBoundingClientRect(child);
    const parentRect = getBoundingClientRect(parent);
    const styles = getStyleComputedProperty(parent);

    return {
        width: childRect.width,
        height: childRect.height,
        top: childRect.top - parentRect.top,
        bottom: childRect.top - parentRect.top + childRect.height,
        left: childRect.left - parentRect.left,
        right: childRect.left - parentRect.left + childRect.width
    };
}