import { IRect } from "@/types/IRect";

export function getRoundedOffsets(rect: IRect)
: IRect {
    const { round } = Math;

    return {
        width: round(rect.width),
        height: round(rect.height),
        top: round(rect.top),
        bottom: round(rect.bottom),
        left: round(rect.left),
        right: round(rect.right)
    }
}