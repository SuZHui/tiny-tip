import { getBoundingClientRect } from '@/util/getBoundingClientRect';
import { getClientRect } from './getClientRect';
/**
 *  获取相对于任意节点的偏移矩形
 * @param {HTMLElement} child
 * @param {HTMLElement} parent
 * @param {boolean} isFixed 
 */
export function getOffsetRectRelativeToArbitraryNode(child: HTMLElement, parent: HTMLElement, isFixed: boolean = false) {
    const isHTML = parent.nodeName === 'HTML';
    const childRect = getBoundingClientRect(child);
    const parentRect = getBoundingClientRect(parent);

    const styles = getComputedStyle(parent);
    const borderTopWidth = parseFloat(styles.borderTopWidth!);
    const borderLeftWidth = parseFloat(styles.borderLeftWidth!);

    // 计算child 相对parent的offset rect
    if (isFixed && isHTML) {
        parentRect.top = Math.max(parentRect.top, 0);
        parentRect.left = Math.max(parentRect.left, 0);
    }
    let offsets = getClientRect({
        top: childRect.top - parentRect.top - borderTopWidth,
        left: childRect.left - parentRect.left - borderLeftWidth,
        width: childRect.width,
        height: childRect.height
    });

    offsets.marginTop = 0;
    offsets.marginLeft = 0;
    

    return offsets;
}