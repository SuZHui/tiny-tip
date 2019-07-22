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
     * Task Queue
     * Calculate the displacement of popper according to the placement of options
     * 根据options的placement，获取popper的位置，计算popper的位移
     */
    var taskQueue = [];

    var TinyTip = /** @class */ (function () {
        /**
         *
         * @param {Element} target 添加tip的元素
         * @param {Element} popover 弹出层模板
         */
        function TinyTip(target, popper, options) {
            if (options === void 0) { options = {}; }
            this.trigger = target;
            this.popper = popper;
            // Merge default options and custom options
            this.options = __assign({}, DEFAULT_OPTIONS, options);
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
        TinyTip.prototype.show = function () {
            this._show();
        };
        TinyTip.prototype._show = function () {
        };
        TinyTip.prototype._update = function () {
            var data = {
                instance: this
            };
            if (!this.state.isCreated) {
                this.state.isCreated = true;
                this.options.onCreate && this.options.onCreate(data);
            }
            else {
                this.options.onUpdate && this.options.onUpdate(data);
            }
        };
        TinyTip.prototype._destroy = function () {
            this.state.isDestroyed = true;
            return this;
        };
        return TinyTip;
    }());

    return TinyTip;

}());
