---
title: Python 库推荐
tags:
  - Python
categories:
  - Python
abbrlink: 29269
date: 2018-07-10 18:49:00
---

[AttrDict](https://github.com/bcj/AttrDict)
字典转换为可以用属性访问的模式

```python
> from attrdict import AttrDict
> a = AttrDict({'foo': 'bar'})
> a.foo
'bar'
> a['foo']
'bar'
```

## Web 框架

[molten](https://github.com/Bogdanp/molten): 用于使用Python 3.6及更高版本构建HTTP API的最小，可扩展，快速且高效的框架。
[responder](https://github.com/kennethreitz/responder): 

### Flask

### Sanic

[![GitHub stars](https://img.shields.io/github/stars/channelcat/sanic.svg)](https://github.com/channelcat/sanic)

### Vibora

[![GitHub stars](https://img.shields.io/github/stars/badges/shields.svg?style=social&label=Stars)](https://github.com/vibora-io/vibora)

## 实用工具

[You-Get](https://github.com/soimort/you-get): 优酷、YouTube 等网站视频下载

[lulu](https://github.com/iawia002/lulu): 各网站视频下载，fork 自 you-get。其作者新开 Go 语言编写同功能库 [annie](https://github.com/iawia002/annie)。

## 代码调试

[icecream](https://github.com/gruns/icecream)：打印调试，优化 `print()` 函数。

## 数据验证

[voluptuous](https://github.com/alecthomas/voluptuous)：数据验证库 [![GitHub stars](https://img.shields.io/github/stars/badges/shields.svg?style=social&label=Stars)]((https://github.com/alecthomas/voluptuous)

## Shell

[xonsh](https://github.com/xonsh/xonsh):  xonsh是一种shell语言和命令提示符。 与其他shell不同，xonsh基于Python，添加了额外的语法，可以轻松调用子进程命令，操作环境和处理文件系统。 xonsh命令提示符为用户提供对xonsh语言的交互式访问。
