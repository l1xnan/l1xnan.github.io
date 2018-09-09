---
title: JavaScript 数据可视化
tags:
  - 可视化
  - JavaScript
categories:
  - 可视化
abbrlink: 11085
date: 2018-09-09 12:29:50
---

## D3js

前端可视化领域当之无愧的 No.1，提供的 API 相对基础，相对灵活度最好，适合完成定制化有较高要求的图形。

网上的参考资料很多，摘录两个：

- [D3js 官网](https://d3js.org/)
- [Awesome D3](https://github.com/wbkd/awesome-d3)

### ReCharts

基于 React 的组合式图表，有[官方中文文档](http://recharts.org/zh-CN)。
设计比较简约，可满足一般数据可视化需要。

## Chart.js

官方介绍：

    为设计和开发人员准备的简单、灵活的 JavaScript 图表工具

相比其他可视化库，其使用可能最为简单、轻量。目前[中文文档](http://chartjs.cn/)翻译完成度较低。

## Echarts

基于 React 封装库有 [echarts-for-react](https://github.com/hustcc/echarts-for-react)，其只是体统了一个简单的封装组件，使用中仍按照 Echarts 的 API 来完成数据可视化。

基于 Vue2.x 封装的有[v-charts](https://v-charts.js.org)，其封装度更高高。

## AntV

蚂蚁金服开源的数据可视化解决方案，包含：

- G2: 一般的数据可视化
- G6: 关系数据可视化
- F2: 专注移动端的数据可视化解决方案

它们有基于其的 React 封装库：

- [BizCharts](http://bizcharts.net): 一个基于 G2 封装的 React 图表库，具有 G2、React 的全部优点，可以让用户以组件的形式组合出无数种图表；并且集成了大量的统计工具，支持多种坐标系绘制，交互定制，动画定制以及图形定制等等。
- [BizGoblin](http://bizcharts.net/products/bizGoblin): 一个基于 F2 封装的 React 图表库，具有 F2、React 的全部优点，可以让用户以组件的形式组合出无数种移动端图表。

一般我们用到最多的是 `AntV/G2`，相比 Echarts 算是后起之秀，官方介绍为：

    G2 是一套基于可视化编码的图形语法，以数据驱动，具有高度的易用性和扩展性，用户无需关注各种繁琐的实现细节，一条语句即可构建出各种各样的可交互的统计图表。

与 Echarts 相比，因为其封装了一些细节，使用上可能相对简单，但是没有 Echarts 那么高的可定制度，相对图形做细微定制化调整，按照官方的 API 可能让人摸不着头脑。而自 Echarts V4 版本，也加入了 `数据集(dataset)` 等功能，减少了代码繁琐度，相比来说可能 Echarts 更好用一些。就系统化解决方案来说，因`AntV` 包含各端以及覆盖 `React`、`Vue`、`Angular` 的官方封装，会更胜一筹。就主题配色来啊，个人感觉 `AntV` 提供的默认主题更好看一点，若你是颜控，不妨试试 `AntV/G2`。

## Highcharts

另一个比较流行的数据可视化框架，有[中文文档](https://www.hcharts.cn/)，网上和 Echarts 对比的文章较多，可自行查阅。有些方面比 Echarts 更强大易用。不过其[商用授权费](https://highcharts.com.cn/highcharts)用大部分国内公司会望而却步，单个开发者授权为`7900元`。
