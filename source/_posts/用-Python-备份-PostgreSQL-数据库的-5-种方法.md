---
layout: pages
title: 用 Python 备份 PostgreSQL 数据库的 5 种方法
date: 2018-07-15 01:20:52
tags:
  - Python
  - PostgreSQL
  - 备份

categories:
  - PostgreSQL
---

## 介绍

翻译自：[5 different ways to backup your PostgreSQL database using Python](https://medium.com/poka-techblog/5-different-ways-to-backup-your-postgresql-database-using-python-3f06cea4f51)

如果您正在为您的应用程序运行 PostgreSQL 数据库，则可能需要运行备份。

Because good boys run backups. And you’re a good boy 🐶.

现在，从 bash shell 备份 PostgreSQL 数据库非常简单。只需像这样调用 pg_dump：

```bash
pg_dump -h localhost -U postgres my_database
```

您还需要压缩备份。 您可以通过压缩转储文件轻松节省大量磁盘空间：

```bash
pg_dump -h localhost -U postgres my_database | gzip > backup.gz
```

但是如何使用 Python 进行数据库备份呢？让我向您展示几种可以实现这一目标的方法。

## 用 subprocess

```python
import gzip
import subprocess
with gzip.open('backup.gz', 'wb') as f:
  popen = subprocess.Popen(cmd, stdout=subprocess.PIPE, universal_newlines=True)

  for stdout_line in iter(popen.stdout.readline, ""):
    f.write(stdout_line.encode('utf-8'))

  popen.stdout.close()
  popen.wait()
```

关于这个片段的一个好处就是你将逐行将 `pg_dump` 的输出写入 `backup.gz`。这意味着对于大型数据库，内存使用量将保持很小，因为您不会立即将整个转储装载到内存中。

## 用 sh

```python
import gzip
from sh import pg_dump
with gzip.open('backup.gz', 'wb') as f:
  pg_dump('-h', 'localhost', '-U', 'postgres', 'my_dabatase', _out=f)
```

看起来更干净，对吧？[sh](https://github.com/amoffat/sh) 是一个短小优雅的库，旨在使调用子进程更容易。如果你不介意依赖另一个第三方库，那么强烈推荐 `sh`。注意你如何导入 `pg_dump` 就像它是一个真正的 Python 模块一样。简直就是魔术。 就像使用 `subprocess` 的示例一样，您不会撑爆 RAM，因为 `pg_dump` 的输出将流式传输到 `backup.gz` 文件。

## 使用 delegator.py

```python
import gzip
import delegator
with gzip.open('backup.gz', 'wb') as f:
  c = delegator.run('pg_dump -h localhost -U postgres my_database')
  f.write(c.out.encode('utf-8'))
```

[delegator.py](https://github.com/kennethreitz/delegator.py) 是一个单独的模块，由 `requests` 的作者 `Kenneth Reitz` 创建。 上面的代码片段看起来没有 `sh` 示例那么魔术，你在写入压缩文件之前，您必须将字符串编码为字节。与 `subprocess` 或 `sh` 示例不同，此方法将随着数据库的增长逐渐使用更多内存，因此我只将其用于小型数据库。我没有找到任何方法来规避这个问题，所以如果你有敲门，请告诉我！

## 使用 pexpect

```python
import gzip
import pexpect
with gzip.open('backup.gz', 'wb') as f:
  c = pexpect.spawn('pg_dump -h localhost -U postgres my_database)
  f.write(c.read())
```

做了一些关于子过程替代的研究，我偶然发现了 [pexpect](https://github.com/pexpect/pexpect)。由于它看起来是一个非常受欢迎的库，我无法跳过它。我喜欢这段代码--直截了当。在写入 gzip 文件之前，无需编码字符串！就像 `delegator.py` 示例一样，如果你不小心的话，这段代码可能会破坏你的内存使用量。当然，代码也非常干净，所以我加上了这段代码！

## 使用 plumbum

```python
import gzip
from plumbum.cmd import pg_dump
with gzip.open('backup.gz', 'wb') as f:
   (pg_dump[“-h”, “localhost”, “-U”, “postgres”, “my_database”] > f)()
```

魔术重载！ 我喜欢这个代码片段使用 `>` 运算符来模仿 bash 中 IO 重定向的行为。这个库有许多使用管道运算符进行 IO 重定向的好例子。与前面的 2 个示例一样，此方法不会逐渐将转储流式传输到 gzip 压缩文件，因此仅适用于较小的数据库。

## 总结

我向您展示了使用 python 调用 `pg_dump` 的 5 种不同的方式。如果您不想安装另一个第三方库，或者“魔术”让您感到害怕，那么 `subprocess` 示例绝对是您的选择。 然而，`sh` 示例更容易理解，并且在内存使用方面表现良好。对于生产用途，我会避开最后 3 个例子，因为它们往往会占用大量内存。此外，由于您是一个好的🐕，请务必测试您的备份恢复程序！