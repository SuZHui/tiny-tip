import { getOuterSizes } from "@/task/getOuterSizes";

export function getPopperOffsets(popper: HTMLElement, placement: string) {
    const popperRect = getOuterSizes(popper);

    const popperOffsets = {
        width: popperRect.width,
        height: popperRect.height,
    };

    const isHoriz = ['right', 'left'].indexOf(placement) !== -1;
    // If it's horizontal, mainSide is [top]
    // if it's vertical, mainSide is [left]
    const mainSide = isHoriz ? 'top' : 'left';
    const secondarySide = isHoriz ? 'left' : 'top';
    const measurement = isHoriz ? 'height' : 'width';
    const secondaryMeasurement = isHoriz ?  'width' : 'height';

    // popperOffsets[mainSide] = 
}