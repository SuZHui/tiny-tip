import { getOuterSizes } from "@/task/getOuterSizes";
import { IOffset } from "@/interface/IOffset";

export function getPopperOffsets(popper: HTMLElement, triggerOffsets: IOffset, placement: string) {
    const popperRect = getOuterSizes(popper);

    const popperOffsets: IOffset = {
        width: popperRect.width,
        height: popperRect.height,
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
    };

    const isHoriz = ['right', 'left'].indexOf(placement) !== -1;
    // If it's horizontal, mainSide is [top]
    // if it's vertical, mainSide is [left]
    const mainSide = isHoriz ? 'top' : 'left';
    const secondarySide = isHoriz ? 'left' : 'top';
    const measurement = isHoriz ? 'height' : 'width';
    const secondaryMeasurement = isHoriz ?  'width' : 'height';

    popperOffsets[mainSide] =
        triggerOffsets[mainSide] +
        triggerOffsets[measurement] / 2 -
        popperRect[measurement] / 2;
    if (placement === secondarySide) {
        popperOffsets[secondarySide] =
        triggerOffsets[secondarySide] - popperRect[secondaryMeasurement];
    } else {
        // popperOffsets[secondarySide] =
        // triggerOffsets[getOppositePlacement(secondarySide)];
    }

  return popperOffsets;
}