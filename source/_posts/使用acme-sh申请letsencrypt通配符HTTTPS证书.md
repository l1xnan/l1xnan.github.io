---
title: 使用 acme.sh 申请Let's Encrypt 通配符 HTTTPS 证书
tags:
  - 部署
  - HTTPS
  - 证书
categories:
  - 后端
abbrlink: 46579
date: 2018-06-05 17:34:27
---

## 安装证书

### 安装脚本

```bash
# 安装 sh 脚本
curl https://get.acme.sh | sh
```

重载配置

```
source ~/.bashrc
```

如果用的 zsh 用：

```
source ~/.zshrc
```

以下都是以 `zsh` 为例：

<!-- more -->

## 域名验证

为了验证域名所有权，Let's Encrypt 支持两种方式来验证：

1.  域名的 DNS: 配置一个随机的 TXT 记录来验证
2.  域名的访问: 配置一个随机的 URL 地址来验证

这里推荐使用 DNS 验证方式。

以阿里云为例，首先在

```
访问控制 > 阿里云子账户 > 用户管理
```

中添加用户，给此授予 `DNS 管理权限`（可以在界面中输入`DNS`搜索相关权限）
然后创建 `AccessKey`，生成 `AccessKeyId` 和 `AccessKeySecret`，保存待用

在 `.zshrc` 中添加：

```bash
export Ali_Key="AccessKeyId"
export Ali_Secret="AccessKeySecret"
```

然后

```
source ~/.zshrc
```

## 颁发证书

### 生成证书

可以对单域名、多域名、泛域名进行颁发

```bash
acme.sh --issue --dns dns_ali -d 'mapledu.cn' -d '*.mapledu.cn'
```

这里会进行域名的 DNS 验证，中间会等待 120 秒来验证正确性，验证成功后会有成功标记。

```
[Mon May 21 19:41:35 CST 2018] Registering account
[Mon May 21 19:41:37 CST 2018] Registered
[Mon May 21 19:41:37 CST 2018] ACCOUNT_THUMBPRINT='jPaF9_SSQDKyCMyRoc9NqS3avPthoH<******>-<******>'
[Mon May 21 19:41:37 CST 2018] Creating domain key
[Mon May 21 19:41:37 CST 2018] The domain key is here: /root/.acme.sh/mapledu.cn/mapledu.cn.key
[Mon May 21 19:41:37 CST 2018] Multi domain='DNS:mapledu.cn,DNS:*.mapledu.cn'
[Mon May 21 19:41:37 CST 2018] Getting domain auth token for each domain
[Mon May 21 19:41:39 CST 2018] Getting webroot for domain='mapledu.cn'
[Mon May 21 19:41:39 CST 2018] Getting webroot for domain='*.mapledu.cn'
[Mon May 21 19:41:39 CST 2018] Found domain api file: /root/.acme.sh/dnsapi/dns_ali.sh
[Mon May 21 19:41:41 CST 2018] Found domain api file: /root/.acme.sh/dnsapi/dns_ali.sh
[Mon May 21 19:41:43 CST 2018] Sleep 120 seconds for the txt records to take effect
[Mon May 21 19:43:45 CST 2018] Verifying:mapledu.cn
[Mon May 21 19:43:48 CST 2018] Pending
[Mon May 21 19:43:50 CST 2018] Success
[Mon May 21 19:43:50 CST 2018] Verifying:*.mapledu.cn
[Mon May 21 19:43:54 CST 2018] Success
[Mon May 21 19:43:54 CST 2018] Removing DNS records.
[Mon May 21 19:43:59 CST 2018] Verify finished, start to sign.
[Mon May 21 19:44:01 CST 2018] Cert success.
-----BEGIN CERTIFICATE-----
<此时省略证书内容>
-----END CERTIFICATE-----
[Mon May 21 19:44:01 CST 2018] Your cert is in  /root/.acme.sh/mapledu.cn/mapledu.cn.cer
[Mon May 21 19:44:01 CST 2018] Your cert key is in  /root/.acme.sh/mapledu.cn/mapledu.cn.key
[Mon May 21 19:44:01 CST 2018] The intermediate CA cert is in  /root/.acme.sh/mapledu.cn/ca.cer
[Mon May 21 19:44:01 CST 2018] And the full chain certs is there:  /root/.acme.sh/mapledu.cn/fullchain.cer
```

该命令执行后，会在计划表里添加计划。

```
crontab -l
```

### 复制证书

前面证书生成以后, 接下来需要把证书 copy 到真正需要用它的地方.

注意, 默认生成的证书都放在安装目录下: ~/.acme.sh/, 请不要直接使用此目录下的文件,
例如: 不要直接让 nginx/apache 的配置文件使用这下面的文件. 这里面的文件都是内部使用,
而且目录结构可能会变化.

正确的使用方法是使用 --installcert 命令,并指定目标位置, 然后证书文件会被 copy 到相应的位置：

```bash
acme.sh --installcert -d "mapledu.cn" -d "*.mapledu.cn" \
    --cert-file /etc/nginx/cert.d/mapledu.cn/mapledu.cn.cer\
    --key-file /etc/nginx/cert.d/mapledu.cn/mapledu.cn.key\
    --ca-file /etc/nginx/cert.d/mapledu.cn/ca.cer\
    --fullchain-file /etc/nginx/cert.d/mapledu.cn/fullchain.cer\
    --reloadcmd "service nginx force-reload"
```

### nginx 配置

nginx 配置是注意配置的是 `key-file` 和 `fullchain-file` 文件：

```
ssl_certificate   /etc/nginx/cert.d/mapledu.cn/fullchain.cer;
ssl_certificate_key  /etc/nginx/cert.d/mapledu.cn/mapledu.cn.key;
```

特别是 `ssl_certificate` 项，应该配置生成的 `fullchain.cer`，而不是 `mapledu.cn.cer`。否则在微信小程序 https 证书验证中会出错。

## 通用脚本

也可以将颁发证书和安装证书两个命令合到一块，通用脚本如下：

```bash
domain="mapledu.cn"
mkdir -p /etc/nginx/cert.d/$domain
acme.sh -d "$domain" -d "*.$domain" \
    --issue --dns dns_ali \
    --installcert \
    --cert-file /etc/nginx/cert.d/$domain/$domain.cer\
    --key-file /etc/nginx/cert.d/$domain/$domain.key\
    --ca-file /etc/nginx/cert.d/$domain/ca.cer\
    --fullchain-file /etc/nginx/cert.d/$domain/fullchain.cer\
    --reloadcmd "service nginx force-reload"
```

## 更新 acme.sh

目前由于 acme 协议和 letsencrypt CA 都在频繁的更新, 因此 acme.sh 也经常更新以保持同步.

升级 acme.sh 到最新版 :

```
acme.sh --upgrade
```

如果你不想手动升级, 可以开启自动升级:

```
acme.sh  --upgrade  --auto-upgrade
```

之后, acme.sh 就会自动保持更新了.

你也可以随时关闭自动更新:

```
acme.sh --upgrade  --auto-upgrade  0
```

参考：

1.  [acme.sh 官方文档](https://github.com/Neilpang/acme.sh/wiki/%E8%AF%B4%E6%98%8E)
2.  [使用 acme.sh 部署 Let's Encrypt 通过阿里云 DNS 验证方式实现泛域名 HTTPS](http://frontenddev.org/article/use-acme-sh-deployment-let-s-encrypt-by-ali-cloud-dns-generic-domain-https-authentication.html)
3.  [利用 acme.sh 申请 Letsencrypt 免费 SSL 证书](https://blog.neroxps.cn/2018/03/17/acme/)
