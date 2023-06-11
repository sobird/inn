---
layout: post
title: Chrome 标签栏debug工具（百度经验）
date: 2015-06-03 20:24:05 +0800
---

```js
javascript: void (function () {
  var dev_env_str_flag = ".cp01",
    online_env_str_flag = "jingyan.baidu.com",
    local_env_str_flag = "127.0.0.1",
    host = location.host,
    name = "",
    value = "";

  if (host.indexOf(dev_env_str_flag) > -1) {
    //开发机环境
    name = "exp_debug";
    var debug = get_cookie(name);
    value = debug == 1 ? 0 : 1;
  } else if (host.indexOf(online_env_str_flag) > -1) {
    //非开发机则默认为线上环境
    name = "orp_preview";
    var orp_preview = get_cookie(name);
    var tip = "";
    if (orp_preview == 1) {
      tip = "即将切换为经验线上环境，是否继续？";
      value = 0;
    } else {
      tip = "即将切换到预览机器环境，是否继续？";
      value = 1;
    }
    if (!confirm(tip)) {
      return;
    }
  } else if (host.indexOf(local_env_str_flag) > -1) {
    name = "FIS_DEBUG_DATA";
    value = "4f10e208f47bfb4d35a5e6f115a6df1a";
  }

  var date = new Date();
  date.setFullYear(date.getFullYear() + 1);
  document.cookie = name + "=" + value + ";path=/;expires=" + date.toGMTString();
  location.reload();
  function get_cookie(name) {
    var _cookie = document.cookie.split(";");
    for (var i = 0, l = _cookie.length; i < l; i++) {
      var item = _cookie[i].split("=");
      if (item[0].trim() == name) {
        return item[1];
      }
    }
  }
})();
```
