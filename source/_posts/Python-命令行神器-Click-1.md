---
layout: pages
title: Python 命令行神器 Click（一）快速上手
date: 2018-07-16 16:58:34
tags:
  - Python
  - 命令行
categories:
  - Python
---

## 简介

[Click](http://click.pocoo.org) 是 Python 的一个第三方库，它只需要很少的代码就能以可组合的方式创建漂亮的命令行工具。 这是“命令行界面创建工具库”。 它具有高度可配置性，但具有开箱即用的合理默认值。

- 命令的任意嵌套
- 自动生成帮助信息
- 支持在运行时子命令的延迟加载

## 安装

```bash
pip install click
```

<!-- more -->

## 基础示例

```python
# ./hello.py
import click

@click.command()                    # ①
def hello():
    """命令行界的 Hello World!"""
    click.echo('Hello World!')      # ②

if __name__ == '__main__':
    hello()
```

然后我们在控制台中查看：

```bash
$ python hello.py
Hello World!
$ python hello.py --help
Usage: hello.py [OPTIONS]

  命令行界的 Hello World!

Options:
  --help  Show this message and exit
```

click 是基于装饰器的。在上述示例中的 ① 行，我们在函数上使用 `click.command()` 装饰器来将该函数变成一个命令行工具。注意在程序的 ② 行，我们使用了了 `click.echo()` 函数，它等价于 `print`，不过它的参数更丰富：

```python
click.echo(message=None, file=None, nl=True, err=False, color=None)
```

如上，`color` 可以定义打印颜色，让我们的输出更美观。详情请查看官网文档 [click.echo](http://click.pocoo.org/6/api/#click.echo)

## 嵌套命令

现实中我们的命令行程序可能要实现好多功能，那么单纯的用一个指令带一堆选项或者参数的方式可能不够用，这是我们可以用 `click.group()` 定义嵌套命令来解决。然后我们用 `add_command` 函数，将子命令绑定到嵌套命令主函数上：

```python
import click

@click.group()
def cli():
    pass

@click.command()
def initdb():
    click.echo('Initialized the database')

@click.command()
def dropdb():
    click.echo('Dropped the database')

cli.add_command(initdb)
cli.add_command(dropdb)

if __name__ == '__main__':
    cli()
```

在控制台中运行代码：

```bash
$ python .\cli.py --help
Usage: cli.py [OPTIONS] COMMAND [ARGS]...

Options:
  --help  Show this message and exit.

Commands:
  dropdb
  initdb
$ python .\cli.py initdb
Initialized the database
$ python .\cli.py initdb --help
Usage: cli.py initdb [OPTIONS]

Options:
  --help  Show this message and exit.
```

## 添加参数

我们可以用 [`option()`](http://click.pocoo.org/6/api/#click.option) 和 [`argument()`](http://click.pocoo.org/6/api/#click.argument) 装饰器给命令行程序添加参数。

```bash
import click

@click.command()
@click.option('--count', default=1, help='number of greetings')
@click.argument('name')
def hello(count, name):
    for x in range(count):
        click.echo('Hello %s!' % name)
```

然后我们在命令行中运行：

```bash
$ python hello.py --help
Usage: hello.py [OPTIONS] NAME

Options:
  --count INTEGER  number of greetings
  --help           Show this message and exit.
```

如 ② ，我们使用 `@click.option` 定义命令行的参数，在其中我们定义可以定义：

- 在 `option` 函数第一个参数中定义 `--number` 参数名。
- 在 `option` 函数第二个参数中定义 `-n` **短**参数名。
- `default` 定义参数的默认值
- `type` 定义参数的类型
- `help` 定义命令的帮助信息

详情，请查看文档 [Options](http://click.pocoo.org/6/options/)

## 安装

对上面编写代码，文件末尾有一个需要有个运行块，如下所示：

```python
if __name__ == '__ main__'：
    hello()
```

如传统上的一个独立 Python 文件。使用 click，您可以继续这样做，但有更好的方法通过 `setuptools`。

有两个主要（以及更多）原因：

- 第一个原因是 setuptools 自动为 Windows 生成可执行包装器，因此您的命令行实用程序也可以在 Windows 上运行。
- 第二个原因是 `setuptools` 脚本在 Unix 上使用 `virtualenv`，而不必激活`virtualenv`。 这是一个非常有用的概念，允许您将所有需求的脚本捆绑到 `virtualenv`中。
-

Click 非常适合使用它，实际上其他文档（官网文档其他部分）将假设您正在通过 `setuptools` 编写应用程序。

我强烈建议您在阅读其余部分之前先查看 [Setuptools Integration](http://click.pocoo.org/6/setuptools/#setuptools-integration) 章节，因为示例假设您将使用 `setuptools`。
