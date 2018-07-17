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
