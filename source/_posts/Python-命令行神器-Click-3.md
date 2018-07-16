---
layout: pages
title: Python 命令行神器 Click（三）细节
date: 2018-07-16 23:14:02
tags:
  - Python
  - 命令行
categories:
  - Python
---

## 命令行应用帮助

```python
# @click.command(help="此命令帮助")
@click.command()
def cli():
    """此命令 docstring """
    pass
```

如果你的 `click.command()` 没有定义 `help` 参数，则程序会用函数体的 `docstring` 内容代替。

<!-- more -->

更多细节请查阅官网文档：

- [Click 文档：装饰器函数参数](http://click.pocoo.org/6/parameters/)
- [Click 文档：命令行选项](http://click.pocoo.org/6/options/)
- [Click 文档：命令行参数](http://click.pocoo.org/6/arguments/)
- [Click 文档：命令组](http://click.pocoo.org/6/commands/)
- [Click 文档：用户输入提示](http://click.pocoo.org/6/prompts/)
- [Click 文档：定义命令行帮助文档](http://click.pocoo.org/6/documentation/)
- [Click 文档：复杂应用](http://click.pocoo.org/6/complex/)
- [Click 文档：高级用法](http://click.pocoo.org/6/advanced/)
- [Click 文档：测试应用](http://click.pocoo.org/6/testing/)
- [Click 文档：实用工具](http://click.pocoo.org/6/utils/)
- [Click 文档：Bash <tab> 完成](http://click.pocoo.org/6/bashcomplete/)
- [Click 文档：异常处理](http://click.pocoo.org/6/exceptions/)

... ...

以及参考文章：

- [click 命令行工具使用详解](https://xin053.github.io/2016/07/31/click%E5%91%BD%E4%BB%A4%E8%A1%8C%E5%B7%A5%E5%85%B7%E4%BD%BF%E7%94%A8%E8%AF%A6%E8%A7%A3/)
