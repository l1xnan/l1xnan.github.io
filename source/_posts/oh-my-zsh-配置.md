---
layout: pages
title: oh-my-zsh 配置
date: 2018-07-15 10:28:27
tags:
  - shell
  - Linux

categories:
  - Linux
---

## 安装

参见 [oh-my-zsh 官网](https://ohmyz.sh/)
首先安装 `zsh`
```
apt install zsh
```
下载并安装： 
```bash
$ sh -c "$(curl -fsSL https://raw.github.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
```

或者

```bash
$ sh -c "$(wget https://raw.github.com/robbyrussell/oh-my-zsh/master/tools/install.sh -O -)"
```
注意：安装完成后，以后对 `~/.bashrc` 的配置要放到 `~./zshrc` 中进行。

若想卸载，可直接运行 `uninstall_oh_my_zsh`。

## 配置主题

打开配置文件

```shell
nano ~./zshrc
```

修改 `ZSH_THEME=` 行：

```
ZSH_THEME="ys"
```

更多主题介绍，参见：[Themes](https://github.com/robbyrussell/oh-my-zsh/wiki/Themes)

<!-- more -->

## 配置插件

[Plugins](https://github.com/robbyrussell/oh-my-zsh/wiki/Plugins)
使用如下命令，查看已安装（默认只启用 `git` 插件）的插件：

```
ls ~/.oh-my-zsh/plugins
```

安装插件很简单，只有添加相应的插件名，并用换行或者空格隔开不同插件名称。

```bash
plugins=(
  git
  z
)
```

### z

使用 cd 命令浏览你常用的目录。`z` 会监视哪些是你经常和最近访问的，并建立一个加权的路径列表。



| 命令      | 说明                                    |
| --------- | --------------------------------------- |
| z foo     | `cd` 到最匹配 foo 的路径                |
| z foo bar | `cd` 到最匹配 foo 和 bar 的路径         |
| z -r foo  | `cd` 到匹配 foo 的 dir 中排名最高的路径 |
| z -t foo  | `cd` 到匹配 foo 的 dir 中最近访问的路径 |
| z -l foo  | 列出所有匹配 foo 的 dir                 |
更多请查看[官网文档](https://github.com/rupa/z)

### extract

项目文档：[extract](https://github.com/xvoland/Extract)

支持的解压或提取格式：

    .zip, .rar, .bz2, .gz, .tar, .tbz2, .tgz, .Z, .7z, .xz, .exe, .tar.bz2, .tar.gz, .tar.xz, .arj, .cab, .chm, .deb, .dmg, .iso, .lzh, .msi, .rpm, .udf, .wim, .xar .cpio
使用方法很简单
```shell
$ extract <archive_filename.extention>

$ extract <archive_filename_1.extention> <archive_filename_2.extention> <archive_filename_3.extention> ...
```
### history

查看历史输入所有命令。用法：在终端输入 `h` 即可。

### 自动补全

实时补全文件名


### zsh-autosuggestions

根据历史输入指令的记录即时的提示。
安装：
```
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
```
配置，编辑 `~/.zshrc` 文件：
```
plugins=(zsh-autosuggestions)
```
配置生效：`source ~/.zshrc`。

### zsh-syntax-highlighting
命令高亮。[文档](https://github.com/zsh-users/zsh-syntax-highlighting)


### zsh-incremental
实时补全路径。[说明](http://mimosa-pudica.net/zsh-incremental.html)


参考资料：
[oh-my-zsh 插件介绍](https://jyzhangchn.github.io/oh-my-zsh-diy.html)