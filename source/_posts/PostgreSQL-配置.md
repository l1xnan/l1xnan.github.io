---
layout: pages
title: PostgreSQL 配置
date: 2018-07-13 23:44:57
tags:
  - Linux
  - PostgreSQL

categories: 
  - PostgreSQL
---

## 安装

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
<!-- more -->
## 配置

### 修改系统 postgres 用户的密码

PostgreSQL 会创建一个默认的 linux 用户 postgres，修改该用户密码的方法如下：

1. 删除用户 `postgres` 的密码

```bash
sudo passwd -d postgres
```

2. 设置用户 postgres 的密码

```bash
sudo -u postgres passwd
```

3. 系统提示输入新的密码

```bash
Enter new UNIX password:
Retype new UNIX password:
passwd: password updated successfully
```

### 修改数据库默认用户 postgres 的密码
PostgreSQL数据库创建一个postgres用户作为数据库的管理员，密码随机，所以需要修改密码，方式如下：

1. 登录PostgreSQL
```bash
sudo -u postgres psql
```
2. 修改登录PostgreSQL密码
```sql
ALTER USER postgres WITH PASSWORD 'postgres';
```
或
```sql
\password postgres
```
注：
1. 密码 postgres 要用引号引起来
2. 命令最后有分号 `;`


## 用户、数据库
进入系统 postgres 用户：
```bash
sudo su - postgres
```
进入 PostgreSQL 命令行
```
psql
```
创建角色
```sql
CREATE USER exampleUser WITH PASSWORD 'example-password';
```
创建数据库，并指定所有者：
```sql
create database exampleDB owner exampleUser;
```
将 `exampleDB` 数据库的所有权限都赋予 `exampleUser`。
```sql
GRANT ALL PRIVILEGES ON DATABASE exampleDB to exampleUser;
```
上述命令还可以在 bash 中完成，便于自动化部署：
```
sudo -u postgres createuser --superuser dbuser
sudo -u postgres createdb -O dbuser exampledb
```

参见：[PostgreSQL新手入门](http://www.ruanyifeng.com/blog/2013/12/getting_started_with_postgresql.html)