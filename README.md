---
title: 记录本次建站配置过程
date: 2018-05-26 00:28:51
tags: 备忘录
---


前置条件：安装`git`，`nodejs`

## 初始化

```bash
npm install -g hexo
hexo init <folder>
cd <folder>
```

```bash
npm install
npm install -D hexo-deployer-git
```

## 部署

### git 相关

`gitee.com/<username>`上创建`<username>`同名仓库：

```
https://gitee.com/<username>/<username>.git
```
<!-- more -->
### 修改配置文件

```
deploy:
  type: git
  repo: https://gitee.com/<username>/<username>.git
  branch: master
```
`branch` 可以是 `master` 分支，也可以是自定义的其他分支（如：`gh-pages`）

部署上传

```
hexo g -d
```

地址：`https://<username>.gitee.io`，即为你的`Pages`页地址。

## 备份源文件

```
git init
git remote add origin <git-repo-url>
git checkout -b src
git add .
git commit -m "初始化"
git push origin src
```
其中 `<git-repo-url>` 可以与 `_config.yml` 配置文件中，博客静态文件的 `deploy/repo` 相同，也可以是自己其他私有仓库的地址，避免直接公开博客源文件。

## 异地更新

```
git clone <git-repo-url>
```

重复`初始化`

## 修改主题

### 下载安装

```
$ cd hexo
$ git clone https://github.com/theme-next/hexo-theme-next themes/next
```

### 修改配置

修改 `_config.yml` 配置文件：

```
# 修改语言为中文，注意是 zh-CN
language: zh-CN
```

新建文件：

```
source/_data/next.yml
```

复制 `themes/next/_config.yml` 内的文件至 `next.yml`，然后修改 `next.yml` 文件。

选择 主题：
```
#scheme: Muse
#scheme: Mist
scheme: Pisces
...
```
设置 语言：

（注意`NexT 6.0` 以上版本语言配置是 `zh-CN`，而不是 `zh-Hans`）
```
language: zh-CN
```
设置 菜单：
```
hexo new page tags
hexo new page categories
hexo new page about
```
修改对应生成的文件：
```
# /source/tags/index.md
title: 标签
type: "tags"
```
```
# /source/categories/index.md
title: "分类"
type: "categories"
```
```
# /source/about/index.md
title: 关于
```
### 升级主题

```
$ cd themes/next
$ git pull
```
### 其他主题推荐
`hexo-theme-material`：https://github.com/viosey/hexo-theme-material



## 优化体验
如果用 VSCode 作为博客的编辑器，可以隐藏一些不必要的文件（如：配置完成后隐藏配置文件）来优化体验。可在`工作区配置`中添加：
```json
{
  "files.exclude": {
    "**/.git": true,
    "**/.deploy*": true,
    "**/node_modules": true,
    "*.json": true,
    "*.lock": true,
    "themes": true,
    "source/_data": true,
    "public": true,
  }
}
```
安装插件：
* Markdown All in One
* vscode-hexo


## 问题处理
windows 下 git 出现恼人的 `warning: LF will be replaced by CRLF` 警告，修改 `git` 配置：

```
git config --global core.autocrlf false
```

在某些情况（尤其是更换主题后），如果发现您对站点的更改无论如何也不生效，您可能需要运行命令：
```
hexo clean
```
参考：

* [Hexo 官方文档](https://hexo.io/zh-cn/docs/)
* [NexT 主题文档](http://theme-next.iissnan.com/)
