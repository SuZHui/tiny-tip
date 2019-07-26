import { ITinyTipEvent } from "@/interface/ITinyTipEvent";

export function offset(data: ITinyTipEvent): ITinyTipEvent {
    const { placement, offsets: { popper, trigger } } = data;
    let offsets;
    
    // TODO: Calculate offsets of popper and trigger
    


    return data;
}