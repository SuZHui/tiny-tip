/**
 * Execution queue
 * @param {Function[]} tasks 
 */
export function runTasks(tasks: Function[]) {
    tasks.forEach(task => task());
}