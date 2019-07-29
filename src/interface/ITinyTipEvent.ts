
import { IOffset } from './IOffset';
export interface ITinyTipEvent {
    instance: any;
    placement: string;
    offsets: {
        popper: IOffset | null,
        trigger: IOffset | null
    }
    styles: {
        [key in keyof CSSStyleDeclaration]?: string | number;
    }
}