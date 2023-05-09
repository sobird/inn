---
layout: post
title: CSS实现圆环的五种方法
date: 2021-04-06 +0800
---

<style type="text/css">
.border{
    width: 64px;
    height: 64px;
    border-radius: 50%;
    border: 10px solid rgb(0, 128, 255);
}

.box-shadow{
    width: 64px;
    height: 64px;
    border-radius: 50%;
    box-shadow: 0 0 0 10px rgb(0, 128, 255);
}

.nest{
    overflow: hidden;
    width: 84px;
    height: 84px;
    border-radius: 50%;
    background-color: rgb(0, 128, 255);
    margin-bottom: 10px;
}

.nest .child {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background-color: #fff;
    margin: 10px;
}

.pseudo {
    overflow: hidden;
    width: 84px;
    height: 84px;
    border-radius: 50%;
    background-color: rgb(0, 128, 255);
    margin-bottom: 10px;
}
.pseudo::after {
    content: "";
    display: block;
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background-color: #fff;
    margin: 10px;
}

.radial-gradient {
    width: 84px;
    height: 84px;
    border-radius: 50%;
    background: radial-gradient( circle closest-side, transparent 32px, rgb(0, 128, 255) 32px);
    margin-bottom: 10px;
}
</style>

## 一、使用border属性

<p class="border"></p>

```css
.border{
    width: 64px;
    height: 64px;
    border-radius: 50%;
    border: 10px solid rgb(0, 128, 255);
}
```

## 二、使用border-shadow属性

<p class="box-shadow"></p>

```css
.box-shadow{
    width: 64px;
    height: 64px;
    border-radius: 50%;
    box-shadow: 0 0 0 10px rgb(0, 128, 255);
}
```

## 三、使用两个标签嵌套

<div class="nest">
<p class="child"></p>
</div>

```css
.nest{
    overflow: hidden;
    width: 84px;
    height: 84px;
    border-radius: 50%;
    background-color: rgb(0, 128, 255);
    margin-bottom: 10px;
}

.nest .child {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background-color: #fff;
    margin: 10px;
}
```

## 四、使用伪类

<div class="pseudo"></div>

```css
.pseudo {
    overflow: hidden;
    width: 84px;
    height: 84px;
    border-radius: 50%;
    background-color: rgb(0, 128, 255);
    margin-bottom: 10px;
}
.pseudo::after {
    content: "";
    display: block;
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background-color: #fff;
    margin: 10px;
}
```


## 五、使用radial-gradient属性

<div class="radial-gradient"></div>

```css
.radial-gradient {
    width: 84px;
    height: 84px;
    border-radius: 50%;
    background: radial-gradient( circle closest-side, transparent 32px, rgb(0, 128, 255) 32px);
    margin-bottom: 10px;
}
```