---
layout: post
title: CSS3实现信封动画样式
date: 2019-12-19 12:08:49 +0800
---

<style type="text/css">
    @keyframes ants {
      to {
        background-position: 100%;
      }
    }
    .envelope-stroke {
      display: block;
      height: 100px;
      border: 5px solid transparent;
      background: linear-gradient(white, white) padding-box,
      repeating-linear-gradient(-45deg, red 0, red 12.5%, transparent 0, transparent 25%, #58a 0, #58a 37.5%, transparent 0, transparent 50%) 0/5em 5em;
      animation: ants 12s linear infinite;
     }
</style>
<div class="envelope-stroke"></div>

<p></p>

### 源码

```html
<style type="text/css">
    @keyframes ants {
      to {
        background-position: 100%;
      }
    }
    .envelope-stroke {
      display: block;
      height: 100px;
      border: 5px solid transparent;
      background: linear-gradient(white, white) padding-box,
      repeating-linear-gradient(-45deg, red 0, red 12.5%, transparent 0, transparent 25%, #58a 0, #58a 37.5%, transparent 0, transparent 50%) 0/5em 5em;
      animation: ants 12s linear infinite;
     }
</style>
<div class="envelope-stroke"></div>
```
