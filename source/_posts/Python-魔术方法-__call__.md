---
title: Python 魔术方法之 __call__
tags:
  - Python
  - 魔术方法
categories:
  - Python
abbrlink: 28705
date: 2018-07-08 22:13:55
---

在 Python 中一切皆对象，就是否能通过函数操作符`()`来调用，我们可将对象分为可调用对象和不可调用对象。我们通过 `def` 自定义的函数是可调用对象；一般情况下，类的实例不是可调用对象。可以用内置函数 `callable()` 来检测目标是否可调用：

```python
>>> class Test: pass
>>> callable(Test)
True
>>> hasattr(Test, '__call__')
True
>>> t = Test()
>>> callable(t)
False
>>> t()
TypeError: 'Test' object is not callable
>>> def func(): pass
>>> callable(func)
>>> True
>>> dir(func)
[...more...,__call__,...more...]
>>> dir(func.__call__)
[...more...,__call__,...more...]
>>>
```

<!-- more -->

我们看到 `Test` 的实例 `t` 是不可调用的。

我们知道 Python 提供了许多的魔术方法。Python 中有一个魔术方法 `__call__`，当我们调用 `x()` 实际上与 `x.__call__()` 是相同的。那么我们是否可以通过给类定义 `__call__` 方法，来实现类的实例可调用呢？答案是可以的。上述 `t()` 之所以错误是因为：

    默认情况下，类中的 `__call__` 方法是没有实现的。

`__call__` 在那些类的实例经常改变状态的时候会非常有效。调用这个实例是一种改变这个对象状态的直接和优雅的做法。下面用一个实例来说明:

```python
class Entity:
'''调用实体来改变实体的位置。'''

def __init__(self, size, x, y):
    self.x, self.y = x, y
    self.size = size

def __call__(self, x, y):
    '''改变实体的位置'''
    self.x, self.y = x, y
```

此种方法在用类定义装饰器时非常有用。
其他魔术方法见参考资料。
参见：

- [Python 魔术方法指南](http://pycoders-weekly-chinese.readthedocs.io/en/latest/issue6/a-guide-to-pythons-magic-methods.html)
