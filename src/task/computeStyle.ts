import { ITinyTipEvent } from "@/interface/ITinyTipEvent";
import { getSupportedPropertyName } from "@/util/getSupportedPropertyName";
import { IStyle } from "@/interface/IStyle";
import { getBoundingClientRect } from "@/util/getBoundingClientRect";

export function computeStyle(data: ITinyTipEvent) {
    // TODO: is use gpuAcceleration?
    const styles: IStyle = {
        // TODO: this property will set in option
        position: 'absolute'
    };
    const { placement } = data;
    // get target bounding client rect
    const targetRect = getBoundingClientRect(data.instance.trigger);
    const popperRect = getBoundingClientRect(data.instance.popper);

    const prefixedProperty = getSupportedPropertyName('transform');

    let left, top;
    // offset of popper to trigger
    const popperToTriggerRect = {
        top: targetRect.top - popperRect.top,
        left: targetRect.left - popperRect.left,
    }

    if (placement === 'top') {
        top = popperToTriggerRect.top - popperRect.height;
    } else if (placement === 'bottom') {
        top = popperToTriggerRect.top + popperRect.height;
    } else {
        top = popperToTriggerRect.top
    }

    if (placement === 'left') {
        left = popperToTriggerRect.left - popperRect.width;
    } else if (placement === 'right') {
        left = popperToTriggerRect.left + popperRect.width;
    } else {
        left = popperToTriggerRect.left;
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

    return data;
}