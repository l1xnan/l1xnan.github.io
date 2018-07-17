---
title: 阿里云 ECS Ubuntu 配置
tags:
  - 服务器
  - Linux
categories:
  - Linux
abbrlink: 8642
date: 2018-07-13 23:11:28
---

环境：Ubuntu 18.04

### Python

参见：

### PostgreSQL

创建 `pgdg.list`编辑配置文件：

    /etc/apt/sources.list.d/pgdg.list

添加如下内容：

```bash
deb http://apt.postgresql.org/pub/repos/apt/ bionic-pgdg main
```

导入存储库签名密钥，并更新包列表：

```bash
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
sudo apt-get update
```

安装：

```bash
apt-get install postgresql-10
```

参见：[LINUX DOWNLOADS (UBUNTU)](https://www.postgresql.org/download/linux/ubuntu/)

### Nginx

不用其他复杂配置，直接运行，即可安装最新稳定版：

```bash
sudo apt install nginx
```
