import { ITinyTipEvent } from './ITinyTipEvent';
export type ITaskQueue = ITask[];
export type ITask = (data: ITinyTipEvent) => void;
