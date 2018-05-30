---
layout: pages
title: VSCode 配置
date: 2018-05-30 22:53:42
tags: VSCode
---

# 必备插件

## 优化编辑器

* Guides: 优化缩进线
* indent-rainbow: 优化缩进点
* Better Comments： 优化注释
* Terminal: 可以在编辑器底边栏添加一个控制台按钮，便于鼠标快速访问
* Code Outline: 显示代码大纲

## 主题

* Material Theme

## 效率工具

* Auto Close Tag
* Auto Rename Tag
* Path Intellisense

## 版本控制

* gitignore
* GitLents

## 语言相关

Vue:

* Vetur

Python：

* Python

## 代码检查、格式化

* ESlint
* Prettier

## Markdown 写作相关

* Markdown All in One
* Markdown Preview Enhanced

```js
{
  "[markdown]": {
        "editor.wordWrap": "wordWrapColumn",
        "editor.quickSuggestions": false
    }
}
```

配置 Markdown 超出 `wordWrapColumn` 设定的值，自动换行。

## 其他

* Polacode: 生成代码截图

# 配置

## 自动格式化

`Prettier` 和 `Eslint` 通用插件配置：

```js
{
  "eslint.autoFixOnSave": true,
  // 让 prettier 使用 eslint 的代码格式进行校验
  "prettier.eslintIntegration": true,
  "eslint.validate": [
      "javascript",
      "javascriptreact",
      "html",
      {
          "language": "html",
          "autoFix": true
      },
      {
          "language": "vue",
          "autoFix": true
      },
  ]
}
```

上述配置在保存的时候能够自动修复代码中存在的不符合指定 `eslint` 代码风格的问题，免除手动修改的烦恼。

## Vue 相关

在 `vue` 中使用 `eslint` 插件的相关配置：

```js
{
  // 这个按用户自身习惯选择
  "vetur.format.defaultFormatter.html": "js-beautify-html",  
  // 让 vue 中的 js 按编辑器自带的 ts 格式进行格式化
  "vetur.format.defaultFormatter.js": "vscode-typescript",  
  "vetur.format.defaultFormatterOptions": {
    "js-beautify-html": {
      // vue 组件中 html 代码格式化样式
      "wrap_attributes": "force-aligned"
    }
  }
}
```

如果同时用 `VSCode`写 Python 代码，请勿设置 `"editor.tabSize": 2`，`Prettier` 已经自带 `"prettier.tabWidth": 2` 配置，不用单独在设置能正确格式化前端类代码。
