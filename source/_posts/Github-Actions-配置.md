---
title: Github Actions 配置
abbrlink: 40769
date: 2020-01-21 17:26:30
tags:
categories:
---

自动化部署 hexo：
```yml
name: Deploy Hexo

on:
  push:
    branches:
      - master

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: checkout
        uses: actions/checkout@master

      - name: nodejs
        uses: actions/setup-node@v1
        with:
          node-version: 12.x
      
      - name: env
        env:
          HEXO_DEPLOY_KEY: ${{secrets.HEXO_DEPLOY_KEY}}
        run: |
          mkdir -p ~/.ssh/
          echo "$HEXO_DEPLOY_KEY" > ~/.ssh/id_rsa
          chmod 600 ~/.ssh/id_rsa
          ssh-keyscan github.com >> ~/.ssh/known_hosts
          git config --global user.name 'xxxxx'
          git config --global user.email 'xxxxx@xx.com'
          git clone https://github.com/theme-next/hexo-theme-next themes/next
      
      - name: install
        run: npm install

      - name: build
        run: npm run build
```