---
layout: post
title: 知道问题页Buttom宽度背景自适应
date: 2012-09-15 +0800
---

<style>
a.operation:link, a.operation:visited, button.operation {
    display:inline-block;
    padding:0 15px;
    height:23px;
    min-width:54px;
    _width:54px;
    background:url(http://img.baidu.com/img/iknow/ui/btns/global.png) no-repeat left -263px;
    font:normal 12px/23px '宋体' ;
    text-align:center;
    white-space:nowrap;
    vertical-align:middle;
    color:#589b00;
    text-decoration:none;
}

a.operation:hover, button.operation:hover{
    background-position:left -263px;
    color:#7bbe24;
}

.new-btn{
    display:inline-block;
    height:23px;
    display: flex;
}
.new-btn a{
    display:inline-block;
    padding:0;
    height:23px;
    font:normal 12px/23px '宋体' ;
    background:url(http://img.baidu.com/img/iknow/ui/btns/global.png) no-repeat -159px -263px;
    text-align:center;
    color:#589b00;
    text-decoration:none;
    outline: none;
}
.new-btn a:hover {
    color:#7bbe24;
}
.left-btn{
    display:inline-block;
    background:url(http://img.baidu.com/img/iknow/ui/btns/global.png) no-repeat 0 -263px;
    width:10px;
    height:23px;
}

.right-btn{
    display:inline-block;
    background:url(http://img.baidu.com/img/iknow/ui/btns/global.png) no-repeat -73px -263px;
    width:10px;
    height:23px;
}
</style>

<h4>之前的Button实现方式</h4>
<p><a class="modify-reply-e operation" href="#">我是按钮</a></p>
<p>变成六个汉字的效果如下:</p>
<p><a class="modify-reply-e operation" href="#">我是按钮哈哈</a></p>
<p>可以看到这种方式，看起来有些不太通用~~ </p>

<h4>新的Button实现方式</h4>
<p>可以自适应汉字长度</p>
<p><div class="new-btn"><span class="left-btn"></span><a href="javascript:void(0)">我是按钮哈哈</a><span class="right-btn"></span></div></p>
