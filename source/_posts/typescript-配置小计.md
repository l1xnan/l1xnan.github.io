---
title: typescript 配置小计
abbrlink: 35898
date: 2018-08-26 16:50:47
tags:
categories:
---

## tsconfig.json 配置
下面对 `tsconfig.json` 配置文件中常用配置做相关说明

若想使用下面语法导入 `React`

```ts
import React, { Component } from 'react';
```

而不是使用

```ts
import * as React from 'react';
```

需要在 `tsconfig.json` 配置文件中添加：

```json
{
  "compilerOptions": {
    "allowSyntheticDefaultImports": true
  }
}
```


## tslint.json 配置

允许成员函数不加 `public` 说明：
```json
{
  "rules": {
    "member-access": [true, "no-public"] // Or false. Read the rule and see what you want.
  }
}
```