---
layout: pages
title: 关于 JavaScript 闭包的简单例子
date: 2018-07-05 16:19:52
tags:
  - JavaScript
  - 闭包
categories:
  - JavaScript
---

于控制台中运行如下例子：

## 例 ①：无闭包

```js
var x = [];
for (var i = 0; i < 9; i++) {
  setTimeout(function() {
    x[i] = i;
  }, 1000);
}
console.log(i);
console.log(x); // ▶(10) [empty × 9, 9]
```

## 例 ②：闭包

```js
var y = [];
function doSetTimeout(i) {
  setTimeout(function() {
    y[i] = i;
  }, 1000);
}
for (var i = 0; i < 9; i++) {
  doSetTimeout(i);
}
console.log(i);
console.log(y); // ▶(9) [0, 1, 2, 3, 4, 5, 6, 7, 8]
```

<!-- more -->

注意上述两个例子中，

- 例 ① 中，`x = [empty × 9, 9]`，`length` 为 `10`；
- 例 ② 中，`y = [0, 1, 2, 3, 4, 5, 6, 7, 8]`，`length` 为 `9`。
  因为循环体是 `i++`，循环结束 `i = 9`。
  我们把 `setTimeout`等待时间改为`0`，再看结果：

```js
var y = [];
function doSetTimeout(i) {
  setTimeout(function() {
    y[i] = i;
  }, 0);
}
for (var i = 0; i < 9; i++) {
  doSetTimeout(i);
}
console.log(y); // ▶(9) [0, 1, 2, 3, 4, 5, 6, 7, 8]
```

## 简写

```js
var z = [];
for (var i = 0; i < 9; i++) {
  (function(i) {
    setTimeout(function() {
      z[i] = i;
    }, 1000);
  })(i);
}
console.log(z);
```

## 引申

注意，如果我们将上面的例子改为：

```js
var z = [];
for (var i = 0; i < 9; i++) {
  (function() {
    setTimeout(function() {
      z[i] = i;
    }, 1000);
  })();
}
console.log(z); // ▶(10) [empty × 9, 9]
```

我们看输出结果是什么，注意函数体中的 `i` 是函数体内部专有的还是引用的全局变量？
然后，我们进一步修改上述代码，看看结果又会是否达到预期：

```js
var z = [];
for (var i = 0; i < 9; i++) {
  (function() {
    var j = i;
    setTimeout(function() {
      z[j] = j;
    }, 1000);
  })();
}
console.log(z);
```
