---
title: Webstorm 设置
tags:
  - Webstorm
categories:
  - 编辑器
abbrlink: 28477
date: 2018-09-09 00:41:32
---

若想启用 `Prettier` 格式化代码，需要自行安装 `Prettier`：

```bash
yarn add --dev prettier
```
这样编辑器会自动选择 `Prettier` 路径，完成配置。格式化快捷键 `Ctrl+Shift+Alt+P`。

注意，使用 `Prettier` 格式化代码与内置的格式化引擎（快捷键为 `Ctrl+Shift+L`）存在差异，而且 WebStorm 编辑器无法像 VSCode 那样在不同的语言环境下选择格式化引擎，即无法达到在编辑 JavaScript 代码时按 `Ctrl+Shift+L` 使用的是 `Prettier` 来个格式化代码的效果。

此时若手误按 `Ctrl+Shift+L` 快捷键，格式化的代码和原来的不符，给版本控制带来麻烦。

未解决上述问题，我们通过 WebStorm 提供的 `Watch Filers` 来迂回解决，具体操作为：打开 `Setting`，选择 `Tools>File Watchers`，点击 `+`，选择 `Prettier`，用默认设置点及 `Ok` 保存即可。

这样，我们在保存代码是时候，能自动使用 `Prettier` 来格式化代码，不用再考虑快捷键格式化代码的问题。