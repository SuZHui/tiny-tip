import { ITaskQueue } from './interface/ITask';
import { DEFAULT_OPTIONS } from './property/defaultOpt';
import { ITinyTipState } from './interface/ITinyTipState';
import { ITinyTipOpt } from './interface/ITinyTipOpt';
import { taskQueue } from './property/taskQueue';
import { runTasks } from './task/runTasks';


export class TinyTip {
    trigger: Element;
    popper: Element;
    options: ITinyTipOpt;
    state: ITinyTipState;
    taskQueue: ITaskQueue;

    /**
     * 
     * @param {HTMLElement} target 添加tip的元素 
     * @param {HTMLElement} popover 弹出层模板
     */
    constructor(target: HTMLElement, popperNode: HTMLElement, options: ITinyTipOpt = {}) {
        this.trigger = target;
        this.popper = popperNode;
        // Merge default options and custom options
        this.options = { ...DEFAULT_OPTIONS, ...options };
        
        // init component state
        this.state = {
            isCreated: false,
            isDestroyed: false
        };

        // init task queue
        this.taskQueue = taskQueue;

        this._update();
    }

    /**
     * Reveals an popover
     */
    public show() {
        this._show();
    }

    private _show() {}

    private _update() {
        let data = {
            instance: this
        };

        // execution component tasks
        runTasks(this.taskQueue);

        if (!this.state.isCreated) {
            this.state.isCreated = true;
            this.options.onCreate && this.options.onCreate(data);
        } else {
            this.options.onUpdate && this.options.onUpdate(data);
        }
    }

    private _destroy() {
        this.state.isDestroyed = true;

        return this;
    }

}