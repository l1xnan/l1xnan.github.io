---
title: tslint 拾遗
tags:
  - tslint
  - typescript
abbrlink: 17219
date: 2018-09-08 23:24:21
categories:
  - typescript
---

禁止某行的 tslint 检查（[Comment flags in source code](https://palantir.github.io/tslint/usage/rule-flags/)）：

```js
someCode(); // tslint:disable-line
```
