import { ITinyTipEvent } from "@/interface/ITinyTipEvent";
import { ITask } from "@/interface/ITask";

/**
 * Execution queue
 * @param {ITask[]} tasks
 * @param {ITinyTipEvent} data
 */
export function runTasks(tasks: ITask[], data: ITinyTipEvent): ITinyTipEvent {
    tasks.forEach(task => {
        data = task(data);
    });
    return data;
}