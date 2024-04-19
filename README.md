# 小酒馆 🍷
> 工作之余不妨来小酒馆里喝一杯

## 本地测试站点

```
jekyll serve
```

## Jekyll

### 环境要求

* Ruby version 2.5.0 or higher 查看版本 `ruby -v`
* RubyGems ruby 的包管理器，查看版本 `gem -v`
* GCC and Make 查看版本 `gcc -v`, `g++ -v`, and `make -v`
* Bundler 管理 Ruby 应用程序依赖的框架，查看版本 `bundle -v`

### 安装 ruby

```sh
# 查看ruby版本, 这是macOS自带的ruby不建议使用，
/usr/bin/ruby -v
ruby 2.6.10p210 (2022-04-12 revision 67958) [universal.x86_64-darwin21]

# 查看gem版本
/usr/bin/gem -v
3.0.3.1

# 使用brew安装新的ruby
brew install ruby
# 查看安装后的版本
ruby -v
ruby 3.3.0 (2023-12-25 revision 5124f9ac75) [x86_64-darwin21]

gem -v
3.5.4

# 升级gem到最新版本
gem update --system 3.5.9
```

### 安装jekyll 和 bundler

```sh
gem install jekyll bundler

# 查看 jekyll 版本
jekyll -v 
jekyll 4.3.3

# 查看 bundler 版本
bundler -v
Bundler version 2.5.9
```


```sh
bundle exec jekyll serve
```


Jekyll 要求博客文章的文件名按照以下格式命名：

`YEAR-MONTH-DAY-title.MARKUP`

* **YEAR** 4位数字，表示年份
* **MONTH** 2位数字，表示月份
* **DAY** 2为数字，表示日期
* **MARKUP** 表示文件扩展名

Jekyll 还提供了对代码片段的强大支持：


```ruby
def print_hi(name)
  puts "Hi, #{name}"
end
print_hi('Tom')
#=> prints 'Hi, Tom' to STDOUT.
```

## GitHub Pages

GitHub Pages 默认支持 `Jekyll` (静态网站生成器)，可自动将项目托管在 [GitHub Pages](https://pages.github.com/)，当然也可以使用其他静态站点生成器或者在本地或其他服务器上自定义构建发布过程。

* [支持的主题](https://pages.github.com/themes/)
* [支持的插件](https://pages.github.com/versions/)

## 参考

* [GitHub Pages 快速入门](https://docs.github.com/zh/pages/quickstart)
* [Jekyll docs][jekyll-docs] 
* [使用 Jekyll 在本地测试 GitHub Pages 站点](https://docs.github.com/zh/pages/setting-up-a-github-pages-site-with-jekyll/testing-your-github-pages-site-locally-with-jekyll)

[jekyll-docs]: https://jekyllrb.com/docs/home
[jekyll-gh]:   https://github.com/jekyll/jekyll
[jekyll-talk]: https://talk.jekyllrb.com/
