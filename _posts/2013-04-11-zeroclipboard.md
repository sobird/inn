---
layout: post
title: 浏览器复制插件-ZeroClipboard
date: 2013-04-11 12:12:57 +0800
---

<script type="text/javascript" src="https://www.unpkg.com/zeroclipboard@2.3.0/dist/ZeroClipboard.js"></script>

<button id="copy-button" data-clipboard-text="Copy Me!" title="Click to copy me.">Copy to Clipboard</button>

<script type="text/javascript">
var client = new ZeroClipboard( document.getElementById("copy-button") );
 
client.on( "ready", function( readyEvent ) {
  // alert( "ZeroClipboard SWF is ready!" );
 
  client.on( "aftercopy", function( event ) {
    // `this` === `client`
    // `event.target` === the element that was clicked
    event.target.style.display = "none";
    alert("Copied text to clipboard: " + event.data["text/plain"] );
  } );
} );
</script>
