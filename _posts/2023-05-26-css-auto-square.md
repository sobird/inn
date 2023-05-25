---
layout: post
title: CSS实现自适应正方形的三种方法
date: 2023-05-26 00:45 +0800
---

<style type="text/css">
  .square1 {
    width: 50vw;
    height: 50vw;
    background: #ccc;

    margin-bottom: 10px;
  }

  .square2 {
    width: 50%;
    padding-top: 50%;
    height: 0;
    background-color: #ccc;

    margin-bottom: 10px;
  }

  .square3 {
    width: 50%;
    overflow: hidden; /* 是为了防止margin塌陷,触发BFC */
    background: #ccc;

    margin-bottom: 10px;
  }

  .square3:after {
    content: "";
    display: block;
    padding-bottom: 100%;
  }
</style>

### CSS3 vw 单位
<div class="square1"></div>

```html
<style>
  .square {
    width: 50vw;
    height: 50vw;
    background: #ccc;
  }
</style>
<div class="square">hello,viewport</div>
```

### 设置垂直方向的padding撑开容器
元素的padding或margin的百分比值是参照父元素的宽度这一特性来实现

<div class="square2"></div>
```html
<style>
  .square{
    width: 50%;
    padding-top: 50%;
    height: 0; /* 避免被内容撑开多余的高度 */
    background-color: #ccc;
  }
</style>
<div class="square"></div>
```

### 利用伪元素(:after) + margin(padding)-top 撑开容器
<div class="square3"></div>

```html
<style>
  .square3 {
    width: 50%;
    overflow: hidden; /* 是为了防止margin塌陷,触发BFC */
    background: #ccc;
  }

  .square3:after {
    content: "";
    display: block;
    padding-bottom: 100%;
  }
</style>
<div class="square"></div>
```