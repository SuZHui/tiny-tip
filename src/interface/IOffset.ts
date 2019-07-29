import { IClientRect } from "./IClientRect";

export interface IOffset extends IClientRect {
    position?: 'absolute' | 'fixed';
}