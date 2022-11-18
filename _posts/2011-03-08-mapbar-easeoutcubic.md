---
layout: post
title: Mapbar地图拖拽缓动演示
date: 2011-03-08 +0800
---

<script type="text/javascript" src="/assets/js/mapbar_v31.2_mod.js"></script>

<style>
img {
  max-width: inherit;
  vertical-align: middle;
}

</style>

<div id="mapbar" style="width:500px;height:300px"></div>

<a href="https://sobird.me/mapbar-easeoutcubic.htm">返回相关文章</a>

<script type="text/javascript">
    var maplet = null;
    function initMap(){
      maplet = new Maplet("mapbar");
      maplet.centerAndZoom(new MPoint(116.38672,39.90805), 8);
      maplet.addControl(new MStandardControl());

    }

    initMap();
</script>
