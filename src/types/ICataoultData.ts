import { Catapult } from './../Catapult';
import { IRect } from "./IRect";
import { IPlacement } from "./IPlacement";
import { IStyle } from "./IStyle";

export interface ICatapultData {
    instance: Catapult;
    offsets: {
        reference: IRect;
        popper: IRect;
    },
    placement: IPlacement;
    styles: IStyle;
}