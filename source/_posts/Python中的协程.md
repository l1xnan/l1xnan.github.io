---
layout: pages
title: Python中的协程
date: 2018-07-04 23:01:14
tags:
  - Python
  - 协程

categories:
  - Python
---

协程、线程、进程的区别不在赘述。
先看 《流畅的 Python》中协程的一个例子：

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

<!-- more -->

再看廖雪峰教程中的一个例子：

```python
def consumer():
    r = ''
    while True:
        n = yield r
        if not n:
            return
        print('[CONSUMER] Consuming %s...' % n)
        r = '200 OK'

def produce(c):
    c.send(None)
    n = 0
    while n < 5:
        n = n + 1
        print('[PRODUCER] Producing %s...' % n)
        r = c.send(n)
        print('[PRODUCER] Consumer return: %s' % r)
    c.close()

c = consumer()
produce(c)
```
