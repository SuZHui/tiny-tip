import { IClientRect } from "@/interface/IClientRect";

/**
 * 给定元素偏移量，生成类似于getBoundingClientRect的输出
 */
export function getClientRect(offsets: { top: number; left: number; width: number; height: number; })
: IClientRect {
    return {
        ...offsets,
        bottom: offsets.top  + offsets.height,
        right: offsets.left + offsets.width
    };
}