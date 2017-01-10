/**
 * browser 资料分析包
 */

Jx().$package(function (J) {
  J.browserOptions = {
    adjustBehaviors : true,
    htmlClass : true
  };

  // 取到 host, 并把这个 host 挂在 Jx.prototype 上面
  J.host = window.location.host;


  // 取到 navigator 里的 platform 字段
  // chrome 下 : "macintel"
  var pf = navigator.platform.toLowerCase();

  // 取到 navigator 里的 userAgent 字段
  // chrome 下 : "mozilla/5.0 (macintosh; intel mac os x 10_11_6) applewebkit/537.36 (khtml, like gecko) chrome/55.0.2883.95 safari/537.36"
  var ua = navigator.userAgent.toLowerCase();

  // 取到浏览器里的插件
  // 返回的是一个 PluginsArray
  var plug = navigator.plugins;

  // 一波还不知道干啥的变量声明...
  var platform, browser, engin, toFixedVersion, s;

  /**
   * 在把 ver 进行处理
   * 
   * @param ver 待处理的 version
   * @param floatLength 看要保留几位小数
   */
  toFixedVersion = function (ver, floatLength) {
    // 把 ver 里的下划线全都变成 .
    ver = ('' + ver).replace(/_/g, '.');

    // 取到 floatLength, 默认为 1
    floatLength = floatLength || 1;

    ver = String(ver).split('.');
    
    // 1 -> 1.0, 1.5 => 1.5, 1.67 => 1.67
    // 总之就是整数的情况就补 .0 
    ver = ver[0] + '.' + (ver[1] || '0')

    // 通过 floatLength 来确定小数点转移的位置
    ver = Number(ver).toFixed(floatLength);

    // 最后把处理之后的 ver 返回
    return ver;
  };

  /**
   * platform 名字空间
   */
  platform = {
    // 得到 navigator.platform.toLowerCase()
    getPlatform : function () {
      return pf;
    },

    /**
     * 操作系统的名称
     */
    name : (window.orientation != undefined) ? 'iPod' : (pf.match(/mac|win|linux/i) || ['unknown'])[0],

    version : 0,

    // 一大波操作系统的版本号, 0 表示不是该系统
    ipod : 0,

    iPad : 0,

    iPhone : 0,

    android : 0,

    win : 0,

    linux : 0,

    mac : 0,

    // 设置浏览器的类型和版本
    set : function (name, ver) {
      this.name = name;
      this.version = ver;
      this[name] = ver;
    }
  };

  platform[platform.name] = true;

  // 探测操作系统版本
  // 这里就是各种 match, 然后把 match 到的东西通过 platform 的 set 方法把版本号添加上
  // todo 这里该总结一下对操作系统的嗅探
  (s = ua.match(/windows ([\d.]+)/)) ? platform.set("win",toFixedVersion(s[1])):
  (s = ua.match(/windows nt ([\d.]+)/)) ? platform.set("win",toFixedVersion(s[1])):
  (s = ua.match(/linux ([\d.]+)/)) ? platform.set("linux",toFixedVersion(s[1])) :
  (s = ua.match(/mac ([\d.]+)/)) ? platform.set("mac",toFixedVersion(s[1])):
  (s = ua.match(/ipod ([\d.]+)/)) ? platform.set("iPod",toFixedVersion(s[1])):
  (s = ua.match(/ipad[\D]*os ([\d_]+)/)) ? platform.set("iPad",toFixedVersion(s[1])):
  (s = ua.match(/iphone ([\d.]+)/)) ? platform.set("iPhone",toFixedVersion(s[1])):
  (s = ua.match(/android ([\d.]+)/)) ? platform.set("android",toFixedVersion(s[1])) : 0;


  browser = {
    features : {
      /**
       * @property xpatch
       */
      xpatch : !!(document.evaluate),
      /**
       * @property air
       */
      air : !!(window.runtime),
      /**
       * @property query
       */
      query : !!(window.querySelector)
    },

    /**
     * 获取浏览器的插件信息
     */
    getPlugins : function () {
      return plug;
    },

    /**
     * 插件, 这里就只列举了 flash
     */
    plugins : {
      flash : (function () {
        var ver = 0;

        // 防止报错
        if (plug && plug.length) {
          // chrome 下可以找得到...
          var flash = plug['Shockwave Flash'];
          if (flash && flash.description) {
            ver = toFixedVersion(flash.description.match(/\b(\d+)\.\d+\b/)[1], 1) || ver;
          } else {
            var startVer = 13;
            while (startVer --) {
              /**
               * fuck ie
               */
              try {
                new ActiveXObject('ShockwaveFlash.ShockwaveFlash.' + startVer);
                ver = toFixedVersion(startVer);
                break;
              } catch(e) {}
            }
          }
        }
        return ver;
      })()
    },

    /**
     * 获取浏览器的 userAgent 信息
     */
    getUserAgent : function () {
      return ua;
    },

    /**
     * 用户使用的浏览器的名称, 如 : chrome
     */
    name : 'unknown',

    /**
     * 浏览器的版本
     */
    version : 0,

    /**
     * 用户使用的浏览器的版本号, 如果是 0 表示不是此浏览器
     */
    ie : 0,
    
    firefox : 0,

    chrome : 0,

    opera : 0,

    safari : 0,

    mobileSafari : 0,

    adobeAir : 0,

    set : function (name, ver) {
      this.name = name;
      this.version = ver;
      this[name] = ver;
    }
  };

  // 探测浏览器并存入 browser 对象
  // 这里我觉得作者很巧妙的就是, 刚开始都是初始化, 后面再进行正则匹配, 通过对象里面暴露出来的 set 方法去对里面的相应信息进行修改
  // 学习了。。
  (s = ua.match(/msie ([\d.]+)/)) ? browser.set("ie",toFixedVersion(s[1])):
  (s = ua.match(/firefox\/([\d.]+)/)) ? browser.set("firefox",toFixedVersion(s[1])) :
  (s = ua.match(/chrome\/([\d.]+)/)) ? browser.set("chrome",toFixedVersion(s[1])) :
  (s = ua.match(/opera.([\d.]+)/)) ? browser.set("opera",toFixedVersion(s[1])) :
  (s = ua.match(/adobeair\/([\d.]+)/)) ? browser.set("adobeAir",toFixedVersion(s[1])) :
  (s = ua.match(/version\/([\d.]+).*safari/)) ? browser.set("safari",toFixedVersion(s[1])) : 0;

  // mobile safari 判断
  (s = ua.match(/version\/([\d.]+).*mobile.*safari/)) ? browser.set("mobileSafari",toFixedVersion(s[1])) : 0;
  if(platform.iPad) browser.set('mobileSafari', '0.0');

  // 是 ie 的话
  if (browser.ie) {
    if (!document.documentMode) document.documentMode = Math.floor(browser.ie);
    else if (document.documentMode !== Math.floor(browser.ie)) browser.set('ie', document.documentMode);
  }


  /**
   * engine 名字空间
   */

  engine = {
    /**
     * 浏览器的引擎名字
     */
    name : 'unknown',

    version : 0,

    /**
     * 引擎版本, 0 表示不是这个引擎
     */

    trident : 0,

    gecko : 0,

    webkit : 0,

    presto : 0,

    // 设置浏览器引擎的类型和版本
    set : function (name, ver) {
      this.name = name;
      this.version = ver;
      this[name] = ver;
    }
  };

  // 探测浏览器内核并存入 browser.engine 对象里面
  (s = ua.match(/trident\/([\d.]+)/)) ? engine.set("trident",toFixedVersion(s[1])):
  (s = ua.match(/gecko\/([\d.]+)/)) ? engine.set("gecko",toFixedVersion(s[1])) :
  (s = ua.match(/applewebkit\/([\d.]+)/)) ? engine.set("webkit",toFixedVersion(s[1])) :
  (s = ua.match(/presto\/([\d.]+)/)) ? engine.set("presto",toFixedVersion(s[1])) : 0;

  // ie 6 内核 trident 版本为 4.0
  // ie 7&8 内核 trident 版本为 5.0
  if (browser.ie) {
    if (browser.ie == 6) {
      engine.set('trident', toFixedVersion('4'));
    } else if (browser.ie == 7 || browser.ie == 8) {
      engine.set('trident', toFixedVersion('5'));
    }
  }


  /**
   * 调整浏览器行为
   */
  var adjustBehaviors = function () {
    // ie6 背景图片不能被缓存的问题
    // 不懂这里。。但是 fuck ie
    try {
      document.execCommand('BackgroundImageCache', false, true);
    } catch (e) {}
  };

  if (J.browserOptions.adjustBehaviors) {
    adjustBehaviors();
  }

  var filterDot = function (string) {
    // again.amnhh => again_amnhh
    return String(string).replace(/\./gi, '_');
  };

  // 给 html 标签添加不同浏览器的参数 className
  // 这种新加 className 的方式有点好玩。。
  // 原来的做法是 element.className += xxx
  // 利用数组的队列貌似不错
  // todo 这里总结一下
  var addHTMLClassName = function () {
    var htmlTag = document.documentElement;
    var htmlClassName = [htmlTag.className];

    htmlClassName.push('javascriptEnabled');
    htmlClassName.push(platform.name);
    htmlClassName.push(platForm.name + filterDot(platform.version));
    htmlClassName.push(browser.name);
    htmlClassName.push(browser.name + filterDot(browser.version));
    
    if (document.documentMode) {
      htmlClassName.push('documentMode_' + document.documentMode);
    }

    htmlClassName.push(engine.name);
    htmlClassName.push(engine.name + filterDot(engine.version));

    if (browser.plugins.flash) {
      htmlClassName.push('flash');
      htmlClassName.push('flash' + filterDot(browser.plugins.flash));
    }

    if (typeof (window['webTyp']) !== 'undefined' && window['webTop']) {
      htmlClassName.push('webTop');
    }

    htmlTag.className = htmlClassName.join(' ');
  };

  if (J.browserOptions.htmlClass) {
    addHTMLClassName();
  }

  // 最后给 Jx 添加一下扩展
  J.platform = platform;
  J.browser = browser;
  J.browser.engine = engine;

});