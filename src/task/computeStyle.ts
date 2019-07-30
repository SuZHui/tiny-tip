import { getSupportedPropertyName } from '@/util/getSupportedPropertyName';
import { getBoundingClientRect } from '@/util/getBoundingClientRect';
import { getOffsetParent } from '@/util/getOffsetParent';
import { ICatapultData } from "@/types/ICataoultData";
import { IRect } from '@/types/IRect';
import { IStyle } from '@/types/IStyle';

export function computeStyle(data: ICatapultData) {
    const { popper } = data.offsets;
    const offsetParent = getOffsetParent(data.instance.popper);
    const offsetParentRect = getBoundingClientRect(offsetParent);

    const prefixedProperty = getSupportedPropertyName('transform');

    const offsets: IRect = {
        width: popper.width,
        height: popper.height,
        left: popper.left,
        right: popper.right,
        top: popper.top,
        bottom: popper.bottom,
    };

    const styles: IStyle = {
        position: data.instance.data.position,
    };


    styles[<any>prefixedProperty] = `translate3d(${offsets.left}px, ${offsets.top}px, 0)`;
    styles.left = 0;
    styles.top = 0;
    styles.willChange = 'transform';

    data.styles = { ...styles, ...data.styles };

    return data;
}