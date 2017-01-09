;(function (tn) {
  var verson = '1.0.%Version%',

    // 就是一个判断 namespace 相关的 tag 
    mark = 'JxMark',
    // 顶层命名空间
    topNamespace = tn,
    // 把顶层命名空间中存在的 Jx 对象引入
    Jx = topNamespace.Jx,
    
    // 放版本的 obj
    VERSIONS = {},

    // 放扩展的 obj
    PACKAGES = {},

    DEBUG = {
      NO_DEBUG : 0,
      SHOW_ALL : 1
    },

    option = {
      debug : 1
    },

    // 输出 method
    out = function (msg, tag, type) {
      // 先把 msg 字符串化
      msg = String(msg);

      if (option.debug) {
        if (this.console) {
          if (this.console.out) {
            // console.out 原生没有支持, 至于是不是 Jx 的扩展, 还需要后面去看
            this.console.out(msg, tag, type);
          } else {
            alert(msg + ' - 消息类型[' + type + ']');
          }
        }
      }

      return msg;
    };

  try {
    // 检测 Jx 名字空间是不是已经存在
    // 这里后半段检测给人的感觉就像是 window 一样
    // jq 里面对 window 的检测就是 obj != null && obj.window === obj;
    if (typeof Jx === 'undefined' || (Jx.mark && Jx.mark === mark)) {
      if (Jx) {
        // 如果已经有 Jx 对象, 则记录已有的信息
        VERSIONS = Jx.VERSIONS;
        PACKAGES = Jx.PACKAGES;
      }

      /**
       * Jx 对象原型
       * 
       * @constructor Jx
       * 
       * @param {Number} ver 要使用的 Jx 版本号
       * @param {Boolean} 标示是否要创建一个新的 Jx 实例, 默认为 false, 全局只唯一一个实例 => 除非特殊需要, 否则一般不会创建新的 Jx 实例
       * 
       * @return {Object} 返回对应版本的 Jx 对象
       * 
       */

      Jx = function (ver, isCreateNew) {
        var J = this;
        
        // 对 instanceof 进行了一道封装
        var instanceOf = function (o, type) {
          return (o && o.hasOwnProperty && (o instanceof type));
        }

        if (isCreateNew) {
          // 如果 J 不是 Jx 的实例
          // 也就是说现在是第一次执行
          // 则初始化对象
          if (!(instanceOf(J, Jx))) {
            J = new Jx(ver);
          } else {
            // 否则就调用 _init 方法
            J._init();
          }
        } else {
          // 这里就是不新建的了
          if (ver) {
            // 先字符串化
            ver = String(ver);

            try {
              if (Jx.VERSONS[ver]) {
                J = Jx.VERSONS[ver];
              } else {
                J = Jx.VERSONS[Jx.DEFAULT_VERSION];
                throw new Error('没有找到 JET verson' + ver + ', 所以返回默认版本 JET version' + Jx.DEFAULT_VERSION + '!');
              }
            } catch (e) {
              J.out('A.错误 : [' + e.name + '] ' + e.message + ', ' + e.fileName + ', 行号 : ' + e.lineNumber + '; stack : ' + typeof e.stack, 2);

            }

          } else {
            J = Jx.VERSIONS[Jx.DEFAULT_VERSION];
          }
        }

        return J;
      }

      Jx.prototype = {
        version : version,

        DEBUG : DEBUG,

        /**
         * Jx 配置
         */
        option : option,

        /**
         * Jx 的初始化方法
         */
        _init : function () {
          this.constructor = Jx;
        },


        /**
         * 创建一个命名空间, 创建的命名空间将会在 window 的根目录下
         * 
         * 可以一次性创建很多的命名空间, 以 xxx.yyy 来传入
         * 
         * J.$namespace('xxx.yyy') => var xxx = {}; xxx.yyy ={}
         */
        $namespace : function (name) {
          // 如果什么都不传的话, 默认返回顶层命名空间
          if (!name) {
            return topNamespace;
          }

          name = String(name);

          var i;
          var ni;
          var nis = name.split('.');
          var ns = topNamespace;

          for (i = 0; i < nis.length; i ++) {
            ni = nis[i];
            ns[ni] = ns[ni] || {};
            ns = ns[nis[i]];
          }

          return ns;
        },

        /**
         * 创建一个 js 代码包
         */
        $package : function () {
          var name = arguments[0];
          var fnc = arguments[arguments.length - 1];
          var ns = topNamespace;
          var returnValue;

          // 如果说 func 就是一个 function 的话
          if (typeof func === 'function') {
            if (typeof name === 'string') {
              ns = this.$namespace(name);
              if (Jx.PACKAGES[name]) {

              } else {
                Jx.PACKAGES[name] = {
                  isLoaded : true,
                  // 初始为 undefined
                  returnValue : returnValue
                }
              }
              // 如果说直接就是一个 object 的话, 就不用我们再去调用 $namespace 方法了
            } else if (typeof name === 'object') {
              ns = name;
            }

            returnValue = func.call(ns, this);
            typeof name === 'string' && (Jx.PACKAGES[name].returnValue = returnValue);
          } else {
            // 最后一个参数必须是 function
            throw new Error('Function required');
          } 

        },

        /**
         * 检测是不是有了这个 js 包
         * 
         * @param {String} 包名
         * @return {Object} 如果已经加载则返回包对象, 否则返回 undefined 
         */ 
        checkPackage : function (name) {
          return Jx.PACKAGES[name];
        },

        out : out,

        // 一大段 debug 相关
        debug : function () {},

        profile : function () {},

        error : function () {},

        warn : function () {},


        // 返回当前的时间戳
        startTime : +new Date(),

        /**
         * 关于 Jx
         * 
         * @return 返回 Jx 的 about 信息
         */
        about : function () {
          return this.out('JET (Javascript Extend Tools) \n version : ' + this.version + '\n\nCopyright (c) 2009, All rights reserved.');
        },

        toString : function () {
          return 'JET version' + this.version + '!';
        }
      };

      
      /**
       * Jx 版本库对象
       */
      Jx.VERSIONS = VERSIONS;


      /**
       * 记录加载的包的对象
       */
      Jx.PACKAGES = PACKAGES;


      /**
       * 创建一个当前版本的 Jx 实例
       */
      Jx.VERSIONS[version] = new Jx(version, true);


      /**
       * Jx 的默认版本号
       */

      Jx.DEFAULT_VERSION = version;

      /**
       * Jx 对象验证标记
       */
      Jx.mark = mark;

      topNameSpace.Jet = topNamespace.Jx = Jx;


    } else {
      throw new Error('"Jx" name is defined in other javascript code !!!');
    }
  } catch (e) {

    // 微内核初始化失败，输出出错信息
    out("JET 微内核初始化失败! " + "B.错误：[" + e.name + "] "+e.message+", " + e.fileName+", 行号:"+e.lineNumber+"; stack:"+typeof e.stack, 1);
  }

    
})(this);