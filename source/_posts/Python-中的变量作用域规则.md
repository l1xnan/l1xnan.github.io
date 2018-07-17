---
title: Python 中的变量作用域规则
tags:
  - Python
categories: Python
abbrlink: 4039
date: 2018-07-01 12:46:24
---

在《流畅的 Python》一书的 7.4 节讲《变量作用域规则》一节，提到如下例子：

```python
>>> def f1(a):
        print(a)
        print(b)
>>> f1(3)
3
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
  File "<stdin>", line 3, in f1
NameError: name 'b' is not defined
```

上述示例中错误很明显。我们再看下一个例子：

```python
>>> b = 6
>>> def f2(a):
...     print(a)    # ①
...     print(b)    # ②
...     b = 9
...
>>> f2(3)
3
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
  File "<stdin>", line 3, in f
UnboundLocalError: local variable 'b' referenced before assignment
```

<!-- more -->

首选 ① 输出 `3`。然后到 ② 执行不了，出现错误。书中解释：

    Python 编译函数的定义体时，它判断 b 是局部变量，因为在函数中给它赋值了。

然后又用 `dis` 库，查看 `f2` 函数的字节码。

```python
>>> b = 6
>>> def f3(a):
...     global b
...     print(a)    # ①
...     print(b)    # ②
...     b = 9
...
>>> f3(3)
3
6
>>> print(b)
```

```python
>>> from dis import dis
>>> dis(f1)
  2           0 LOAD_GLOBAL              0 (print)
              2 LOAD_FAST                0 (a)
              4 CALL_FUNCTION            1
              6 POP_TOP

  3           8 LOAD_GLOBAL              0 (print)
             10 LOAD_GLOBAL              1 (b)         # <<= ①
             12 CALL_FUNCTION            1
             14 POP_TOP
             16 LOAD_CONST               0 (None)
             18 RETURN_VALUE
```

```python
>>> dis(f2)
  2           0 LOAD_GLOBAL              0 (print)
              2 LOAD_FAST                0 (a)
              4 CALL_FUNCTION            1
              6 POP_TOP

  3           8 LOAD_GLOBAL              0 (print)
             10 LOAD_FAST                1 (b)       # <<= ②
             12 CALL_FUNCTION            1
             14 POP_TOP

  4          16 LOAD_CONST               1 (9)
             18 STORE_FAST               1 (b)
             20 LOAD_CONST               0 (None)
             22 RETURN_VALUE
```

```python
>>> dis(f3)
  3           0 LOAD_GLOBAL              0 (print)
              2 LOAD_FAST                0 (a)
              4 CALL_FUNCTION            1
              6 POP_TOP

  4           8 LOAD_GLOBAL              0 (print)
             10 LOAD_GLOBAL              1 (b)       # <<= ③
             12 CALL_FUNCTION            1
             14 POP_TOP

  5          16 LOAD_CONST               1 (9)
             18 STORE_GLOBAL             1 (b)
             20 LOAD_CONST               0 (None)
             22 RETURN_VALUE
>>>
```

看 `<<=` 行的不同：①、③ 中编程器将 `b` 视作全局变量，而 ② 中编辑器将 `b` 视作局部变量。综上，我们已经很直观的看到问题的所在，至于编辑器具体实现，以及为什么这样实现，还有待进一步学习和查阅相关资料。

再来重新思考 Python 作用域（scopes）：

    L （Local） 局部作用域
    E （Enclosing） 闭包函数外的函数中
    G （Global） 全局作用域
    B （Built-in） 内建作用域

它们以 `L –> E –> G –> B` 的规则查找，即：在局部找不到，便会去局部外的局部找（例如闭包），再找不到就会去全局找，再者去内建中找。
（开坑，待续……）
