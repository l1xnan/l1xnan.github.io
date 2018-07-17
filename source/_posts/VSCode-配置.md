---
title: VSCode 配置
tags:
  - VSCode
  - 编辑器
abbrlink: 57001
date: 2018-05-30 22:53:42
---

# 必备插件

## 优化编辑器

- Guides: 高亮缩进基准线
- indent-rainbow: 优化缩进点
- Better Comments： 优化注释
- Terminal: 可以在编辑器底边栏添加一个控制台按钮，便于鼠标快速访问
- Code Outline: 显示代码大纲

<!-- more -->

## 主题

- Material Theme

## 效率工具

- Auto Close Tag: 自动闭合 HTML 标签
- Auto Rename Tag: 修改 HTML 标签时，自动修改匹配的标签
- Path Intellisense: 路径完成提示

## 版本控制

- gitignore
- GitLents

## 语言相关

Vue:

- Vetur

Python：

- Python

## 代码检查、格式化

- ESlint
- Prettier

## Markdown 写作相关

- Markdown All in One
- Markdown Preview Enhanced
- markdownlint

如果想让书写显得工整一点，配置 Markdown 换行设置为：

```js
{
  "[markdown]": {
        "editor.wordWrap": "wordWrapColumn",
        "editor.quickSuggestions": false
    }
}
```

`editor.wordWrap` 有如下几个配置：

- `off` - 禁用折行
- `on` - 视区折行
- `wordWrapColumn` - 在 `“editor.wordWrapColumn”` 处折行
- `bounded` - 在视区与 `“editor.wordWrapColumn”` 两者的较小者处折行

## 其他

- Polacode: 生成代码截图

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
