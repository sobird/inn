---
layout: post
title: 原生JS实现鼠标拖拽
date: 2010-10-25 14:38:00 +0800
---
<style type="text/css">
#dragme {
  z-index: 20;
  border: 4px solid #A6C9E1;
  position: absolute;
  width: 300px;
  height: 250px;
  background: #E9F3FD;
  padding: 5px;
  text-align: center;
}
</style>

<div id="dragme">
鼠标拖拽
</div>

<script type="text/javascript">
  mousedrag = {
  init: function(id){
    var o = document.getElementById(id);
    o.onmousedown = mousedrag.starIt;
  },

  starIt: function(e){
    //重置Event对象
    e = mousedrag.setEv(e);

    t = this;
    // 注册mousemove事件到document对象
    document.onmousemove = mousedrag.dragIt;
    // 注册mouseup事件到document对象
    document.onmouseup = mousedrag.endIt;  

    page = {
      x:0,
      y:0
    };
    //获取对象的offset
    offset ={
      left:t.offsetLeft,
      top:t.offsetTop
    }
    //获取鼠标的页面坐标,并存放到page对象
    page.x = e.pageX; //pageX和pageY只在FF下有效
    page.y = e.pageY;
  },

  dragIt: function(e){
    var left = e.pageX-page.x + offset.left;
    var stop = e.pageY-page.y + offset.top;
    
    t.style.left = left + "px";
    t.style.top = stop + "px";
  },

  endIt: function(e){
    document.onmousemove = null;
    document.onmouseup = null;
  },

  setEv: function(e){
    var e = e || window.event;
    if(typeof e.pageX == 'undefined'){
      e.pageX = e.clientX + document.documentElement.scrollLeft;
      e.pageY = e.clientY + document.documentElement.scrollTop;
    }
    return e;
  }
};

mousedrag.init('dragme');
</script>
