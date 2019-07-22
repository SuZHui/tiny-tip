import { ITinyTipEvent } from "./ITinyTipEvent";

export interface ITinyTipOpt {
    title?: string;
    placement?: 'top' | 'bottom' | 'left' | 'right';
    onCreate?: (data: ITinyTipEvent) => void;
    onUpdate?: (data: ITinyTipEvent) => void;

}