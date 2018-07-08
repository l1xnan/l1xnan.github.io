---
layout: pages
title: Python 中的多重继承
date: 2018-06-29 23:21:01
tags:
  - Python
  - 继承
categories: Python
---

节选自：《流畅的 Python》

环境：`Python 3.6`

```python
class A: # 默认继承自 object
    def ping(self):
        print('ping:', self)


class B(A):
    def pong(self):
        print('pong:', self)


class C(A):
    def pong(self):
        print('PONG:', self)


class D(B, C):
    def ping(self):
        super().ping()
        print('post-ping: ', self)

    def pingpong(self):
        self.ping()
        super().ping()
        self.pong()
        super().pong()
        C.pong(self)
```

<!-- more -->

`B` 和 `C` 都实现了 `pong` 方法，只是输出结果不一样。那么在`D` 的实例上调用 `pong` 方法，我们运行的是哪一个 `pong` 方法呢？

```python
>>> d = D()
>>> d.pong()  # ①
pong: <__main__.D object at 0x000001B4167C10F0>
>>> C.pong(d) # ②
PONG: <__main__.D object at 0x000001B4167C10F0>
```

- ① 直接调用 `d.pong()` 运行的是 `B` 类中的版本。
- ② 超类中的方法都可以直接调用，注意此时要把实例作为显示参数传入（因为我们定义的不是 类方法，没有用 `@classmethod` 装饰器修饰，所以用类调用时，必须显示传入给 `self` 参数传入实例）。

对于 ①，Python 能区分 `d.pong()` 调用的哪个类方法，是因为 Python 会按照特定的顺序便利继承图。这个顺序叫**方法解析顺序**(Method Resolution Order, MRO)。类都有一个名为 `__mro__` 的属性，它的值是一个元组，按照方法解析顺序列出各个超类（或父类），从当前类**自下而上，自左而右**，直到 `object` 类。 `D` 类的 `__mro__` 属性如下：

```
>>> D.__mro__
(__main__.D, __main__.B, __main__.C, __main__.A, object)
```

若想把方法调用委托给超类，推荐的方式是使用内置的 `super()` 函数（注意: Python 3 和 Python 2 中 `super()` 使用上有细微差别）。然而，有时可能需要绕过方法解析顺序，直接调用某个超类的方法 -- 这样做有时更方便。例如，`D.ping` 方法可以这样写：

```python
class D(B, C):

    ... ...

    def ping(self):
        A.ping(self)
        pring('post-ping:', self)
```

注意，直接在类上调用实例方法时，必须显示传入 `self` 参数，因为这样访问的是未绑定方法（unbound method）。

然而，使用 `super()` 最安全，也不易过时。调用框架或不受自己控制的类层次结构中的方法，尤其适合使用 `super()`。 使用 `super()` 调用方法时，会遵守方法的解析顺序，如：

```python
>>> d.ping() # ①
ping: <__main__.D object at 0x000001B4167C10F0> # ②
post-ping:  <__main__.D object at 0x000001B4167C10F0> # ③
```

- ① `D` 类的 `ping` 方法做了两次调用。
- ② 第一个调用的是 `super().ping()`；`super` 函数把 `ping` 调用委托给了 `A` 类；这行由 `A.ping` 输出。
- ③ 第二个调用的是 `pring('post-ping:', self)`，输出的是这一行。

下面看一下， `D` 实例上调用 `pingpong` 方法得到的结果：

```python
>>> d.pingpong()
ping: <__main__.D object at 0x000001B4167C10F0> # ①
post-ping:  <__main__.D object at 0x000001B4167C10F0>
ping: <__main__.D object at 0x000001B4167C10F0> # ②
pong: <__main__.D object at 0x000001B4167C10F0> # ③
pong: <__main__.D object at 0x000001B4167C10F0> # ④
PONG: <__main__.D object at 0x000001B4167C10F0> # ⑤
```

- ① 第一个调用的是 `self.ping()`，运行的是 `D` 类的 `ping` 方法，输出这一行和下一行。
- ② 第二个调用的是 `super().ping()`，跳过 `D` 类的 `ping` 方法，找到 `A` 类的 `ping` 方法。
- ③ 第三个调用的是 `self.pong()`，根据 `__mro__`，找到的是 `B` 类实现的 `pong` 方法（尽管 `C` 类也实现了此方法）。
- ④ 第四个调用的是 `super().pong()`，也根据 `__mro__`，找到的是 `B` 类实现的 `pong` 方法。
- ⑤ 第五个调用的是 `C.pong(self)`，忽略 `__mro__`，找到的是 `C` 类实现的 `pong` 方法。

方法解析顺序不仅考虑继承图，还考虑子类声明中列出的超类顺序。也就是说，如果把 `D` 类声明为 `class D(C, B):`，那么 `D` 类的 `__mro__` 属性就会不一样：先搜索 `C` 类，在搜索 `B` 类。
分析类时，在交互式控制台中查看 `__mro__` 属性，能便于我们分析它们的继承管理。

```python
>>> bool.__mro__
(<class 'bool'>, <class 'int'>, <class 'object'>)
>>> import numbers
>>> numbers.Integral.__mro__
(<class 'numbers.Integral'>, <class 'numbers.Rational'>, <class 'numbers.Real'>, <class 'numbers.Complex'>, <class 'numbers.Number'>, <class 'object'>)
```
