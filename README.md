# 部署记录

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

### 修改配置文件

```
deploy:
  type: git
  repo: https://gitee.com/<username>/<username>.git
  branch: master
```

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

## 问题处理
在某些情况（尤其是更换主题后），如果发现您对站点的更改无论如何也不生效，您可能需要运行命令：
```
hexo clean
```
参考：

* [Hexo 官方文档](https://hexo.io/zh-cn/docs/)
* [NexT 主题文档](http://theme-next.iissnan.com/)
