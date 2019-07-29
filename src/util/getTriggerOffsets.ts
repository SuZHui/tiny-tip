import { findCommonOffsetParent } from "./findCommonOffsetParent";
import { getOffsetRectRelativeToArbitraryNode } from "./getOffsetRectRelativeToArbitraryNode";

export function getTriggerOffsets(popper: HTMLElement, trigger: HTMLElement, position: 'fixed' | 'absolute' = 'absolute') {
    const commonOffsetParent = findCommonOffsetParent(popper, trigger);
    return getOffsetRectRelativeToArbitraryNode(trigger, <HTMLElement>commonOffsetParent!, position === 'fixed');
}