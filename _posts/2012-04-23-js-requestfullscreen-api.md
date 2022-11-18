---
layout: page
title: JavaScript全屏API演示
date: 2012-04-23 +0800
---

<style type="text/css">
.case{
  background:#f0f0f0;
  border:2px solid #fff;
  box-shadow: 0 0 2px gray;
  padding: 20px;
}
.case>div{
  background:#ddd;
  border-radius:5px;
  border:1px solid #fff;
  box-shadow: 0 0 2px #ddd;
  padding: 10px;
  overflow-x: auto;
  margin-bottom:20px;
}
</style>

<div class="section clearfix">
    <div id="fullscreen">
      <div class="case">
        <div id="status"></div>
        <button id="isgofullScreen">进入全屏</button>
      </div>
    </div>
</div>

<p></p>

<a href="https://sobird.me/js-requestfullscreen-api.htm">回到相关文章</a>

<script type="text/javascript">
/* 
Native FullScreen JavaScript API
-------------
Assumes Mozilla naming conventions instead of W3C for now
*/

(function() {
  var fullScreenApi = {
    supportsFullScreen: false,
    isFullScreen: function() {
      return false;
    },
    requestFullScreen: function() {},
    cancelFullScreen: function() {},
    fullScreenEventName: '',
    prefix: ''
  },
    browserPrefixes = 'webkit moz o ms khtml'.split(' ');

  // check for native support
  if (typeof document.cancelFullScreen != 'undefined') {
    fullScreenApi.supportsFullScreen = true;
  } else {
    // check for fullscreen support by vendor prefix
    for (var i = 0, il = browserPrefixes.length; i < il; i++) {
      fullScreenApi.prefix = browserPrefixes[i];

      if (typeof document[fullScreenApi.prefix + 'CancelFullScreen'] != 'undefined') {
        fullScreenApi.supportsFullScreen = true;

        break;
      }
    }
  }

  // update methods to do something useful
  if (fullScreenApi.supportsFullScreen) {
    fullScreenApi.fullScreenEventName = fullScreenApi.prefix + 'fullscreenchange';

    fullScreenApi.isFullScreen = function() {
      switch (this.prefix) {
      case '':
        return document.fullScreen;
      case 'webkit':
        return document.webkitIsFullScreen;
      default:
        return document[this.prefix + 'FullScreen'];
      }
    }
    fullScreenApi.requestFullScreen = function(el) {
      return (this.prefix === '') ? el.requestFullScreen() : el[this.prefix + 'RequestFullScreen']();
    }
    fullScreenApi.cancelFullScreen = function(el) {
      return (this.prefix === '') ? document.cancelFullScreen() : document[this.prefix + 'CancelFullScreen']();
    }
  }

  // jQuery plugin
  if (typeof jQuery != 'undefined') {
    jQuery.fn.requestFullScreen = function() {

      return this.each(function() {
        var el = jQuery(this);
        if (fullScreenApi.supportsFullScreen) {
          fullScreenApi.requestFullScreen(el);
        }
      });
    };
  }

  // export api
  window.fullScreenApi = fullScreenApi;
})();

var fullscreen = document.getElementById('fullscreen');
var _status = document.getElementById('status');
var btn = document.getElementById('isgofullScreen');

if (window.fullScreenApi.supportsFullScreen) {
  _status.innerHTML = '恭喜！您的浏览器支持Javascript原生全屏API，<br /> 单击下面的按钮即可进入全屏模式';
  
  var noFullscreen = function(){
    window.fullScreenApi.cancelFullScreen(fullscreen);
    removeDomListener(btn, 'click',noFullscreen);
    addDomListener(btn, 'click',goFullscreen);
    _status.innerHTML = '你已经退出全屏，<br />点击下面的按钮可以进入全屏';
    btn.innerHTML = '进入全屏';
  };

  var goFullscreen = function(){
    window.fullScreenApi.requestFullScreen(fullscreen);
    removeDomListener(btn, 'click',goFullscreen);
    addDomListener(btn, 'click',noFullscreen);
    _status.innerHTML = '你已经进入全屏模式，<br />点击下面的按钮可以退出全屏';
    btn.innerHTML = '退出全屏';
  };
  addDomListener(btn, 'click',goFullscreen);
} else {
  _status.innerHTML = '抱歉！您的浏览器不支持Javascript原生全屏API,<br /> 你需要Safari 5.1+, Chrome Canary, or Firefox Nightly Firefox10+浏览器才能支持该API';
  btn.parentNode.removeChild(btn);
}











//----------------------------------------------------------------
/**
 * 跨浏览器事件处理程序
 * 
 * @param {Element} instance  [Dom元素对象]
 * @param {String} eventName [事件类型名称]
 * @param {Function} handler   [函数句柄]
 * @param {Boolean} capture   [是否使用事件捕获模式]
 */
function addDomListener (instance, eventName, handler, useCapture){
  if (instance.addEventListener) {
    //DOM2级事件处理程序
    instance.addEventListener(eventName, handler, useCapture);
  } else if (instance.attachEvent){
    instance.attachEvent('on' + eventName, handler);
  } else {
    //DOM0级事件处理程序
    instance['on' + eventName] = handler;
  }
}


//----------------------------------------------------------------
/**
 * 跨浏览器事件处理程序
 * 
 * @param {Element} instance  [Dom元素对象]
 * @param {String} eventName [事件类型名称]
 * @param {Function} handler   [函数句柄]
 * @param {Boolean} capture   [是否使用事件捕获模式]
 */
function removeDomListener (instance, eventName, handler, useCapture){
  if (instance.removeEventListener) {
    //DOM2级事件处理程序
    instance.removeEventListener(eventName, handler, useCapture);
  } else if (instance.detachEvent){
    instance.detachEvent('on' + eventName, handler);
  } else {
    //DOM0级事件处理程序
    instance['on' + eventName] = null;
  }
}
</script>
