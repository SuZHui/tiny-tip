import { ITinyTipEvent } from "@/interface/ITinyTipEvent";
import { getSupportedPropertyName } from "@/util/getSupportedPropertyName";
import { IStyle } from "@/interface/IStyle";
import { getBoundingClientRect } from "@/util/getBoundingClientRect";
import { getOffsetParent } from "@/util/getOffsetParent";

export function computeStyle(data: ITinyTipEvent) {
    const offsetParent = getOffsetParent(data.instance.popper);
    const offsetParentRect = offsetParent.getBoundingClientRect();
    

    // TODO: is use gpuAcceleration?
    const styles: IStyle = {
        // TODO: this property will set in option
        position: data.offsets.popper!.position
    };
    const { placement } = data;
    // get target bounding client rect
    const targetRect = getBoundingClientRect(data.instance.trigger);
    const popperRect = getBoundingClientRect(data.instance.popper);

    const prefixedProperty = getSupportedPropertyName('transform');

    let left, top;
    if (placement === 'top') {
        top = targetRect.top - popperRect.height;
    } else if (placement === 'bottom') {
        top = targetRect.top + popperRect.height;
    } else {
        top = targetRect.top
    }

    if (placement === 'left') {
        left = targetRect.left - popperRect.width;
    } else if (placement === 'right') {
        left = targetRect.left + popperRect.width;
    } else {
        left = targetRect.left;
    }

    if (prefixedProperty) {
        // TODO: If the value is odd, translate3d's display will be blurred
        // setting the value to even solves this problem
        styles[<any>prefixedProperty] = `translate3d(${left}px, ${top}px, 0)`;
        styles.left = 0;
        styles.top = 0;
        styles.willChange = 'transform';
    } else {
        // TODO: If the browser does not support the transform property
        // use 'style.position' instead of

    }
    
    // update style of data
    data.styles = { ...styles, ...data.styles };
    debugger
    return data;
}