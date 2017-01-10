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
   * 从第一个函数开始 try, 直到尝试出第一个可以成功执行的函数就停止继续后面的函数, 并返回这个成功执行的结果
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


  /**
   * 对一个对象或者数组进行扩展
   * 
   * @param {Mixed} beExtendObj 被扩展的对象或者数组
   * @param {Mixed} extendObj1, extendObj2 ... 用来参照扩展的对象或者数组
   * @return {Mixed} 返回被扩展后的对象或者数组
   * 
   * 直接就是深拷贝, 对当前项是 Object 的时候直接就是递归调用
   */
  var extend = function (beExtendObj, extendObj1, extendObj2) {
    var a = arguments;
    var i;
    var p;
    var beExtendObj;
    var extendObj;


    // 如果只是传入了一个参数的话, 就当做是对调用者的扩展
    // 参考 jq 里面的 $.extend 的功能
    if (a.length === 1) {
      beExtendObj = this;
      // 这个 i 是用来标示从哪个位置开始是扩展的项
      i = 0;
    } else {
      beExtendObj = a[0] || {};
      i = 1;
    }

    for (; i < arguments.length; i ++) {
      extendObj = arguments[i];

      for (p in extendObj) {
        var src = beExtendObj[p];
        var obj = extendObj[p];

        // 避免死循环
        if (src === obj) {
          continue;
        }

        // obj 存在, obj 是一个 Object 不是 Array 不是 dom 节点不是 Function
        if (obj && isObject(obj) && !isArray(obj) && !obj.nodeType && !isFunction(obj) {
          src = beExtendObj[p] || {};
          // 直接就会进行深层次的遍历
          beExtendObj[p] = extend(src, obj || (obj.length != null ? [ ] : { }));
          // 拷贝的对象的当前项为 undefined 的时候, 跳过, 不为 undefined 的时候, 就进行赋值
        } else if (obj !== undefined) {
          beExtendObj[p] = obj;
        }
      }
    }

    return beExtendObj;
  };

  /**
   * 获取当前时间的函数
   */
  var now = function () {
    return + new Date();
  };


  var timedChunk = function (items, process, context, isShift, callback) {
    // 把 items 转化成数组
    var todo = items.concat();
    // 设置一个默认延时时间
    var delay = 25;

    window.setTimeout(function () {
      // 先取到当前的时间
      var start = +new Date();

      // 在 todo list 里面还有东西, 并且执行时间过了 50 ms 的时候
      // 一直执行 todo list 里面的函数
      do {
        process.call(context, todo.shift());
      } while (todo.length > 0 && (+new Date() - start < 50));

      // 如果 50 ms 之后还有 todo 没有执行完的话
      if (todo.length > 0) {
        // 再把这些 arguments 执行一遍, 而且是放到另一个延时队列里面, 延时时间为 25 ms
        window.setTimeout(arguments.callee, delay);
      } else if (callback) {
        // 传入了 callback 的时候, 而且 todo list 里面没东西了的时候
        // 用 callback 调用一下子 item 
        callback(item);
      }
    }, delay);
  };

  /**
   * 获取对象自身具有的属性和方法的数量
   * 
   * @param {Object} obj 要获取的对象
   * @return {Number} 返回对象自身具有的属性和方法
   */
  var getLength = function (obj) {
    var p, count = 0;

    // for/in 循环遍历一下这个对象
    // 注意, 这里只是对象了
    for (p in obj) {
      if (obj.hasOwnProperty(p)) {
        count ++;
      }
    }

    return count;
  };


  /**
   * 一个空函数
   * 
   * 相当于很多框架里面的 noop
   */
  var emptyFunc = function () {};


  /**
   * 函数的重构方法
   * 
   * todo, 暂时不知道是什么意思
   * 
   * @param {Object} option 选项对象
   * @return {Function} 返回重构后的函数执行结果
   */
  var rebuild = function (func, option) {
    option = option || {};

    // 如果有这个属性的话, 就直接返回就好了
    // 没有的话就定义
    func.$$rebuildedFunc = func.$$rebuildedFunc || function () {
      // 先取到这个 this
      var self2 = this;
      var scope;
      var args;

      // 范围就是配置变量 option 里面的 contextObj 字段
      // 或者是 this
      scope = option.contextObj || self2;
      // 先取到 arguments, 其实转换成了数组了
      args = Array.prototype.slice.call(arguments, 0);

      if (args !== undefined) {
        args = args.concat(option.arguments);
      }

      // 如果说 event 字段为 false 的话, 就去掉第一个数组元素
      if (option.event === false) {
        args = args.slice(1);
      }

      return func.apply(scope, args);
    }

    return func.$$rebuildedFunc;
  };


  /**
   * 给函数传入参数并执行
   * 
   * @param {Mixed} args 参数列表
   * @return {Mixed} 返回函数执行的结果
   */
  var pass = function (func, var_args) {
    // 把 slice 方法先取出来
    var slice = Array.prototype.slice;

    // 把参数里面的 var_args 取出来
    var a = slice.call(arguments, 1);

    return function () {
      var context = this;
      // 传入参数并执行
      return func.apply(context, a.concat(slice.call(arguments)));
    };
  };


  /**
   * 将一个函数绑定给一个对象作为方法
   * 
   * @param {Function} 要绑定的函数
   * @param {Object} 要绑定的对象
   * @param {Mixed} args 参数列表
   * 
   * @return {Function} 返回被绑定 this 上下文对象函数
   * 
   * @exampleJx().$package(function (J) {
   *    funcB = J.bind(funcA, obj, a, b);
   *    funcB(c, d); // => funcA.call(obj, a, b, c, d);
   * });
   */
  var bind = function (func, context, var_args) {
    var slice = Array.prototype.slice;

    // 还是取到 var_args 的字段
    var a = slice.call(arguments, 2);

    return function () {
      return func.apply(context, a.concat(slice.call(arguments)));
    };
  };


  /**
   * 
   */
  var Class = function () {
    var length = arguments.length;

    // 最后一个参数当做是配置
    var option = arguments[length - 1];

    // option 里面的 init 方法
    option.init = option.init || function () {};

    // 参数中有要继承的父类
    if (length === 2) {
      // arguments[0] 的 extend 字段约定为继承的父类的名称
      var superClass = arguments[0].extend;

      // 搞一个新的构造函数
      var tempClass = function () {};
      tempClass.prototype = superClass.prototype;

      var subClass = function () {
        this.init.apply(this, arguments);
      };

      // 加一个对父类原型引用的静态属性
      subClass.superClass = superClass.prototype;


      // 如果父类有 func 的话, 会调用一下
      subClass.callSuper = function (context, func) {
        var slice = Array.prototype.slice;

        var a = slice.call(arguments, 2);

        // func => superClass.prototype.func
        var func = subClass.superClass[func];

        if (func) {
          func.apply(context, a.concat(slice.call(arguments)));
        }
      };

      // 指定原型
      subClass.prototype = new tempClass();

      // 指定构造函数
      subClass.prototype.constructor = subClass;

      // 把 subClass.prototype 和配置项 option 合在一起
      J.extend(subClass.prototype, option);

      // init 方法
      subClass.prototype.init = function () {
        option.init.apply(this, arguments);
      };

      return subClass;
      // 如果参数中没有父类, 则是单纯的构建一个类
    } else if (length === 1) {
      var newClass = function () {
        // 加了 return, 否则 init 的对象不生效
        return this.init.apply(this, arguments);
      };

      // 单纯的把 prototype 指向配置项
      newClass.prototype = option;
      return newClass;
    }
  };


});