---
layout: pages
title: Python 中的 super() 和 MRO
date: 2018-06-30 23:03:21
tags:
  - Python
categories: Python
---

术语：

- MRO: 方法解析顺序(Method Resolution Order, MRO)

环境：Python 3（Python 2 会有差别）

# super()

首选可以参看 Python 3 版本中 `super()` 说明文档： [PEP 3135 -- New Super](https://www.python.org/dev/peps/pep-3135/)：
开篇即说：

```python
super()
```

等价于：

```python
super(__class__, <firstarg>)
```

# super 指的是 MRO 中的下一个类！

```python
class A:
    def spam(self):
        print('A.spam')
        super().spam()

class B:
    def spam(self):
        print('B.spam')

class C(A, B):
    pass
```

下面我们测试说明。首先实例化 `A` 类，然后调用它的 `spam` 方法，很显然，会出错：

```python
>>> a = A()
>>> a.spam()
A.spam
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
  File "<stdin>", line 4, in spam
AttributeError: 'super' object has no attribute 'spam'
```

那么，我们再做如下测试：

```python
>>> c = C()
>>> c.spam()
A.spam
B.spam
```

你可以看到在 `A` 类中使用 `super().spam()` 实际上调用的是跟 `A` 类毫无关系的 `B` 类中的 `spam()` 方法。 这个用`C类` 的 MRO 列表就可以完全解释清楚了：

```python
>>> C.__mro__
(<class '__main__.C'>, <class '__main__.A'>, <class '__main__.B'>, <class 'object'>)
```

在 MRO 顺序中， `B` 类时 `A` 类的下一个类即为 `B` 类。

参考：

- [调用父类方法 - 《Python Cookbook 3rd》](http://python3-cookbook.readthedocs.io/zh_CN/latest/c08/p07_calling_method_on_parent_class.html)
- [Python’s super() considered super!](https://rhettinger.wordpress.com/2011/05/26/super-considered-super/)
