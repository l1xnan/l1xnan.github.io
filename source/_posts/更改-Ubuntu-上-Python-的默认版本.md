---
layout: pages
title: 更改 Ubuntu 上 Python 的默认版本
date: 2018-07-13 22:11:20
tags:
  - Ubuntu
  - Linux
categories:
  - Linux
---

通常 Python 用户使用非系统 Python 发行版，如 Miniconda。这些 Python 发行版通常允许在 Python 版本之间轻松切换。但是，在必须使用系统 Python 的情况下，可以使用 `update-alternatives` 持久切换默认的 Python 版本。具体步骤如下：

## 不用 sudo

新建路径：

```bash
mkdir ~/.local/bin
```

编辑 `.bashrc`

```bash
export PATH="$HOME/.local/bin:$PATH"
```

设置：

```bash
update-alternatives --install $HOME/.local/bin/python python /usr/bin/python3 20

update-alternatives --install $HOME/.local/bin/python python /usr/bin/python2 10
```

## 需要使用 sudo

```bash
update-alternatives --install /usr/bin/python python /usr/bin/python2 20 --slave /usr/bin/pip pip /usr/local/bin/pip2
update-alternatives --install /usr/bin/python python /usr/bin/python3 30 --slave /usr/bin/pip pip /usr/local/bin/pip3
```

## 查看与切换

```bash
update-alternatives --config python
```

翻译自：[Set Python version with update-alternatives](https://www.scivision.co/set-python-version-update-alternatives/)
