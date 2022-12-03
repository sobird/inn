---
layout: post
title: JS使用eval进行加密解密
date: 2011-10-31 +0800
---

<script>
  var a = 62;
  function encode() {
    var code = document.getElementById('code').value;
    code = code.replace(/[\r\n]+/g, '');
    code = code.replace(/'/g, "\\'");
    var tmp = code.match(/\b(\w+)\b/g);
    tmp.sort();
    var dict = [];
    var i, t = '';
    for(var i=0; i<tmp.length; i++) {
      if(tmp[i] != t) dict.push(t = tmp[i]);
    }
  
    var len = dict.length;
    var ch;
    for(i=0; i<len; i++) {
      ch = num(i);
      code = code.replace(new RegExp('\\b'+dict[i]+'\\b','g'), ch);
      if(ch == dict[i]) dict[i] = '';
    }
    document.getElementById('code').value = "eval(function(p,a,c,k,e,d){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)d[e(c)]=k[c]||e(c);k=[function(e){return d[e]}];e=function(){return'\\\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\\\b'+e(c)+'\\\\b','g'),k[c]);return p}(" + "'"+code+"',"+a+","+len+",'"+ dict.join('|')+"'.split('|'),0,{}))";
  }
  function num(c) {
    return(c<a?'':num(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36));
  }

  function decode() {
    var code = document.getElementById('code').value;
    code = code.replace(/^eval/, '');
    document.getElementById('code').value = eval(code);
  }

  function run() {
    eval(document.getElementById('code').value);
  }
</script>

<textarea id="code" cols="80" rows="20" onfocus="this.select()"></textarea>

<div>
  <input type="button" onclick="encode()" value="加密（Encode）" />
  <input type="button" onclick="decode()" value="解码(Decode)" />
  <input type="button" onclick="run()" value="运行(Run)" />
</div>

### 源码

```js
var a = 62;
function encode() {
  var code = document.getElementById("code").value;
  code = code.replace(/[\r\n]+/g, "");
  code = code.replace(/'/g, "\\'");
  var tmp = code.match(/\b(\w+)\b/g);
  tmp.sort();
  var dict = [];
  var i,
    t = "";
  for (var i = 0; i < tmp.length; i++) {
    if (tmp[i] != t) dict.push((t = tmp[i]));
  }

  var len = dict.length;
  var ch;
  for (i = 0; i < len; i++) {
    ch = num(i);
    code = code.replace(new RegExp("\\b" + dict[i] + "\\b", "g"), ch);
    if (ch == dict[i]) dict[i] = "";
  }
  document.getElementById("code").value =
    "eval(function(p,a,c,k,e,d){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)d[e(c)]=k[c]||e(c);k=[function(e){return d[e]}];e=function(){return'\\\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\\\b'+e(c)+'\\\\b','g'),k[c]);return p}(" + "'" + code + "'," + a + "," + len + ",'" + dict.join("|") + "'.split('|'),0,{}))";
}
function num(c) {
  return (
    (c < a ? "" : num(parseInt(c / a))) +
    ((c = c % a) > 35 ? String.fromCharCode(c + 29) : c.toString(36))
  );
}

function decode() {
  var code = document.getElementById("code").value;
  code = code.replace(/^eval/, "");
  document.getElementById("code").value = eval(code);
}

function run() {
  eval(document.getElementById("code").value);
}
```
