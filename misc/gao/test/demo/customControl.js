// 定义一个控件类,即function
function SDOControl(){
  // 默认停靠位置和偏移量
  this.defaultAnchor = BMAP_ANCHOR_TOP_RIGHT;
  this.defaultOffset = new BMap.Size(10,10);
}
// 定义卫星图标控件
SDOControl.prototype = new BMap.Control();
SDOControl.prototype.initialize = function(mymap){
	var that = this;
	this._map = mymap;
	this._mapType = 0;
	
	var div = document.createElement("div"); 
	div.style.cursor = "pointer";
	div.style.width = "47px";
	div.style.height = "49px";
	div.style.backgroundColor = "white";
	div.style.backgroundImage = "url('http://c.hiphotos.baidu.com/album/s%3D550%3Bq%3D90%3Bc%3Dxiangce%2C100%2C100/sign=eba8737dd143ad4ba22e46c5b2392b92/c995d143ad4bd113416b39ea5aafa40f4afb0547.jpg?referer=b94f08f48701a18ba9fc267f635e&x=.jpg')";
	div.style.backgroundPosition = "center center";
	div.style.backgroundRepeat = "no-repeat";

	var span = document.createElement("span");
	span.style.fontSize="12px";
	span.style.position="absolute";
	span.style.bottom="0";
	span.style.margin = "0 -30px -30px";
	span.style.background="#ffffff url(./assets/images/bg-black-trans.png) repeat 0 0";
	span.style.width="70px";
	span.style.height="15px";
	span.style.padding="0px 3px 5px 3px";
	span.style.fontWeight="normal";
	span.style.display = "none";
	span.onclick = function(e){//不会写样式，只能采用阻止冒泡的办法了，懒~所以只在span上阻止了下
		if (e && e.stopPropagation) {//非IE浏览器  
			e.stopPropagation();    
		}    
		else {//IE浏览器
			window.event.cancelBubble = true;   
		}  
	}
	
	var checkBox = document.createElement("input");
	checkBox.setAttribute("type","checkbox"); 
	checkBox.style.paddingBottom = "0px"; 
	checkBox.onclick = function(e){
		if(this.checked){
			that._map.setMapType(BMAP_HYBRID_MAP);
		}else{
			that._map.setMapType(BMAP_SATELLITE_MAP);
		}
	}

	var subSpan = document.createElement("span");
	subSpan.style.position="absolute";
	subSpan.style.margin= "3px 0px 0px 0px";
	
	subSpan.appendChild(document.createTextNode("显示路网"));
		
	span.appendChild(checkBox);
	span.appendChild(subSpan);

	div.appendChild(span);
	checkBox.setAttribute("checked","checked");
	
	
  	div.onclick = function(e){
  	  	that._mapType = (++(that._mapType))%2;
  	  	if(that._mapType == 1){
  	  		div.style.backgroundImage = "url('http://b.hiphotos.baidu.com/album/s%3D550%3Bq%3D90%3Bc%3Dxiangce%2C100%2C100/sign=740cb19302087bf479ec57ecc2e82611/0b7b02087bf40ad10b40493b572c11dfa8ecce46.jpg?referer=02f9b7db8744ebf83466500f2a5c&x=.jpg')";	
	  	  	if(checkBox.checked){
				that._map.setMapType(BMAP_HYBRID_MAP);
			}else{
				that._map.setMapType(BMAP_SATELLITE_MAP);
			}
  	  		span.style.display = "block";
  	  		
  	  	}else if(that._mapType == 0){
  	  		div.style.backgroundImage = "url('http://c.hiphotos.baidu.com/album/s%3D550%3Bq%3D90%3Bc%3Dxiangce%2C100%2C100/sign=eba8737dd143ad4ba22e46c5b2392b92/c995d143ad4bd113416b39ea5aafa40f4afb0547.jpg?referer=b94f08f48701a18ba9fc267f635e&x=.jpg')";
  	  		that._map.setMapType(BMAP_NORMAL_MAP);
  	  		span.style.display = "none";
  	  	}
  }
  this._map.getContainer().appendChild(div);
  return div;
}



