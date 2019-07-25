import { ITaskQueue } from './interface/ITask';
import { DEFAULT_OPTIONS } from './property/defaultOpt';
import { ITinyTipState } from './interface/ITinyTipState';
import { ITinyTipOpt } from './interface/ITinyTipOpt';
import { runTasks } from './task/runTasks';
import tasks from '@/task/index';
import { ITinyTipEvent } from './interface/ITinyTipEvent';
import { getSupportedPropertyName } from './util/getSupportedPropertyName';


export class TinyTip {
    trigger: HTMLElement;
    popper: HTMLElement;
    options: ITinyTipOpt;
    state: ITinyTipState;
    taskQueue: ITaskQueue;

    /**
     * 
     * @param {HTMLElement} target 添加tip的元素 
     * @param {HTMLElement} popover 弹出层模板
     */
    constructor(target: HTMLElement, popperNode: HTMLElement, options: ITinyTipOpt = DEFAULT_OPTIONS) {
        this.trigger = target;

        if (this.trigger.parentNode!.contains(popperNode)) {
            this.popper = popperNode;
        } else {
            const popper = popperNode.cloneNode(true);
            this.trigger.parentNode!.appendChild(popper);
            this.popper = <HTMLElement>popper;
        }

        
        // Merge default options and custom options
        this.options = { ...DEFAULT_OPTIONS, ...options };
        
        // init component state
        this.state = {
            isCreated: false,
            isDestroyed: false
        };

        // init task queue
        this.taskQueue = tasks;

        this._update();
    }

    private _update() {
        let data: ITinyTipEvent = {
            instance: this,
            offsets: {
                trigger: null,
                popper: null,
            },
            placement: this.options.placement!,
            styles: {},
        };

        // execution component tasks and return the result data
        data = runTasks(this.taskQueue, data);

        // trigger life cycle events
        if (!this.state.isCreated) {
            this.state.isCreated = true;
            this.options.onCreate && this.options.onCreate(data);
        } else {
            this.options.onUpdate && this.options.onUpdate(data);
        }
    }

    public destroy() {
        this.state.isDestroyed = true;

        this.popper.style.position = '';
        this.popper.style.top = '';
        this.popper.style.left = '';
        this.popper.style.right = '';
        this.popper.style.bottom = '';
        this.popper.style.willChange = '';
        const propertyName = getSupportedPropertyName('transform');
        propertyName && (this.popper.style[<any>propertyName] = '');

        return this;
    }

}