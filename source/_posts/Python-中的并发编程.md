---
layout: pages
title: Python 中的并发编程
date: 2018-07-08 15:55:36
tags:
  - Python
  - 并发
categories:
  - Python
---

Python 中的并发主要涉及三种：多进程、多线程、协程。
相信提到多线程大家首先想到的是标准库 `threading`，而提到多进程首先会想到标准库 `multiprocessing`。在 Python 这两个标准库几乎成了 Python 并发编程的代名词。对于这两个标准库，无论网络还是书籍，可查阅的资料非常丰富，我们不多做介绍。本文主要介绍从 Python3.2 开始被纳入标准库 `concurrent.futures`，它是对 `threading` 和 `multiprocessing` 进一步的封装和高级别的抽象，暴露出统一的接口，帮助开发者非常方便的实现异步调用。可以查阅其最初的提案 [PEP 3148](https://www.python.org/dev/peps/pep-3148/)。

## 模块接口

`concurrent.futures` 模块提供的接口很简单，提供了：

- 类 `Executor`：一个抽象类，提供异步执行调用的方法。 我们一般使用其具体的子类，而不直接调用它。
- 类 `ThreadPoolExecutor`：是 `Executor` 的子类。提供了线程池的支持。
- 类 `ProcessPoolExecutor`：是 `Executor` 的子类。提供了线程池的支持。把工作分配给多个 Python 进程处理。因此，如果需要做 CPU 密集型处理，使用这个模块能绕开 GIL，利用所有可用的 CPU 核心。
- 类 `Future`：封装了可调用的异步执行。 其实例由 `Executor.submit()` 创建，表示可能已经完成或者尚未完成的延迟计算。
- 函数 `await`：
- 函数 `as_completed(fs, timeout=None)`：返回由 `fs` 给出的 `Future` 实例（可能由不同的`Executor` 实例创建）的迭代器，它们在结束（结束状态可能是完成或被取消）时产生 future。 `fs` 复制的任何期货都将被退回一次。 在调用 `as_completed()`之前完成的任何 future 都将首先产生。 如果异步函数超时，则调用 `__next__()` 返回迭代器时会引发 `concurrent.futures.TimeoutError`。 `timeout` 可以是 `int` 或 `float`。如果未指定`timeout` 或 `None`，则等待时间没有限制。

### ThreadPoolExecutor 和 ProcessPoolExecutor

```python
class ThreadPoolExecutor(max_workers=None, thread_name_prefix='')
```

```python
class ProcessPoolExecutor(max_workers=None)
```

`ThreadPoolExecutor` 和 `ProcessPoolExecutor`，是 `Executor` 的子类，它们都实现了通用的 `Executor` 接口，因此使用 `concurrent.futures` 模块能特别轻松地把基于线程的方案转成基于进程的方案。

- `submit(fn, *args, **kwargs)`：将可调用的 `fn` 调度为 `fn(* args ** kwargs)` 并返回表示可调用执行的 `Future` 对象。
- `map(func, *iterables, timeout=None, chunksize=1)`：类似于 `map(func, *iterables)`，但是 `func` 是异步执行。若想并发运行多个可调用的对象可调用此函数。

  - `func`：需要异步执行的函数。
  - `*iterables`：可迭代对象，如列表等。每一次 `func` 执行，都会从 `iterables` 中取参数。
  - `timeout`：设置每次异步操作的超时时间。它的值可以是 `int` 或 `float`，如果操作超时，会返回 `raisesTimeoutError`；如果不指定 timeout 参数，则不设置超时间。

- `shutdown(wait=True)`：向执行者发出信号，表示当目前待处理的期货执行完毕时，它应该释放它正在使用的任何资源。 在关闭后调用 `Executor.submit()` 和 `Executor.map()` 将引发 `RuntimeError`。

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
```

### Future

```python
class Future
```

```python
wait(fs, timeout=None, return_when=ALL_COMPLETED)
```

## 应用实例
