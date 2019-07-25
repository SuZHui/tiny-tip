import { TinyTip } from './../TinyTip';
import { IOffset } from './IOffset';
export interface ITinyTipEvent {
    instance: TinyTip;
    placement: string;
    offsets: {
        popper: IOffset | null,
        trigger: IOffset | null
    }
    styles: {
        [key in keyof CSSStyleDeclaration]?: string | number;
    }
}