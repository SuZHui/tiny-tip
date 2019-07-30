'use strict';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function getSupportedPropertyName(property) {
    var prefixes = [false, 'ms', 'webkit', 'Moz', 'O'];
    var upperProp = "" + property.charAt(0).toUpperCase() + property.slice(1);
    for (var i = 0; i < prefixes.length; i++) {
        var prefix = prefixes[i];
        var toCheck = prefix ? "" + prefix + upperProp : property;
        if (document.body.style[toCheck] !== undefined) {
            return toCheck;
        }
    }
    return null;
}

function setStyles(element, styles) {
    Object.keys(styles).forEach(function (key) {
        var unit = '';
        if (['width', 'height', 'top', 'right', 'bottom', 'left'].indexOf(key) !== -1
            && styles[key] === 'number') {
            unit = 'px';
        }
        element.style[key] = "" + styles[key] + unit;
    });
}

/**
 * Gets the parent element of a given element
 * 返回html元素
 * @param {HTMLElement|null} element
 * @returns {HTMLElement}
 */
function getOffsetParent(element) {
    if (!element) {
        return document.documentElement;
    }
    var noOffsetParent = null;
    var offsetParent = element.offsetParent || null;
    while (offsetParent === noOffsetParent && element.nextElementSibling) {
        element = element.nextElementSibling;
        offsetParent = element.offsetParent;
    }
    var nodeName = offsetParent && offsetParent.nodeName;
    if (!nodeName || nodeName === 'BODY' || nodeName === 'HTML') {
        return element ? element.ownerDocument.documentElement : document.documentElement;
    }
    return offsetParent;
}

var DEFAULT_CONFIG = {
    placement: 'top',
};

/**
 * Get the size of the element and its position relative to the viewport
 * @param {HTMLElement} element dom node
 * @returns {object}
 */
function getBoundingClientRect(element) {
    var rect = element.getBoundingClientRect();
    return {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
        bottom: rect.bottom,
        right: rect.width
    };
}

function getStyleComputedProperty(element, property) {
    if (property === void 0) { property = null; }
    if (element.nodeType !== Node.ELEMENT_NODE || element.nodeType !== 1) {
        return [];
    }
    var window = element.ownerDocument.defaultView;
    var css = window.getComputedStyle(element, null);
    return property ? css[property] : css;
}

/**
 * 从给定的child 和 parent 节点
 * 生成一个包含相对offset信息的对象
 */
function getOffsetRectFromCtoP(child, parent) {
    var isHTML = parent.nodeName === 'HTML';
    var childRect = getBoundingClientRect(child);
    var parentRect = getBoundingClientRect(parent);
    var styles = getStyleComputedProperty(parent);
    if (isHTML) {
        parentRect.top = Math.max(parentRect.top, 0);
        parentRect.left = Math.max(parentRect.left, 0);
        // TODO: 如果不是IE10
        // offset加入计算margin和border
        var marginTop = parseFloat(styles.marginTop);
        var marginLeft = parseFloat(styles.marginLeft);
        childRect.top += marginTop;
        childRect.left += marginLeft;
        childRect.bottom += marginTop;
        childRect.right += marginLeft;
    }
    return {
        width: childRect.width,
        height: childRect.height,
        top: childRect.top - parentRect.top,
        bottom: childRect.top - parentRect.top + childRect.height,
        left: childRect.left - parentRect.left,
        right: childRect.left - parentRect.left + childRect.width
    };
}

/**
 * Execution queue
 * @param {ITask[]} tasks
 * @param {ITinyTipEvent} data
 */
function runTasks(tasks, data) {
    tasks.forEach(function (task) {
        data = task(data);
    });
    return data;
}

/**
 * Apply style to popper
 * @param {ICatapultData} data
 */
function applyStyle(data) {
    // Futures: Location types fixed and absolut need to be added
    setStyles(data.instance.popper, data.styles);
    return data;
}

function getRoundedOffsets(rect) {
    var round = Math.round;
    return {
        width: round(rect.width),
        height: round(rect.height),
        top: round(rect.top),
        bottom: round(rect.bottom),
        left: round(rect.left),
        right: round(rect.right)
    };
}

