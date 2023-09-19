---
layout: post
title: useMergedState
date: 2023-09-19 23:49 +0800
---


### 类型定义
```ts
type Updater<T> = (updater: T | ((origin: T) => T), ignoreDestroy?: boolean) => void;
/**
 * Similar to `useState` but will use props value if provided.
 * Note that internal use rc-util `useState` hook.
 */
export default function useMergedState<T, R = T>(defaultStateValue: T | (() => T), option?: {
    defaultValue?: T | (() => T);
    value?: T;
    onChange?: (value: T, prevValue: T) => void;
    postState?: (value: T) => T;
}): [R, Updater<T>];
```


### 参考

* [我们应该如何优雅的处理 React 中受控与非受控](https://cloud.tencent.com/developer/article/2195455)