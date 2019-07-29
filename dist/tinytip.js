var Tinytip = (function () {
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
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

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
            width: rect.right - rect.left,
            height: rect.bottom - rect.top
        };
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

    var ILifecycle = /** @class */ (function () {
        function ILifecycle() {
            this.state = {
                isCreated: false,
                isDestroyed: false
            };
        }
        return ILifecycle;
    }());

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
        var childRect = getBoundingClientRect(child);
        var parentRect = getBoundingClientRect(parent);
        var styles = getStyleComputedProperty(parent);
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

    function computeStyle(data) {
        var popper = data.offsets.popper;
        var offsetParent = getOffsetParent(data.instance.popper);
        var offsetParentRect = getBoundingClientRect(offsetParent);
        var prefixedProperty = getSupportedPropertyName('transform');
        var offsets = {
            width: popper.width,
            height: popper.height,
            left: popper.left,
            right: popper.right,
            top: popper.top,
            bottom: popper.bottom,
        };
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
     * 弹射器
     * 用于将给定的html内容显示到给定引用的四周
     */
    var Catapult = /** @class */ (function (_super) {
        __extends(Catapult, _super);
        function Catapult(reference, popper) {
            var _this = _super.call(this) || this;
            _this._options = DEFAULT_CONFIG;
            _this.data = {};
            _this.reference = reference;
            _this.popper = popper;
            // init task queue
            _this.taskQueue = tasks;
            _this._initialize();
            _this._update();
            return _this;
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
        };
        Catapult.prototype._update = function () {
            // reference元素位置信息
            var referenceOffset = getOffsetRectFromCtoP(this.reference, this.data.offsetParent.reference);
            var data = {
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
            }
            else {
                this.update();
                this._options.onUpdate && this._options.onUpdate(data);
            }
        };
        /**
         *
         * @param {HTMLElement} popper 弹出元素
         * @param {HTMLElement} referenceOffset reference元素位置信息
         * @param {IPlacement} placement 弹出元素相对于reference的位置
         */
        Catapult.prototype._getPopperOffsets = function (popper, referenceOffset, placement) {
            var popperRect = getBoundingClientRect(popper);
            var popperOffset = {
                width: popperRect.width,
                height: popperRect.height,
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
            };
            var isHoriz = ['right', 'left'].indexOf(placement) !== -1;
            var mainSide = isHoriz ? 'top' : 'left';
            var secondarySide = isHoriz ? 'left' : 'top';
            var measurement = isHoriz ? 'height' : 'width';
            var secondaryMeasurement = isHoriz ? 'width' : 'height';
            popperOffset[mainSide] =
                referenceOffset[mainSide] +
                    referenceOffset[measurement] / 2 -
                    popperRect[measurement] / 2;
            if (placement === secondarySide) {
                popperOffset[secondarySide] =
                    referenceOffset[secondarySide] - popperRect[secondaryMeasurement];
            }
            return popperOffset;
        };
        // === implement ILifecycle ===
        Catapult.prototype.create = function () {
            this.state.isCreated = true;
            return this;
        };
        Catapult.prototype.update = function () {
            return this;
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
            return this;
        };
        return Catapult;
    }(ILifecycle));

    return Catapult;

}());
