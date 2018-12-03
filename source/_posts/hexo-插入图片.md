---
title: hexo 插入图片
abbrlink: 55443
date: 2018-12-03 21:58:26
tags:
categories:
---

vscode 内无法预览{% asset_img xxx %}代码的图片，通过插件 `Markdown Preview Enhanced` 来解决，首先安装此插件，然后 `ctrl+shift+P` 输入

```
Markdown Preview Enhanced: Extend Parser
```

调出插件的 `parse.js` 文件，修改其中的 `onWillParseMarkdown` 方法：

```js
module.exports = {
  onWillParseMarkdown: function (markdown) {
    return new Promise((resolve, reject) => {
      const title = /title:\s*(.*)/.exec(markdown)[1].replace(/\s/, '-')
      markdown = markdown.replace(
        /\{%\s*asset_img\s*(\S*)\s*(.*)\s+%\}/g,
        (whole, $1, $2) =>  (`![${$2}](${title}/${$1})`)
      )
      return resolve(markdown)
    })
  },
  ...  ...
};
```
