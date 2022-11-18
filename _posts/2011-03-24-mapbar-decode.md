---
layout: post
title: Mapbar经纬坐标偏移的加/解密算法
date: 2011-03-24 +0800
---

<script src="https://unpkg.com/vue@2.6.10/dist/vue.js"></script>

<div id="app">
  <div>
    <h2>加密</h2>
    <input type="text" name="lng" placeholder="经度" v-model="lng" />
    <input type="text" name="lat" placeholder="维度" v-model="lat" />
    <p>
      {{coordOffsetEncrypt}}
    </p>
  </div>

  <div>
    <h2>解密</h2>
    <input type="text" name="lng" placeholder="经度" v-model="delng" />
    <input type="text" name="lat" placeholder="维度" v-model="delat" />
    <p>
      {{croodOffsetDecrypt}}
    </p>
  </div>

  
</div>

<a href="https://sobird.me/mapbar-longitude-latitude-encode-decode.htm">返回相关文章</a>

<script>
  new Vue({
    el: '#app',
    data: {
      lng: '116.404',
      lat: '39.915',
      delng: '',
      delat: '',
    },
    computed: {
      coordOffsetEncrypt: function () {
        var result = coordOffsetEncrypt(this.lng, this.lat);
        this.delng = result[0];
        this.delat = result[1];

        console.log(1212)
        return result;
      },
      croodOffsetDecrypt: function () {
        return croodOffsetDecrypt(this.delng, this.delat);
      }
    }
  });

  function coordOffsetEncrypt(x, y) {
    var x = parseFloat(x) * 100000 % 36000000;
    var y = parseFloat(y) * 100000 % 36000000;

    var _x = parseFloat(((Math.cos(y / 100000)) * (x / 18000)) + ((Math.sin(x / 100000)) * (y / 9000)) + x);
    var _y = parseFloat(((Math.sin(y / 100000)) * (x / 18000)) + ((Math.cos(x / 100000)) * (y / 9000)) + y);

    return [_x / 100000.0, _y / 100000.0];
  }

  function croodOffsetDecrypt(x, y) {
    var x = parseFloat(x) * 100000 % 36000000;
    var y = parseFloat(y) * 100000 % 36000000;

    var x1 = parseInt(-(((Math.cos(y / 100000)) * (x / 18000)) + ((Math.sin(x / 100000)) * (y / 9000))) + x);
    var y1 = parseInt(-(((Math.sin(y / 100000)) * (x / 18000)) + ((Math.cos(x / 100000)) * (y / 9000))) + y);

    var x2 = parseInt(-(((Math.cos(y1 / 100000)) * (x1 / 18000)) + ((Math.sin(x1 / 100000)) * (y1 / 9000))) + x + ((x > 0) ? 1 : -1));
    var y2 = parseInt(-(((Math.sin(y1 / 100000)) * (x1 / 18000)) + ((Math.cos(x1 / 100000)) * (y1 / 9000))) + y + ((y > 0) ? 1 : -1));

    return [x2 / 100000.0, y2 / 100000.0];
  }
</script>
