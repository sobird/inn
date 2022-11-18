---
layout: post
title: mouseenter和mouseleave事件演示
date: 2012-04-21 +0800

CustomVariables: 这是自定义变量，可通过{{page.CustomVariables}}来调佣。
---

<script type="text/javascript" src="https://www.unpkg.com/jquery@3.6.1/dist/jquery.js"></script>

<style type="text/css">
.case{
  background:#f0f0f0;
  border:2px solid #fff;
  box-shadow: 0 0 2px gray;
}
.case>div{
  background:#ddd;
  margin: 20px;
  height:50px;
  border-radius:5px;
  border:1px solid #fff;
  box-shadow: 0 0 2px #ddd;
  padding: 0 10px;
  overflow-x: auto;
  text-align:center;
  padding-top:20px;
}
</style>



注：除 IE 系列支持 mouseenter 和 mouseleave 事件外，opera11+ 、firefox10+也支持 mouseenter 和 mouseleave 事件，同时它们也成为 w3c DOM3 Event 的规范，其他浏览器(chrome、opera)不支持。

jQuery 对这两个事件做了兼容，效果可参见页面最下方的测试效果。

## HTML 事件处理程序

<div class="case" onmouseenter="mouseenter(this)" onmouseleave="mouseleave(this)">
  <div>mouseenter 和 mouseleave</div>
</div>

{% highlight html %}
<div class="case" onmouseenter="mouseenter(this)" onmouseleave="mouseleave(this)">
  <div>mouseenter 和 mouseleave</div>
</div>
{% endhighlight %}

<div class="case" onmouseover="mouseover(this)" onmouseout="mouseout(this)">
  <div>mouseover 和 mouseout</div>
</div>

```html
<div class="case" onmouseover="mouseover(this)" onmouseout="mouseout(this)">
  <div>mouseover 和 mouseout</div>
</div>
```

## DOM0级事件处理程序

<div id="me_1" class="case">
  <div>mouseenter 和 mouseleave</div>
</div>

```js
var me_1 = document.getElementById('me_1');
me_1.onmouseenter = function(e){
  mouseenter(this);
}
me_1.onmouseleave = function(e){
  mouseleave(this);
}
```

<div id="mo_1" class="case" >
  <div>mouseover 和 mouseout</div>
</div>

```js
var mo_1 = document.getElementById('mo_1');
mo_1.onmouseover = function(e){
  mouseover(this);
}
mo_1.onmouseout = function(e){
  mouseout(this);
}
```

## DOM2级事件处理程序

<div id="me_2" class="case">
  <div>mouseenter 和 mouseleave</div>
</div>

```js
var me_2 = document.getElementById('me_2');
addDomListener(me_2, 'mouseenter', function(e){
  var _self = this;
  if(_self === window){
    _self = me_2;
  }
  mouseenter(_self);
});
addDomListener(me_2, 'mouseleave', function(e){
  var _self = this;
  if(_self === window){
    _self = me_2
  }
  mouseleave(_self);
});
```

<div id="mo_2" class="case">
  <div>mouseover 和 mouseout</div>
</div>

```js
var mo_2 = document.getElementById('mo_2');
addDomListener(mo_2, 'mouseover', function(e){
  var _self = this;
  if(_self === window){
    _self = mo_2
  }
  mouseover(_self);
});
addDomListener(mo_2, 'mouseout', function(e){
  var _self = this;
  if(_self === window){
    _self = mo_2
  }
  mouseout(_self);
});
```

## jQuery的hover，mouseenter，mouseleave事件

<div id="me_3" class="case">
  <div>mouseenter 和 mouseleave</div>
</div>

```js
$('#me_3').mouseenter(function(e){
  mouseenter(this);
}).mouseleave(function(){
  mouseleave(this);
});
```

<div id="mo_3" class="case">
  <div>mouseover 和 mouseout</div>
</div>

```js
$('#mo_3').mouseover(function(e){
  mouseover(this);
}).mouseout(function(){
  mouseout(this);
});
```

<a href="https://sobird.me/mouseenter-mouseleave.htm">返回相关文章</a>

<script type="text/javascript">
var _elemt = null;
var _numbe = 0;

//
var me_1 = document.getElementById('me_1');
me_1.onmouseenter = function(e){
  mouseenter(this);
}
me_1.onmouseleave = function(e){
  mouseleave(this);
}

//
var mo_1 = document.getElementById('mo_1');
mo_1.onmouseover = function(e){
  mouseover(this);
}
mo_1.onmouseout = function(e){
  mouseout(this);
}

//
var me_2 = document.getElementById('me_2');
addDomListener(me_2, 'mouseenter', function(e){
  var _self = this;
  if(_self === window){
    _self = me_2;
  }
  mouseenter(_self);
});
addDomListener(me_2, 'mouseleave', function(e){
  var _self = this;
  if(_self === window){
    _self = me_2
  }
  mouseleave(_self);
});

//
var mo_2 = document.getElementById('mo_2');
addDomListener(mo_2, 'mouseover', function(e){
  var _self = this;
  if(_self === window){
    _self = mo_2
  }
  mouseover(_self);
});
addDomListener(mo_2, 'mouseout', function(e){
  var _self = this;
  if(_self === window){
    _self = mo_2
  }
  mouseout(_self);
});

//
$('#me_3').mouseenter(function(e){
  mouseenter(this);
}).mouseleave(function(){
  mouseleave(this);
});

$('#mo_3').mouseover(function(e){
  mouseover(this);
}).mouseout(function(){
  mouseout(this);
});

function mouseenter(t){
  appendTip('mouseenter 事件触发', t);
}

function mouseleave(t){
  appendTip('mouseleave 事件触发', t);
}

function mouseover(t){
  appendTip('mouseover 事件触发', t);
}

function mouseout(t){
  appendTip('mouseout 事件触发', t);
}



function appendTip(tip,t){
  if(t === _elemt){
    _numbe++;
  } else {
    _numbe = 0;
    _elemt = null;
  }
  _elemt = t;
  if(_numbe == 0){
    _numbe++;
  }
  var child = t.children[0];
  if(_numbe == 1){
    child.innerHTML = '';
  }

  tip = _numbe + '、' + tip + "<br \>";
  child.innerHTML += tip
  child.scrollTop = child.scrollHeight;
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
</script>
