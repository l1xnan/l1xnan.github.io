---
title: Flask-SQLAlchemy 调试
tags:
  - Flask
categories:
  - Flask
abbrlink: 10329
date: 2018-10-06 23:09:37
---

在使用 Flask-SQLAlchemy 时，如果想调试相关代码，一般和调试 Flask 调试一样，运行
```bash
flask shell
```
进入 Shell 环境进行。
注意，原生运行此命令，Shell 环境为默认的 Python 环境，没有 IPython 提供的代码高亮和代码提示。
此时安装 `flask-shell-ipython` 插件可以解决此问题。

如果不想使用上述插件，我们可以创造一个应用上下文环境，即控制台运行 `ipython`，进入 IPython 环境，在其中运行代码：
```py
from manage import app, db
ctx = app.app_context()
ctx.push()
```
这样既创造了一个应用上下文环境。下面我们就可以正常完成数据库的增删查改操作。

如果使用 PyCharm 编辑器，其提供的 `Python Console` 提供了查看当前变量值等功能更加的方便，同理可以在其中运行上述代码。
每次运行上述代码嫌麻烦，PyCharm 提供了 `Starting script` 功能，具体操作如下：

    Setting > Build, Execution, Deployment > Console > Python Console > Starting script
然后将上述代码，添加到其中，每次运行 `Python Console` 就能自动加载上述代码。