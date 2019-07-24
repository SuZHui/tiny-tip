import { ITinyTipEvent } from './ITinyTipEvent';
import { TinyTip } from '@/TinyTip';

// Task queue
export type ITaskQueue = ITask[];
// Task function
export type ITask = (data: ITinyTipEvent) => void;
// Param of Task function
export type ITaskParam = {
    instance: TinyTip
}
