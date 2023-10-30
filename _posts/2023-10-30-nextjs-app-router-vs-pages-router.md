---
layout: post
title: Next.js - App Router 和 Pages Router
date: 2023-10-30 21:00 +0800
---

在Next.js 13.0 之前，Pages Router是Next.js中创建路由的主要方式，它基于本地文件系统将每个文件映射到一个路由。新版本(13之后)为我们提供了一种更加灵活的创建路由的方式 - App Router(与Pages Router 共存，向下兼容)。


## 项目结构
使用`Pages Router`方式，项目结构如下：

```json
src
└── pages
    ├── index.ts // 首页
    ├── about.ts
    ├── _app.tsx
    ├── _document.tsx
    ├── _error.tsx
    ├── 404.tsx
    ├── user
    │   └── index.ts
    └── api
        └── user.ts
```

使用`App Router`方式，项目结构如下：

![App Router](/assets/terminology-component-tree.avif)

```json
src
└── app
    ├── page.ts // 首页
    ├── about
    │   └── page.ts
    ├── layout.tsx
    ├── globals.css
    ├── user
    │   └── page.ts
    └── api
        └── route.ts
```


* `pages/_app.js` 和 `pages/_document.js` 替换为 `app/layout.js`。
* `pages/_error.js` 替换为 `app/error.js`。
* `pages/404.js` 替换为 `app/not-found.js`。
* `pages/api/*` 当前保留在`pages`目录中

## 特定功能的文件
每个页面的目录中可以放置几个具有保留名称的特定文件

layout.js
loading.js
template.js

## 服务端 和 客户端组件

默认情况下，`app` 目录中的任何组件现在都是服务器组件，这意味这我们不能书写js交互相关的代码，例如：

```tsx
import React, { useState } from "react";

const Page = () => {
  const [count, setCount] = useState(0);
  return (
    <>
      <button onClick={() => setCount(count => count + 1)}>按钮 {count}</button>
    </>
  );
};

export default Page;
```
将会报错，此时需要通过在文件顶部声明 `'use client'` 来声明客户端组件。

```tsx
'use client'

import React, { useState } from "react";

const Page = () => {
  const [count, setCount] = useState(0);
  return (
    <>
      <button onClick={() => setCount(count => count + 1)}>按钮 {count}</button>
    </>
  );
};

export default Page;
```

## 参考
* [pages](https://nextjs.org/docs/pages)
* [From Pages to App](https://nextjs.org/docs/pages/building-your-application/upgrading/app-router-migration)
* [What is different between App Router and Pages Router in Next.js?](https://stackoverflow.com/questions/76570208/what-is-different-between-app-router-and-pages-router-in-next-js)