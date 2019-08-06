import { setStyles } from "../util/setStyles";
import { ICatapultData } from "../types/ICataoultData";

/**
 * Apply style to popper
 * @param {ICatapultData} data 
 */
export function applyStyle(data: ICatapultData) {
    // Futures: Location types fixed and absolut need to be added
    setStyles(data.instance.popper, data.styles);

    return data;
}