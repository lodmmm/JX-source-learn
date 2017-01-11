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
   * 设置 cssText
   * 
   * @param {Element} el 元素
   * @param {String} cssText css 属性
   */
  var setCssText = function (el, cssText) {
    el.style.cssText = cssText;
  };




});