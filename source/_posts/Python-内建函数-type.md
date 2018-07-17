---
title: Python 内建函数 type
abbrlink: 22083
date: 2018-07-14 10:03:34
tags:
---

环境：Python 3.6.5

```
$ python -c "import sys;print(sys.version)"
3.6.5 (default, Apr  1 2018, 05:46:30)
```

Python 内建函数 type，一般用判断变量类型，其实它还有一个比较魔术的用法，我们首先看一下它的 `docstring`：

```
>>> print(type.__doc__)
type(object_or_name, bases, dict)
type(object) -> the object's type
type(name, bases, dict) -> a new type
```

下面我们探讨下怎样用`type()`构造一个新类。

<!-- more -->

## 构造一个空类

类的 `__name__` 属性不需要同存储这个类的变量的名称相同。
当在一个`*.py`顶层（在模块上下文中）时，`class`命令将类绑定到`module object`，使用类的名称作为键。

当我们使用`type`时，`__name__`和绑定之间没有链接。

```
cls = type('A', (object,), {})
```

这个新类有我们预期的名字：

```
cls                 #=> __main__.A
cls.__name__        #=> 'A'
```

```
for key, val in cls.__dict__.items():
    print(key,val,sep=": ")
```

结果如下：

```
__module__: __main__
__dict__: <attribute '__dict__' of 'A' objects>
__weakref__: <attribute '__weakref__' of 'A' objects>
__doc__: None
```

## 构建任何类

我们通过传递给`type()`空字典`{}`获得一个空类，`__dic__`只是上述几个键。
我们可以通过传递一个非空字典来获取更多有趣的类。同时我们可以通过更多有趣的`bases`，以实现继承。

我们尝试使用`dict`的参数来指定这些特殊属性，如： `__doc__`, `__name__` 和 `__module__`。

```
body = dict(__doc__='docstring', __name__='not_A', __module__='modname')
cls2 = type('A', (object,), body)
```

```
cls2.__doc__, cls2.__name__, cls2.__module__
#=> ('docstring', 'A', 'modname')
```

参见：[type(name, bases, dict)](https://jfine-python-classes.readthedocs.io/en/latest/type-name-bases-dict.html)
