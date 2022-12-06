---
layout: post
title: MapBar地图切片渲染
date: 2011-03-29 01:46:00 +0800
---

<script type="text/javascript" src="https://www.unpkg.com/jquery@3.6.1/dist/jquery.js"></script>

<div id="map" style="position:relative;width:740px;height:350px;overflow:hidden;"></div>

<p id="panel">
  <p>宽度：<input type="text" id="width" name="customsize" size="7" ></p>
  <p>高度：<input type="text" id="height" name="customsize" size="7" ></p>
  <p>经度：<input type="text" id="lon" name="customsize" size="7" ></p>
  <p>纬度：<input type="text" id="lat" name="customsize" size="7" ></p>
  <p>缩放级别： <input type="text" id="zoom" name="customsize" size="4" ></p>
  <p class="submit"><button id="drawMap">生成地图</button></p>
  <p>注意本地图是个最简单的Mapbar地图,您就别想拖动缩放了</p>
  <p style="color:#f00">如果你想看清楚地图是怎么形成的，请在下面的表单中填写一个时间差(以毫秒为单位)</p>
  <p>时间差：<input type="text" disabled="true" id="interval" name="customsize" size="6" >(不太好使)</p>
</p>

<a href="https://sobird.me/a-simple-map-of-the-source-code-mapbar.htm">返回相关文章</a>

<script type="text/javascript">
var divId = 'map';
var imgWidth = 300;
var imgHeight = 300;
var imgExt = 'png';    
var centerpoint = '120.15689,35.96333';
var point = centerpoint.split(',');
var _centerLon = point[0];
var _centerLat = point[1];
var zoomlevel = 8;
var map = $('#'+divId);


//每层地图切片的文件夹名称
var levelFolder    = new Array('W','0','1','2','3','4','5','6','7','8','9','10','11','12','13','16');

//每层地图切片所跨的经度数
var cutImgLonRange  = new Array(90,40,20,10,5,2,1,0.5,0.2,0.1,0.05,0.02,0.01,0.005,0.002,0.001);

//每层地图切片所跨的维度数
var cutImgLatRange  = new Array(90*0.8,40*0.8,20*0.8,10*0.8,5*0.8,2*0.8,0.8,0.5*0.8,0.2*0.8,0.1*0.8,0.05*0.8,0.02*0.8,0.01*0.8,0.005*0.8,0.002*0.8,0.001*0.8);

//地图区块大小 将不同区块的放在不同的文件夹下面进行管理
var blockSize    = new Array(10,10,10,10,10,10,10,10,10,10,50,50,50,50,50,50);

//纬度的偏移
var latOffset    = new Array(0,0,0,0,0,0,0,0,75,0,0,-150,0,0,0,0);