function computeStyle(data) {
    var popper = data.offsets.popper;
    var offsetParent = getOffsetParent(data.instance.popper);
    var offsetParentRect = getBoundingClientRect(offsetParent);
    var prefixedProperty = getSupportedPropertyName('transform');
    var offsets = getRoundedOffsets(popper);
    var styles = {
        position: data.instance.data.position,
    };
    styles[prefixedProperty] = "translate3d(" + offsets.left + "px, " + offsets.top + "px, 0)";
    styles.left = 0;
    styles.top = 0;
    styles.willChange = 'transform';
    data.styles = __assign({}, styles, data.styles);
    return data;
}

var tasks = [
    computeStyle,
    applyStyle
];

/**
 *
 * @param {HTMLElement} popper 弹出元素
 * @param {HTMLElement} referenceOffset reference元素位置信息
 * @param {IPlacement} placement 弹出元素相对于reference的位置
 */
function getPopperOffsets(popper, referenceOffset, placement) {
    var popperRect = getBoundingClientRect(popper);
    var popperOffset = {
        width: popperRect.width,
        height: popperRect.height,
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    };
    // main side 为 offset 中的left 或 top,用以对应popper将要位移的方向
    // secondary side 为 主轴之外的另一轴， 与主轴对应
    // 如果popper出现在横轴（placement = left | right）
    // 则main side 为top 
    // 如果popper出现在纵轴(placement = top | bottom)
    // 则main side 为 left
    var isHoriz = ['right', 'left'].indexOf(placement) !== -1;
    var mainSide = isHoriz ? 'top' : 'left';
    var secondarySide = isHoriz ? 'left' : 'top';
    var measurement = isHoriz ? 'height' : 'width';
    var secondaryMeasurement = isHoriz ? 'width' : 'height';
    // 相对于main side 居中
    popperOffset[mainSide] =
        referenceOffset[mainSide] +
            referenceOffset[measurement] / 2 -
            popperRect[measurement] / 2;
    if (placement === secondarySide) {
        // 如果 placement 与 secondary相等
        // 说明 popper相对reference的位置与 secondary side相等
        // 则popper的【secondary side】对应属性相等
        // offset[ss] = ref[ss] - pp[width|height]
        popperOffset[secondarySide] =
            referenceOffset[secondarySide] - popperRect[secondaryMeasurement];
    }
    else {
        // 反之则为
        // offset[ss] = ref[ss] + pp[width|height]
        popperOffset[secondarySide] =
            referenceOffset[secondarySide] + referenceOffset[secondaryMeasurement];
    }
    return popperOffset;
}

/**
 * 弹射器
 * 用于将给定的html内容显示到给定引用的四周
 */
var Catapult = /** @class */ (function () {
    function Catapult(reference, popper, options) {
        if (options === void 0) { options = DEFAULT_CONFIG; }
        this._options = DEFAULT_CONFIG;
        this.data = {};
        this.reference = reference;
        this.popper = popper;
        this._options = __assign({}, this._options, options);
        this.state = {
            isCreated: false,
            isDestroyed: false
        };
        // init task queue
        this.taskQueue = tasks;
        this._initialize();
        this._update();
    }
    /**
     * 初始化组件
     */
    Catapult.prototype._initialize = function () {
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
            this.reference.parentElement.append(this.popper);
        }
    };
    Catapult.prototype._update = function () {
        // reference元素位置信息
        var referenceOffset = getOffsetRectFromCtoP(this.reference, this.data.offsetParent.reference);
        var data = {
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
        }
        else {
            this._options.onUpdate && this._options.onUpdate(data);
        }
    };
    Catapult.prototype.destroy = function () {
        var _a;
        this.state.isDestroyed = true;
        setStyles(this.popper, (_a = {
                position: '',
                top: '',
                left: '',
                right: '',
                bottom: '',
                willChange: ''
            },
            _a[getSupportedPropertyName('transform')] = '',
            _a));
        // TODO: disabled event listeners
        // remove the popper from dom
        this.popper.parentNode.removeChild(this.popper);
        return this;
    };
    return Catapult;
}());

module.exports = Catapult;
