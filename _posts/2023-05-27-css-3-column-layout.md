---
layout: post
title: CSS实现三栏布局
date: 2023-05-27 14:49 +0800
---

## Flex

<style type="text/css">
  .flex-sample {
    display: flex;
    height: 300px;
    border: 1px solid #ccc
  }
  .flex-sample .left {
    background: #eee;
    width: 100px;
    border-right: 1px solid #ccc;
  }
  .flex-sample .main {
    flex: 1;
  }
  .flex-sample .right {
    background: #eee;
    width: 100px;
    border-left: 1px solid #ccc;
  }
</style>

<div class="flex-sample">
  <div class="left">left</div>
  <div class="main">main</div>
  <div class="right">right</div>
</div>

```html
<style type="text/css">
  .flex-sample {
    display: flex;
    height: 300px;
    border: 1px solid #ccc
  }
  .flex-sample .left {
    background: #eee;
    width: 100px;
    border-right: 1px solid #ccc;
  }
  .flex-sample .main {
    flex: 1;
  }
  .flex-sample .right {
    background: #eee;
    width: 100px;
    border-left: 1px solid #ccc;
  }
</style>

<div class="flex-sample">
  <div class="left">left</div>
  <div class="main">main</div>
  <div class="right">right</div>
</div>
```

## Calc

<style type="text/css">
  .calc-sample {
    height: 300px;
    border: 1px solid #ccc
  }
  .calc-sample > div {
    display: inline-block;
    height: 100%;
  }
  .calc-sample .left {
    background: #eee;
    width: 100px;
  }
  .calc-sample .main {
    width: calc(100% - 202px);
    border-left: 1px solid #eee;
    border-right: 1px solid #eee;
  }
  .calc-sample .right {
    background: #eee;
    width: 100px;
  }
</style>

<div class="calc-sample">
  <div class="left">left</div><div class="main">main</div><div class="right">right</div>
</div>


```html
<style type="text/css">
  .calc-sample {
    height: 300px;
    border: 1px solid #ccc
  }
  .calc-sample > div {
    display: inline-block;
    height: 100%;
  }
  .calc-sample .left {
    background: #eee;
    width: 100px;
  }
  .calc-sample .main {
    width: calc(100% - 202px);
    border-left: 1px solid #eee;
    border-right: 1px solid #eee;
  }
  .calc-sample .right {
    background: #eee;
    width: 100px;
  }
</style>

<div class="calc-sample">
  <div class="left">left</div><div class="main">main</div><div class="right">right</div>
</div>
```

### BFC
<style type="text/css">
  .bfc-sample {
    height: 300px;
    border: 1px solid #ccc;
  }
  .bfc-sample > div{
    height: 100%;
  }
  .bfc-sample .left {
    background: #eee;
    width: 100px;
    float: left;
  }
  .bfc-sample .main {
    border-left: 1px solid #eee;
    border-right: 1px solid #eee;
    display: flex;
  }
  .bfc-sample .right {
    background: #eee;
    width: 100px;
    float: right;
  }
</style>

<div class="bfc-sample">
  <div class="left">left</div>
  <div class="right">right</div>
  <div class="main">main</div>
</div>

```html
<style type="text/css">
  .bfc-sample {
    height: 300px;
    border: 1px solid #ccc;
  }
  .bfc-sample > div{
    height: 100%;
  }
  .bfc-sample .left {
    background: #eee;
    width: 100px;
    float: left;
  }
  .bfc-sample .main {
    border-left: 1px solid #eee;
    border-right: 1px solid #eee;
    display: flex;
  }
  .bfc-sample .right {
    background: #eee;
    width: 100px;
    float: right;
  }
</style>

<div class="bfc-sample">
  <div class="left">left</div>
  <div class="right">right</div>
  <div class="main">main</div>
</div>
```

## Margin

<style type="text/css">
  .margin-sample {
    height: 300px;
    border: 1px solid #ccc;
  }
  .margin-sample > div{
    height: 100%;
  }
  .margin-sample .left {
    background: #eee;
    width: 100px;
    float: left;
  }
  .margin-sample .main {
    margin-left: 100px;
    margin-right: 100px;
  }
  .margin-sample .right {
    background: #eee;
    width: 100px;
    float: right;
  }
</style>

<div class="margin-sample">
  <div class="left">left</div>
  <div class="right">right</div>
  <div class="main">main</div>
</div>

```html
<style type="text/css">
  .margin-sample {
    height: 300px;
    border: 1px solid #ccc;
  }
  .margin-sample > div{
    height: 100%;
  }
  .margin-sample .left {
    background: #eee;
    width: 100px;
    float: left;
  }
  .margin-sample .main {
    margin-left: 100px;
    margin-right: 100px;
  }
  .margin-sample .right {
    background: #eee;
    width: 100px;
    float: right;
  }
</style>

<div class="margin-sample">
  <div class="left">left</div>
  <div class="right">right</div>
  <div class="main">main</div>
</div>
```

## Table

<style type="text/css">
  .table-sample {
    display: table;
    height: 300px;
    border: 1px solid #ccc;
    width: 100%;
  }
  .table-sample > div{
    display: table-cell;
  }
  .table-sample .left {
    background: #eee;
    width: 100px;
  }
  .table-sample .main {
    
  }
  .table-sample .right {
    background: #eee;
    width: 100px;
  }
</style>

<div class="table-sample">
  <div class="left">left</div>
  <div class="main">main</div>
  <div class="right">right</div>
</div>

```html
<style type="text/css">
  .table-sample {
    display: table;
    height: 300px;
    border: 1px solid #ccc;
    width: 100%;
  }
  .table-sample > div{
    display: table-cell;
  }
  .table-sample .left {
    background: #eee;
    width: 100px;
  }
  .table-sample .main {
    
  }
  .table-sample .right {
    background: #eee;
    width: 100px;
  }
</style>

<div class="table-sample">
  <div class="left">left</div>
  <div class="main">main</div>
  <div class="right">right</div>
</div>
```

## Grid

<style type="text/css">
  .grid-sample {
    height: 300px;
    border: 1px solid #ccc;

    display: grid;
    grid-template-columns: 100px auto 100px;
  }
  .grid-sample .left {
    background: #eee;
  }
  .grid-sample .right {
    background: #eee;
  }
</style>

<div class="grid-sample">
  <div class="left">left</div>
  <div class="main">main</div>
  <div class="right">right</div>
</div>

```html
<style type="text/css">
  .grid-sample {
    height: 300px;
    border: 1px solid #ccc;

    display: grid;
    grid-template-columns: 100px auto 100px;
  }
  .grid-sample .left {
    background: #eee;
  }
  .grid-sample .right {
    background: #eee;
  }
</style>

<div class="grid-sample">
  <div class="left">left</div>
  <div class="main">main</div>
  <div class="right">right</div>
</div>
```