var Tinytip = (function () {
  'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(source, true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(source).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function getSupportedPropertyName(property) {
    var prefixes = [false, 'ms', 'webkit', 'Moz', 'O'];
    var upperProp = "".concat(property.charAt(0).toUpperCase()).concat(property.slice(1));

    for (var i = 0; i < prefixes.length; i++) {
      var prefix = prefixes[i];
      var toCheck = prefix ? "".concat(prefix).concat(upperProp) : property;

      if (document.body.style[toCheck] !== undefined) {
        return toCheck;
      }
    }

    return null;
  }

  function setStyles(element, styles) {
    Object.keys(styles).forEach(function (key) {
      var unit = '';

      if (['width', 'height', 'top', 'right', 'bottom', 'left'].indexOf(key) !== -1 && styles[key] === 'number') {
        unit = 'px';
      }

      element.style[key] = "".concat(styles[key]).concat(unit);
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
    placement: 'top'
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

  function getStyleComputedProperty(element) {
    var property = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

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
      parentRect.left = Math.max(parentRect.left, 0); // TODO: 如果不是IE10
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
    var offsetParentRect = getBoundingClientRect(offsetParent); // 计算位置时加入对滚动位置的计算

    popper.left += -offsetParentRect.left;
    popper.top += -offsetParentRect.top;
    var prefixedProperty = getSupportedPropertyName('transform');
    var offsets = getRoundedOffsets(popper);
    var styles = {
      position: data.instance.data.position
    };
    styles[prefixedProperty] = "translate3d(".concat(offsets.left, "px, ").concat(offsets.top, "px, 0)");
    styles.left = 0;
    styles.top = 0;
    styles.willChange = 'transform';
    data.styles = _objectSpread2({}, styles, {}, data.styles);
    return data;
  }

  var tasks = [computeStyle, applyStyle];

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
      bottom: 0
    }; // main side 为 offset 中的left 或 top,用以对应popper将要位移的方向
    // secondary side 为 主轴之外的另一轴， 与主轴对应
    // 如果popper出现在横轴（placement = left | right）
    // 则main side 为top 
    // 如果popper出现在纵轴(placement = top | bottom)
    // 则main side 为 left

    var isHoriz = ['right', 'left'].indexOf(placement) !== -1;
    var mainSide = isHoriz ? 'top' : 'left';
    var secondarySide = isHoriz ? 'left' : 'top';
    var measurement = isHoriz ? 'height' : 'width';
    var secondaryMeasurement = isHoriz ? 'width' : 'height'; // 相对于main side 居中

    popperOffset[mainSide] = referenceOffset[mainSide] + referenceOffset[measurement] / 2 - popperRect[measurement] / 2;

    if (placement === secondarySide) {
      // 如果 placement 与 secondary相等
      // 说明 popper相对reference的位置与 secondary side相等
      // 则popper的【secondary side】对应属性相等
      // offset[ss] = ref[ss] - pp[width|height]
      popperOffset[secondarySide] = referenceOffset[secondarySide] - popperRect[secondaryMeasurement];
    } else {
      // 反之则为
      // offset[ss] = ref[ss] + pp[width|height]
      popperOffset[secondarySide] = referenceOffset[secondarySide] + referenceOffset[secondaryMeasurement];
    }

    return popperOffset;
  }

  /**
   * 弹射器
   * 用于将给定的html内容显示到给定引用的四周
   */
  var Catapult =
  /*#__PURE__*/
  function () {
    function Catapult(reference, popper) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : DEFAULT_CONFIG;

      _classCallCheck(this, Catapult);

      _defineProperty(this, "_options", DEFAULT_CONFIG);

      _defineProperty(this, "reference", void 0);

      _defineProperty(this, "popper", void 0);

      _defineProperty(this, "taskQueue", void 0);

      _defineProperty(this, "data", {});

      _defineProperty(this, "state", void 0);

      this.reference = reference;
      this.popper = popper;
      this._options = _objectSpread2({}, this._options, {}, options);
      this.state = {
        isCreated: false,
        isDestroyed: false // init task queue

      };
      this.taskQueue = tasks;

      this._initialize();

      this._update();
    }
    /**
     * 初始化组件
     */


    _createClass(Catapult, [{
      key: "_initialize",
      value: function _initialize() {
        this.data.position = 'absolute';
        this.data.offsetParent = {
          reference: getOffsetParent(this.reference),
          popper: getOffsetParent(this.popper)
        }; // 设置popper的position为absolute 或 fixed 再进行定位
        // TODO: 后期需要考虑可在absoulte 和 fixed之间切换

        setStyles(this.popper, {
          position: this.data.position
        }); // 获取reference 与 popper的 offsetParent元素
        // 判断两者的offsetParent是否一致
        // 如果不一致 则统一取最外层元素
        // const order = this.reference.compareDocumentPosition(this.popper) & Node.DOCUMENT_POSITION_FOLLOWING;
        // 如果popper节点与reference不在同一个文档对象中
        // 则将popper追加至 与reference同级

        if (document.documentElement.compareDocumentPosition(this.popper) & Node.DOCUMENT_POSITION_DISCONNECTED) {
          this.reference.parentElement.append(this.popper);
        }
      }
    }, {
      key: "_update",
      value: function _update() {
        // reference元素位置信息
        var referenceOffset = getOffsetRectFromCtoP(this.reference, this.data.offsetParent.reference);
        var data = {
          instance: this,
          offsets: {
            reference: referenceOffset,
            popper: getPopperOffsets(this.popper, referenceOffset, this._options.placement)
          },
          placement: this._options.placement,
          styles: {}
        }; // execution component tasks and return the result data

        data = runTasks(this.taskQueue, data); // trigger life cycle events

        if (!this.state.isCreated) {
          this.state.isCreated = true;
          this._options.onCreate && this._options.onCreate(data);
        } else {
          this._options.onUpdate && this._options.onUpdate(data);
        }
      }
    }, {
      key: "destroy",
      value: function destroy() {
        this.state.isDestroyed = true;
        setStyles(this.popper, _defineProperty({
          position: '',
          top: '',
          left: '',
          right: '',
          bottom: '',
          willChange: ''
        }, getSupportedPropertyName('transform'), '')); // TODO: disabled event listeners
        // remove the popper from dom

        this.popper.parentNode.removeChild(this.popper);
        return this;
      }
    }]);

    return Catapult;
  }();

  return Catapult;

}());
