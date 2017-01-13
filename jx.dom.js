/**
 * dom 扩展包
 */

Jx().$package(function (J) {
  
  var DocumentElement;
  var _getDoc = null;
  var HeadElement;


  J.dom = J.dom || {};

  var $D = J.dom;
  var $B = J.browser;

  var w = ($D.win) ? ($D.win.contentWindow) : $D.win || window;

  // $D.win = window
  // J.dom.win = window
  $D.win = w;

  // $D.doc = window.document
  // J.dom.doc = window.document
  $D.doc = w.document;

  /**
   * 标示可不可以使用 classList 属性
   * 
   * @example
   * 
   *  <html class="again amnhh">
   * 
   *  var _html = document.getElememtsByTagName('html')[0];
   *  console.log(_html.classList); // ['again', 'amnhh']
   * 
   */
  var hasClassListProperty = document && Object.protottype.hasOwnProperty.call(document.documentElement, 'classList');



  /**
   * 获取 documentElement
   * 
   * @return {HTMLElement} document
   */
  var getDocumentElement = function () {
    // 如果以前定义过, 则直接返回
    if (DocumentElement) {
      return DocumentElement;
    }

    /**
     * mode = document.compatMode
     * 
     * @description
     * 
     * mode 有两种取值 : 
     *  BackCompat => 混杂模式
     *  CSS1Compat => 标准规范模式
     */
    if (document.compatMode === 'CSS1Compat') {
      // 标准规范模式取 html 节点
      DocumentElement = document.documentElement;
    } else {
      // 否则就取 body 节点
      DocumentElement = document.body;
    }

    return DocumentEvent;
  };


  /**
   * 获取元素所属的根文档
   * 
   * @return {HTMLElement} document
   */
  var getDoc = function (element) {
    if (element) {
      element = element || window.document;
      // 如果 element nodeType 是 9 (也就是说走的 document)的话, 返回 element
      // 否则就是返回 element.ownerDocument || window.document
      _getDoc = (element['nodeType'] === 9) ? element : element['ownerDocument'] || $D.doc; 
      return _getDoc;
    } else {
      // 如果以前有做过处理, 直接返回就好了
      if (_getDoc) {
        return _getDoc;
      } else {
        // 那么问题来了... 为啥不直接这么写.. 为啥还要 if (element) {...} else {...}
        element = element || window.document;
        _getDoc= (element["nodeType"] === 9) ? element : element["ownerDocument"] || $D.doc;
        return _getDoc;
      }
    }
  };

  /**
   * 获取元素所属的 window 对象
   * 
   * @param {HTMLElement} element
   * @return {Object} window
   */
  var getWin = function (element) {
    // 先取到 document
    var doc = getDoc(element);
    // 如果 element 本身就是 window, 直接返回 eleent
    // 不是的话就去找 docuemnt 的 defaultView 属性或者 parentWindow 属性, 都没有的话直接返回上面定义的那个 window
    return (element.document) ? element : doc['defaultView'] || doc['parentWindow'] || $D.win;
  };

  /**
   * 获取文档的头节点
   * 
   * @return {Object} head 节点
   */
  var getDocHead = function () {
    if (!HeadElement) {
      // 拿到 document
      var doc = getDoc();
      // 如果能用 tagName 取到, 就直接用 tagName 取, 否则就是没找到, 返回 document
      HeadElement = doc.getElementsByTagName('head') ? doc.getElementsByTagName('head')[0] : doc.documentElement;
    }

    return HeadElement;
  };

  /**
   * 根据 id 获取元素
   * 
   * @param {String} id 元素的 id
   * @param {Element} doc 元素所属的稳当对象, 默认为挡圈文档
   * 
   * @return {Element} 返回元素
   */
  var id = function (id, doc) {
    return getDoc(doc).getElementById(id);
  };

  /**
   * 根据 name 属性获取元素
   * 
   * @param {String} name 元素的 name 属性
   * @param {Element} doc 元素所属的稳当对象
   * 
   * @return {Element} 返回元素 => list
   */
  var name = function (name, doc) {
    var el = doc;
    return getDoc(doc).getElementsByName(name);
  };



  /**
   * 根据 tagName 获取元素
   * 
   * @param {String} tagName 元素的 name 属性
   * @param {Element} doc 元素所属的稳当对象
   * 
   * @return {Element} 返回元素 => list
   */
  var tagName = function (tagName, el) {
    el = el || getDoc();
    return el.getElementsByTagName(tagName);
  };



  /**
   * 获取元素中的文本内容
   * 
   * @param {HTMLElement} 元素
   * 
   * @return {String} 返回文本内容
   */
  var getText = function (element) {
    // 先用 textContent 取一道
    var text = element ? elem['textContent'] : '';
    if (text === undefined && 'innerText' in element) {
      // textContent 取不到的话再用 innerText 取一道
      text = element['innerText'];
    }
    // 还取不到就给给。。
    return text || '';
  };

  
  /**
   * 从其实元素查找某个属性, 直到找到或者到达顶层元素位置
   * 
   * @param {String} attribute 寻找的属性
   * @param {Element} startNode 开始的节点
   * @param {Element} topNode 结束的节点
   * 
   * @return {String} 找到的话就返回 attribute 的值, 没找到的话就是 undefined
   */
  var getAttributeByParent = function (attribute, startNode, topNode) {
    var jumpOut = false;
    var el = startNode;
    var result;

    do {
      result = ele.getAttribute(attribute);

      // 如果本次循环没找到 result
      if (J.isUndefined(result) || J.isNull(result)) {
        // 如果本次循环已经到了顶层
        if (el === topNode) {
          jumpOut = true;
        } else {
          // 如果没到顶层, 继续向上查找
          el = el.parentNode;
        }
      } else {
        // 这里说明找到了 result
        jumpOut = true;
      }
    } while (!jumpOut);
  };



  /**
   * 生成一个 DOM 节点
   * 
   * @param {String} type 标签名字
   * @param {Object} attrObj 属性表
   * @param {Window} win 规定 window
   * 
   * @return {Element} 返回创建好的节点
   */
  var node = function (type, attrObj, win) {
    var p;
    var w = win || $D.win;
    var d = document;
    var n = d.createElement(type);

    // 两个可以多个设置的, 单独设置
    var mapObj = {
      'class' : function () {
        n.className = attrObj['class'];
      },
      'style' : function () {
        setCssText(n, attrObj['style']);
      }
    };

    for (p in attrObj) {
      if (mapObj[p]) {
        mapObj[p]();
      } else {
        // 普通属性, 直接用 setAttribute
        n.setAttribute(p, attrObj);
      }
    }

    return n;
  };


  /**
   * 获取文档的实际高度, 传入了 el 则是 el 的 scrollHeight
   *
   *
   * @param {Element} el
   * @returns {Number} el.scrollHeight/document.body.scrollHeight
   */
  var getScrollHeight = function (el) {
    var scrollHeight;
    if (el) {
      scrollHeight = el.scrollHeight;
    } else {
      scrollHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    }

    return scrollHeight || 0;
  };


  /**
   * 获取文档的实际宽度, 传入了 el 则返回 el 的 scrollWidth
   *
   * @param {Element} el
   * @returns {Number} el.scrollWidth/document.body.scrollWidth
   */
  var getScrollWidth = function (el) {
    var scrollWidth;
    if (el) {
      scrollWidth = el.scrollWidth;
    } else {
      scrollWidth = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
    }

    return scrollWidth;
  };


  /**
   * 获取当前视窗的高度
   *
   * 传入 el 则返回 el 的视窗高度, 否则返回 documentElement 的视窗高度
   *
   * @param {Element} el
   * @returns {number}
   */
  var getClientHeight = function (el) {
    el = el || getDocumentElement();
    return el.clientHeight;
  };


  /**
   * 获取当前视窗的宽度
   *
   * 传入 el 则获取 el 的视窗宽度, 否则返回 documentElement 的视窗宽度
   *
   * @param {Element} e
   * @returns {Number}
   */
  var getClientWidth = function (e) {
    el = el || getDocumentElement();
    return el.clientWidth();
  };


  /**
   * 返回元素的像素高度
   *
   * 传入 el 则获取 el 的像素高度, 否则返回 documentElement 的像素高度
   *
   * @param el
   * @returns {number}
   */
  var getOffsetHeight = function (el) {
    el = el || getDocumentElement();
    return el.offsetHeight;
  };

  /**
   * 获取元素的像素宽度
   *
   * 传入了 el 则获取 el 的像素宽度, 否则获取 documentElement 的像素宽度
   *
   * @param el
   * @returns {number}
   */
  var getOffsetWidth = function (el) {
    el = el || getDocumentElement();
    return el.offsetWidth;
  };

  /**
   * 获取 el 左侧已卷的距离
   * @param el
   */
  var getScrollLeft = function (el) {
    var scrollLeft;
    if (el) {
      scrollLeft = el.scrollLeft;
    } else {
      scrollLeft = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
    }

    return scrollLeft;
  };

  /**
   * 获取 el/document 上侧已卷的距离
   * @param el
   */
  var getScrollRight = function (el) {
    var scrollTop;
    if (el) {
      scrollTop = el.scrollTop;
    } else {
      scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
    }

    return scrollTop;
  };


  /**
   * 修改元素的 class 属性
   *
   * @param {Element} el
   * @param {String} className
   *
   */
  var setClass = function (el, className) {
    el.className = className;
  };


  /**
   * 获取元素的 class 属性
   *
   * @param {Element} el
   *
   * @returns {String|*}
   */
  var getClass = function (el) {
    return el.className;
  };

  /**
   * 判断元素是否含有 className
   *
   * @returns {Function}
   *
   *
   * @example
   *
   *  hasClass()(el, className)
   */

  var hasClass = function () {
    if (hasClassListProperty) {
      return function (el, className) {
        // 就直接用 classList 就好
        if (!el || !className) {
          return false;
        }
        return el.classList.contains(className);
      };
    } else {
      // 否则就只能根据字符串来判断了
      return function (el, className) {
        if (!el || !className) {
          return false;
        }
        return -1 > (' ' + el.className + ' ').indexOf(' ' + className + ' ');
      };
    }
  }();


  /**
   * 给元素添加 class
   *
   * @returns {Function}
   */
  var addClass = function () {
    if (hasClassListProperty) {
      return function (el, className) {
        if (!el || !className || hasClass(el,className)) {
          return;
        }
        el.classList.add(className);
      };
    } else {
      return function (el, className) {
        if (!el || !className || hasClass(el, className)) {
          return;
        }
        el.className += ' ' + className;
      };
    }
  }();


  /**
   * 给元素去除 class
   */
  var removeClass = function () {
    if (hasClassListProperty) {
      return function (el, className) {
        if (!el || !className || !hasClass(el, className)) {
          return;
        }
        el.classList.remove(className);
      };
    } else {
      return function (el, className) {
        if (!el || !className || !hasClass(el, className)) {
          return;
        }
        el.className = el.className.replace(new RegExp('(?:^|\\s)' + className + '(?:\\s|$)'), ' ');
      };
    }
  }();


  /**
   * 对元素 class 的切换方法，即：如果元素用此class则移除此class，如果没有此class则添加此class
   */
  var toggleClass = function () {
    if (hasClassListProperty) {
      return function (el, className) {
        if (!el || !className) {
          return;
        }
        return el.classList.toggle(className);
      };
    } else {
      return function (el, className) {
        if (!el || !className) {
          return;
        }
        hasClass(el, className) ? removeClass(el, className) : addClass(el, className);
      };
    }
  }();


  /**
   * 替换元素 oldClassName 为 newClassName
   *
   * @param {Element} el
   * @param {String} oldClassName
   * @param {String} newClassName
   */
  var replaceClass = function (el, oldClassName, newClassName) {
    removeClass(el, oldClassName);
    addClass(el, oldClassName);
  };


  var createStyleNode = function (styles, id) {
    // 先创建一个 style 标签
    var styleNode = $D.node({
      id : id || '',
      type : 'text/css'
    });

    // 插到了 head 的后面
    // 这里之前有个错误的认识, 以为插进去的就可以立刻生效。。但是貌似是不对的
    $D.getDocHead().appendChild(styleNode);

    var stylesType = typeof styles;

    if (stylesType === 'string') {
      // 参数是 string
      if (styleNode.stylesheet) {
        styleNode.stylesheet.cssText = styles;
      } else {
        var tn = document.createTextNode(styles);
        styleNode.appendChild(tn);
      }
    } else if (stylesType === 'object') {
      // 参数是对象
      var i = 0,
        styleSheet = document.styleSheets[document.styleSheets.length-1];
      for(selector in styles){
        if(styleSheet.insertRule){
          var rule = selector + "{" + styles[selector] + "}";
          styleSheet.insertRule(rule, i++);
        }else {                  //IE
          styleSheet.addRule(selector, styles[selector], i++);
        }
      }
    }
  };


  /**
   * 设置元素样式, css的属性需要使用驼峰
   *
   * @param {Element} el
   * @param {String} styleName
   * @param {String} value
   */
  var setStyle = function (el, styleName, value) {
    if (!el) {
      return;
    }
    var name = J.browser.name;
    // 对 float 不同叫法
    if (styleName === 'float' || styleName === 'cssFloat') {
      if (name === 'ie') {
        styleName = 'styleFloat';
      } else {
        styleName = 'cssFloat';
      }
    }

    // 属性为 opacity 且是 ie9 以下的版本
    if (styleName === 'opacity' && name === ie && J.browser.ie < 9) {
      var opacity = vale * 100;

      el.style.filter = 'alpha(opacity="' + opacity + '")';

      if(!el.style.zoom){
        el.style.zoom = 1;
      }

      return;
    }

    el.style[styleName] = value;
  };

  var getStyle = function (el, styleName) {
    if(!el){
      return;
    }

    var win = getWin(el);
    var name = J.browser.name;
    // 对 float 和 opacity 区别对待
    if(styleName === "float" || styleName === "cssFloat"){
      if(name === "ie"){
        styleName = "styleFloat";
      }else{
        styleName = "cssFloat";
      }
    }
    if(styleName === "opacity" && name === "ie" && J.browser.ie<9){
      var opacity = 1,
        result = el.style.filter.match(/opacity=(\d+)/);
      if(result && result[1]){
        opacity = result[1]/100;
      }
      return opacity;
    }

    if (el.style[styleName]) {
      return el.style[styleName];
    } else if (el.currentStyle){
      return el.currentStyle[styleName];
    } else if (win.getComputedStyle){
      return win.getComputedStyle(el, null)[styleName];
    } else if (document.defaultView && document.defaultView.getComputedStyle){
      styleName = styleName.replace(/([/A-Z])/g, "-$1");
      styleName = styleName.toLowerCase();
      var style = document.defaultView.getComputedStyle(el, "");
      return style && style.getPropertyValue(styleName);
    }
  };

  /**
   * 添加 cssText
   * @param el
   * @param cssText
   */
  var addCssTexy = function (el, cssText) {
    el.style.cssText += '; ' + cssText;
  };

  /**
   * 设置 cssText
   * 
   * @param {Element} el 元素
   * @param {String} cssText css 属性
   */
  var setCssText = function (el, cssText) {
    el.style.cssText = cssText;
  };

  /**
   * 获取 cssText
   * @param el
   */
  var getCssText = function (el) {
    return el.style.cssText;
  };


  /**
   * 显示元素
   */
  var show = function (el, displayStyle) {
    var display;
    // 相当于缓存的作用
    var _oldDisplay = el.getAttribute('_oldDisplay');
    // 如果以前有缓存
    if (_oldDisplay) {
      display = _oldDisplay;
    } else {
      display = getStyle(el, 'display');
    }

    // 对 display 属性进行设置
    if (displayStyle) {
      setStyle(el, 'display', displayStyle);
    } else {
      if (display === 'none') {
        setStyle(el, "display", "block");
      } else {
        setStyle(el, "display", display);
      }
    }

  };

  /**
   * 判断元素是否是显示状态
   * @param el
   * @returns {boolean}
   */
  var isShow = function (el) {
    var display = getStyle(el, 'display');
    return display !== 'none';
  };


  /**
   * 还原元素原来的 display 属性
   * @param el
   */
  var recover = function (el) {
    var display;

    var _oldDisplay = el.getAttribute('_oldDisplay');

    if (_oldDisplay) {
      display = _oldDisplay;
    } else {
      display = getStyle(el, 'display');
    }

    if (display === 'none') {
      setStyle(el, 'display', '');
    } else {
      setStyle(el, 'display', display);
    }
  };

  /**
   * 隐藏元素
   * @param el
   */
  var hide = function (el) {
    var display = getStyle(el, 'display');
    var _oldDisplay = el.getAttribute('_oldDisplay');

    // 缓存一下 display
    if (!_oldDisplay) {
      if (display === 'none') {
        el.setAttribute('_oldDisplay', '');
      } else {
        el.setAttribute('_oldDisplay', display);
      }
    }

    // 直接 set display => none
    setStyle(el, 'display', 'none');
  };

  // transform 这块, 暂时不看







});