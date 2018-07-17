---
title: Python 中用类编写装饰器
tags:
  - Python
  - 装饰器
categories:
  - Python
abbrlink: 62594
date: 2018-07-08 22:07:58
---

在《流畅的 Python》一书杂谈中推荐使用类来编写装饰器。就我的理解来说，简单的装饰器仍然使用传统的函数来定义比较好。而复杂的、涉及很多状态的装饰器，用类的方法定义，结构会更加清晰，容易扩展。

<!-- more -->

```python
class RouterBase:
    pass

class router(RouterBase):
    def __init__(self, *args, **kwargs):
        pass

    def __call__(self, *args, **kwargs):
        pass

    def func1(self,*args, **kwargs):
        """辅助函数"""
        pass

    def func2(self,*args, **kwargs):
        """辅助函数"""
        pass

    ... ...

@router('/index')
def index():
    pass
```

Python Web 框架中，我们会见到这样通过装饰器定义路由，而路由装饰器是非常复杂的，如果卸载一个函数中，这个函数一定是非常复杂的、难以维护的。而我们通过类定义这个路由装饰器，可以通过继承和在类中定义辅助函数，很好的拆分实现，进而优化我们的代码。

参考资料：

- [将装饰器定义为类](http://python3-cookbook-personal.readthedocs.io/zh_CN/latest/c09/p09_define_decorators_as_classes.html)
- [What is a “callable” in Python?](https://stackoverflow.com/questions/111234/what-is-a-callable-in-python)
