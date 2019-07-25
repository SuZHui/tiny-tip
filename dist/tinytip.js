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

    /**
     * Default options provided to TinyTip.js constructor
     */
    var DEFAULT_OPTIONS = {
        placement: 'top',
        onCreate: function (_) { },
        onUpdate: function (_) { }
    };

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
     * Apply style to popper
     * @param {ITinyTipEvent} data
     */
    function applyStyle(data) {
        // Futures: Location types fixed and absolut need to be added
        setStyles(data.instance.popper, { position: 'absolute' });
        setStyles(data.instance.popper, data.styles);
        return data;
    }

    function getSupportedPropertyName(property) {
        var prefixes = [false, 'ms', 'webkit', 'Moz', 'O'];
        var upperProp = "" + property.charAt(0).toUpperCase() + property.slice(1);
        for (var i = 0; i < prefixes.length; i++) {
            var prefix = prefixes[i];
            var toCheck = prefix ? "" + prefix + upperProp : property;
            if (document.body.style.hasOwnProperty(toCheck)) {
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
            width: rect.width,
            height: rect.height
        };
    }

    function computeStyle(data) {
        // TODO: is use gpuAcceleration?
        var styles = {
            // TODO: this property will set in option
            position: 'absolute'
        };
        var placement = data.placement;
        // get target bounding client rect
        var targetRect = getBoundingClientRect(data.instance.trigger);
        var popperRect = getBoundingClientRect(data.instance.popper);
        var prefixedProperty = getSupportedPropertyName('transform');
        var left, top;
        // offset of popper to trigger
        var popperToTriggerRect = {
            top: targetRect.top - popperRect.top,
            left: targetRect.left - popperRect.left,
        };
        if (placement === 'top') {
            top = popperToTriggerRect.top - popperRect.height;
        }
        else if (placement === 'bottom') {
            top = popperToTriggerRect.top + popperRect.height;
        }
        else {
            top = popperToTriggerRect.top;
        }
        if (placement === 'left') {
            left = popperToTriggerRect.left - popperRect.width;
        }
        else if (placement === 'right') {
            left = popperToTriggerRect.left + popperRect.width;
        }
        else {
            left = popperToTriggerRect.left;
        }
        if (prefixedProperty) {
            // TODO: If the value is odd, translate3d's display will be blurred
            // setting the value to even solves this problem
            styles[prefixedProperty] = "translate3d(" + left + "px, " + top + "px, 0)";
            styles.left = 0;
            styles.top = 0;
            styles.willChange = 'transform';
        }
        // update style of data
        data.styles = __assign({}, styles, data.styles);
        return data;
    }

    function offset(data) {
        var placement = data.placement, _a = data.offsets, popper = _a.popper, trigger = _a.trigger;
        return data;
    }

    var tasks = [
        offset,
        computeStyle,
        applyStyle
    ];

    var TinyTip = /** @class */ (function () {
        /**
         *
         * @param {HTMLElement} target 添加tip的元素
         * @param {HTMLElement} popover 弹出层模板
         */
        function TinyTip(target, popperNode, options) {
            if (options === void 0) { options = DEFAULT_OPTIONS; }
            this.trigger = target;
            if (this.trigger.parentNode.contains(popperNode)) {
                this.popper = popperNode;
            }
            else {
                var popper = popperNode.cloneNode(true);
                this.trigger.parentNode.appendChild(popper);
                this.popper = popper;
            }
            // Merge default options and custom options
            this.options = __assign({}, DEFAULT_OPTIONS, options);
            // init component state
            this.state = {
                isCreated: false,
                isDestroyed: false
            };
            // init task queue
            this.taskQueue = tasks;
            this._update();
        }
        TinyTip.prototype._update = function () {
            var data = {
                instance: this,
                offsets: {
                    trigger: null,
                    popper: null,
                },
                placement: this.options.placement,
                styles: {},
            };
            // execution component tasks and return the result data
            data = runTasks(this.taskQueue, data);
            // trigger life cycle events
            if (!this.state.isCreated) {
                this.state.isCreated = true;
                this.options.onCreate && this.options.onCreate(data);
            }
            else {
                this.options.onUpdate && this.options.onUpdate(data);
            }
        };
        TinyTip.prototype.destroy = function () {
            this.state.isDestroyed = true;
            this.popper.style.position = '';
            this.popper.style.top = '';
            this.popper.style.left = '';
            this.popper.style.right = '';
            this.popper.style.bottom = '';
            this.popper.style.willChange = '';
            var propertyName = getSupportedPropertyName('transform');
            propertyName && (this.popper.style[propertyName] = '');
            return this;
        };
        return TinyTip;
    }());

    return TinyTip;

}());
