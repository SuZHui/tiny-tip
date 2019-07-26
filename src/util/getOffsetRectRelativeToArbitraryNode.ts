import { getBoundingClientRect } from '@/util/getBoundingClientRect';
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

    // TODO: 计算child 相对parent的offset rect

}