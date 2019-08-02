/*入口函数特性
  1.传入''，null，undefined，NAN，0，false，都返回空的JQuery对象
  2.传入字符串：
    如果是代码片段：则会创建好dom后存储到JQuery中并返回
    如果是选择器：会将所有匹配到的dom存入Jquery中并返回
  3.数组：无论是数组还是伪数组，都会将数组中的每项存入JQuery对象中并返回
  4.除上述外的其他数据类型：存入到JQuery对象中并返回
*/

(function (window, undefined) {

  function JQuery(selector) {
    return new JQuery.prototype.init(selector);
  }

  JQuery.prototype = {
    constructor: JQuery,
    init: function (selector) {
      // 传入''，null，undefined，NAN，0，false，都返回空的JQuery对象
      if (!selector) return this;

      // 传入字符串：
      if (JQuery.isString(selector)) {
        if (JQuery.isHtml(selector)) {
          // 如果是代码片段：则会创建好dom后存储到JQuery中并返回
          var div = document.createElement('div');
          div.innerHTML = selector;

          Array.prototype.push.apply(this, div.children);
          return this;
        } else {
          // 如果是选择器：会将所有匹配到的dom存入Jquery中并返回
          var domList = document.querySelectorAll(selector);
          [].push.apply(this, domList);
          return this;
        }
      }

      //传入的是数组，无论是真数组还是伪数组，都会将数组中的每项存入JQuery对象中并返回
      if (JQuery.isArray(selector)) {
        //由于IE8及以下版本的push.apply()中第二个参数如果是自定义伪数组则会报错
        //为了兼容性，统一转为真数组后再转换成伪数组
        var tempArr = [].slice.apply(selector);
        [].push.apply(this, tempArr);
        return this;
      }

      if (JQuery.isFunction(selector)) {
        return JQuery.ready(selector);
      }

      //其他数据类型
      this[0] = selector;
      this.length = 1;
      return this;
    },
    jquery: '1.1.0',
    selector: '',
    length: 0,
    push: [].push,
    slice: [].slice,
    sort: [].sort,
    toArray: function () {
      return [].slice.apply(this);
    },
    get: function (index) {
      if (arguments.length === 0) return [].slice.apply(this);

      if (index >= 0) {
        return this[index];
      } else {
        return this[index + this.length];
      }
    },

    eq: function (index) {
      if (arguments.length === 0) return new JQuery();

      return JQuery(this.get(index));
    },

    each: function (fn) {
      JQuery.each(this, fn);
    },
    map: function (fn) {
      return JQuery.map(this, fn);
    },
    appendTo: function (target) {
      var $target = $(target);
      var $this = this;
      var res = [];
      $target.each(function (index, item) {
        var targetElem = item;
        $this.each(function (k, v) {
          if (index == 0) {
            res.push(targetElem.appendChild(v));
          } else {
            res.push(targetElem.appendChild(v.cloneNode(true)));
          }
        })
      })
      return $(res);
    },
    prependTo: function (target) {
      var $target = $(target);
      var $this = this;
      var res = [];
      $target.each(function (index, item) {
        var theFirstChild = item.firstChild;
        var targetElem = item;
        $this.each(function (k, v) {
          if (index == 0) {
            res.push(targetElem.insertBefore(v, theFirstChild));
          } else {
            res.push(targetElem.insertBefore(v.cloneNode(true), theFirstChild));
          }
        })
      })
      return $(res);
    },
    append: function (source) {
      if (JQuery.isFunction(source)) {
        this.each(function (index, item) {
          var html = source(index, item.innerHTML);
          $(html).appendTo(this);
        })
      } else if (JQuery.isString(source)) {
        this.each(function (index, item) {
          item.innerHTML += source;
        })
      } else {
        var $source = $(source);
        $source.appendTo(this);
      }
      return this;
    },
    prepend: function (source) {
      if (JQuery.isFunction(source)) {
        this.each(function (index, item) {
          var html = source(index, item.innerHTML);
          $(html).prependTo(this);
        })
      } else if (JQuery.isString(source)) {
        this.each(function (index, item) {
          item.innerHTML += source;
        })
      } else {
        var $source = $(source);
        $source.prependTo(this);
      }
      return this;
    },
    replaceAll: function (selector) {
      var $replaceElem = $(selector);
      var $this = this;
      var res = [];
      $replaceElem.each(function (k, v) {
        var parentNode = v.parentNode;
        var nextSibling = v.nextSibling;
        parentNode.removeChild(v);
        $this.each(function (index, item) {
          if (k === 0) {
            res.push(parentNode.insertBefore(item, nextSibling));
          } else {
            res.push(parentNode.insertBefore(item.cloneNode(true), nextSibling));
          }
        })
      })
      return $(res);
    },
    css: function () {
      var $replaceElem = $(selector);
      var $this = this;
      var res = [];
      $replaceElem.each(function (k, v) {
        var parentNode = v.parentNode;
        var nextSibling = v.nextSibling;
        parentNode.removeChild(v);
        $this.each(function (index, item) {
          if (k === 0) {
            res.push(parentNode.insertBefore(item, nextSibling));
          } else {
            res.push(parentNode.insertBefore(item.cloneNode(true), nextSibling));
          }
        })
      })
      return $(res);
    }

  }
  JQuery.extend = JQuery.prototype.extend = function (obj) {
    for (var key in obj) {
      this[key] = obj[key];
    }
  }

  //DOM操作相关
  JQuery.prototype.extend({
    empty: function () {
      this.each(function (index, item) {
        item.innerHTML = '';
      })
      return this;
    },
    html: function (context) {
      if (arguments.length === 0) {
        return this[0].innerHTML;
      } else {
        this.each(function (index, item) {
          item.innerHTML = context;
        })
      }
    },
    attr: function (name, value) {
      if (arguments.length === 1) {
        if (JQuery.isObject(name)) {
          JQuery.each(name, function (k, v) {
            v.setAttribute(k, v);
          })
        } else {
          return this[0].getAttribute(name);
        }
      } else {
        this.each(function (k, v) {
          v.setAttribute(name, value);
        })
      }
      return this;
    },
    prop: function (name, value) {
      if (arguments.length === 1) {
        if (JQuery.isObject(name)) {
          JQuery.each(name, function (k, v) {
            v[k] = v;
          })
        } else {
          return v[name];
        }
      } else {
        this.each(function (k, v) {
          v[name] = value;
        })
      }
      return this;
    },
    on: function (name, handler) {
      this.each(function (index, elem) {

        //判断有无事件缓存，无则创建
        if (!elem.eventCache) {
          elem.eventCache = {};
        }

        //判断事件缓存对象中有无相应事件的缓存数组，无则创建
        if (!elem.eventCache[name]) {
          elem.eventCache[name] = [];

          //绑定相应的事件处理函数
          if (elem.addEventListener) {
            elem.addEventListener(name, function (e) {
              $.each(elem.eventCache[name], function (index, item) {
                item.call(elem, e);
              })
            })
          } else if (elem.attachEvent) {
            elem.attachEvent(`on${name}`, function (e) {
              for (var i = elem.eventCache[name].length - 1; i >= 0; i--) {
                elem.eventCache[name][i].call(elem, e);
              }
            })
          }
        }

        //往响应事件缓存里面添加处理函数
        elem.eventCache[name].push(handler);
      })
    }
  })

  JQuery.extend({
    //判断是否字符串
    isString: function (str) {
      return typeof (str) === 'string';
    },

    //判断是否是html代码片段
    isHtml: function (str) {
      if (str.trim) {
        str.trim();
      } else {
        //IE8及以下浏览器无trim，使用正则表达式来代替
        str.replace(/^\s+|\s$/g, '');
      }
      return str.charAt(0) === '<' && str.charAt(str.length - 1) === '>' && str.length >= 3;
    },

    isObject: function (selector) {
      return typeof selector === 'object';
    },

    isWindow: function (selector) {
      return selector != null && selector === window;
    },

    isFunction: function (selector) {
      return selector != null && typeof (selector) === 'function';
    },
    isArray: function (selector) {
      return JQuery.isObject(selector) && 'length' in selector && !JQuery.isWindow(selector);
    },

    ready: function (fn) {
      if (document.readyState === 'complete') {
        fn;
      } else if (document.addEventListener) {
        document.addEventListener('DOMContentLoaded', fn);
      } else if (document.attachEvent) {
        // IE <= 8
        document.attachEvent('onreadystatechange', function () {
          if (document.readyState === 'complete') {
            fn();
          }
        })
      }
    },

    each: function (obj, fn) {
      if (obj == null) return;

      if (JQuery.isArray(obj)) {
        //数组处理
        for (var i = 0; i < obj.length; i++) {
          var ret = fn.call(obj[i], i, obj[i]);
          if (ret === true) {
            continue;
          } else if (ret === false) {
            break;
          }
        }
      } else {
        //对象处理
        for (var key in obj) {
          var ret = fn.call(obj[key], key, obj[key]);
          if (ret === true) {
            continue;
          } else if (ret === false) {
            break;
          }
        }
      }
    },

    map: function (obj, fn) {
      var res = [];
      var temp = null;
      if (JQuery.isArray(obj)) {
        for (var i = 0; i < obj.length; i++) {
          temp = fn.call(obj[i], i, obj[i]);
          if (temp != null) {
            res.push(temp);
          }
        }
      } else {
        for (var key in obj) {
          temp = fn.call(obj[key], key, obj[key]);
          if (temp != null) {
            res.push(temp);
          }
        }
      }
      return res;
    },
  })



  JQuery.prototype.init.prototype = JQuery.prototype;
  window.JQuery = window.$ = JQuery;

})(window, undefined)