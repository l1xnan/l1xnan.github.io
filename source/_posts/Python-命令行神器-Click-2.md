---
title: Python 命令行神器 Click（二）打包
tags:
  - Python
  - 命令行
categories:
  - Python
abbrlink: 4615
date: 2018-07-16 22:33:14
---

## 介绍

要用 `setuptools` 打包你的 script，您只需要这个 Python 包的脚本文件和 `setup.py` 文件。 想象一下这个目录结构：

    yourscript.py
    setup.py

你的脚本文件 `yourscript.py` 内容：

```python
import click

@click.command()
def cli():
    """Example script."""
    click.echo('Hello World!')
```

而 `setup.py` 文件内容：

```python
from setuptools import setup

setup(
    name='yourscript',
    version='0.1',
    py_modules=['yourscript'],
    install_requires=[
        'Click',
    ],
    entry_points='''
        [console_scripts]
        yourscript=yourscript:cli
    ''',
)
```

重点在 `entry_points` 参数中。在 `console_scripts` 下面，每行标识一个控制台脚本。 等号（=）左边是应该生成的命令行应用的名称，等号右边是导入路径，后跟冒号（:)和 click 命令函数。

就这样！

<!-- more -->

## 测试程序

要测试脚本，您可以创建一个新的 virtualenv，然后安装您的包：

```shell
$ virtualenv venv
$ . venv/bin/activate
$ pip install --editable .
```

之后，您的命令应该可用：

```shell
$ yourscript
Hello World!
```

## 包中的命令行应用

如果您的脚本正在增长，并且您希望切换到包含在 Python 包中的脚本，我们只需要做很少的更改就能达到目的。 我们假设您的目录结构更改为：

    yourpackage/
        __init__.py
        main.py
        utils.py
        scripts/
            __init__.py
            yourscript.py

在这种情况下，您可以使用软件包和 setuptools 的自动软件包查找支持，而不是在`setup.py` 文件中使用 `py_modules`。 除此之外，还建议包括其他包数据。

这样，你只需要对 `setup.py` 内容做如下修改：

```python
from setuptools import setup, find_packages

setup(
    name='yourpackage',
    version='0.1',
    packages=find_packages(),
    include_package_data=True,
    install_requires=[
        'Click',
    ],
    entry_points='''
        [console_scripts]
        yourscript=yourpackage.scripts.yourscript:cli
    ''',
)
```
