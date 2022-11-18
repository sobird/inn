---
layout: page
title: JavaScript数组去重性能测试
date: 2012-04-28 +0800
---

<p>请去 <a href="https://sobird.me/javascript-array-unique-testing.htm">相关文章</a> 查看原文</p>
<p>请在下面的框中填写要测试数组长度, 注：设置的值不要太大哦，否则会死的！</p>
<p><input type="text" id="argLen" /> <button onclick="tester()">开始测试</button></p>
<p>该测试不包括jQuery_unique数组去重方法的测试</p>
<h4>测试结果将会在下面显示</h4>
<div id="result"></div>

<script type="text/javascript">
var result = document.getElementById('result');

function tester(){
  var argLen = document.getElementById('argLen');
  var l = parseInt(argLen.value);
  if(typeof l != 'number' || !l){
    alert('请填写正确的数组长度');
  }
  var html = '';
  var test_array = generateTestArray(l);
  var start = new Date().getTime();
  no_repeat_1(test_array);
  html += 'no_repeat_1()执行时间：' + (new Date().getTime() - start) + 'ms (这个方法是我首先想到的，效率一般般了)<br />';

  start = new Date().getTime();
  yui_uniq(test_array);
  html += 'yui_uniq()执行时间：' + (new Date().getTime() - start) + 'ms (这个方法是YUI中的数组去重方法)<br />';

  start = new Date().getTime();
  planabc_uniq(test_array);
  html += 'planabc_uniq()执行时间：' + (new Date().getTime() - start) + 'ms (这是怪飞博客里写的数组去重方法，性能最佳)<br />';

  start = new Date().getTime();
  no_repeat_2(test_array);
  html += 'no_repeat_2()执行时间：' + (new Date().getTime() - start) + 'ms (这是采用Array.indexOf()方法实现的，性能也太差了吧~~)<br />';

  var start = new Date().getTime();
  someone_uniq(test_array);
  html += 'someone_uniq()执行时间：' + (new Date().getTime() - start) + 'ms (这是我一同学实现的方法，性能很不错)<br />';

  var start = new Date().getTime();
  //@see https://github.com/wedteam/qwrap/blob/master/resource/js/core/dev/array.h.js
  qwrap_quicklyUnique(test_array);
  html += 'qwrap_quicklyUnique()执行时间：' + (new Date().getTime() - start) + 'ms (QWrap里的快速去重方法，详情见<a href="https://github.com/wedteam/qwrap/blob/master/resource/js/core/dev/array.h.js">此处</a>)<br />';

  result.innerHTML = html;
}

/**
 * 生成一个测试数组
 * 
 * @param {Number} len [数组长度]
 * @return {Array} [所生成的测试数组]
 */
function generateTestArray(len){
  if(typeof len != 'number'){
    return [];
  }
  var _testArg = [];
  for(var i = 0; i<len; i++){
    _testArg.push(Math.ceil(Math.pow(Math.random()*10, 3)));
  }
  return _testArg;
}

// ----------- my no_repeat ---------
/**
 * javascript数组去重方法
 * @param  {Array} arg [所要去重的数组]
 * @return {Array}     [去重后新的数组]
 */
function no_repeat_1(arg){
  var _arg = [];
  var _len = arg.length;
  for(var i = 0; i < _len; i++){
    if(in_array(arg[i], _arg, true)){
      continue;
    }
    _arg.push(arg[i]);
  }
  return _arg;
}

/**
 * 检查数组中是否存在某个值
 *
 * @param  {Mixed} needle [给定的某个元素]
 * @param  {Array} haystack [所要查找的数组]
 * @param  {Boolean} strict [如果为true 则会检查 needle 的类型是否和 haystack 中的相同]
 * @return {Boolean} [在 haystack 中搜索 needle ，如果找到则返回 TRUE，否则返回 FALSE]
 */
function in_array(needle, haystack, strict){
  if(typeof needle == undefined || typeof haystack == undefined){
    return false;
  }
  var len = haystack.length;
  for(var i = 0; i < len; i++){
    if(strict){
      if(needle === haystack[i]){
        return true;
      }
    } else {
      if(needle == haystack[i]){
        return true;
      }
    }
  }
  return false;
}

//---------- YUI ---------------
function toObject(a) {
  var o = {};
  for (var i = 0, j=a.length; i < j; i = i+1) {// 这里我调整了下, YUI源码中是i<a.length
    o[a[i]] = true;
  }
  return o;
};
function keys(o) {
  var a=[], i;
  for (i in o) {
    if (o.hasOwnProperty(i)) {// 这里, YUI源码中是lang.hasOwnProperty(o, i)
      a.push(i);
    }
  }
  return a;
};
function yui_uniq(a) {
  return keys(toObject(a));
};

