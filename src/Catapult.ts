import { getSupportedPropertyName } from '@/util/getSupportedPropertyName';
import { getBoundingClientRect } from '@/util/getBoundingClientRect';
import { setStyles } from '@/util/setStyles';
import { getOffsetParent } from '@/util/getOffsetParent';
import { DEFAULT_CONFIG } from "./config/defaultConfig";
import { ILifecycle } from "./types/ILifecycle";
import { IRect } from './types/IRect';
import { getOffsetRectFromCtoP } from './util/getOffsetRectFromCtoP';
import { IPlacement } from './types/IPlacement';
import { runTasks } from './task/runTasks';
import tasks from '@/task/index';
import { ITaskQueue } from './interface/ITask';
import { ICatapultData } from './types/ICataoultData';

/**
 * 弹射器
 * 用于将给定的html内容显示到给定引用的四周
 */
export class Catapult extends ILifecycle {
    private _options = DEFAULT_CONFIG;
    
    reference: HTMLElement;
    popper: HTMLElement;
    taskQueue: ITaskQueue;
    data: any = {};
    

    constructor(reference: HTMLElement, popper: HTMLElement) {
        super();
        this.reference = reference;
        this.popper = popper;

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
    }

    private _update() {
        // reference元素位置信息
        const referenceOffset = getOffsetRectFromCtoP(this.reference, this.data.offsetParent.reference);

        let data: ICatapultData = {
            instance: this,
            offsets: {
                reference: referenceOffset,
                popper: this._getPopperOffsets(this.popper, referenceOffset, this._options.placement),
            },
            placement: this._options.placement,
            styles: {},
        };

        // execution component tasks and return the result data
        data = runTasks(this.taskQueue, data);

        // trigger life cycle events
        if (!this.state.isCreated) {
            this.create();
            this._options.onCreate && this._options.onCreate(data);
        } else {
            this.update();
            this._options.onUpdate && this._options.onUpdate(data);
        }
    }

    /**
     * 
     * @param {HTMLElement} popper 弹出元素
     * @param {HTMLElement} referenceOffset reference元素位置信息 
     * @param {IPlacement} placement 弹出元素相对于reference的位置 
     */
    private _getPopperOffsets(popper: HTMLElement, referenceOffset: IRect, placement: IPlacement)
    : IRect {
        const popperRect = getBoundingClientRect(popper);

        const popperOffset: IRect = {
            width: popperRect.width,
            height: popperRect.height,
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
        };

        const isHoriz = ['right', 'left'].indexOf(placement) !== -1;
        const mainSide = isHoriz ? 'top': 'left';
        const secondarySide = isHoriz ? 'left': 'top';
        const measurement = isHoriz ? 'height' : 'width';
        const secondaryMeasurement = isHoriz ? 'width' : 'height';

        popperOffset[mainSide] =
            referenceOffset[mainSide] +
            referenceOffset[measurement] / 2 -
            popperRect[measurement] / 2;
        
        if (placement === secondarySide) {
            popperOffset[secondarySide] =
                referenceOffset[secondarySide] - popperRect[secondaryMeasurement];
        }

        return popperOffset;
    }

    // === implement ILifecycle ===
    create() {
        this.state.isCreated = true;
        return this;
    }

    update() {
        return this;
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

        return this;
    }
}