function drawMap(){
  var LatLon       = coordOffsetDecrypt(_centerLon,_centerLat);//解密Mapbar坐标
  centerLon      = LatLon[0];
  centerLat      = LatLon[1];
  
  var mapwidth    = map.width();
  var mapheight    = map.height();
  
  var halfNum5clipX   = Math.ceil(mapwidth/imgWidth/2);
  var halfNum5clipY   = Math.ceil(mapheight/imgHeight/2);
  
  var _blockSize     = blockSize[zoomlevel];
  var clipLonRange   = cutImgLonRange[zoomlevel];
  var clipLatRange  = cutImgLatRange[zoomlevel];
  var multiple      = 100000;
  
  clipNo5X=Math.floor((centerLon)/clipLonRange);
  clipNo5Y=Math.floor((centerLat)/clipLatRange);
  if(clipNo5X<0)clipNo5X+=1;
  
  var mapX=mapwidth/2-Math.round(((centerLon*multiple)%(clipLonRange*multiple))*imgWidth/(clipLonRange*multiple));
  if(centerLat>=0) {
    mapY=mapheight/2-imgHeight+Math.round(((centerLat*multiple)%(clipLatRange*multiple))*imgHeight/(clipLatRange*multiple));
  }else {
    mapY=mapheight/2+Math.round(((centerLat*multiple)%(clipLatRange*multiple))*imgHeight/(clipLatRange*multiple));
  }
  
  var clipXNum=(360/clipLonRange);
  rotationCosVal=1.0;
  rotationSinVal=0.0;
  
  var Clip = [];
  clipNo5X=Math.floor((centerLon)/clipLonRange);
  clipNo5Y=Math.floor((centerLat)/clipLatRange);
  if(clipNo5X<0)clipNo5X+=1;
  
  var mapX=mapwidth/2-Math.round(((centerLon*multiple)%(clipLonRange*multiple))*imgWidth/(clipLonRange*multiple));
  if(centerLat>=0) {
    mapY=mapheight/2-imgHeight+Math.round(((centerLat*multiple)%(clipLatRange*multiple))*imgHeight/(clipLatRange*multiple));
  }else {
    mapY=mapheight/2+Math.round(((centerLat*multiple)%(clipLatRange*multiple))*imgHeight/(clipLatRange*multiple));
  }
  
  map.html('');

  for (var _clipXNo = -halfNum5clipX - 1; _clipXNo <= halfNum5clipX; _clipXNo++) {
    for (var _clipYNo = -halfNum5clipY - 1; _clipYNo <= halfNum5clipY; _clipYNo++) {
      try {
        var clipXNo = parseInt(clipNo5X + _clipXNo);//地图横向切片序列号
        var clipYNo = parseInt(clipNo5Y + _clipYNo);
        clipXNo = (clipXNo) % clipXNum
        if (clipXNo >= (clipXNum / 2)) 
          clipXNo -= clipXNum;
        if (clipXNo < (-clipXNum / 2)) 
          clipXNo += clipXNum;
        var folderX = parseInt(Math.floor((clipXNo) / _blockSize));
        var folderY = parseInt(Math.floor((clipYNo) / _blockSize));
        
        if (folderX < 0) 
          folderX += 1;
        if (folderY < 0) 
          folderY += 1;
        
        var fileXNo = (clipXNo) - folderX * _blockSize;
        var fileYNo = (clipYNo) - folderY * _blockSize;
        
        var _strImgUrl = 'http://img.mapbar.com/maplite/mapbank/mapbar/' + levelFolder[zoomlevel] + '/';
        if (zoomlevel >= 14) 
          _strImgUrl += folderX + "/";
        
        _strImgUrl += folderX + "_" + folderY + "/";
        _strImgUrl += fileXNo + "_" + fileYNo + "." + imgExt;
        
        var clipLeft = (_clipXNo * imgWidth) + parseInt(mapX);
        var clipTop = (-(_clipYNo * imgHeight) + parseInt(mapY));
        
        clipTop = clipTop + latOffset[zoomlevel];
        
        var isClearImgUrl = false;
        
        if ((clipLeft < -imgWidth || clipLeft > mapwidth || clipTop > mapheight || clipTop < -imgHeight)) 
          isClearImgUrl = true;
        
        if (isClearImgUrl) 
          continue;
        
        var clipId = ((zoomlevel).toString(16) + (clipNo5X + _clipXNo).toString(16) + 'l' + (clipNo5Y + _clipYNo).toString(16)).toLowerCase();
        
        if (_strImgUrl && _strImgUrl.indexOf("NaN") < 0) {
          if (Clip[clipId] == null) {
            Clip[clipId] = new Image();
            Clip[clipId].id = clipId;
            Clip[clipId].name = clipId;
            Clip[clipId].unselectable = "on";
            Clip[clipId].style.position = "absolute";
            Clip[clipId].style.MozUserSelect = "none";
            Clip[clipId].src = _strImgUrl;
            
          }
          
          var p2 = (clipLeft + imgWidth / 2 - mapwidth / 2) * rotationCosVal - (clipTop + imgHeight / 2 - mapheight / 2) * rotationSinVal + mapwidth / 2;
          var p5 = (clipLeft + imgWidth / 2 - mapwidth / 2) * rotationSinVal + (clipTop + imgHeight / 2 - mapheight / 2) * rotationCosVal + mapheight / 2;
          
          Clip[clipId].style.top = parseInt(p5 - imgHeight / 2) + "px";
          Clip[clipId].style.left = parseInt(p2 - imgWidth / 2) + "px";
          //var interval = parseInt($('#interval').val());
          
          map.append(Clip[clipId]);
        }
        _strImgUrl = null;
      } 
      catch (e) {
        throw (e);
      }
    }
  }
}

// The follow is two helper functions

/**
 * 将真实地理坐标加密为Mapbar经纬度坐标
 *
 * @param x 经度值
 * @param y 维度值
 * @returns [x,y]
 */
function coordOffsetEncrypt(x,y){
  x = parseFloat(x)*100000%36000000;
  y = parseFloat(y)*100000%36000000;

  _X = parseInt(((Math.cos(y/100000))*(x/18000))+((Math.sin(x/100000))*(y/9000))+x);
  _Y = parseInt(((Math.sin(y/100000))*(x/18000))+((Math.cos(x/100000))*(y/9000))+y);

  return [_X/100000.0,_Y/100000.0];
}

/**
 * 将Mapbar经纬坐标解密为真实地理坐标
 *
 * @param x 经度值
 * @param y 维度值
 * @returns [x,y]
 */
function coordOffsetDecrypt(x,y){
  x = parseFloat(x)*100000%36000000;
  y = parseFloat(y)*100000%36000000;

  x1 = parseInt(-(((Math.cos(y/100000))*(x/18000))+((Math.sin(x/100000))*(y/9000)))+x);
  y1 = parseInt(-(((Math.sin(y/100000))*(x/18000))+((Math.cos(x/100000))*(y/9000)))+y);

  x2 = parseInt(-(((Math.cos(y1/100000))*(x1/18000))+((Math.sin(x1/100000))*(y1/9000)))+x+((x>0)?1:-1));
  y2 = parseInt(-(((Math.sin(y1/100000))*(x1/18000))+((Math.cos(x1/100000))*(y1/9000)))+y+((y>0)?1:-1));

  return [x2/100000.0,y2/100000.0];
}

function sleep(time){
  var tstart = Number(new Date());
  while((tstart + time) > Number(new Date())){};
}
$('#width').val(map.width());
$('#height').val(map.height());
$('#lon').val(_centerLon);
$('#lat').val(_centerLat);
$('#zoom').val(zoomlevel);

$('#drawMap').click(function(){
  map.width($('#width').val());
  map.height($('#height').val());
  $('#panel').height($('#height').val()-20);
  _centerLon = $('#lon').val();
  _centerLat = $('#lat').val();
  zoomlevel = $('#zoom').val();
  drawMap();
});
$("input[name='customsize']").keydown(function(e){
  if(e.keyCode == 13){
    $('#drawMap').click();
  }
});
drawMap();
</script>
