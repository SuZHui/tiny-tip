import { ITinyTipEvent } from "@/interface/ITinyTipEvent";
import { setStyles } from "@/util/setStyles";

/**
 * Apply style to popper
 * @param {ITinyTipEvent} data 
 */
export function applyStyle(data: ITinyTipEvent) {
    // Futures: Location types fixed and absolut need to be added
    setStyles(data.instance.popper, { position: 'absolute' });
    setStyles(data.instance.popper, data.styles);

    return data;
}