// --------- planabc  -------------
function planabc_uniq(arr) {
  var a = [],
    o = {},
    i,
    v,
    cv, // corrected value
    len = arr.length;

  if (len < 2) {
    return arr;
  }

  for (i = 0; i < len; i++) {
    v = arr[i];

    /* closurecache 提供的函数中使用的是  cv = v + 0;，
     * 这样就无法辨别类似[1, 10, "1", "10"]的数组，
     * 因为运算后 => 1, 10, 10, 100，很明显，出现了重复的标示符。
     * 加前面就难道没问题吗？
     * 有的：数组中不能出现类似01 、001，以 0 开头的数字，
     * 但适用性比原先更广。
     */
    cv = 0 + v;

    if (!o[cv]) {
      a.push(v);
      o[cv] = true;
    }
  }
  return a;
}


if(!Array.prototype.indexOf) {
  Array.prototype.indexOf = function (obj, fromIndex) {
    if (fromIndex == null) {
      fromIndex = 0;
    } else if (fromIndex < 0) {
      fromIndex = Math.max(0, this.length + fromIndex);
    }

    for (var i = fromIndex; i < this.length; i++) {
      if (this[i] === obj)
        return i;
    }
    return -1;
  };
}

function no_repeat_2(arg){
  var _arg = [];
  for(var i = 0; i < arg.length; i++){
    if(_arg.indexOf(arg[i]) != -1){
      continue;
    }
    _arg.push(arg[i]);
  }
  return _arg;
}

// --- someone  renenglish--- 
function someone_uniq(a,strict){
  var o = {},
    arr = [],
    key;
  for(var i = 0; i < a.length; ++i){
    key = a[i];
    if(strict){
      if(typeof(a[i]) == 'number'){
        key = a[i]+'.number';
      }   
      if(typeof(a[i]) == 'string'){
        key = a[i]+'.string';
      }
    }   
    if(!o[key]){
      o[key] = true;
      arr.push(a[i]);
    }   
  }   
  return arr;
};

//jQuery中的数组去重方法，不太适于测试，性能啊性能，难道真的这么差吗?
function jquery_unique(arg){
  var arg = arg.sort();
  for ( var i = 1, j = arg.length; i < j; i++ ) {
    if ( arg[i] === arg[ i - 1 ] ) {
      arg.splice( i--, 1 );
    }
  }
  return arg;
}

//var start = new Date().getTime();
//jquery_unique(test_array);
//console.log(new Date().getTime() - start);
//
//
/*
  Copyright (c) Baidu Youa Wed QWrap
  version: $version$ $release$ released
*/

/*
 * @class ArrayH 核心对象Array的扩展
 * @singleton 
 * @namespace QW
 * @helper
 */
(function() {
  var ArrayH = {
    /*
     * 快速除重，相对于ArrayH.unique，为了效率，牺了代码量与严谨性。如果数组里有不可添加属性的对象，则会抛错.
     * @method quicklyUnique
     * @static
     * @param {array} arr 待处理数组
     * @return {array} 返回除重后的新数组
     */
    quicklyUnique: function(arr) {
      var strs = {},
        numAndBls = {},
        objs = [],
        hasNull,
        hasUndefined,
        ret = [];
      for (var i = 0, len = arr.length; i < len; i++) {
        var oI = arr[i];
        if (oI === null) {
          if (!hasNull) {
            hasNull = true;
            ret.push(oI);
          }
          continue;
        }
        if (oI === undefined) {
          if (!hasUndefined) {
            hasUndefined = true;
            ret.push(oI);
          }
          continue;
        }
        var type = typeof oI;
        switch (type) {
        case 'object':
        case 'function':
          if (!oI.__4QuicklyUnique) {
            oI.__4QuicklyUnique = true;
            ret.push(oI);
            objs.push(oI);
          }
          break;
        case 'string':
          if (!strs[oI]) {
            ret.push(oI);
            strs[oI] = true;
          }
        default:
          if (!numAndBls[oI]) {
            ret.push(oI);
            numAndBls[oI] = true;
          }
          break;
        }
      }
      for (i = 0; oI = objs[i++];) {
        if (oI instanceof Object) {
          delete oI.__4QuicklyUnique;
        } else {
          oI.__4QuicklyUnique = undefined;
        }
      }
      return ret;
    },
    /*
     * 快速排序，按某个属性，或按“获取排序依据的函数”，来排序.
     * @method soryBy
     * @static
     * @param {array} arr 待处理数组
     * @param {string|function} prop 排序依据属性，获取
     * @param {boolean} desc 降序
     * @return {array} 返回排序后的新数组
     */
    sortBy: function(arr, prop, desc) {
      var props = [],
        ret = [],
        i = 0,
        len = arr.length;
      if (typeof prop == 'string') {
        for (; i < len; i++) {
          var oI = arr[i];
          (props[i] = new String(oI && oI[prop] || ''))._obj = oI;
        }
      } else if (typeof prop == 'function') {
        for (; i < len; i++) {
          oI = arr[i];
          (props[i] = new String(oI && prop(oI) || ''))._obj = oI;
        }
      } else {
        throw '参数类型错误';
      }
      props.sort();
      for (i = 0; i < len; i++) {
        ret[i] = props[i]._obj;
      }
      if (desc) {ret.reverse(); }
      return ret;
    }
  };

  window['qwrap_quicklyUnique'] = ArrayH.quicklyUnique;

}());
</script>
