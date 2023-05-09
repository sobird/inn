---
layout: post
title: Linux常用命令
date: 2022-12-02 +0800
---

Linux基本操作命令：

```sh
# 查看内核/操作系统/CPU信息.uname 命令将正在使用的操作系统名写到标准输出中。例如：Linux centos 2.6.18-194.11.4.el5xen #1 SMP Tue Sep 21 06:28:04 EDT 2010 i686 i686 i386 GNU/Linux
uname -a

# 该命令的一般格式为： passwd [用户名] 其中用户名为需要修改口令的用户名。只有超级用户可以使用“passwd 用户名”修改其他用户的口令，普通用户只能用不带参数的passwd命令修改自己的口令
passwd user

# 查看CPU信息
cat /proc/cpuinfo

# 查看内存信息
free

# 查看磁盘分区表及分区结构
fdisk -l

# 查看硬盘信息
df -lh

# 查看各分区使用情况
df -h

# 设置vps时区
cp -f /usr/share/zoneinfo/Asia/Shanghai /etc/localtime

# 检查可更新的rpm包
yum check-update

# 更新所有的rpm包 yum -y update
yum update

# 安装rpm包
yum install apache

# 删除rpm包,包括与该包有倚赖性的包
yum remove php

# 列出已经安装的所有的rpm包
yum list installed

# 列出资源库中特定的可以安装或更新以及已经安装的rpm包的信息
yum info php

# 搜索匹配特定字符(mozilla)的rpm包,注:在rpm包名,包描述等中搜索
yum search mozilla

# 搜索有包含特定文件名的rpm包
yum provides realplay

# 列出与mysql有关的包 === # yum list installed | grep mysql
rpm -qa | grep mysql

# 卸载mysql-server-3.23.58-9
rpm -e mysql-server (-nodeps)

# 查看指定目录的大小
du -sh <目录名> 

# 查看系统运行时间、用户数、负载
uptime

# 查看操作系统版本
head -n 1 /etc/issue

# 查看环境变量资源
env

# 查看防火墙设置
iptables -L

# 列出所有系统服务
chkconfig –list

# 列出所有启动的系统服务程序
chkconfig –list | grep on

# 查看所有进程
ps -ef

# 实时显示进程状态用户
top

# 查看活动用户
w

# 查看指定用户信息
id <用户名>

# 查看用户登录日志
last

# 查看系统所有用户
cut -d: -f1 /etc/passwd

# 查看系统所有组
cut -d: -f1 /etc/group

# 查看当前用户的计划任务服务
crontab -l

# 查看所有安装的软件包
rpm -qa

# 设置Apache开机启动
chkconfig httpd on
```