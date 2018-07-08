---
layout: pages
title: Python 并发编程之 future
date: 2018-07-08 15:55:36
tags:
  - Python
  - 并发
categories:
  - Python
---

Python 中的并发主要涉及三种：多进程、多线程、协程。

相信提到多线程和多进程大家首先想到的是标准库 `threading` 和 `multiprocessing`。在 Python 中，这两个标准库几乎成了 Python 并发编程的代名词。对于这两个标准库，无论网络还是书籍，可查阅的资料非常丰富，我们不多做介绍。本文主要介绍从 Python3.2 开始被纳入标准库的 `concurrent.futures`，它是对 `threading` 和 `multiprocessing` 进一步的封装和高级别的抽象，并暴露出统一的接口，帮助开发者非常方便的实现异步调用。最初的提案见于 [PEP 3148](https://www.python.org/dev/peps/pep-3148/)。

<!-- more -->

## 模块接口

`concurrent.futures` 模块提供的接口很简单，提供了类：

- `Executor`：一个抽象类，提供异步执行调用的方法。 我们一般使用其具体的子类，而不直接调用它。
- `ThreadPoolExecutor`：是 `Executor` 的子类。提供了线程池的支持。
- `ProcessPoolExecutor`：是 `Executor` 的子类。提供了线程池的支持。把工作分配给多个 Python 进程处理。因此，如果需要做 CPU 密集型处理，使用这个模块能绕开 GIL，利用所有可用的 CPU 核心。
- `Future`：封装了可调用的异步执行。 其实例由 `Executor.submit()` 创建，表示可能已经完成或者尚未完成的延迟计算。

以及模块函数：

- `await(fs, timeout=None, return_when=ALL_COMPLETED)`：等待由 `fs` 给出的 `Future` 实例（可能由不同的 `Executor` 实例创建）完成。返回一个命名的 2 元组的集合。第一个集合，名为 `done`，包含在等待完成之前完成（完成或被取消）的 future。第二个集合，名为 `not_done`，包含未完成的 future。
- `as_completed(fs, timeout=None)`：返回由 `fs` 给出的 `Future` 实例（可能由不同的`Executor` 实例创建）的迭代器，它们在结束（结束状态可能是完成或被取消）时产生 future。 `fs` 复制的任何期货都将被退回一次。 在调用 `as_completed()`之前完成的任何 future 都将首先产生。 如果异步函数超时，则调用 `__next__()` 返回迭代器时会引发 `concurrent.futures.TimeoutError`。 `timeout` 可以是 `int` 或 `float`。如果未指定`timeout` 或 `None`，则等待时间没有限制。

### Executor

```python
class concurrent.futures.Executor
```

它提供如下方法：

- `submit(fn, *args, **kwargs)`：将可调用的 `fn` 调度为 `fn(* args ** kwargs)` 并返回表示可调用执行的 `Future` 对象。

```python
with ThreadPoolExecutor(max_workers=1) as executor:
    future = executor.submit(pow, 323, 1235)
    print(future.result())
```

- `map(func, *iterables, timeout=None, chunksize=1)`：类似于 `map(func, *iterables)`，但是 `func` 是异步执行。若想并发运行多个可调用的对象可调用此函数。

  - `func`：需要异步执行的函数。
  - `*iterables`：可迭代对象，如列表等。每一次 `func` 执行，都会从 `iterables` 中取参数。
  - `timeout`：设置每次异步操作的超时时间。它的值可以是 `int` 或 `float`，如果操作超时，会返回 `raisesTimeoutError`；如果不指定 timeout 参数，则不设置超时间。

- `shutdown(wait=True)`：向执行者发出信号，表示当目前待处理的期货执行完毕时，它应该释放它正在使用的任何资源。 在关闭后调用 `Executor.submit()` 和 `Executor.map()` 将引发 `RuntimeError`。

`ThreadPoolExecutor` 和 `ProcessPoolExecutor`，是 `Executor` 的子类，它们都实现了通用的 `Executor` 接口，因此使用 `concurrent.futures` 模块能特别轻松地把基于线程的方案转成基于进程的方案。

### ThreadPoolExecutor

```python
class ThreadPoolExecutor(max_workers=None, thread_name_prefix='')
```

看官网中的[实例](https://docs.python.org/3/library/concurrent.futures.html#threadpoolexecutor-example)，我们稍加改造：

```python
import concurrent.futures as futures
import urllib.request

URLS = ['http://www.baidu.com/',
        'http://www.qq.com/',
        'http://www.sina.com.cn/',
        'http://www.sohu.com/']

# Retrieve a single page and report the URL and contents
def load_url(url, timeout):
    with urllib.request.urlopen(url, timeout=timeout) as conn:
        return conn.read()

# 使用 with 语句来确保及时清理线程
with futures.ThreadPoolExecutor(max_workers=5) as executor:
    # 开启加载每个 future，并用它们的 URL 来标记 future
    future_to_url = {executor.submit(load_url, url, 60): url for url in URLS}
    print(list(futures.as_completed(future_to_url)))
    for future in futures.as_completed(future_to_url):
        url = future_to_url[future]
        try:
            data = future.result()
        except Exception as exc:
            print('%r generated an exception: %s' % (url, exc))
        else:
            print('%r page is %d bytes' % (url, len(data)))
```

### ProcessPoolExecutor

```python
class ProcessPoolExecutor(max_workers=None)
```

其继承自 `Executor`，于其行为几乎一致。但是在 `map()` 方法中，使用 `ProcessPoolExecutor` 时，此方法将迭代器切换为多个块，并将其作为单独的任务提交到池中。 可以通过将 `chunksize` 设置为正整数来指定这些块的（近似）大小。 对于非常长的迭代，使用较大的 `chunksize` 值可以显着提高性能，而默认大小为 `1`。使用 `ThreadPoolExecutor` 时，`chunksize` 无效。

### Future

```python
class Future
```

它提供了如下方法（简单机翻一下￣ □ ￣｜｜）：

- `cancel()`
  尝试取消调用。如果调用当前正在执行并且不能被取消，则该方法将返回 `False`，否则调用将被取消，并且该方法将返回 `True`。

- `cancelled()`
  如果调用成功取消，则返回 `True`。

- `running()`
  如果调用当前正在执行并且无法取消，则返回 `True`。

- `done()`
  如果调用成功取消或完成运行，则返回`True`。

- `result(timeout=None)`
  返回调用返回的值。如果调用尚未完成，则此方法将等待到 timeout 秒。如果调用在 `timeout` 秒内没有完成，则将产生 `concurrent.futures.TimeoutError`。 `timeout` 可以是 `int` 或 `float`。如果未指定 `timeout` 或 `None`，则等待时间没有限制。
  如果 future 在完成之前被取消，则抛出 `CancelledError` 错误。
  如果这个调用在执行过程中抛出异常，这种方法也将引发相同的异常。

- `exception(timeout=None)`
  返回调用引发的异常。如果调用尚未完成，则此方法将等待到 `timeout` 秒。如果调用在 `timeout` 秒内没有完成，则将产生 `concurrent.futures.TimeoutError`。 `timeout` 可以是 `int` 或 `float`。如果未指定 `timeout` 或 `None`，则等待时间没有限制。
  如果未来在完成之前被取消，则 `CancelledError` 将被提出。
  如果调用在未提高的情况下完成，则返回 `None`。

- `add_done_callback(fn)`
  将可调用 fn 附加到未来。 fn 将被调用，将来作为其唯一的参数，当未来被取消或完成运行时。
  添加的 `callables` 按它们被添加的顺序被调用，并且总是在属于添加它们的进程的线程中被调用。如果可调用引发了 `Exception` 子类，它将被记录并被忽略。如果可调用引发了 `BaseException` 子类，则该行为是未定义的。
  如果未来已经完成或被取消，`fn` 将立即被调用。

## 应用实例

<!--
```python
def download_many(cc_list):
    cc_list = cc_list[:5] ➊
    with futures.ThreadPoolExecutor(max_workers=3) as executor: ➋
        to_do = []
        for cc in sorted(cc_list): ➌
            future = executor.submit(download_one, cc) ➍
            to_do.append(future) ➎
            msg = 'Scheduled for {}: {}'
            print(msg.format(cc, future)) ➏
    results = []
    for future in futures.as_completed(to_do): ➐
        res = future.result() ➑
        msg = '{} result: {!r}'
        print(msg.format(future, res)) ➒
        results.append(res)
    return len(results)
``` -->

综上，我们可以看到使用 `concurrent.future` 模块进行多线程、多进程编程会比用 `threading` 和 `multiprocessing` 简单许多。

参见：

- [使用 Python 进行并发编程-PoolExecutor 篇](http://www.dongwm.com/archives/%E4%BD%BF%E7%94%A8Python%E8%BF%9B%E8%A1%8C%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B-PoolExecutor%E7%AF%87/)
