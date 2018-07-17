---
title: Python中的协程
tags:
  - Python
  - 协程
categories:
  - Python
abbrlink: 47856
date: 2018-07-04 23:01:14
---

## 概述

Python 3.5 之前的协程是靠 `yield` 实现的，和生成器 `yield` 共用关键字，语义不明确，使用比较晦涩，很少有人使用（起码大多数爬虫程序用的是多线程）。Python 3.5 增加了 `async` 和 `await` 关键字（保留关键字，未正式确定，Python 3.7 正式确定），作为定义协程的专用关键字。协程才正式变得优雅可用，不过它的基础仍是基于 `yield` 的协程。作为基础，我们对其做一下简述。

## 与生成器的不同

协程、线程、进程的区别不在赘述。简述协程和生成器的区别：

- 生成器是用于生成供迭代的数据
- 协程是数据的消费者
- 虽然在协程中会使用 `yield` 产生值，但这与迭代无关。

也就是说，协程只是和生成器“碰巧”共用了 `yield` 关键词，其他无任何关联。

## 协程基础

下面我们来分析下《流畅的 Python》中协程的一个例子：

### 简单实例

```python
>>> def simple_coroutine():     # ①
...     print('-> 协程开始')
...     x = yield               # ②
...     print('-> 协程接收：', x)
...
>>> my_coro = simple_coroutine()
>>> my_coro                      # ③
<generator object simple_coroutine at 0x0000023E1AC54150>
>>> next(my_coro)                # ④
-> 协程开始
>>> my_coro.send(42)             # ⑤
-> 协程接收： 42
Traceback (most recent call last):   # ⑥
  File "<stdin>", line 1, in <module>
StopIteration
>>>
```

- ① 协程使用生成器函数定义：定义体重有 `yield` 关键字。
- ④ 首选要调用 `next(...)` 函数，因为生成器还没有启动，没在 `yield` 语句处暂停，所以一开始发送数据。也可以用给生成器发送`None`代替：`my_coro,send(None)`，专业术语叫**预激生成器**。

可用 `inspect.getgeneratorstate(...)` 查看协程状态：

```python
import inspect
inspect.getgeneratorstate(...)
```

具体有协程从创建到结束有四种状态：

- `GEN_CREATED`: 等待执行
- `GEN_RUNNING`: 解析器正在执行
- `GEN_SUSPENDED`: 在 `yield` 表达式出暂停执行
- `GEN_CLOSED`: 执行结束

只有在多线程应用中才能看到 `GEN_RUNNING` 状态。此外，生成器对象在自己身上调用 `getgeneratorstate` 函数能看到，可自行测试。

<!-- more -->

### 预激协程

为了方便预激协程，《流畅的 Python》提供了一个预激协程的装饰器例子，可供参考：

```python
from functools import wraps
def coroutine(func):
    """装饰器：向前执行到第一个 `yield` 表达式，预激 `func`"""
    @wraps(func)
    def primer(*args, **kwargs):
        gen = func(*args, **kwargs)
        next(gen)
        return gen

    return primer
```

### 终止协程和异常处理

在协程中，未处理的异常能导致协程终止
Python 也为协程提供两个方法：

- `generator.throw(exc_type[, exc_value[, traceback]])`：致使生成器在暂停 `yield` 表达式处抛出**指定**的异常。如果生成器处理了抛出的异常，代码会向前执行到下一个 `yield` 表达式，而产生的值会调用 `generator.throw` 方法得到返回值。如果生成器没有处理抛出的异常，异常会向上冒泡，传到调用方的上下文中。
- `generator.close()`：只是生成器在暂停的 `yield` 表达式处抛出 `GeneratorExit` 异常。

### 让协程返回值

`return` 可以出现在生成器中，当生成器正常结束，执行 `return`。

```python
def test():
    while True:
        a = yield
        if a == 10:
            break
    return a
```

```python
>>> t = test()
>>> t.send(None)
>>> t.send(10)
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
StopIteration: 10
>>>
```

```python
>>> t = test()
>>> import inspect
>>> inspect.getgeneratorstate(t)
'GEN_CREATED'
>>> next(t)
>>> inspect.getgeneratorstate(t)
'GEN_SUSPENDED'
>>> try:
...     t.send(10)
... except StopIteration as exc:
...     result = exc.value
...
>>> result
10
```

## 实例分析

```python
def simple_coro(a):
    print('-> 开始: a =', a)
    b = yield a                 # ①
    print('-> 接收: b =', b)
    c = yield a + b             # ②
    print('-> 接收：c =', c)
```

调用：

```python
>>> coro = simple_coro(14)  # 创建协程
>>> r1 = coro.send(None)    # 或执行：next(coro)，启动协程
-> 开始: a = 14
>>> r1
14
# 协程执行至，① 行 yield 右边，返回 yield 右边表达式的值，
# 并等待 send 发送新值，赋值给 b
>>> r2 = coro.send(28)
-> 接收: b = 28
>>> r2
42
>>> r3 = coro.send(99)
-> 接收：c = 99
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
StopIteration
>>> r3
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
NameError: name 'r3' is not defined
```

从上述分析中我们看到，`yield` 的作用，不严谨的说是：

1.  协程在 `yield` 关键字所在位置暂停执行；
2.  当协程执行至此 `yield` 处时，返回 `yield` 右边表达式的值，并等待 `send` 函数发送下一个值给 `yield` 左边的变量;
3.  每一次 `coroutine.send(value)` 执行的范围为：`yield` 语句行左边变量赋值至下一个 `yield`语句行右边表达式返回值或协程结束。

如上述协程 `coro.send(28)` 的执行范围为：

```python
_________
|    b = |_______________________
|    print('-> 接收: b =', b)  
¯¯¯¯¯¯¯¯¯¯| yield a + b  # 相当于 return a +b，然后暂停
          ¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯
```

## yield from

基础概念：

- 委派生成器：包含 `yield from <iterable>` 表达式的生成器函数。
- 子生成器：从 `yield from` 表达式中 `<iterable>` 部分获取的生成器（subgenerator）。
- 调用方：调用委派生成器的客户端代码。
