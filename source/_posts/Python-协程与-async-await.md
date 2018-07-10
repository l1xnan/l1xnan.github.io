---
layout: pages
title: Python 协程与 async/await
date: 2018-07-10 19:25:42
tags:
  - Python
  - 协程
  - 异步

categories:
  - Python
---

## 为什么引入 async/await

关于 async/await 最初的提案，参见：[PEP492](https://www.python.org/dev/peps/pep-0492/) 以及它的[中文翻译](http://www.cnblogs.com/animalize/p/4738941.html)。

具体细节我们先不做了解，先看一下增加 async/await 解决了什么问题（引自翻译）：

在以前，我们可以用生成器实现协程（PEP 342），后来又对其进行了改进，引入了 `yield from` 语法（PEP 380）。但仍有一些缺点：

- 协程和普通生成器使用相同的语法，所以很容易把它们搞混，初学者更是如此。
- 一个函数是否是一个协程，取决于它里面是否出现了 `yield` 或 `yield from` 语句。这并不明显，容易在重构函数的时候搞乱，导致出错。
- 异步调用被 `yield` 语法限制了，我们不能获得、使用更多的语法特性，比如 `with` 和 `for`。

**PEP492** 把协程从生成器独立出来，成为 Python 的一个原生事物。这会消除协程和生成器之间的混淆，方便编写不依赖特定库的协程代码。也为 linter 和 IDE 进行代码静态分析提供了机会。

使用原生协程和相应的新语法，我们可以在异步编程时使用上下文管理器（context manager）和迭代器。如下文所示，新的 async with 语句可以在进入、离开运行上下文（runtime context）时进行异步调用，而 async for 语句可以在迭代时进行异步调用。

综上，虽然在 CPython 的内部实现，用 `def async` 定义的协程仍然是一个生成器，但是已经被封装好了，我们不用关心其晦涩的细节。添加 async/await 后我们编写异步协程程序会更加的容易、直观。同时增加异步迭代器 `async for` 和异步上下文管理器 `async with`，我们在编写异步程序将更加的方便。

## 详细内容

一般我们将新语法 async/await 定义的协程称为：原生协程；将传统方法实现的协程称为：生成器协程。

### 语法

使用如下语法声明原生协程：

```python
async def read_data(db):
    pass
```

协程语法有如下关键点：

- `async def` 函数必定是协程，即使里面不含有 `await` 语句。
- 如果在 async 函数里面使用 `yield` 或 `yield from` 语句，会引发 `SyntaxError` 异常。
- 在 CPython 内部，引入两个新的代码对象标识（code object flags）：
  1.  `CO_COROUTINE` 表示这是原生协程。（由新语法定义）
  2.  `CO_ITERABLE_COROUTINE` 表示这是用生成器实现的协程，但是和原生协程兼容。（用装饰器 `types.coroutine()` 装饰过的生成器协程）
- 调用一个普通生成器，返回一个生成器对象（generator object）；相应的，调用一个协程返回一个协程对象（coroutine object）。
- 协程不再抛出 `StopIteration` 异常，作为替代会抛出 `RuntimeError` 异常。
- 如果一个协程从未等待就被垃圾收集器销毁了，会引发一个 `RuntimeWarning` 异常。

### types.coroutine()

types 模块添加了一个新函数 `coroutine(fn)`。“用生成器实现的协程”和“原生协程”本身是不互通，不兼容的，使用它可以让两者之间的互操作。

```python
@types.coroutine
def process_data(db):
    data = yield from read_data(db)
    ...
```

### await 表达式

新的 await 表达式用于获得协程执行的结果：

```python
async def read_data(db):
    data = await db.fetch('SELECT ...')
    ...
```

`await` 和 `yield from` 类似，它挂起 `read_data` 的执行，直到 `db.fetch` 执行完毕并返回结果。

以 CPython `内部，await` 使用了 `yield from` `的实现，但加入了一个额外步骤——验证它的参数类型。await` 只接受 `awaitable` 对象，`awaitable` 对象是以下的其中一个：
