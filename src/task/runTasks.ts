import { ITask } from "@/interface/ITask";
import { ICatapultData } from "@/types/ICataoultData";

/**
 * Execution queue
 * @param {ITask[]} tasks
 * @param {ITinyTipEvent} data
 */
export function runTasks(tasks: ITask[], data: ICatapultData): ICatapultData {
    tasks.forEach(task => {
        data = task(data);
    });
    return data;
}