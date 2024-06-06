---
layout: post
title: Windows Ubuntu golang环境配置
date: 2024-06-06 19:50 +0800
author: Sobird
---

## 使用Ubuntu的Repository安装Golang
```sh
# 更新Ubuntu系统
sudo apt update && sudo apt upgrade
# 使用 Ubuntu 提供的 APT 存储库安装 Golang 的最简单方法
sudo apt install golang
# 验证
go version
go version go1.13.8 linux/amd64
```


## 使用 Golang-Backports PPA 安装 Golang
```sh
# 通过运行以下命令导入 PPA：
sudo add-apt-repository ppa:longsleep/golang-backports -y
# 更新 APT 包列表以包含新添加的 PPA
sudo apt update
# 使用 PPA 安装 Golang
sudo apt install golang
# 如果您需要特定的旧版本，可以通过指定版本号来安装它。例如，要安装 Golang v1.18，请运行：
sudo apt install golang-1.18
```

## 配置vscode
同时按下`ctrl+shift+p`，然后输入：`go:install`，选中`Go:Install/Update Tools`，进行工具安装。