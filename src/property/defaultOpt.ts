import { ITinyTipEvent } from './../interface/ITinyTipEvent';
import { ITinyTipOpt } from "../interface/ITinyTipOpt";

/**
 * Default options provided to TinyTip.js constructor
 */
export const DEFAULT_OPTIONS: ITinyTipOpt = {
    placement: 'top',
    onCreate(_: ITinyTipEvent) {},
    onUpdate(_: ITinyTipEvent) {}
}
