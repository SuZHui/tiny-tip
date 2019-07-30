import { getSupportedPropertyName } from '@/util/getSupportedPropertyName';
import { setStyles } from '@/util/setStyles';
import { getOffsetParent } from '@/util/getOffsetParent';
import { DEFAULT_CONFIG } from "./config/defaultConfig";
import { getOffsetRectFromCtoP } from './util/getOffsetRectFromCtoP';
import { runTasks } from './task/runTasks';
import tasks from '@/task/index';
import { ICatapultData } from './types/ICataoultData';
import { ICatapultConfig } from './types/ICatapultConfig';
import { getPopperOffsets } from './util/getPopperOffsets';
import { ITaskQueue } from './types/ITask';

/**
 * 弹射器
 * 用于将给定的html内容显示到给定引用的四周
 */
export class Catapult {
    private _options = DEFAULT_CONFIG;
    
    reference: HTMLElement;
    popper: HTMLElement;
    taskQueue: ITaskQueue;
    data: any = {};
    state: { isCreated: boolean; isDestroyed: boolean; };
    

    constructor(reference: HTMLElement, popper: HTMLElement, options: ICatapultConfig) {
        this.reference = reference;
        this.popper = popper;
        this._options = { ...this._options, ...options };

        this.state = {
            isCreated: false,
            isDestroyed: false
        }

        // init task queue
        this.taskQueue = tasks;

        this._initialize();
        this._update();
    }

    /**
     * 初始化组件
     */
    private _initialize() {
        this.data.position = 'absolute';
        this.data.offsetParent = {
            reference: getOffsetParent(this.reference),
            popper: getOffsetParent(this.popper)
        };
        // 设置popper的position为absolute 或 fixed 再进行定位
        // TODO: 后期需要考虑可在absoulte 和 fixed之间切换
        setStyles(this.popper, { position: this.data.position });

        // 获取reference 与 popper的 offsetParent元素
        // 判断两者的offsetParent是否一致
        // 如果不一致 则统一取最外层元素
        // const order = this.reference.compareDocumentPosition(this.popper) & Node.DOCUMENT_POSITION_FOLLOWING;

        // 如果popper节点与reference不在同一个文档对象中
        // 则将popper追加至 与reference同级
        if (document.documentElement.compareDocumentPosition(this.popper) & Node.DOCUMENT_POSITION_DISCONNECTED) {
            this.reference.parentElement!.append(this.popper);
        }

    }

    private _update() {
        // reference元素位置信息
        const referenceOffset = getOffsetRectFromCtoP(this.reference, this.data.offsetParent.reference);

        let data: ICatapultData = {
            instance: this,
            offsets: {
                reference: referenceOffset,
                popper: getPopperOffsets(this.popper, referenceOffset, this._options.placement),
            },
            placement: this._options.placement,
            styles: {},
        };

        // execution component tasks and return the result data
        data = runTasks(this.taskQueue, data);

        // trigger life cycle events
        if (!this.state.isCreated) {
            this.state.isCreated = true;
            this._options.onCreate && this._options.onCreate(data);
        } else {
            this._options.onUpdate && this._options.onUpdate(data);
        }
    }

    destroy() {
        this.state.isDestroyed = true;

        setStyles(this.popper, {
            position: '',
            top: '',
            left: '',
            right: '',
            bottom: '',
            willChange: '',
            [<any>getSupportedPropertyName('transform')]: ''
        });

        // TODO: disabled event listeners
        
        // remove the popper from dom
        this.popper.parentNode!.removeChild(this.popper);

        return this;
    }
}