import { IRect } from "@/types/IRect";
import { getBoundingClientRect } from "./getBoundingClientRect";
import { IPlacement } from "@/types/IPlacement";

/**
 * 
 * @param {HTMLElement} popper 弹出元素
 * @param {HTMLElement} referenceOffset reference元素位置信息 
 * @param {IPlacement} placement 弹出元素相对于reference的位置 
 */
export function getPopperOffsets(popper: HTMLElement, referenceOffset: IRect, placement: IPlacement)
: IRect {
    const popperRect = getBoundingClientRect(popper);

    const popperOffset: IRect = {
        width: popperRect.width,
        height: popperRect.height,
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    };

    // main side 为 offset 中的left 或 top,用以对应popper将要位移的方向
    // secondary side 为 主轴之外的另一轴， 与主轴对应
    // 如果popper出现在横轴（placement = left | right）
    // 则main side 为top 
    // 如果popper出现在纵轴(placement = top | bottom)
    // 则main side 为 left
    const isHoriz = ['right', 'left'].indexOf(placement) !== -1;
    const mainSide = isHoriz ? 'top': 'left';
    const secondarySide = isHoriz ? 'left': 'top';
    const measurement = isHoriz ? 'height' : 'width';
    const secondaryMeasurement = isHoriz ? 'width' : 'height';

    // 相对于main side 居中
    popperOffset[mainSide] =
        referenceOffset[mainSide] +
        referenceOffset[measurement] / 2 -
        popperRect[measurement] / 2;
    
    if (placement === secondarySide) {
        // 如果 placement 与 secondary相等
        // 说明 popper相对reference的位置与 secondary side相等
        // 则popper的【secondary side】对应属性相等
        // offset[ss] = ref[ss] - pp[width|height]
        popperOffset[secondarySide] =
            referenceOffset[secondarySide] - popperRect[secondaryMeasurement];
    } else {
        // 反之则为
        // offset[ss] = ref[ss] + pp[width|height]
        popperOffset[secondarySide] =
            referenceOffset[secondarySide] + referenceOffset[secondaryMeasurement];
    }

    return popperOffset;
}