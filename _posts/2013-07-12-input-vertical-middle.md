---
layout: post
title: 输入框中的文本垂直居中方法
date: 2013-07-12 +0800
---

<style type="text/css">
.input-exam1{
  border: 1px solid #ccc;
  height: 40px;
  width: 200px;
}
.input-exam2{
  border: 1px solid #ccc;
  height: 40px;
  line-height: 40px;
  width: 200px;
}
.input-exam3{
  border: 1px solid #ccc;
  height: 40px;
  line-height:40px\9;
  width: 200px;
}
</style>

<p><input class="input-exam1" type="text" value="{{site.url}}" /></p>

```css
.input-exam1{
  border: 1px solid #ccc;
  height: 40px;
  width: 200px;
}
```

除IE内核浏览器外，缺省line-height时都会自适应文本框的height，而IE内核的浏览器文本则会以文本框的顶部对齐。

<p><input class="input-exam2" type="text" value="{{site.url}}" /></p>

```css
.input-exam2{
  border: 1px solid #ccc;
  height: 40px;
  line-height: 40px;
  width: 200px;
}
```

IE下line-height对文本框有效，加上与相同的height后可以让IE也垂直居中。line-height超过height时，文本框获得焦点后拖动鼠标或按上下键会出现上下滚动的现象。chrome和safari浏览器下，文本框虽能居中，但是鼠标selected该文本时，选中的范围却是从文本框顶部到文本的底部，感觉比较丑。不信的话，你可以在chrome和safari内核浏览器下select一下上面的文本文字试试。

<p><input class="input-exam3" type="text" value="{{site.url}}" /></p>

```css
.input-exam3{
  border: 1px solid #ccc;
  height: 40px;
  line-height:40px\9; /* IE */
  width: 200px;
}
```

经测试，在各浏览器下可以保持文本垂直居中，效果较为理想，目前我在项目中一般使用这种方式

<a href="https://sobird.me/text-ipt-vertical-align-mid.htm">返回相关文章</a>