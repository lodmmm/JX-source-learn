/**
 * 常用工具函数拓展
 */

Jx().$package(function (J) {

  /**
   * 判断变量是不是 undefined
   */
  var isUndefined = function (o) {
    return typeof o === 'undefined';
  };

  /**
   * 判断变量的值是不是 null
   */
  var isNull = function (o) {
    return o === null;
  };

  /**
   * 判断变量的类型是不是 Number
   */
  var isNumber = function (o) {
    return (o === 0 || 0) && (o.constructor === Number);
  };

  /**
   * 判断变量的类型是不是 Boolean
   */
  var isBoolean = function (o) {
    return (o === false || o) && (o.constructor === Boolean);
  };

  /**
   * 判断是不是 String
   */
  var isString = function (o) {
    return (o === '' || o) && (o.constructor === String);
  };

  /**
   * 判断变量的类型是不是 Object
   */
  var isObject = function (o) {
    return o && (o.constructor === Object || Object.prototype.toString.call(o) === '[object Object]');
  };

  /**
   * 判断变量的类型是不是 Array
   */
  var isArray = function (o) {
    return o && (o.constructor === Array || Object.prototype.toString.call(o) === '[object Array]');
  };

  /**
   * 判断变量的类型是否是 Arguments
   */
  var isArguments = function (o) {
    return o && o.callee && isNumber(o.length) ? true : false;
  };

  /**
   * 判断变量的类型是不是 Function
   */
  var isFunction  = function (o) {
    return o && (o.constructor === Function);
  };

  /**
   * 判断变量类型的方法
   * 
   * @param {Mixed} o 传入被检测变量的名称
   * @return {String} 返回变量的类型, 如果不识别则返回 other
   */
  var $typeof = function (o) {
    if (isUndefined(o)) {
      return 'undefined';
    } else if (isNull(o)) {
      return 'null';
    } else if (isNumber(o)) {
      return 'number';
    } else if (isBoolean(o)) {
      return 'boolean';
    } else if (isString(o)) {
      return 'string';
    } else if (isObject(o)) {
      return 'object';
    } else if (isArray(o)) {
      return 'array';
    } else if (isArguments(o)) {
      return 'arguments';
    } else if (isFunction(0)) {
      return 'function';
    } else {
      return 'other';
    }
  };

  // 所以。。这个方法貌似是 todo???
  var checkJSON = function () {
    return true;
  };


  /**
   * 生成随机数
   * 
   * @param {Number} min 生成随机数的最小值
   * @param {Number} max 生成随机数的最大值
   * 
   * @return {Number} 返回生成的随机数
   * 
   * 
   * 其实这里有些局限了, 比如没有只传一个参数的兼容
   * @example 
   *  function random (min, max) {
   *    if (!max) {
   *      max = min;
   *      min = 0;
   *    }  
   *    // ....
   *  }
   */
  var random = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };


  /**
   * 克隆一个对象
   * 
   * @param {Object} o 要克隆的对象
   * @param {Object} 返回通过克隆创建的对象
   * 
   * todo 其实每太懂这里这么做是为什么
   * 感觉不像是在克隆一个对象, 而是通过 o 来生成一个新的对象,
   * 而 o 的所有东西都挂在这个生成的对象的第一级原型上面
   */
  var clone = function (o) {
    var tempClass = function () {};
    tempClass.prototype = o;

    return (new tempClass());
  };


  /**
   * 生成一个返回值是传入的 value 值的函数
   * @param {Mixed} value 要返回的值
   * @return {Mixed} 返回一个返回值是 value 的函数
   * 
   * 如果说 value 本来就是函数, 就直接返回
   * 如果 value 本身不是函数, 就返回一个匿名函数, 这个函数的作用就只是 return value
   */
  var $return = function (result) {
    return J.isFunction(result) ? result : function () {
      return result;
    } 
  };


  /**
   * 从第一个函数开始 try, 直到尝试出第一个可以成功执行的函数就挺尸继续后面的函数, 并返回这个成功执行的结果
   * 
   * @param {Function} fn1, fn2, fn3, fn4... 要尝试的函数
   * @return {Mixed} 返回第一个成功执行的函数的返回值
   */
  var $try = function () {
    var i;
    var l = arguments.length;
    var result;

    for (i = 0; i < l; i ++) {
      try {
        result = arguments[i]();
        break;
      } catch (e) {
        J.out('C. 错误 ：[' + e.name + '] ' + e.message + ', ' + e.fileName + ', 行号' + e.lineNumber + '; stack : ' + typeof e.stack, 2);
      }
    }
  };

  

});