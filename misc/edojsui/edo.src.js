/**
 * @link:	http://www.edojs.com
 * @license:	http://edojs.com/license/
 * @date:	2011-4-9
 * @description:Just For Developers
 * @version:	$Id: edo.src.js 35 2013-01-21 05:37:52Z yangjunlong $
 */

Edo = {
    version: "1.0",
    website: "http://www.edojs.com",
    email: "services@edojs.com"
};
window.undefined = window.undefined;

//给Function对象原型添加extend方法(method)
Function.prototype.extend = function(parent, children) {
    if (typeof parent != "function") return this;
    var _this = this,
    _t_proto_ = _this.prototype,
    _p_proto_ = parent.prototype;
    
    if (_this.superclass == _p_proto_) return;
    _this.superclass = _p_proto_;
    _this.superclass.constructor = parent;
    
    for (var k in _p_proto_){
    	_t_proto_[k] = _p_proto_[k];
    };
    if (children){
    	for (k in children){
    		_t_proto_[k] = children[k];
    	}
    };
    return _this;
};

//和extend方法不同
//浅拷贝～～ 将children中的属性 简单的赋值到 parent对象中，如果已存在该属性，覆盖替换之
Edo.apply = function(parent, children, other) {
    if (other) {
    	Edo.apply(parent, other);
    }
    if (parent && children && typeof children == "object") {
    	for (var key in children) {
    		parent[key] = children[key];
    	}
    }
    return parent;
};

//和上基本相同，唯一的区别在于if，如果parent对象中存在children中的属性，则不拷贝
Edo.applyIf = function(parent, children) {
    if (parent) {
    	for (var key in children) {
    		if (parent[key] === undefined || parent[key] === null) {
    			parent[key] = children[key];
    		}
    	}
    }
    return parent;
};

//转义一些特殊字符
function escapeRe($) {
    return $.replace(/([.*+?^${}()|[\]\/\\])/g, "\\$1")
}

//HTML字符实体转码 例如：< 转为 &lt; 
function HTMLEncode(str) {
    var div = document.createElement("div"); 
    (div.textContent != null) ? (div.textContent = str) : (div.innerText = str);
    var html = div.innerHTML;
    div = null;
    return html;
}
//和上面的相反
function HTMLDecode(html) {
    var div = document.createElement("div");
    div.innerHTML = html;
    var text = div.innerText || div.textContent;
    div = null;
    return text;
}

//-- 下面定义了一些全局变量 主要是一些浏览器判断
var toString = Object.prototype.toString,
ua = navigator.userAgent.toLowerCase(),
check = function($) {
    return $.test(ua);
},
DOC = document,
isStrict = DOC.compatMode == "CSS1Compat",
isOpera = toString.call(window.opera) == "[object Opera]",
isChrome = check(/chrome/),
isWebKit = check(/webkit/),
isSafari = !isChrome && check(/safari/),
isSafari2 = isSafari && check(/applewebkit\/4/),
isSafari3 = isSafari && check(/version\/3/),
isSafari4 = isSafari && check(/version\/4/),
isIE = !!window.attachEvent && !isOpera,
isIE7 = isIE && check(/msie 7/),
isIE8 = isIE && check(/msie 8/),
isIE6 = isIE && !isIE7 && !isIE8,
isGecko = !isWebKit && check(/gecko/),
isGecko2 = isGecko && check(/rv:1\.8/),
isGecko3 = isGecko && check(/rv:1\.9/),
isBorderBox = isIE && !isStrict,
isWindows = check(/windows|win32/),
isMac = check(/macintosh|mac os x/),
isAir = check(/adobeair/),
isLinux = check(/linux/),
isSecure = /^https/i.test(window.location.protocol);
// -- : end

if (isIE6) {
    try {
        DOC.execCommand("BackgroundImageCache", false, true)
    } catch(e) {}
}

//为Edo对象扩展一些属性
Edo.apply(Edo, {
    view: document.defaultView,
    types: {},
    htmlRe: /<html[^>]*>((\n|\r|.)*?)<\/html>/ig,
    scriptRe: /(?:<script([^>]*)?>)((\n|\r|.)*?)(?:<\/script>)/ig,
    styleRe: /(?:<style([^>]*)?>)((\n|\r|.)*?)(?:<\/style>)/ig,
    emptyRe: /(?:<--)((\n|\r|.)*?)(?:-->)/ig,
    ID: 1,
    id: function($, _) {
        return ($ = Edo.getDom($) || {}).id = $.id || (_ || "edo-cmp") + (++Edo.ID);
    },
    
    /**
     * 为Edo Framework 创建命名空间
     */
    namespace: function() {
        var _,tmp; 
        [].each.call(arguments, function(A) {
            tmp = A.split(".");
            _ = window[tmp[0]] = window[tmp[0]] || {}; 
            [].each.call(tmp.slice(1), function(tmp) {
                _ = _[tmp] = _[tmp] || {}
            })
        });
        return _
    },
    
    UID: 1,
    
    /**
     * 获取dom元素对象,并会添加 uid 属性
     * 
     * @param el : Element/String 目标dom元素或dom的id字符串
     * @return dom
     */
    getDom: function(el) {
        if (!el || !DOC) return null;
        el = el.dom ? el.dom: (typeof el == "string" ? DOC.getElementById(el) : el);
        if (el && !el.uid) el.uid = Edo.UID++;
        return el;
    },
    
    getBody: function() {
        return DOC.body || DOC.documentElement;
    },
    
    removeNode: isIE ? function() {
        var $,B,A,_;
        return function(D, C) {
            if (D && D.tagName != "BODY") {
                B = D.getElementsByTagName("OBJECT");
                _ = B.length;
                for (A = 0; A < _; A++) B[0].parentNode.removeChild(B[0]);
                if (!C) {
                    D.parentNode.removeChild(D);
                    return
                }
                $ = $ || DOC.createElement("div");
                $.appendChild(D);
                $.innerHTML = ""
            }
        }
    }() : function($) {
        if ($ && $.parentNode && $.tagName != "BODY") $.parentNode.removeChild($)
    },
    
    isArray: function($) {
        return toString.apply($) === "[object Array]"
    },
    
    isNumber: function($) {
        return typeof $ === "number" && isFinite($)
    },
    
    toBool: function($) {
        if (typeof $ === "string") {
            if ($ == "true") return true;
            if ($ == "false") return false;
            throw new Error("必须传递布尔值")
        }
        return !! $
    },
    
    isValue: function($) {
        return $ || $ === 0 || $ === false
    },
    isPercent: function($) {
        return typeof $ === "string" && $.length > 1 && $.charAt($.length - 1) == "%"
    },
    isDate: function($) {
        return toString.apply($) === "[object Date]"
    },
    isInt: function($) {
        var _ = parseFloat($);
        return ! isNaN(_) && _ == $
    },
    toFixed: function(A, $) {
        var _ = String(A).split(".");
        if (_.length == 1) return _[0];
        return _[0] + "." + _[1].substring(0, $)
    },
    type: function($) {
        if ($ === undefined || $ === null) return false;
        if ($.htmlElement) return "element";
        var _ = typeof $;
        if (_ == "object" && $.nodeName) switch ($.nodeType) {
        case 1:
            return "element";
        case 3:
            return (/\S/).test($.nodeValue) ? "textnode": "whitespace"
        }
        if (_ == "object" || _ == "function") {
            switch ($.constructor) {
            case Array:
                return "array";
            case RegExp:
                return "regexp";
            case Date:
                return "date"
            }
            if (typeof $.length == "number" && typeof $.item == "function") return "nodelist"
        }
        return _
    },
    emptyFn: function() {},
    
    /**
     * 
     * 
     */
    globalEval: function(script) {
        if (script){
        	if (window.execScript){
        		window.execScript(script);
        	} else if (isSafari) {
                var _head = document.getElementsByTagName("head")[0] || document.documentElement,
                _script = document.createElement("script");
                _script.type = "text/javascript";
                if (isIE){
                	_script.text = script;
                } else {
                	_script.appendChild(document.createTextNode(script));
                }
                _head.appendChild(_script);
                _head.removeChild(_script)
            } else {
            	eval.call(window, script)
            }
        }
    },
    domLoaded: false,
    
    
    /**
     * DomReady
     */
    domLoad: function(callback) {
        if (Edo.domLoaded) {
            callback();
            return;
        }
        if (!window.__load_events){
        	window.__load_events = [];
        }
        window.__load_events.push(callback);
        
        var _ = false,
        $ = function() {
            if (_) return;
            _ = true;
            if (isGecko || isOpera){
            	document.removeEventListener("DOMContentLoaded", $, false);
            }
            if (window.__load_timer) {
                clearInterval(window.__load_timer);
                window.__load_timer = null;
            }
            if (isIE) {
                var __ie_onload = document.getElementById("__ie_onload");
                if (__ie_onload) {
                    __ie_onload.onreadystatechange = Edo.emptyFn;
                    __ie_onload.parentNode.removeChild(__ie_onload);
                    __ie_onload = null;
                }
            }
            if (!Edo.domLoaded) {
                Edo.domLoaded = true;
                for (var i = 0; i < window.__load_events.length; i++){
                	window.__load_events[i]();
                }
                window.__load_events = null;
            }
        };
        
        Edo.util.Dom.on(window, "load", function(_) {
            $();
        });
        setTimeout($, 3000);
        if (isIE) {
            document.write("<script id='__ie_onload' defer src='javascript:void(0)'></script>");
            var __ie_onload = document.getElementById("__ie_onload");
            __ie_onload.onreadystatechange = function() {
                if (this.readyState == "complete"){
                	$();
                }
            };
            __ie_onload = null;
        } else if (isGecko || isOpera){
        	document.addEventListener("DOMContentLoaded", $, false);
        } else if (isWebKit){
        	window.__load_timer = setInterval(function() {
                if (/loaded|complete/.test(document.readyState)){
                	$();
                }
            },10)
        }
    },
    
    /**
     * 一个最短的DOMReady代码
     *  同 Edo.domLoad
     * 
     * add it by junlong.yang at 2011/11/10
     */
    __dom_load: function(callback){
    	/in/.test(document.readyState)?setTimeout('Edo.__dom_load('+callback+')',9):callback();
    },
    
    parseDate: function($, B) {
        if (!$) return;
        if ($.format) return $;
        var A = Date.parseFunctions;
        if (A[B] == null) Date.createParser(B);
        var _ = A[B];
        return Date[_]($);
    }
});


Edo.replaceHtml = function(A, _, C) {
    var $ = (typeof A === "string" ? document.getElementById(A) : A),
    B = document.createElement($.nodeName);
    B.id = $.id;
    B.className = $.className;
    B.style.width = $.style.width;
    B.style.height = $.style.height;
    B.style.left = $.style.left;
    B.style.top = $.style.top;
    if (C){
    	setTimeout(function() {
            B.innerHTML = _;
        },1);
    }else{
    	B.innerHTML = _;
    }
    $.parentNode.replaceChild(B, $);
    setTimeout(function() {
        Edo.removeNode($, true);
        $ = null
    },1000);
    return B;
};

//给Function对象原型添加regType方法(method)
Function.prototype.regType = function(type) {
    var _args = arguments;
    if (_args.length > 1) {
        for (var i = 0, l = _args.length; i < l; i++){
        	this.regType(_args[i]);
        } 
        return;
    }
    type = type.toLowerCase();
    Edo.types[type] = this;
    this.type = type;
};
Edo.getValue = function($, B) {
    B = String(B);
    var A = B.split("."),
    D = $;
    for (var _ = 0, C = A.length; _ < C; _++){
    	D = D[A[_]];
    }
    return D;
};
Edo.setValue = function($, C, B) {
    C = String(C);
    var A = C.split("."),
    E = $;
    for (var _ = 0, D = A.length; _ < D; _++) if (_ == D - 1) {
        E[A[_]] = B;
        break
    } else E = E[A[_]]
};

/**
 * 通过序列化与反序列化的方式克隆
 * 
 */
Edo.clone = function($) {
    var _ = Edo.util.JSON.encode($, 
    function($) {
        return "new Date(" + $.getTime() + ")"
    });
    return Edo.util.JSON.decode(_);
};


Array.prototype.each = function(C, _) {
    for (var i = 0, A = this.length; i < A; i++) {
        var B = this[i];
        if (typeof(B) !== "undefined"){
        	if (C.call(_, B, i, this) === false){
        		break;
        	}
        }
    }
};
//创建Edojs的命名空间
Edo.ns = Edo.namespace;
Edo.ns("Edo.util", "Edo.util.Fx", "Edo.core", "Edo.managers", "Edo.controls", "Edo.containers", "Edo.navigators", "Edo.lists", "Edo.layouts", "Edo.data", "Edo.plugins", "Edo.project", "Edo.excel", "Edo.ux", "Edo.project.plugins");

//给Function对象原型扩展如下方法
Edo.apply(Function.prototype, {
	/**
	 * 将给定的obj对象应用到Function对象
	 * 
	 * @param Object : obj
	 */
    bind: function(obj) {
        var _this = this;
        return function() {
            return _this.apply(obj, arguments);
        };
    },
    
    /**
     * 延迟 将给定的obj对象应用到Function对象
     */
    defer: function(time, obj, args) {
        var _this = this;
        return setTimeout(function() {
            _this.apply(obj, args || []);
        },time);
    },
    
    time: function(time, obj, args, $) {
        var _this = this;
        if ($) _this.apply(obj, args || []);
        return setInterval(function() {
            _this.apply(obj, args || [])
        },time)
    }
});

//给Array对象原型扩展如下方法
Edo.apply(Array.prototype, {
    sortByFn: function(fn) {//一个冒泡排序算法？？
        fn = fn || function(el1, el2) {
            return el2 < el1;
        };
        for (var i = 0, l = this.length; i < l; i++) {
            var _ = this[i];
            for (var j = l - 1; j >= i; j--) {
                var C = this[j];
                if (fn(_, C)) {
                    this[j] = _;
                    this[i] = C;
                    _ = C;
                }
            }
        }
    },
    add: Array.prototype.enqueue = function($) {
        this[this.length] = $;
        return this
    },
    getRange: function(_, A) {
        var B = [];
        for (var $ = _; $ <= A; $++){
        	B[B.length] = this[$];
        }
        return B;
    },
    addRange: function(A) {
        for (var $ = 0, _ = A.length; $ < _; $++){
        	this[this.length] = A[$];
        }
        return this;
    },
    
    clear: function() {
        this.length = 0;
        return this;
    },
    
    /**
     * 把自己克隆一份并返回，这并不是对象的引用
     * 
     * @return Array
     */
    clone: function() {
        if (this.length === 1) {
        	return [this[0]];
        } else {
        	return Array.apply(null, this);
        }
    },
    
    contains: function($) {
        return (this.indexOf($) >= 0);
    },
    
    /**
     * 返回某个指定的元素值在数组中首次出现的位置 {此方法来自stringObject.indexOf方法}
     * 
     * @param {Mixed} searchvalue 必需。规定需检索的元素值
     * @param Number fromindex 可选的整数参数。规定在数组中开始检索的位置。
     * 它的合法取值是 0 到 arrayObject.length - 1。
     * 如省略该参数，则将从数组的首字符开始检索。
     * @return index
     */
    indexOf: function(searchvalue, fromindex) {
        var l = this.length;
        for (var index = (fromindex < 0) ? Math.max(0, l + fromindex) : fromindex || 0; index < l; index++){
        	if (this[index] === searchvalue){
        		return index;
        	}
        }
        return - 1;
    },
    
    dequeue: function() {
    	/**
    	 * shift方法用于把数组的第一个元素从其中删除，并返回第一个元素的值。
    	 */
        return this.shift();
    },
    
    /**
     * 在数组指定的索引位置插入元素
     * 
     * @param {Number} index 必需 规定从何处插入元素
     * @param {Mixed}  element 要添加的元素
     */
    insert: function(index, element) {
    	/**
    	 * 用于插入、删除或替换数组的元素。
    	 * 
    	 * @param Number : index 必需。规定从何处添加/删除元素。该参数是开始插入和（或）删除的数组元素的下标，必须是数字
    	 * @param Number : howmany 必需。规定应该删除多少元素。必须是数字，但可以是 "0"。如果未规定此参数，则删除从 index 开始到原数组结尾的所有元素。
    	 * @param Mixed  : element1 可选。规定要添加到数组的新元素。从 index 所指的下标处开始插入。
    	 */
        this.splice(index, 0, element);
        return this;
    },
    
    /**
     * 删除给定的某个元素
     * 
     * @param Mixed : el
     */
    remove: function(el) {
        var $ = this.indexOf(el);
        if ($ >= 0) this.splice($, 1);
        return ($ >= 0);
    },
    
    /**
     * 删除给定索引所在的元素
     * 
     * @param Number : index
     */
    removeAt: function(index) {
        var _ = this[index];
        this.splice(index, 1);
        return _;
    },
    
    /**
     * 将rgb格式的颜色转化为Hex的颜色格式
     */
    rgbToHex: function(rgb) {
        if (this.length < 3) return false;
        if (this.length == 4 && this[3] == 0 && !rgb) return "transparent";
        var A = [];
        for (var $ = 0; $ < 3; $++) {
            var _ = (this[$] - 0).toString(16);
            A.push((_.length == 1) ? "0" + _: _)
        }
        return rgb ? A: "#" + A.join("");
    },
    
    /**
     * 将hex格式的颜色转化为rgb的颜色格式
     */
    hexToRgb: function(hex) {
        if (this.length != 3) return false;
        var _ = [];
        for (var $ = 0; $ < 3; $++) _.push(parseInt((this[$].length == 1) ? this[$] + this[$] : this[$], 16));
        return hex ? _: "rgb(" + _.join(",") + ")";
    },
    
    equals: function(value) {
        if (this == value) {
        	return true;
        }
        if (this.length != value.length) {
        	return false;
        }
        for (var i = 0, _ = this.length; i < _; i++) {
        	if (this[i] != value[i]) {
        		return false;
        	}
        }
        return true;
    }
});

Edo.applyIf(String, {
	/**
	 * 对字符串进行转义
	 * 
	 * @return String
	 */
    escape: function($) {
        return $.replace(/('|\\)/g, "\\$1");
    },
    leftPad: function(_, B, $) {
        var A = new String(_);
        if (!$) $ = " ";
        while (A.length < B) A = $ + A;
        return A.toString();
    },
    
    /**
     * ????
     */
    format: function(_) {
        var $ = Array.prototype.slice.call(arguments, 1);
        return _.replace(/\{(\d+)\}/g, function(A, _) {
            return $[_];
        });
    }
});


Edo.applyIf(String.prototype, {
    rgbToHex: function(_) {
        var $ = this.match(/\d{1,3}/g);
        return ($) ? $.rgbToHex(_) : false
    },
    hexToRgb: function(_) {
        var $ = this.match(/^#?(\w{1,2})(\w{1,2})(\w{1,2})$/);
        return ($) ? $.slice(1).hexToRgb(_) : false
    },
    contains: function($, _) {
        return (_) ? (_ + this + _).indexOf(_ + $ + _) > -1: this.indexOf($) > -1
    }
});


String.prototype.trim = function() {
    var $ = /^\s+|\s+$/g;
    return function() {
        return this.replace($, "");
    }
} ();

Edo.applyIf(Number.prototype, {
	/**
	 * 此方法什么用？？
	 */
    constrain: function($, _) {
        return Math.min(Math.max(this, $), _)
    }
});


Date.setHours = function(_, $) {
    _.setHours(0);
    _.setMinutes($ * 60)
};

Date.setMinutes = function($, _) {
    $.setHours(0);
    $.setMinutes(_)
};
if (typeof $ == "undefined") $ = Edo.getDom;

//垃圾回收,间隔十秒钟垃圾回收一次
setInterval(function() {
    if (typeof(CollectGarbage) != "undefined"){
    	CollectGarbage();
    }
},10000);

function UUID() {
    var _tmp = [],
    _ = "0123456789ABCDEF".split("");
    for (var i = 0; i < 36; i++){
    	_tmp[i] = Math.floor(Math.random() * 16);
    }
    _tmp[14] = 4;
    _tmp[19] = (_tmp[19] & 3) | 8;
    for (i = 0; i < 36; i++) {
    	_tmp[i] = _[_tmp[i]];
    }
    _tmp[8] = _tmp[13] = _tmp[18] = _tmp[23] = "-";
    return _tmp.join("");
}

/**
 * Dom操作类 
 * 
 * @see http://edojs.com/api/#Edo.util.Dom
 * Namespace:	Edo.util
 * ClassName:	Dom
 */
Edo.util.Dom = {
    camelRe: /(-[a-z])/gi,
    unitPattern: /\d+(px|em|%|en|ex|pt|in|cm|mm|pc)$/i,
    borders: {
        l: "border-left-width",
        r: "border-right-width",
        t: "border-top-width",
        b: "border-bottom-width"
    },
    paddings: {
        l: "padding-left",
        r: "padding-right",
        t: "padding-top",
        b: "padding-bottom"
    },
    margins: {
        l: "margin-left",
        r: "margin-right",
        t: "margin-top",
        b: "margin-bottom"
    },
    camelFn: function($, _) {
        return _.charAt(1).toUpperCase()
    },
    propCache: {},
    classCache: {},
    evHash: {},
    EID: 1,
    EVENTS: {
        dragstart: 1,
        dragmove: 1,
        dragcomplete: 1,
        dragenter: 1,
        dragover: 1,
        dragout: 1,
        dragdrop: 1
    },
    
    /**
     * 给dom元素添加监听事件
     * 
     * @param el : Element/String 目标dom元素或dom的id字符串
     * @param type : String 事件名
     * @param fn : Function 事件监听器方法
     * @param scope : Object 激发事件时的this对象
     * @return Boolean 是否绑定成功
     */
    addListener: function(el, type, fn, scope) {
        el = Edo.getDom(el);
        if (!el){
        	return false;
        }
        var _uid = el.uid,
        _evHash = this.evHash[_uid];
        if (!_evHash){
        	_evHash = this.evHash[_uid] = {
                    dom: el
        	};
        }
        var _type = _evHash[type];
        if (!_type) _type = _evHash[type] = [];
        scope = scope || el;
        
        //如果已经on了一个一模一样的事件则返回false
        if (this.findListener(el, type, fn, scope)) {
        	return false;//这句是什么意思?
        }
        var _filterEvent = function(event) {
            return fn.call(scope, new Edo.util.Event(event || window.event));//??
        };

        _type[_type.length] = [fn, _filterEvent, scope];
        
        if (this.EVENTS[type]) {
        	return;
        }
        //---------------------------------------
        if (window.addEventListener) {
            if (isGecko3 && type == "mousewheel"){
            	type = "DOMMouseScroll";
            }
            el.addEventListener(type, _filterEvent, false);
        } else if (window.attachEvent){
        	el.attachEvent("on" + type, _filterEvent);
        }
        return true;
    },
    
    /**
     * 去除监听dom事件
     * 
     * @param el : Element/String 目标dom元素或dom的id字符串
     * @param type : String 事件名 
     * @param fn : Function 事件监听器方法 
     * @param scope : Object 激发事件时的this对象
     * @return Boolean 是否绑定成功
     */
    removeListener: function(el, type, fn, scope) {
        el = Edo.getDom(el);
        if (!el){
        	return false;
        }
        scope = scope || el;
        var A = this.findListener(el, type, fn, scope);
        if (!A){
        	return false;
        }
        var _uid = el.uid;
        this.evHash[_uid][type].remove(A);
        if (this.EVENTS[type]){
        	return;
        }
        if (window.removeEventListener) {
            if (isGecko3 && type == "mousewheel"){
            	type = "DOMMouseScroll";
            }
            el.removeEventListener(type, A[1], false)
        } else if (window.detachEvent){
        	el.detachEvent("on" + type, A[1]);
        }
        return true;
    },
    
    /**
     * 寻找监听dom事件
     * 
     * @param el : String 目标dom元素或dom的id字符串
     * @param type:String 事件名
     * @param fn : Function 事件监听器方法
     * @param scope : Object 激发事件时的this对象
     * @return Boolean 是否找到dom的监听事件
     */
    findListener: function(el, type, fn, scope) {
        el = Edo.getDom(el);
        if (!el){
        	return false;
        }
        scope = scope || el;
        var _uid = el.uid,
        _evHash = this.evHash[_uid];
        if (!_evHash){
        	return;
        }
        var C = _evHash[type];
        if (!C){
        	return;
        }
        for (var $ = 0, E = C.length; $ < E; $++) {
            var B = C[$];
            if (B[0] === fn && B[2] === scope){
            	return B;
            }
        }
    },
    
    /**
     * 激发DOM上给定类型的事件
     * 
     * @param el : String 目标dom元素或dom的id字符串
     * @param type:String 事件名
     */
    fireEvent: function(el, type) {
        el = Edo.getDom(el);
        if (!el) {
        	return false;
        }
        var _uid = el.uid,
        _evHash = this.evHash[_uid];
        if (!_evHash) {
        	return;
        }
        type = type.toLowerCase();
        var B = _evHash[type];
        if (B) {
            var _extra_args = Array.apply(null, arguments);
            _extra_args.shift();
            _extra_args.shift();
            B.each(function(_evHash) {
                _evHash[0].apply(_evHash[2], _extra_args);
            })
        }
    },
    
    /**
     * 清除监听dom事件
     * 
     * @param el : Element/String 目标dom元素或dom的id字符串
     * @param type : String 事件类型名
     */
    clearEvent: function(el, type) {
        el = Edo.getDom(el);
        if (!el) return false;
        var E = el.uid,
        D = this.evHash[E];
        if (D) for (var C in D) {
            if (C == "dom") continue;
            if ((type && type == C) || !type) {
                var B = D[C];
                while (B.length) {
                    var $ = B[0];
                    this.removeListener(el, C, $[0], $[2]);
                }
            }
        }
        if (!type) delete this.evHash[E];
    },
    
    /**
     * 阻止事件
     * 
     * @param el : Element/String 目标dom元素或dom的id字符串
     * @param eventName : String 事件名
     * @param preventDefault : Boolean 是否阻止默认行为
     */
    swallowEvent: function(el, eventName, preventDefault) {
        el = Edo.getDom(el);
        var C = function(event) {
            event.stopEvent();
            if (preventDefault){
            	event.stopDefault();
            }
        };
        if (eventName instanceof Array) {
            for (var i = 0, l = eventName.length; i < l; i++){
            	this.on(el, eventName[i], C);
            }
        } else {
        	this.on(el, eventName, C);
        }
    },
    
    /**
     * 增加样式
     * 
     * @param {Element/String} el 目标dom元素或dom的id字符串
     * @param {String} className 样式类名
     */
    addClass: function(el, className) {
        el = Edo.getDom(el);
        if (className && !this.hasClass(el, className)){
        	el.className = el.className + " " + className;
        }
    },
    
    /**
     * 去除样式
     * 
     * @param el : Element/String 目标dom元素或dom的id字符串
     * @param className : String 样式类名
     */
    removeClass: function(el, className) {
        el = Edo.getDom(el);
        if (!el || !className || !el.className) return;
        if (this.hasClass(el, className)) {
            var _ = this.classCache[className];
            if (!_) {
                _ = new RegExp("(?:^|\\s+)" + className + "(?:\\s+|$)", "g");
                this.classCache[className] = _
            }
            el.className = el.className.replace(_, " ");
        }
    },
    hasClass: function(el, className) {
        el = Edo.getDom(el);
        return className && (" " + el.className + " ").indexOf(" " + className + " ") != -1;
    },
    toggleClass: function($, _) {
        $ = Edo.getDom($);
        if (this.hasClass($, _)) this.removeClass($, _);
        else this.addClass($, _)
    },
    replaceClass: function(_, $, A) {
        _ = Edo.getDom(_);
        this.removeClass(_, $);
        this.addClass(_, A)
    },
    applyStyles: function(A, $) {
        A = Edo.getDom(A);
        if ($) if (typeof $ == "string") {
            var B = /\s?([a-z\-]*)\:\s?([^;]*);?/gi,
            _;
            while ((_ = B.exec($)) != null) this.setStyle(A, _[1], _[2])
        } else if (typeof $ == "object") {
            for (var C in $) this.setStyle(A, C, $[C])
        } else if (typeof $ == "function") this.applyStyles(A, $.call())
    },
    
    /**
     * 获取styles属性集合
     * 
     * @param el : Element/String 目标dom元素或dom的id字符串
     * @return Object 样式属性对象,如 { width: '100px', color: 'red', ...
     */
    getStyles: function(el) {
        var _args = arguments,
        len = _args.length,
        _styles = {};
        for (var i = 1; i < len; i++){
        	_styles[_args[i]] = this.getStyle(el, _args[i]);
        }
        return _styles;
    },
    
    /**
     * 获取style属性
     * 
     * @param el : Element/String 目标dom元素或dom的id字符串
     * @param name : String 属性名
     * @return String 样式属性值
     */
    getStyle: Edo.view && Edo.view.getComputedStyle ? 
    function(el, name) {
        el = Edo.getDom(el);
        var C,
        B,
        $;
        if (name == "float") name = "cssFloat";
        if (C = el.style[name]) return C;
        if (B = Edo.view.getComputedStyle(el, "")) {
            if (! ($ = this.propCache[name])) $ = this.propCache[name] = name.replace(this.camelRe, this.camelFn);
            return B[$]
        }
        return null;
    }: function(el, name) {
        el = Edo.getDom(el);
        var C,
        B,
        $;
        if (name == "opacity") return this.getOpacity(el);
        else if (name == "float") name = "styleFloat";
        if (! ($ = this.propCache[name])) $ = this.propCache[name] = name.replace(this.camelRe, this.camelFn);
        if (C = el.style[$]) return C;
        if (B = el.currentStyle) return B[$];
        return null;
    },
    
    setStyle: function(A, B, _) {
        A = Edo.getDom(A);
        if (typeof B == "string") {
            var $;
            if (! ($ = this.propCache[B])) $ = this.propCache[B] = B.replace(this.camelRe, this.camelFn);
            switch ($) {
            case "opacity":
                this.setOpacity(A, _);
                break;
            case "float":
                $ = isIE ? "styleFloat": "cssFloat";
            default:
                A.style[$] = _
            }
        } else for (var C in B) if (typeof B[C] != "function") this.setStyle(A, C, B[C])
    },
    isStyle: function(_, A, $) {
        return this.getStyle(_, A) == $
    },
    isBorderBox: function($) {
        $ = Edo.getDom($);
        if (!this.noBoxAdjust) {
            this.noBoxAdjust = isStrict ? {
                select: 1
            }: {
                input: 1,
                select: 1,
                textarea: 1
            };
            if (isIE || isGecko) this.noBoxAdjust["button"] = 1
        }
        return this.noBoxAdjust[$.tagName.toLowerCase()] || isBorderBox
    },
    adjust: function(_, B, $) {
        _ = Edo.getDom(_);
        var A = $ ? "lr": "tb";
        if (typeof B == "number") {
            if (!this.isBorderBox(_)) B -= (this.getBorderWidth(_, A) + this.getPadding(_, A));
            if (B < 0) B = 0
        }
        return B
    },
    addUnits: function(_, $) {
        if (_ === "" || _ == "auto") return _;
        if (_ === undefined) return "";
        if (typeof _ == "number" || !this.unitPattern.test(_)) return _ + ($ || "px");
        return _
    },
    addStyles: function(D, E, B) {
        var A = 0,
        F,
        C;
        for (var _ = 0, $ = E.length; _ < $; _++) {
            F = this.getStyle(D, B[E.charAt(_)]);
            if (F) {
                C = parseInt(F, 10);
                if (C) A += (C >= 0 ? C: -1 * C)
            }
        }
        return A
    },
    getMargins: function($, _) {
        if (!_) return {
            top: parseInt(this.getStyle($, "margin-top"), 10) || 0,
            left: parseInt(this.getStyle($, "margin-left"), 10) || 0,
            bottom: parseInt(this.getStyle($, "margin-bottom"), 10) || 0,
            right: parseInt(this.getStyle($, "margin-right"), 10) || 0
        };
        else return this.addStyles($, _, this.margins)
    },
    
    /**
     * 获取dom的边框宽度
     * 
     * @param el : Element/String 目标dom元素或dom的id字符串
     */
    getBorderWidth: function(el, _) {
        return this.addStyles(el, _, this.borders);
    },
    getPadding: function(el, _) {
        return this.addStyles(el, _, this.paddings);
    },
    setWidth: function(_, $) {
        _ = Edo.getDom(_);
        $ = this.adjust(_, $, true);
        _.style.width = this.addUnits($)
    },
    getWidth: function(_, A) {
        _ = Edo.getDom(_);
        var $ = _.offsetWidth || 0;
        $ = A !== true ? $: $ - this.getBorderWidth(_, "lr") - this.getPadding(_, "lr");
        return $ < 0 ? 0: $
    },
    setHeight: function(_, $) {
        _ = Edo.getDom(_);
        $ = this.adjust(_, $);
        _.style.height = this.addUnits($)
    },
    getHeight: function(_, A) {
        _ = Edo.getDom(_);
        var $ = _.offsetHeight || 0;
        $ = A !== true ? $: $ - this.getBorderWidth(_, "tb") - this.getPadding(_, "tb");
        return $ < 0 ? 0: $
    },
    
    /**
     * 获取可视区宽度
     * 
     * @param el : Element/String 目标dom元素或dom的id字符串
     * @param Number 返回可视区宽度
     */
    getViewWidth: function(el) {
        el = Edo.getDom(el);
        var _doc = document;
        if (el == _doc){
        	return isIE ? (isStrict ? _doc.documentElement.clientWidth: _doc.body.clientWidth) : self.innerWidth;
        } 
        return el.clientWidth;
    },
    
    /**
     * 获取可视区高度
     * 
     * @param el : Element/String 目标dom元素或dom的id字符串
     * @return Number 返回可视区高度
     */
    getViewHeight: function(el) {
        el = Edo.getDom(el);
        var _doc = document;
        if (el == _doc){
        	return isIE ? (isStrict ? _doc.documentElement.clientHeight: _doc.body.clientHeight) : self.innerHeight;
        } 
        return el.clientHeight;
    },
    
    /**
     * 获取可视区尺寸
     * 
     * @param el : Element/String 目标dom元素或dom的id字符串
     * @return Number 返回可视区尺寸
     */
    getViewSize: function(el) {
        return {
            width: this.getViewWidth(el),
            height: this.getViewHeight(el)
        }
    },
    
    /**
     * 获取滚动区宽度
     * @param el : Element/String 目标dom元素或dom的id字符串
     * @return Number 返回滚动区宽度
     */
    getScrollWidth: function(el) {
        el = Edo.getDom(el);
        var _doc = document;
        if (el == _doc){
        	return Math.max(Math.max(_doc.body.scrollWidth, _doc.documentElement.scrollWidth), this.getViewWidth(_doc));
        }
        return el.scrollWidth;
    },
    
    /**
     * 获取滚动区高度
     * @param el : Element/String 目标dom元素或dom的id字符串
     * @return Number 返回滚动区宽度
     */
    getScrollHeight: function(el) {
        el = Edo.getDom(el);
        var _doc = document;
        if (el == _doc){
        	return Math.max(Math.max(_doc.body.scrollHeight, _doc.documentElement.scrollHeight), this.getViewHeight(_doc));
        }
        return el.scrollHeight
    },
    
    /**
     * 获取滚动区尺寸
     * 
     * @param el : Element/String 目标dom元素或dom的id字符串
     * @return Size 
     */
    getScrollSize: function(el) {
        return {
            width: this.getScrollWidth(el),
            height: this.getScrollHeight(el)
        }
    },
    
    getScroll: function(el) {
        if (!el) el = document;
        el = Edo.getDom(el);
        var _doc = document;
        if (el == _doc || el == _doc.body) {
            var _scrollLeft,
            _scrollTop;
            if (isIE && isStrict) {
                _scrollLeft = _doc.documentElement.scrollLeft || (_doc.body.scrollLeft || 0);
                _scrollTop = _doc.documentElement.scrollTop || (_doc.body.scrollTop || 0)
            } else {
                _scrollLeft = window.pageXOffset || (_doc.body.scrollLeft || 0);
                _scrollTop = window.pageYOffset || (_doc.body.scrollTop || 0)
            }
            return {
                left: _scrollLeft,
                top: _scrollTop
            }
        } else return {
            left: el.scrollLeft,
            top: el.scrollTop
        }
    },
    
    isScrollable: function(A, $) {
        A = Edo.getDom(A);
        var _ = A.scrollWidth > A.clientWidth,
        B = A.scrollHeight > A.clientHeight;
        if ($ === true) return _;
        if ($ === false) return B;
        return _ || B
    },
    
    /**
     * 判断给定的dom是否显示
     * 
     * @param el : Element/String 目标dom元素或dom的id字符串
     * @return Boolean
     */
    isVisible: function(el, B) {
        el = Edo.getDom(el);
        var $ = !(this.getStyle(el, "visibility") == "hidden" || this.getStyle(el, "display") == "none");
        if (B !== true || !$){
        	return $;
        }
        var _el_parent = el.parentNode;
        while (_el_parent && _el_parent.tagName.toLowerCase() != "body") {
            if (!this.isVisible(_el_parent)){
            	 return false;
            }
            _el_parent = _el_parent.parentNode;
        }
        return true;
    },
    
    /**
     * 设置dom元素的postion属性
     * 
     * @param el : Element/String 目标dom元素或dom的id字符串
     * @param position : css 的postion属性值
     * @param zindex : css的z-index的属性值
     * @param left : css的left属性值
     * @param top : css的top属性值
     */
    position: function(el, position, zindex, left, top) {
        el = Edo.getDom(el);
        if (!position) {
            if (this.getStyle(el, "position") == "static"){
            	this.setStyle(el, "position", "relative");
            }
        } else {
        	this.setStyle(el, "position", position);
        }
        if (zindex){
        	this.setStyle(el, "z-index", zindex);
        }
        if (left !== undefined && top !== undefined){
        	this.setXY(el, [left, top]);
        } else if (left !== undefined){
        	this.setX(el, left);
        } else if (top !== undefined) {
        	this.setY(el, top);
        }
    },
    translatePoints: function(el, xy, B) {
        if (xy instanceof Array) {
            B = xy[1];
            xy = xy[0]
        }
        var C = this.getStyle(el, "position"),
        _xy = this.getXY(el),
        _left = parseInt(this.getStyle(el, "left"), 10),
        _top = parseInt(this.getStyle(el, "top"), 10);
        if (isNaN(_left)){
        	_left = (C == "relative") ? 0: el.offsetLeft;
        }
        if (isNaN(_top)){
        	_top = (C == "relative") ? 0: el.offsetTop;
        }
        return {
            left: (xy - _xy[0] + _left),
            top: (B - _xy[1] + _top)
        }
    },
    setX: function($, _) {
        this.setXY($, [_, false])
    },
    setY: function($, _) {
        this.setXY($, [false, _])
    },
    setXY: function(_, $) {
        _ = Edo.getDom(_);
        this.position(_);
        var A = this.translatePoints(_, $);
        if ($[0] !== false) _.style.left = A.left + "px";
        if ($[1] !== false) _.style.top = A.top + "px"
    },
    getXY: function(F) {
        var _,
        D,
        B,
        I,
        C = (document.body || document.documentElement);
        F = Edo.getDom(F);
        if (F == C) return [0, 0];
        var $ = pt = 0;
        if (!isGecko) {
            $ = parseInt(this.getStyle(F, "margin-left"), 10) || 0;
            pt = parseInt(this.getStyle(F, "margin-top"), 10) || 0
        }
        if (F.getBoundingClientRect) {
            B = F.getBoundingClientRect();
            I = this.getScroll(document);
            return [B.left + I.left + $, B.top + I.top + pt]
        }
        var J = 0,
        H = 0;
        _ = F;
        var E = this.getStyle(F, "position") == "absolute";
        while (_) {
            J += _.offsetLeft;
            H += _.offsetTop;
            if (!E && this.getStyle(_, "position") == "absolute") E = true;
            if (isGecko && _ != F) {
                var G = parseInt(this.getStyle(_, "borderTopWidth"), 10) || 0,
                A = parseInt(this.getStyle(_, "borderLeftWidth"), 10) || 0;
                J += A;
                H += G;
                if (_ != F && this.getStyle(_, "overflow") != "visible") {
                    J += A;
                    H += G
                }
            }
            _ = _.offsetParent
        }
        if (isSafari && E) {
            J -= C.offsetLeft;
            H -= C.offsetTop
        }
        if (isGecko && !E) {
            J += parseInt(this.getStyle(C, "borderLeftWidth"), 10) || 0;
            H += parseInt(this.getStyle(C, "borderTopWidth"), 10) || 0
        }
        _ = F.parentNode;
        while (_ && _ != C) {
            if (!isOpera || (_.tagName != "TR" && this.getStyle(_, "display") != "inline")) {
                J -= _.scrollLeft;
                H -= _.scrollTop
            }
            _ = _.parentNode
        }
        return [J + $, H + pt]
    },
    setSize: function(A, $, _) {
        if ($ || $ == 0) this.setWidth(A, $);
        if (_ || _ == 0) this.setHeight(A, _)
    },
    getSize: function($, _) {
        return {
            width: this.getWidth($, _),
            height: this.getHeight($, _)
        }
    },
    setBox: function(C, B, $) {
        var _ = B.width,
        A = B.height;
        if ($ && !this.isBorderBox(C)) {
            _ -= (this.getBorderWidth(C, "lr") + this.getPadding(C, "lr"));
            A -= (this.getBorderWidth(C, "tb") + this.getPadding(C, "tb"))
        }
        this.setSize(C, B.width, B.height);
        this.setXY(C, [B.x, B.y])
    },
    getBox: function(el, F) {
        el = Edo.getDom(el);
        var _ = this.getXY(el),
        A = el.offsetWidth,
        C = el.offsetHeight,
        box;
        if (!F) box = {
            x: _[0],
            y: _[1],
            0: _[0],
            1: _[1],
            width: A,
            height: C
        };
        else {
            var G = this.getBorderWidth(el, "l") + this.getPadding(el, "l"),
            B = this.getBorderWidth(el, "r") + this.getPadding(el, "r"),
            E = this.getBorderWidth(el, "t") + this.getPadding(el, "t"),
            H = this.getBorderWidth(el, "b") + this.getPadding(el, "b");
            box = {
                x: _[0] + G,
                y: _[1] + E,
                0: _[0] + G,
                1: _[1] + E,
                width: A - (G + B),
                height: C - (E + H)
            }
        }
        box.right = box.x + box.width;
        box.bottom = box.y + box.height;
        return box;
    },
    
    /**
     * 清除透明度
     * 
     * @param el : Element/String 目标dom元素或dom的id字符串
     */
    clearOpacity: function(el) {
        el = Edo.getDom(el);
        var _elStyle = el.style;
        if (isIE) {
            if (typeof _elStyle.filter == "string" && (/alpha/i).test(_elStyle.filter)) _elStyle.filter = ""
        } else {
            _elStyle.opacity = "";
            _elStyle["-moz-opacity"] = "";
            _elStyle["-khtml-opacity"] = ""
        }
    },
    setOpacity: function(_, $) {
        _ = Edo.getDom(_);
        $ = parseFloat($);
        var A = _.style;
        if (isIE) {
            A.zoom = 1;
            A.filter = (A.filter || "").replace(/alpha\([^\)]*\)/gi, "") + ($ == 1 ? "": " alpha(opacity=" + $ * 100 + ")")
        } else A.opacity = $
    },
    getOpacity: function(_) {
        _ = Edo.getDom(_);
        var B = _.style;
        if (typeof B.filter == "string") {
            var $ = B.filter.match(/alpha\(opacity=(.*)\)/i);
            if ($) {
                var A = parseFloat($[1]);
                if (!isNaN(A)) return A ? A / 100: 0
            }
            return 1
        } else return parseFloat(B.opacity) || 1
    },
    remove: function(_, $) {
        Edo.removeNode(_, $)
    },
    clearNodes: function(_) {
        var B = _.childNodes;
        for (var $ = B.length - 1; $ >= 0; $--) {
            var A = B[$];
            _.removeChild(A)
        }
    },
    warp: null,
    createElement: function($) {
        if (!this.warp) this.wrap = document.createElement("div");
        $ = $.trim();
        var A = $.indexOf("<tr") == 0;
        if (A) $ = "<table>" + $ + "</table>";
        this.wrap.innerHTML = $;
        var _ = this.wrap.firstChild;
        return A ? _.rows[0] : _
    },
    insertHtml: function(A, $, _) {
        A = Edo.getDom(A);
        _ = _.toLowerCase();
        if (A.insertAdjacentHTML) {
            switch (_) {
            case "beforebegin":
                A.insertAdjacentHTML("BeforeBegin", $);
                return A.previousSibling;
            case "afterbegin":
                A.insertAdjacentHTML("AfterBegin", $);
                return A.firstChild;
            case "beforeend":
                A.insertAdjacentHTML("BeforeEnd", $);
                return A.lastChild;
            case "afterend":
                A.insertAdjacentHTML("AfterEnd", $);
                return A.nextSibling
            }
            throw "Illegal insertion point -> \"" + _ + "\""
        }
        var B = A.ownerDocument.createRange(),
        C;
        switch (_) {
        case "beforebegin":
            B.setStartBefore(A);
            C = B.createContextualFragment($);
            A.parentNode.insertBefore(C, A);
            return A.previousSibling;
        case "afterbegin":
            if (A.firstChild) {
                B.setStartBefore(A.firstChild);
                C = B.createContextualFragment($);
                A.insertBefore(C, A.firstChild);
                return A.firstChild
            } else {
                A.innerHTML = $;
                return A.firstChild
            }
        case "beforeend":
            if (A.lastChild) {
                B.setStartAfter(A.lastChild);
                C = B.createContextualFragment($);
                A.appendChild(C);
                return A.lastChild
            } else {
                A.innerHTML = $;
                return A.lastChild
            }
        case "afterend":
            B.setStartAfter(A);
            C = B.createContextualFragment($);
            A.parentNode.insertBefore(C, A.nextSibling);
            return A.nextSibling
        }
        throw "Illegal insertion point -> \"" + _ + "\""
    },
    insertElement: function(A, _, $) {
        A = Edo.getDom(A);
        _ = Edo.getDom(_);
        $ = $.toLowerCase();
        if (A.insertAdjacentElement) A.insertAdjacentElement($, _);
        else switch ($) {
        case "beforebegin":
            A.parentNode.insertBefore(_, A);
            break;
        case "afterbegin":
            A.insertBefore(_, A.firstChild);
            break;
        case "beforeend":
            A.appendChild(_);
            break;
        case "afterend":
            A.nextSibling ? A.parentNode.insertBefore(_, A.nextSibling) : A.parentNode.appendChild(_);
            break
        }
        switch ($) {
        case "beforebegin":
            return A.previousSibling;
        case "afterbegin":
            return A.firstChild;
        case "beforeend":
            return A.lastChild;
        case "afterend":
            return A.nextSibling;
        default:
            throw new Error()
        }
    },
    insert: function(A, _, $) {
        if (_.toString().indexOf("<tr") == 0) _ = this.createElement(_);
        A = Edo.getDom(A);
        return (typeof _ == "string" ? this.insertHtml: this.insertElement)(A, _, $)
    },
    
    /**
     * 将指定的dom添加到目标元素内的最后
     * 
     * @param el : Element/String 目标dom元素或dom的id字符串
     * @param c : String 需要添加的dom
     * @return Element dom元素
     */
    append: function(el, c) {
        el = Edo.getDom(el);
        return this.insert(el, c, "beforeend")
    },
    preend: function(_, $) {
        _ = Edo.getDom(_);
        return this.insert(_, $, "afterbegin")
    },
    
    /**
     * 将指定的dom添加到目标元素的后面
     * 
     * @param parentElement : Element/String 目标父元素
     * @param c : String 需要添加的dom
     * @return Element dom元素
     */
    after: function(parentElement, c) {
        parentElement = Edo.getDom(parentElement);
        return this.insert(parentElement, c, "afterend")
    },
    
    /**
     * 将指定的dom添加到目标元素内的前面
     * 
     * @param parentElement : Element/String 目标父元素
     * @param c : String 需要添加的dom
     * @return Element dom元素
     */
    before: function(parentElement, c) {
        parentElement = Edo.getDom(parentElement);
        return this.insert(parentElement, c, "beforebegin")
    },
    
    overwrite: function(_, $) {
        _ = Edo.getDom(_);
        _.innerHTML = "";
        return this.append(_, $)
    },
    replace: function($, _) {
        $ = Edo.getDom($);
        _ = Edo.getDom(_);
        if ($.parentNode) $.parentNode.replaceChild(_, $)
    },
    
    /**
     * 清空
     * 
     * @param el : Element/String 目标父元素
     */
    empty: function(el) {
        el = Edo.getDom(el);
        if (el.innerHTML){
        	el.innerHTML = "";
        } else {
        	el.value = ""
        }
    },
    
    isAncestor: function(A, $) {
        var _ = false;
        A = Edo.getDom(A);
        $ = Edo.getDom($);
        if (A === $) return true;
        if (A && $) if (A.contains) return A.contains($);
        else if (A.compareDocumentPosition) return !! (A.compareDocumentPosition($) & 16);
        else while ($ = $.parentNode) _ = $ == A || _;
        return _
    },
    
    /**
     * 查找目标元素的指定样式的父元素
     * 
     * parentElement : Element/String 目标父元素
     * dom2 : dom dom元素 
     * number : Number 查找的层级数
     */
    findParent: function(parentElement, dom2, number) {
        parentElement = Edo.getDom(parentElement);
        var C = document.body,
        _ = 0,
        D;
        number = number || 50;
        if (typeof number != "number") {
            D = Edo.getDom(number);
            number = 10
        }
        while (parentElement && parentElement.nodeType == 1 && _ < number && parentElement != C && parentElement != D) {
            if (this.hasClass(parentElement, dom2)){
            	return parentElement;
            }
            _++;
            parentElement = parentElement.parentNode;
        }
        return null;
    },
    findChild: function(_, A) {
        _ = Edo.getDom(_);
        var B = _.getElementsByTagName("*");
        for (var $ = 0, C = B.length; $ < C; $++) {
            var _ = B[$];
            if (this.hasClass(_, A)) return _
        }
    },
    mask: function(_, A, C, $) {
        _ = Edo.getDom(_);
        if (_._mask) return;
        A = A || "";
        C = C || "";
        this.unmask(_);
        _._position = _.style.position;
        if (this.getStyle(_, "position") == "static" && _ != document && _ != document.body) this.setStyle(_, "position", "relative");
        _._mask = this.append(_, "<div class=\"e-mask\" style=\"height:0px;overflow:hidden;\"><div class=\"e-mask-cover " + C + "\"></div>" + A + "</div>");
        this.addClass(_, "e-masked");
        if ($) this.addClass(_._mask, $);
        _._mask.style.height = "100%";
        if (document == _ || document.body == _) {
            var B = Edo.util.Dom.getScrollSize(document);
            Edo.util.Dom.setHeight(_._mask, B.height)
        }
        return _._mask
    },
    unmask: function($) {
        $ = Edo.getDom($);
        if ($._mask) {
            this.remove($._mask);
            $._mask = null
        }
        this.removeClass($, "e-masked");
        if ($._position) $.style.position = $._position
    },
    isMasked: function($) {
        $ = Edo.getDom($);
        return !! ($._mask && $._mask.style.display != "none")
    },
    
    /**
     * 获取焦点
     * 
     * @param el : Element/String 目标dom元素或dom的id字符串
     */
    focus: function(el) {
        el = Edo.getDom(el);
        try {
            setTimeout(function() {
                try {
                    el.focus();
                } catch(_) {}
            },10)
        } catch(_) {}
    },
    
    /**
     * 失去焦点
     * 
     * @param el : Element/String 目标dom元素或dom的id字符串
     */
    blur: function(el) {
        el = Edo.getDom(el);
        try {
            try {
                el.blur();
            } catch(_) {}
        } catch(_) {}
    },
    repaint: function($) {
        this.addClass($, "e-repaint");
        setTimeout(function() {
            Edo.util.Dom.removeClass($, "e-repaint")
        },
        1)
    },
    selectable: function(_, $) {
        _ = Edo.getDom(_);
        if ( !! $) {
            this.removeClass(_, "e-unselectable");
            if (isIE) _.unselectable = "off";
            else {
                _.style.MozUserSelect = "";
                _.style.KhtmlUserSelect = "";
                _.style.UserSelect = ""
            }
        } else {
            this.addClass(_, "e-unselectable");
            if (isIE) _.unselectable = "on";
            else {
                _.style.MozUserSelect = "none";
                _.style.UserSelect = "none";
                _.style.KhtmlUserSelect = "none"
            }
        }
    },
    clip: function($) {
        $ = Edo.getDom($);
        if (!$.isClipped) {
            $.isClipped = true;
            $.originalClip = {
                o: this.getStyle($, "overflow"),
                x: this.getStyle($, "overflow-x"),
                y: this.getStyle($, "overflow-y")
            };
            this.setStyle($, "overflow", "hidden");
            this.setStyle($, "overflow-x", "hidden");
            this.setStyle($, "overflow-y", "hidden")
        }
    },
    unclip: function(_) {
        _ = Edo.getDom(_);
        if (_.isClipped) {
            _.isClipped = false;
            var $ = _.originalClip;
            if ($.o) this.setStyle(_, "overflow", $.o);
            if ($.x) this.setStyle(_, "overflow-x", $.x);
            if ($.y) this.setStyle(_, "overflow-y", $.y)
        }
    },
    getOuterHtml: function(_) {
        _ = Edo.getDom(_);
        var C = _.outerHTML;
        if (C) return C;
        var D = _.attributes,
        B = "<" + _.tagName;
        for (var $ = 0; $ < D.length; $++) {
            var A = D[$];
            if (A.specified) B += " " + A.name + "=\"" + A.value + "\""
        }
        C = _.innerHTML;
        if (C) return B + ">" + C + "</" + _.tagName + ">";
        else return B + ">"
    },
    setOuterHtml: function(A, $) {
        A = Edo.getDom(A);
        if (A.outerHTML) {
            A.outerHTML = $;
            return
        }
        var _ = A.ownerDocument.createRange();
        _.setStartBefore(A);
        var B = _.createContextualFragment($);
        A.parentNode.replaceChild(B, A)
    },
    hover: function(_, D, $, A) {
        _ = Edo.getDom(_);
        var B = function($) {
            if (!$.within(this, true)) D.apply(A || this, arguments)
        },
        C = function(_) {
            if (!_.within(this, true)) $.apply(A || this, arguments)
        };
        this.on(_, "mouseover", B, _);
        this.on(_, "mouseout", C, _)
    },
    addClassOnOver: function($, _) {
        $ = Edo.getDom($);
        $.overCls = _;
        this.hover($, 
        function() {
            this.addClass($, $.overCls)
        },
        function() {
            this.removeClass($, $.overCls)
        },
        this)
    },
    addClassOnFocus: function($, _) {
        $ = Edo.getDom($);
        $.focusCls = _;
        this.on($, "focus", 
        function() {
            this.addClass($, $.focusCls)
        },
        this);
        this.on($, "blur", 
        function() {
            this.removeClass($, $.focusCls)
        },
        this)
    },
    addClassOnClick: function(_, A, $) {
        _ = Edo.getDom(_);
        _.clickCls = A;
        this.on(_, "mousedown", 
        function() {
            this.addClass(_, _.clickCls);
            var A = function() {
                this.removeClass(_, _.clickCls);
                this.un(document, "mouseup", A, this);
                if ($) $()
            };
            this.on(document, "mouseup", A, this)
        },
        this)
    },
    isInRegin: function($, _) {
        var B = $[0],
        A = $[1];
        _.right = _.x + _.width;
        _.bottom = _.y + _.height;
        return B >= _.x && B <= _.right && A >= _.y && A <= _.bottom
    },
    getbyClass: function(A, $) {
        var _ = this.getsbyClass(A, $, false);
        return _[0]
    },
    getsbyClass: function(E, A, C) {
        if (A && typeof A == "string") A = document.getElementById(A);
        var D = (A || document).getElementsByTagName("*"),
        _ = [];
        for (var $ = 0, F = D.length; $ < F; $++) {
            var B = D[$];
            if (E && (" " + B.className + " ").indexOf(" " + E + " ") != -1) {
                _.push(B);
                if (C === false) break
            }
        }
        return _
    },
    getChildren: function(B) {
        B = Edo.getDom(B);
        var C = B.childNodes,
        _ = [];
        for (var $ = 0, D = C.length; $ < D; $++) {
            var A = C[$];
            if (A && A.tagName && A.nodeType == 1) _.push(A)
        }
        return _
    },
    getOffsetsTo: function(_, A) {
        var $ = this.getXY(_),
        B = this.getXY(A);
        return [$[0] - B[0], $[1] - B[1]]
    },
    scrollIntoView: function(I, H, F) {
        var B = Edo.getDom(H) || Edo.getBody(),
        $ = this.getOffsetsTo(I, B),
        C = $[0] + B.scrollLeft,
        J = $[1] + B.scrollTop,
        D = J + I.offsetHeight,
        A = C + I.offsetWidth,
        G = B.clientHeight,
        K = parseInt(B.scrollTop, 10),
        _ = parseInt(B.scrollLeft, 10),
        L = K + G,
        E = _ + B.clientWidth;
        if (I.offsetHeight > G || J < K) B.scrollTop = J;
        else if (D > L) B.scrollTop = D - G;
        B.scrollTop = B.scrollTop;
        if (F !== false) {
            if (I.offsetWidth > B.clientWidth || C < _) B.scrollLeft = C;
            else if (A > E) B.scrollLeft = A - B.clientWidth;
            B.scrollLeft = B.scrollLeft
        }
        return this
    }
};
Edo.util.Dom.on = Edo.util.Dom.addListener;
Edo.util.Dom.un = Edo.util.Dom.removeListener;
Edo.util.Dom.contains = Edo.util.Dom.isAncestor;
//Edo.util.Dom : END

//getContent??
Edo.getCt = function() {
    if (!Edo.ct) {
        Edo.ct = document.createElement("div");
        Edo.ct.style.cssText = "position:absolute;overflow:auto;width:2000px;height:1000px;display:block;left:-2000px;top:-1000px;";
        document.body.appendChild(Edo.ct);
    }
    return Edo.ct;
};

Edo.util.Dom.on(window, "unload", function() {
    var _date = new Date();
    if (Edo.managers.SystemManager) {
    	Edo.managers.SystemManager.destroy();//销毁组件对象
    }
    var evHash = Edo.util.Dom.evHash;
    for (var eid in evHash) {//清除绑定在dom上的事件
        try {
            Edo.util.Dom.clearEvent(evHash[eid].dom);
        } catch(B) {}
    }
    Edo.ct = null;
}); 

//给html body标签添加环境class属性
(function() {
    var $ = function() {
        var _body = document.body || document.getElementsByTagName("body")[0];
        if (!_body) {
        	return false;
        }
        Edo.getCt();
        var $ = [" ", isIE ? "ie " + (isIE6 ? "ie6": (isIE7 ? "ie7": "ie8")) : isGecko ? "gecko " + (isGecko2 ? "gecko2": "gecko3") : isOpera ? "opera": isWebKit ? "webkit": ""];
        if (isSafari) {
        	$.push("safari " + (isSafari2 ? "safari2": (isSafari3 ? "safari3": "safari4")));
        } else if (isChrome) {
        	$.push("chrome");
        }
        if (isMac) {
        	$.push("mac");
        }
        if (isLinux) {
        	$.push("linux");
        }
        if (isStrict || isBorderBox) {
            var _html = _body.parentNode;
            if (_html) {
            	_html.className += isStrict ? " strict": " border-box";
            }
        }
        _body.className += $.join(" ");
        return true;
    };
    if (!$()){
    	Edo.domLoad($);
    }
})();

/**
 * 激发Edojs的domload事件
 */
Edo.domLoad(function() {
    Edo.util.Dom.fireEvent(window, "domload");
});


var enableTrace = false,
traceWindow = null,
traceArray = [];
function trace($, _) {
    if (!enableTrace) return;
    if (!traceWindow) {
        traceWindow = Edo.util.Dom.append(document.body, "<div style=\"width:40%;height:300px;overflow:auto;border:solid 1px black;position:absolute;right:0;top:0;\"></div>");
        Edo.util.Dom.append(document.body, "<input type=\"button\" style=\"border:solid 1px black;position:absolute;right:10px;top:10px;width:50px;\" value=\"清空\" onclick=\"traceWindow.innerHTML = '';\" />")
    }
    Edo.util.Dom.append(traceWindow, "<span style=\"" + _ + "\">" + $ + "</span>" + "<br/>");
    traceWindow.scrollTop = 100000
}

/**
 * XML User Interface Language？？
 * 
 * @see http://baike.baidu.com/view/955745.htm
 */
var isXUL = isGecko ? function($) {
    return Object.prototype.toString.call($) == "[object XULElement]"
}: function() {},

/**
 * 是否为文本节点
 */
isTextNode = isGecko ? function(domNode) {
    try {
        return domNode.nodeType == 3
    } catch(_) {
        return false;
    }
}: function(domNode) {
    return domNode.nodeType == 3;
};

/**
 * 事件对象基类
 * 
 * @param event : Event
 */
Edo.util.Event = function(event) {
    if (event.rawEvent) {
    	return event;
    }
    var _event = this.rawEvent = event;
    Edo.apply(this, _event);
    this.ctrlKey = _event.ctrlKey || _event.metaKey;
    if (typeof(_event.button) !== "undefined") {
        var _ = Edo.util.MouseButton;
        this.button = (typeof(_event.which) !== "undefined") ? _event.button: (_event.button === 4) ? _.middle: (_event.button === 2) ? _.right: _.left
    }
    if (_event.type === "keypress"){
    	this.charCode = _event.charCode || _event.keyCode || 0;
    } else if (_event.keyCode && (_event.keyCode === 46)){
    	this.keyCode = 127;
    }
    this.domType = this.type;
    this.domTarget = this.trigger = this.target = this.resolveTextNode(_event.target || _event.srcElement);
    this.x = this.getX(),
    this.y = this.getY();
    this.xy = [this.x, this.y];
    if (event.type == "DOMMouseScroll") {
        this.type = "mousewheel";
        this.wheelDelta = this.getWheelDelta() * 24;
    }
};
Edo.util.Event.prototype = {
    getX: function(event) {
        event = event ? event.rawEvent || event: this.rawEvent;
        var _pageX = event.pageX;
        if (!_pageX && 0 !== _pageX) {
            _pageX = event.clientX || 0;
            if (document.all){//if ISIE
            	_pageX += this.getScroll()[1];
            }
        }
        return _pageX;
    },
    getY: function(event) {
        event = event ? event.rawEvent || event: this.rawEvent;
        var _pageY = event.pageY;
        if (!_pageY && 0 !== _pageY) {
            _pageY = event.clientY || 0;
            if (document.all){//if ISIE
            	_pageY += this.getScroll()[0];
            }
        }
        return _pageY;
    },
    getWheelDelta: function() {
        var _event = this.rawEvent,
        wheelNum = 0;
        if (_event.wheelDelta){//un Firefox
        	wheelNum = _event.wheelDelta / 120;
        } else if (_event.detail){//Firefox
        	wheelNum = -_event.detail / 3;
        }
        return wheelNum;
    },
    
    /**
     * ??
     */
    within: function($, A) {
        var _ = A ? this.getRelatedTarget() : this.domTarget;
        return _ && Edo.util.Dom.contains($, _)
    },
    stopEvent: function() {
        if (this.rawEvent.stopPropagation){//un IE
        	this.rawEvent.stopPropagation();
        } else if (window.event){//IE
        	window.event.cancelBubble = true;
        }
    },
    stopDefault: function() {
        if (this.rawEvent.preventDefault){
        	this.rawEvent.preventDefault();
        } else if (window.event){
        	window.event.returnValue = false;
        }
    },
    stop: function() {
        this.stopDefault();
        this.stopEvent();
    },
    resolveTextNode: function($) {
        try {
            return $ && !$.tagName ? $.parentNode: $
        } catch(_) {
            return null
        }
    },
    getRelatedTarget: function(event) {
        event = event ? (event.rawEvent || event) : this.rawEvent;
        var $ = event.relatedTarget;
        if (!$){
        	if (event.type == "mouseout"){
        		$ = event.toElement;
        	} else if (event.type == "mouseover"){
        		$ = event.fromElement;
        	} else if (event.type == "blur"){
        		$ = document.elementFromPoint(this.x, this.y);
        	}
        }
        return this.resolveTextNode($)
    },
    getScroll: function() {
        var _html = document.documentElement,
        _body = document.body;
        if (_html && (_html.scrollTop || _html.scrollLeft)){
        	return [_html.scrollTop, _html.scrollLeft];
        } else if (_body){
        	return [_body.scrollTop, _body.scrollLeft];
        } else {
        	return [0, 0];
        }
    }
};
Edo.util.Event.isSafeKey = function(keyCode) {
	/**
	 * 16 = Shift_L
	 * 17 = Control_L
	 * 18 = Alt_L
	 */
    return (keyCode >= 16 && keyCode <= 18) || (keyCode >= 33 && keyCode <= 40);
};
/**
 * 鼠标按钮
 */
Edo.util.MouseButton = {
    left: 0,
    middle: 1,
    right: 2
};
//Edo.util.Event : END

/**
 * 事件基类.实现事件的add,remove,find,fire,clear等逻辑,是edo框架实现事件机制的类.
 * 
 * Namespace:	Edo.util
 * ClassName:	Observable
 * 
 * @example
 * //监听click事件
 * cmp.addListener('click', onClick, cmp);
 * //删除监听
 * cmp.removeListener('click', onClick, cmp);
 *  ...
 *  @see http://edojs.com/api/#Edo.util.Observable
 */
Edo.util.Observable = function() {
    if (!this.events){
    	this.events = {};
    }
};
Edo.util.Observable.prototype = {
	/**
	 * 批量增加事件监听方法,别名 "on"
	 * 
	 * @param listeners : Object 事件配置对象:{'click': function(e){...}, ...}
	 * @param scope : Object 激发事件时的this对象
	 * @return Object 返回组件对象自身
	 */		
    addListeners: function(listeners, scope) {
        if (listeners) {
            scope = listeners.scope || scope || this;
            delete listeners.scope;
            for (var type in listeners){
            	this.on(type, listeners[type], scope);
            }
        }
        return this;
    },
    
    /**
     * 添加事件监听方法，别名 "on"
     * 
     * @param name : String 事件名
     * @param fn : Function 事件监听器方法
     * @param scope : Object 激发事件时的this对象
     * @param index : Number
     * @return Object 返回组件对象自身
     */
    addListener: function(name, fn, scope, index) {
        if (typeof fn != "function"){
        	return false;
        }
        name = name.toLowerCase();
        var _event = this.events[name];
        if (!_event){
        	_event = this.events[name] = [];
        }
        if (_event) {
            scope = scope || this;
            if (!this.findListener(name, fn, scope)) {
            	if (typeof index !== "undefined") {
            		_event.insert(index, [fn, scope]);//insert Array原型扩展
            	} else {
            		_event[_event.length] = [fn, scope]
            	}
            }
        }
        return this;
    },
    
    /**
     * 删除事件监听方法,别名 "un"
     * 
     * @param name : String 事件名
     * @param fn : Function 事件监听器方法
     * @param scope : Object 激发事件时的this对象
     * @return Object 返回组件对象自身
     */
    removeListener: function(name, fn, scope) {
        if (typeof fn != "function") return false;
        name = name.toLowerCase();
        var _event = this.events[name];
        if (_event) {
            scope = scope || this;
            var element = this.findListener(name, fn, scope);
            if (element) _event.remove(element);
        }
        return this;
    },
    
    /**
     * 判断是否具有指定的事件监听方法
     * 
     * @param name : String 事件名
     * @param fn : Function 事件监听器方法
     * @param scope : Object 激发事件时的this对象
     * @return element 数组元素
     */
    findListener: function(name, fn, scope) {
        name = name.toLowerCase();
        var _event = this.events[name];
        scope = scope || this;
        if (_event){
        	for (var i = 0, l = _event.length; i < l; i++) {
                var element = _event[i];
                if (element[0] === fn && element[1] === scope) return element;
            }
        }
    },
    
    /**
     * 增加事件
     * 
     * @param arguments : Array 事件名字符串数组
     * @return Object 返回组件对象自身
     */
    addEvents: function() {
        if (!this.events){
        	this.events = {};
        }
        var _events = this.events,
        _ = Array.apply(null, arguments);
        _.each(function(name) {
            var _ = _events[name];
            if (!_) _events[name] = [];
        });
        return this;
    },
    
    /**
     * 激发事件
     * 
     * @param name : String 事件名
     * @param arguments : Array 事件激发时的参数数组
     * @return Object
     */
    fireEvent: function(name, arguments) {
        var _event = this.events[name];
        if (_event) {
            var E;
            if (arguments && arguments != this) {
                arguments.source = this;
                arguments.type = name;
            }
            for (var i = 0, l = _event.length; i < l; i++) {
                var D = _event[i],
                _ = D[0].call(D[1] || this.scope || this, arguments);
                if (E !== false) E = _;
            }
            return E;
        }
    },
    
    /**
     * 清除所有事件
     * 
     * @return Object 返回组件对象自身
     */
    clearEvent: function($) {
        if ($){
        	delete this.events[$];
        } else {
        	this.events = {};
        }
        return this;
    }
};
Edo.util.Observable.prototype.on = Edo.util.Observable.prototype.addListener;
Edo.util.Observable.prototype.un = Edo.util.Observable.prototype.removeListener;
//Edo.util.Observable : END

//----------------------------- Edo.util.Ajax : BEGIN--------------------------------
var isLocalFile = location.href.indexOf("file:") != -1;
if (!window.XMLHttpRequest || (isIE && isLocalFile)){
	window.XMLHttpRequest = function() {
	    var B = ["Microsoft.XMLHTTP", "Msxml2.XMLHTTP"];
	    for (var i = 0; i < B.length; i++) {
	        try {
	            var xhr = new ActiveXObject(B[i]);
	            return xhr;
	        } catch(A) {};
	    }
	    return null;
	};
}
function emptyFn() {}
/**
 * ajax无刷新数据交互组件
 * 
 * @see http://www.edojs.com/api/#Edo.util.Ajax
 */
Edo.util.Ajax = {
    ajaxID: 100,
    ajaxConfigs: {},
    getAjax: function($) {
        return this.ajaxConfigs[$]
    },
    
    /**
     * 发送ajax方式的数据提交 
     * 
     * @param {Object} config     
     * ajax配置对象 config
     * {
     *    type: "get",            //交互方式:get,post
     *    url: null,              //数据源地址
     *    params: null,           //传递参数        
     *    async: true,            //是否异步    
     *    timeout: 0,             //超时设置,为0不设置超时
     *    nocache: true,          //不缓存
     *    onSuccess: Edo.emptyFn, //成功回调函数
     *    onFail: Edo.emptyFn,    //失败回调函数
     *    onOut: Edo.emptyFn      //超时回调函数   
     * }
     * @return {AID} ajaxID
     */
    request: function(config) {
        var _xhrObj = new XMLHttpRequest(),
        _cfg = Edo.apply({
            type: "get",
            url: null,
            timeout: 0,
            contentType: "application/x-www-form-urlencoded",
            async: true,/*是否为异步请求*/
            params: null,
            onSuccess: emptyFn,
            onFail: emptyFn,
            onOut: emptyFn,
            request: _xhrObj,
            abort: function() {
                if (this._timer) {
                    window.clearTimeout(this._timer);
                    this._timer = null
                }
                var _xhrObj = this.request;
                if (_xhrObj) {
                    _xhrObj.onreadystatechange = emptyFn;
                    _xhrObj.abort();
                    this.onFail(0, this)
                }
            },
            cache: false
        },config),
        
        _querystr = this.encodeURL(_cfg.params);
        
        if (_cfg.type.toLowerCase() == "post") {//若为post请求
            _xhrObj.open(_cfg.type, _cfg.url, _cfg.async);
            _xhrObj.setRequestHeader("Content-Type", _cfg.contentType)
        } else {
            if (_cfg.params) {
            	_cfg.url += ((_cfg.url.indexOf("?") > -1) ? "&": "?") + _querystr;
            }
            _cfg.url += ((_cfg.url.indexOf("?") > -1) ? "&": "?");
            if (_cfg.cache == false) {
            	_cfg.url += "_$_d=" + new Date().getTime();
            }
            _xhrObj.open(_cfg.type, _cfg.url, _cfg.async)
        }
        if (_cfg.async) {
        	_xhrObj.onreadystatechange = this.onreadystatechange.bind(_cfg);
        }
        if (_cfg.timeout > 0) {
        	_cfg._timer = window.setTimeout(function() {
        			_cfg.onOut(_xhrObj)
        		},_cfg.timeout);
        }
        
        //--------------------------------------
        try {
            if (_cfg.defer){
            	setTimeout(function() {
                    try {
                        _xhrObj.send(_querystr)
                    } catch($) {}
                },_cfg.defer);
            } else if (_cfg.async){
            	setTimeout(function() {
                    _xhrObj.send(_querystr)
                },1);
            } else {
            	_xhrObj.send(_querystr)
            }
        } catch(D) {
            _cfg.onFail(1000, _xhrObj)
        }
        //--------------------------------------
        
        if (!_cfg.defer && !_cfg.async) {
        	this.onreadystatechange.call(_cfg, _xhrObj);
        }
        var _ajaxId = this.ajaxID++;
        this.ajaxConfigs[_ajaxId] = _xhrObj;
        return _ajaxId;
    },
    
    /**
     * 这个得需要服务器端的支持 -by junlong.yang comment
     */
    jsonp: function() {},
    
    /**
     * 终止一个ajax对象的继续与服务端交互数据 
     */
    abort: function($) {
        var _ = this.ajaxConfigs[$];
        if (_) _.abort()
    },
    onreadystatechange: function() {
        var _xhrObj = this.request,
        _ = isLocalFile ? 0: 200;
        if (_xhrObj.readyState === 4) {
            if (_xhrObj.status === _) {
            	this.onSuccess(_xhrObj.responseText, this);
            } else {
            	this.onFail(_xhrObj.status, this);
            }
            _xhrObj.onreadystatechange = emptyFn;
        }
    },
    
    /**
     * 编码URL字符串
     * 
     * @param Mixed : kv 键值对
     * @return String : queryString
     */
    encodeURL: function(kv) {
        var A = [];
        for (var _ in kv) {
            var B = kv[_];
            if (typeof(B) == "object"){
            	B = Edo.util.JSON.encode(B);
            }
            A.push(encodeURIComponent(_) + "=" + encodeURIComponent(B))
        }
        return A.join("&")
    }
};
//----------------------------- Edo.util.Ajax : END --------------------------------

/**
 * Cookie操作类
 * 
 * @see http://www.edojs.com/api/#Edo.util.Cookie
 */
Edo.util.Cookie = {
	/**
	 * 根据name获得存储的cookie字符串
	 * 
	 * @param {String} name
	 * @return {String} value
	 */
    get: function(name) {
        var A = document.cookie.split("; "),
        B = null;
        for (var $ = 0; $ < A.length; $++) {
            var _ = A[$].split("=");
            if (name == _[0]) B = _;
        }
        if (B) {
            var C = B[1];
            if (C === undefined) return C;
            return unescape(C)
        }
        return null
    },
    
    /**
     * 设置给定name的cookie值
     * 
     * @param {String} name
     * @param {String} value
     * @param {String} expire
     * @param {String} domain
     * @return void
     */
    set: function(name, value, expire, domain) {
        var _ = new Date();
        if (expire != null) _ = new Date(_.getTime() + (expire * 1000 * 3600 * 24));
        document.cookie = name + "=" + escape(value) + ((expire == null) ? "": ("; expires=" + _.toGMTString())) + ";path=/" + (domain ? "; domain=" + domain: "")
    },
    
    /**
     * 删除给定name的cookie值
     * 
     * @param {String} name
     * @param {String} domain
     * @return void
     */
    del: function(name, domain) {
        this.set(name, null, -100, domain)
    }
}; 

(function() {
    Date.formatCodeToRegex = function(A, $) {
        var _ = Date.parseCodes[A];
        if (_) {
            _ = typeof(_) == "function" ? _() : _;
            Date.parseCodes[A] = _
        }
        return _ ? Edo.applyIf({
            c: _.c ? String.format(_.c, $ || "{0}") : _.c
        },
        _) : {
            g: 0,
            c: null,
            s: escapeRe(A)
        }
    };
    var $f = Date.formatCodeToRegex;
    Edo.apply(Date, {
        parseFunctions: {
            count: 0
        },
        parseRegexes: [],
        formatFunctions: {
            count: 0
        },
        daysInMonth: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
        y2kYear: 50,
        MILLI: "ms",
        SECOND: "s",
        MINUTE: "mi",
        HOUR: "h",
        DAY: "d",
        MONTH: "mo",
        YEAR: "y",
        dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        monthNumbers: {
            Jan: 0,
            Feb: 1,
            Mar: 2,
            Apr: 3,
            May: 4,
            Jun: 5,
            Jul: 6,
            Aug: 7,
            Sep: 8,
            Oct: 9,
            Nov: 10,
            Dec: 11
        },
        getShortMonthName: function($) {
            return Date.monthNames[$].substring(0, 3)
        },
        getShortDayName: function($) {
            return Date.dayNames[$].substring(0, 3)
        },
        getMonthNumber: function($) {
            return Date.monthNumbers[$.substring(0, 1).toUpperCase() + $.substring(1, 3).toLowerCase()]
        },
        formatCodes: {
            d: "String.leftPad(this.getDate(), 2, '0')",
            D: "Date.getShortDayName(this.getDay())",
            j: "this.getDate()",
            l: "Date.dayNames[this.getDay()]",
            N: "(this.getDay() ? this.getDay() : 7)",
            S: "this.getSuffix()",
            w: "this.getDay()",
            z: "this.getDayOfYear()",
            W: "String.leftPad(this.getWeekOfYear(), 2, '0')",
            F: "Date.monthNames[this.getMonth()]",
            m: "String.leftPad(this.getMonth() + 1, 2, '0')",
            M: "Date.getShortMonthName(this.getMonth())",
            n: "(this.getMonth() + 1)",
            t: "this.getDaysInMonth()",
            L: "(this.isLeapYear() ? 1 : 0)",
            o: "(this.getFullYear() + (this.getWeekOfYear() == 1 && this.getMonth() > 0 ? +1 : (this.getWeekOfYear() >= 52 && this.getMonth() < 11 ? -1 : 0)))",
            Y: "this.getFullYear()",
            y: "('' + this.getFullYear()).substring(2, 4)",
            a: "(this.getHours() < 12 ? 'am' : 'pm')",
            A: "(this.getHours() < 12 ? 'AM' : 'PM')",
            g: "((this.getHours() % 12) ? this.getHours() % 12 : 12)",
            G: "this.getHours()",
            h: "String.leftPad((this.getHours() % 12) ? this.getHours() % 12 : 12, 2, '0')",
            H: "String.leftPad(this.getHours(), 2, '0')",
            i: "String.leftPad(this.getMinutes(), 2, '0')",
            s: "String.leftPad(this.getSeconds(), 2, '0')",
            u: "String.leftPad(this.getMilliseconds(), 3, '0')",
            O: "this.getGMTOffset()",
            P: "this.getGMTOffset(true)",
            T: "this.getTimezone()",
            Z: "(this.getTimezoneOffset() * -60)",
            c: function() {
                for (var A = "Y-m-dTH:i:sP", $ = [], _ = 0, B = A.length; _ < B; ++_) {
                    var C = A.charAt(_);
                    $.push(C == "T" ? "'T'": Date.getFormatCode(C))
                }
                return $.join(" + ")
            },
            U: "Math.round(this.getTime() / 1000)"
        },
        parseDate: function($, B) {
            if (!$) return;
            if ($.format) return $;
            var A = Date.parseFunctions;
            if (A[B] == null) Date.createParser(B);
            var _ = A[B];
            return Date[_]($)
        },
        getFormatCode: function(_) {
            var $ = Date.formatCodes[_];
            if ($) {
                $ = typeof($) == "function" ? $() : $;
                Date.formatCodes[_] = $
            }
            return $ || ("'" + String.escape(_) + "'")
        },
        createNewFormat: function(format) {
            var funcName = "format" + Date.formatFunctions.count++;
            Date.formatFunctions[format] = funcName;
            var code = "Date.prototype." + funcName + " = function(){return ",
            special = false,
            ch = "";
            for (var i = 0; i < format.length; ++i) {
                ch = format.charAt(i);
                if (!special && ch == "\\") special = true;
                else if (special) {
                    special = false;
                    code += "'" + String.escape(ch) + "' + "
                } else code += Date.getFormatCode(ch) + " + "
            }
            eval(code.substring(0, code.length - 3) + ";}")
        },
        createParser: function(format) {
            var funcName = "parse" + Date.parseFunctions.count++,
            regexNum = Date.parseRegexes.length,
            currentGroup = 1;
            Date.parseFunctions[format] = funcName;
            var code = "Date." + funcName + " = function(input){\n" + "var y, m, d, h = 0, i = 0, s = 0, ms = 0, o, z, u, v;\n" + "input = String(input);\n" + "d = new Date();\n" + "y = d.getFullYear();\n" + "m = d.getMonth();\n" + "d = d.getDate();\n" + "var results = input.match(Date.parseRegexes[" + regexNum + "]);\n" + "if (results && results.length > 0) {",
            regex = "",
            special = false,
            ch = "";
            for (var i = 0; i < format.length; ++i) {
                ch = format.charAt(i);
                if (!special && ch == "\\") special = true;
                else if (special) {
                    special = false;
                    regex += String.escape(ch)
                } else {
                    var obj = Date.formatCodeToRegex(ch, currentGroup);
                    currentGroup += obj.g;
                    regex += obj.s;
                    if (obj.g && obj.c) code += obj.c
                }
            }
            code += "if (u){\n" + "v = new Date(u * 1000);\n" + "}else if (y >= 0 && m >= 0 && d > 0 && h >= 0 && i >= 0 && s >= 0 && ms >= 0){\n" + "v = new Date(y, m, d, h, i, s, ms);\n" + "}else if (y >= 0 && m >= 0 && d > 0 && h >= 0 && i >= 0 && s >= 0){\n" + "v = new Date(y, m, d, h, i, s);\n" + "}else if (y >= 0 && m >= 0 && d > 0 && h >= 0 && i >= 0){\n" + "v = new Date(y, m, d, h, i);\n" + "}else if (y >= 0 && m >= 0 && d > 0 && h >= 0){\n" + "v = new Date(y, m, d, h);\n" + "}else if (y >= 0 && m >= 0 && d > 0){\n" + "v = new Date(y, m, d);\n" + "}else if (y >= 0 && m >= 0){\n" + "v = new Date(y, m);\n" + "}else if (y >= 0){\n" + "v = new Date(y);\n" + "}\n}\nreturn (v && (z || o))?" + " (typeof(z) == 'number' ? v.add(Date.SECOND, -v.getTimezoneOffset() * 60 - z) :" + " v.add(Date.MINUTE, -v.getTimezoneOffset() + (sn == '+'? -1 : 1) * (hr * 60 + mn))) : v;\n" + "}";
            Date.parseRegexes[regexNum] = new RegExp("^" + regex + "$", "i");
            eval(code)
        },
        parseCodes: {
            d: {
                g: 1,
                c: "d = parseInt(results[{0}], 10);\n",
                s: "(\\d{2})"
            },
            j: {
                g: 1,
                c: "d = parseInt(results[{0}], 10);\n",
                s: "(\\d{1,2})"
            },
            D: function() {
                for (var _ = [], $ = 0; $ < 7; _.push(Date.getShortDayName($)), ++$);
                return {
                    g: 0,
                    c: null,
                    s: "(?:" + _.join("|") + ")"
                }
            },
            l: function() {
                return {
                    g: 0,
                    c: null,
                    s: "(?:" + Date.dayNames.join("|") + ")"
                }
            },
            N: {
                g: 0,
                c: null,
                s: "[1-7]"
            },
            S: {
                g: 0,
                c: null,
                s: "(?:st|nd|rd|th)"
            },
            w: {
                g: 0,
                c: null,
                s: "[0-6]"
            },
            z: {
                g: 0,
                c: null,
                s: "(?:\\d{1,3}"
            },
            W: {
                g: 0,
                c: null,
                s: "(?:\\d{2})"
            },
            F: function() {
                return {
                    g: 1,
                    c: "m = parseInt(Date.getMonthNumber(results[{0}]), 10);\n",
                    s: "(" + Date.monthNames.join("|") + ")"
                }
            },
            M: function() {
                for (var _ = [], $ = 0; $ < 12; _.push(Date.getShortMonthName($)), ++$);
                return Edo.applyIf({
                    s: "(" + _.join("|") + ")"
                },
                $f("F"))
            },
            m: {
                g: 1,
                c: "m = parseInt(results[{0}], 10) - 1;\n",
                s: "(\\d{2})"
            },
            n: {
                g: 1,
                c: "m = parseInt(results[{0}], 10) - 1;\n",
                s: "(\\d{1,2})"
            },
            t: {
                g: 0,
                c: null,
                s: "(?:\\d{2})"
            },
            L: {
                g: 0,
                c: null,
                s: "(?:1|0)"
            },
            o: function() {
                return $f("Y")
            },
            Y: {
                g: 1,
                c: "y = parseInt(results[{0}], 10);\n",
                s: "(\\d{4})"
            },
            y: {
                g: 1,
                c: "var ty = parseInt(results[{0}], 10);\n" + "y = ty > Date.y2kYear ? 1900 + ty : 2000 + ty;\n",
                s: "(\\d{1,2})"
            },
            a: {
                g: 1,
                c: "if (results[{0}] == 'am') {\n" + "if (h == 12) { h = 0; }\n" + "} else { if (h < 12) { h += 12; }}",
                s: "(am|pm)"
            },
            A: {
                g: 1,
                c: "if (results[{0}] == 'AM') {\n" + "if (h == 12) { h = 0; }\n" + "} else { if (h < 12) { h += 12; }}",
                s: "(AM|PM)"
            },
            g: function() {
                return $f("G")
            },
            G: {
                g: 1,
                c: "h = parseInt(results[{0}], 10);\n",
                s: "(\\d{1,2})"
            },
            h: function() {
                return $f("H")
            },
            H: {
                g: 1,
                c: "h = parseInt(results[{0}], 10);\n",
                s: "(\\d{2})"
            },
            i: {
                g: 1,
                c: "i = parseInt(results[{0}], 10);\n",
                s: "(\\d{2})"
            },
            s: {
                g: 1,
                c: "s = parseInt(results[{0}], 10);\n",
                s: "(\\d{2})"
            },
            u: {
                g: 1,
                c: "ms = results[{0}]; ms = parseInt(ms, 10)/Math.pow(10, ms.length - 3);\n",
                s: "(\\d+)"
            },
            O: {
                g: 1,
                c: ["o = results[{0}];", "var sn = o.substring(0,1);", "var hr = o.substring(1,3)*1 + Math.floor(o.substring(3,5) / 60);", "var mn = o.substring(3,5) % 60;", "o = ((-12 <= (hr*60 + mn)/60) && ((hr*60 + mn)/60 <= 14))? (sn + String.leftPad(hr, 2, '0') + String.leftPad(mn, 2, '0')) : null;\n"].join("\n"),
                s: "([+-]\\d{4})"
            },
            P: {
                g: 1,
                c: ["o = results[{0}];", "var sn = o.substring(0,1);", "var hr = o.substring(1,3)*1 + Math.floor(o.substring(4,6) / 60);", "var mn = o.substring(4,6) % 60;", "o = ((-12 <= (hr*60 + mn)/60) && ((hr*60 + mn)/60 <= 14))? (sn + String.leftPad(hr, 2, '0') + String.leftPad(mn, 2, '0')) : null;\n"].join("\n"),
                s: "([+-]\\d{2}:\\d{2})"
            },
            T: {
                g: 0,
                c: null,
                s: "[A-Z]{1,4}"
            },
            Z: {
                g: 1,
                c: "z = results[{0}] * 1;\n" + "z = (-43200 <= z && z <= 50400)? z : null;\n",
                s: "([+-]?\\d{1,5})"
            },
            c: function() {
                var _ = [],
                A = [$f("Y", 1), $f("m", 2), $f("d", 3), $f("h", 4), $f("i", 5), $f("s", 6), {
                    c: "ms = (results[7] || '.0').substring(1); ms = parseInt(ms, 10)/Math.pow(10, ms.length - 3);\n"
                },
                {
                    c: "if(results[9] == 'Z'){\no = 0;\n}else{\n" + $f("P", 9).c + "\n}"
                }];
                for (var $ = 0, B = A.length; $ < B; ++$) _.push(A[$].c);
                return {
                    g: 1,
                    c: _.join(""),
                    s: A[0].s + "-" + A[1].s + "-" + A[2].s + "T" + A[3].s + ":" + A[4].s + ":" + A[5].s + "((.|,)\\d+)?" + "(" + $f("P", null).s + "|Z)"
                }
            },
            U: {
                g: 1,
                c: "u = parseInt(results[{0}], 10);\n",
                s: "(-?\\d+)"
            }
        }
    })
} ());
Edo.apply(Date.prototype, {
    dateFormat: function(_) {
        if (Date.formatFunctions[_] == null) Date.createNewFormat(_);
        var $ = Date.formatFunctions[_];
        return this[$]()
    },
    getTimezone: function() {
        return this.toString().replace(/^.* (?:\((.*)\)|([A-Z]{1,4})(?:[\-+][0-9]{4})?(?: -?\d+)?)$/, "$1$2").replace(/[^A-Z]/g, "")
    },
    getGMTOffset: function($) {
        return (this.getTimezoneOffset() > 0 ? "-": "+") + String.leftPad(Math.abs(Math.floor(this.getTimezoneOffset() / 60)), 2, "0") + ($ ? ":": "") + String.leftPad(Math.abs(this.getTimezoneOffset() % 60), 2, "0")
    },
    getDayOfYear: function() {
        var $ = 0;
        Date.daysInMonth[1] = this.isLeapYear() ? 29: 28;
        for (var _ = 0; _ < this.getMonth(); ++_) $ += Date.daysInMonth[_];
        return $ + this.getDate() - 1
    },
    getWeekOfYear: function() {
        var B = 86400000,
        _ = 7 * B,
        $ = Date.UTC(this.getFullYear(), this.getMonth(), this.getDate() + 3) / B,
        C = Math.floor($ / 7),
        A = new Date(C * _).getUTCFullYear();
        return C - Math.floor(Date.UTC(A, 0, 7) / _) + 1
    },
    isLeapYear: function() {
        var $ = this.getFullYear();
        return !! (($ & 3) == 0 && ($ % 100 || ($ % 400 == 0 && $)))
    },
    getFirstDayOfMonth: function() {
        var $ = (this.getDay() - (this.getDate() - 1)) % 7;
        return ($ < 0) ? ($ + 7) : $
    },
    getLastDayOfMonth: function() {
        var $ = (this.getDay() + (Date.daysInMonth[this.getMonth()] - this.getDate())) % 7;
        return ($ < 0) ? ($ + 7) : $
    },
    getFirstDateOfMonth: function() {
        return new Date(this.getFullYear(), this.getMonth(), 1)
    },
    getLastDateOfMonth: function() {
        return new Date(this.getFullYear(), this.getMonth(), this.getDaysInMonth())
    },
    getDaysInMonth: function() {
        Date.daysInMonth[1] = this.isLeapYear() ? 29: 28;
        return Date.daysInMonth[this.getMonth()]
    },
    getSuffix: function() {
        switch (this.getDate()) {
        case 1:
        case 21:
        case 31:
            return "st";
        case 2:
        case 22:
            return "nd";
        case 3:
        case 23:
            return "rd";
        default:
            return "th"
        }
    },
    clone: function() {
        return new Date(this.getTime())
    },
    clearTime: function($) {
        if ($) return this.clone().clearTime();
        this.setHours(0);
        this.setMinutes(0);
        this.setSeconds(0);
        this.setMilliseconds(0);
        return this
    },
    add: function(B, A) {
        var $ = this.clone();
        if (!B || A === 0) return $;
        switch (B.toLowerCase()) {
        case Date.MILLI:
            $.setMilliseconds(this.getMilliseconds() + A);
            break;
        case Date.SECOND:
            $.setSeconds(this.getSeconds() + A);
            break;
        case Date.MINUTE:
            $.setMinutes(this.getMinutes() + A);
            break;
        case Date.HOUR:
            $.setHours(this.getHours() + A);
            break;
        case Date.DAY:
            $.setDate(this.getDate() + A);
            break;
        case Date.MONTH:
            var _ = this.getDate();
            if (_ > 28) _ = Math.min(_, this.getFirstDateOfMonth().add("mo", A).getLastDateOfMonth().getDate());
            $.setDate(_);
            $.setMonth(this.getMonth() + A);
            break;
        case Date.YEAR:
            $.setFullYear(this.getFullYear() + A);
            break
        }
        return $
    },
    between: function($, _) {
        var A = this.getTime();
        return $.getTime() <= A && A <= _.getTime()
    }
});
Date.prototype.format = Date.prototype.dateFormat;
if (isSafari) {
    Date.brokenSetMonth = Date.prototype.setMonth;
    Date.prototype.setMonth = function(_) {
        if (_ <= -1) {
            var A = Math.ceil( - _),
            B = Math.ceil(A / 12),
            $ = (A % 12) ? 12 - A % 12: 0;
            this.setFullYear(this.getFullYear() - B);
            return Date.brokenSetMonth.call(this, $)
        } else return Date.brokenSetMonth.apply(this, arguments)
    }
}
Date.monthNames = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];
Date.dayNames = ["日", "一", "二", "三", "四", "五", "六"];
Edo.util.Drag = function($) {
    Edo.apply(this, $)
};
Edo.util.Drag.prototype = {
    onStart: Edo.emptyFn,
    onMove: Edo.emptyFn,
    onStop: Edo.emptyFn,
    capture: false,
    fps: 20,
    event: null,
    start: function(_) {
        _.stopDefault();
        if (_) this.event = _;
        this.now = this.init = this.event.xy.clone();
        var $ = document;
        Edo.util.Dom.on($, "mousemove", this.move, this);
        Edo.util.Dom.on($, "mouseup", this.stop, this);
        this.trigger = _.trigger;
        Edo.util.Dom.selectable(this.trigger, false);
        Edo.util.Dom.selectable($.body, false);
        if (this.capture) if (isIE) this.trigger.setCapture(true);
        else if (isGecko) document.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP | Event.MOUSEDOWN);
        this.started = false;
        this.startTime = new Date()
    },
    move: function(_) {
        if (this.delay) if (new Date() - this.startTime < this.delay) return;
        if (!this.started) {
            this.started = true;
            this.onStart(this)
        }
        var $ = this;
        if (!this.timer) {
            $.now = _.xy.clone();
            $.event = _;
            $.onMove($);
            $.timer = null
        }
    },
    stop: function(_) {
        this.now = _.xy.clone();
        this.event = _;
        if (this.delay) this.onMove(this);
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null
        }
        var $ = document;
        Edo.util.Dom.un($, "mousemove", this.move, this);
        Edo.util.Dom.un($, "mouseup", this.stop, this);
        Edo.util.Dom.selectable(this.trigger, true);
        Edo.util.Dom.selectable($.body, true);
        if (this.capture) if (isIE) this.trigger.releaseCapture();
        else if (isGecko) document.releaseEvents(Event.MOUSEMOVE | Event.MOUSEUP | Event.MOUSEDOWN);
        if (this.started) this.onStop(this)
    }
};

/**
 * JSON解析器
 * 
 * @see http://ditu.pujia.com/maps/js/custom_src.js -> json_encode(mixed)
 * Namespace:	Edo.util
 * ClassName:	JSON
 * Single
 */
Edo.util.JSON = new(function() {
    var useHasOwn = !!{}.hasOwnProperty,
    
    /**
     * 是否支持浏览器内建的JSON解析器(Edo.USE_NATIVE_JSON 需要配置此项)
     */
    isNative = function() {//一个闭包的经典示例
        var $ = null;
        return function() {
            if ($ === null) $ = Edo.USE_NATIVE_JSON && window.JSON && JSON.toString() == "[object JSON]";
            return $;
        }
    } (),
    
    /**
     * 格式化十分秒数字为二位显示
     */
    pad = function($) {
        return $ < 10 ? "0" + $: $;
    },
    
    doDecode = function(json) {
        return eval("(" + json + ")")
    },
    
    doEncode = function($) {
        if (typeof $ == "undefined" || $ === null){
        	return "null";
        }else if($.push){
        	return encodeArray($);
        }else if($.getFullYear){
        	return Edo.util.JSON.encodeDate($);
        }else if(typeof $ == "string"){
        	return encodeString($);
        }else if(typeof $ == "number"){
        	return isFinite($) ? String($) : "null";
        }else if(typeof $ == "boolean"){
        	return String($);
        }else{
            var A = ["{"],
            B,
            _,
            C;
            for (_ in $) if (!useHasOwn || $.hasOwnProperty(_)) {
                C = $[_];
                switch (typeof C) {
                case "undefined":
                case "function":
                case "unknown":
                    break;
                default:
                    if (B) A[A.length] = ",";
                    A[A.length] = doEncode(_);
                    A[A.length] = ":";
                    A[A.length] = C === null ? "null": doEncode(C);
                    B = true
                }
            }
            A[A.length] = "}";
            return A.join("")
        }
    },
    
    m = {
        "\b": "\\b",
        "\t": "\\t",
        "\n": "\\n",
        "\f": "\\f",
        "\r": "\\r",
        "\"": "\\\"",
        "\\": "\\\\"
    },
    
    strReg1 = /["\\\x00-\x1f]/,
    
    strReg2 = /([\x00-\x1f\\"])/g,
    
    encodeString = function($) {
        if (strReg1.test($)) return "\"" + $.replace(strReg2, 
        function($, A) {
            var _ = m[A];
            if (_) return _;
            _ = A.charCodeAt();
            return "\\u00" + Math.floor(_ / 16).toString(16) + (_ % 16).toString(16)
        }) + "\"";
        return "\"" + $ + "\"";
    },
    
    encodeArray = function($) {
        var A = ["["],
        C,
        _,
        B = $.length,
        D;
        for (_ = 0; _ < B; _ += 1) {
            D = $[_];
            switch (typeof D) {
            case "undefined":
            case "function":
            case "unknown":
                break;
            default:
                if (C) A[A.length] = ",";
                A[A.length] = D === null ? "null": Edo.util.JSON.encode(D);
                C = true
            }
        }
        A[A.length] = "]";
        return A.join("");
    },
    
    /**
     * 序列化Date对象为字符串
     */
    encodeDate = function(date) {
        return "\"" + date.getFullYear() + "-" + pad(date.getMonth() + 1) + "-" + pad(date.getDate()) + "T" + pad(date.getHours()) + ":" + pad(date.getMinutes()) + ":" + pad(date.getSeconds()) + "\""
    };
    
    this.encodeDate = encodeDate;
    
    /**
     * 将obj对象序列化成json字符串
     * 
     * @param obj : Object对象
     * @return str : String
     */
    this.encode = function() {
        var $;
        return function(obj, A) {
            if (!$) $ = isNative() ? JSON.stringify: doEncode;
            if (A) this.encodeDate = A;
            var B = $(obj);
            if (A) this.encodeDate = encodeDate;
            return B
        }
    } ();
    
    /**
     * 将str字符串反序列化成json对象
     * 
     * @param str : String json字符串
     * @return json对象
     */
    this.decode = function() {
        var _,
        $ = /[\"\'](\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})[\"\']/g;
        return function(str) {
            str = str.replace($, "new Date($1,$2-1,$3,$4,$5,$6)");
            if (!_) _ = isNative() ? JSON.parse: doDecode;
            return _(str);
        }
    } ()
})();
Edo.util.Json = Edo.util.JSON;


function XMLDOM(D) {
    if (!window.DOMParser) {
        var C = ["Msxml2.DOMDocument.3.0", "Msxml2.DOMDocument"];
        for (var $ = 0; $ < C.length; $++) {
            try {
                var A = new ActiveXObject(C[$]);
                A.async = false;
                A.loadXML(D);
                A.setProperty("SelectionLanguage", "XPath");
                return A
            } catch(B) {}
        }
        return null;
    } else {
        try {
            var _ = new window.DOMParser();
            return _.parseFromString(D, "text/xml");
        } catch(B) {
            return null;
        }
    }
    return null;
}

/**
 * XML解析器
 */
Edo.util.XML = {
    version: "<?xml version=\"1.0\" standalone=\"no\"?>",
    useCDATA: false,
    dateFormat: function($) {
        return $.getFullYear() + "-" + ($.getMonth() + 1) + "-" + $.getDate() + "T" + $.getHours() + ":" + $.getMinutes() + ":" + $.getSeconds()
    },
    encode: function(A) {
        var C = function($) {
            if ($ === undefined || $ === null) return false;
            var _ = typeof $;
            if (_ == "object" || _ == "function") switch ($.constructor) {
            case Array:
                return "array";
            case RegExp:
                return "regexp";
            case Date:
                return "date";
            }
            return _;
        },
        B = this.dateFormat,
        $ = this.useCDATA,
        E = [];
        function _(A, K) {
            var G = C(A);
            switch (G) {
            case "object":
                for (var K in A) {
                    var F = A[K],
                    I = C(F);
                    if (I == "function" || I == "regexp") continue;
                    var M = I == "array";
                    for (var D = 0, L = M ? F.length: 1; D < L; D++) {
                        var N = M ? F[D] : F;
                        E[E.length] = "<";
                        E[E.length] = K;
                        var J = false;
                        if (C(N) == "object") {
                            for (var H in N) if (H.indexOf("@") == 0) {
                                E[E.length] = " ";
                                E[E.length] = H.substr(1);
                                E[E.length] = "=\"";
                                E[E.length] = N[H];
                                E[E.length] = "\"";
                                delete N[H]
                            } else J = true
                        } else J = true;
                        if (J) {
                            E[E.length] = ">";
                            _(N, K);
                            E[E.length] = "</";
                            E[E.length] = K;
                            E[E.length] = ">"
                        } else E[E.length] = "/>"
                    }
                }
                break;
            case "string":
                if (!$ && (A.indexOf("<") == -1 && A.indexOf(">") == -1)) E[E.length] = A;
                else {
                    E[E.length] = "<![CDATA[";
                    E[E.length] = A;
                    E[E.length] = "]]>"
                }
                break;
            case "date":
                E[E.length] = B(A);
                break;
            default:
                E[E.length] = A;
                break
            }
        }
        E[E.length] = this.version;
        _(A);
        var D = E.join("");
        return D
    },
    decode: function(D) {
        if (!D) return null;
        if (typeof D !== "string") return null;
        D = D.trim();
        if (D.indexOf("<") != 0) return null;
        D = new XMLDOM(D);
        if (!D) return null;
        var B = D.documentElement;
        if (!B || B.tagName == "parsererror") return null;
        function $(B) {
            var D = [];
            for (var _ = 0, C = B.length; _ < C; _++) {
                var A = B[_],
                $ = A.nodeType;
                if ($ == 1 || $ == 4) D[D.length] = A
            }
            B = D.length > 0 ? D: B;
            return B
        }
        var _ = Object.prototype.toString;
        function C(K, _) {
            var H = K.attributes || [],
            F = 0,
            E = H.length,
            J = $(K.childNodes);
            if (E == 0 && J.length == 0) return "";
            _ = _ || {};
            while (F < E) {
                var I = H[F];
                _["@" + I.nodeName] = I.nodeValue;
                F++
            }
            F = 0,
            E = J.length;
            while (F < E) {
                var D = J[F],
                L = D.nodeName,
                A = D.nodeType;
                if (A != 1) return D.nodeValue;
                else if (A == 1) {
                    var B = C(D),
                    G = _[L];
                    if (!G) _[L] = B;
                    else if (G) {
                        if (!G.push) _[L] = [G];
                        _[L][_[L].length] = B
                    }
                }
                F++
            }
            return _
        }
        var A = C(D);
        return A
    }
};
Edo.util.XmlToJson = Edo.util.XML.decode;
Edo.util.JSONToXml = Edo.util.XML.encode;

/**
 * 动画类
 * 
 * Namespace:	Edo.util
 * ClassName:	Anim
 */
Edo.util.Anim = function($){
    this.options = Edo.apply({
        onStart: Edo.emptyFn,
        onStep: Edo.emptyFn,
        onComplete: Edo.emptyFn,
        transition: function($) {
            return - (Math.cos(Math.PI * $) - 1) / 2
        },
        duration: 500,
        fps: 50
    },$)
};
Edo.util.Anim.prototype = {
    start: function($) {
        this.stopTimer();
        this.time = new Date().getTime() - ($ || 0);
        this.options.onStart();
        this.timer = setInterval(this.step.bind(this), Math.round(1000 / this.options.fps))
    },
    stop: function(_) {
        this.stopTimer();
        this.options.onComplete(_);
        var $ = new Date().getTime() - this.time;
        this.time = null;
        return $
    },
    step: function() {
        var $ = new Date().getTime(),
        A = this.options.onStep;
        if ($ < this.time + this.options.duration) {
            var _ = this.options.transition(($ - this.time) / this.options.duration);
            A(_)
        } else {
            A(1);
            this.stop(false)
        }
    },
    stopTimer: function() {
        clearInterval(this.timer);
        this.timer = null
    }
};
Edo.util.Anim.compute = function(A, $, _) {
    return ($ - A) * _ + A
};
Edo.util.Anim.parseColorArray = function($) {
    if ($ instanceof Array) return $;
    else if ($.contains("rgb")) $ = $.split("rgb").splice(1, 4).map(function($) {
        return $.rgbToHex()
    }).join(" ");
    return $.hexToRgb(true)
};
Edo.util.Anim.getStyle = function($, _) {
    var A = Edo.util.Dom.getStyle($, _);
    if (_.contains("olor")) {
        while (A == "transparent" && _ != document) {
            $ = $.parentNode;
            A = Edo.util.Dom.getStyle($, _)
        }
        if (A == "transparent") A = "#fff"
    }
    return A
};
Edo.util.Anim.Transition = function(_, $) {
    $ = $ ? ($ instanceof Array ? $: [$]) : [];
    return Edo.apply(_, {
        easeIn: function(A) {
            return _(A, $)
        },
        easeOut: function(A) {
            return 1 - _(1 - A, $)
        },
        easeInOut: function(A) {
            return (A <= 0.5) ? _(2 * A, $) / 2: (2 - _(2 * (1 - A), $)) / 2
        }
    })
};
Edo.util.Anim.Transitions = {
    linear: function() {
        return arguments[0]
    }
};
Edo.util.Anim.Transitions.extend = function(_) {
    for (var $ in _) Edo.util.Anim.Transitions[$] = new Edo.util.Anim.Transition(_[$])
};
Edo.util.Anim.Transitions.extend({
    Pow: function($, _) {
        return Math.pow($, _[0] || 6)
    },
    Expo: function($) {
        return Math.pow(2, 8 * ($ - 1))
    },
    Circ: function($) {
        return 1 - Math.sin(Math.acos($))
    },
    Sine: function($) {
        return 1 - Math.sin((1 - $) * Math.PI / 2)
    },
    Back: function($, _) {
        _ = _[0] || 1.618;
        return Math.pow($, 2) * ((_ + 1) * $ - _)
    },
    Bounce: function(A) {
        var $;
        for (var _ = 0, B = 1; 1; _ += B, B /= 2) if (A >= (7 - 4 * _) / 11) {
            $ = -Math.pow((11 - 6 * _ - 11 * A) / 4, 2) + B * B;
            break
        }
        return $
    },
    Elastic: function($, _) {
        return Math.pow(2, 10 * --$) * Math.cos(20 * $ * Math.PI * (_[0] || 1) / 3)
    }
}); 
["Quad", "Cubic", "Quart", "Quint"].each(function(_, $) {
    Edo.util.Anim.Transitions[_] = new Edo.util.Anim.Transition(function(_) {
        return Math.pow(_, [$ + 2])
    })
});


Edo.util.Fx.Base = function($) {
    this.options = Edo.apply({
        onStart: this.onStart.bind(this),
        onStep: this.onStep.bind(this),
        onComplete: this.onComplete.bind(this),
        duration: 500,
        fps: 50,
        unit: "px",
        wait: true
    },
    $);
    this.addEvents("start", "step", "complete", "chaincomplete");
    Edo.util.Fx.Base.superclass.constructor.call(this);
    this.addListeners(this.options.listeners)
};
Edo.util.Fx.Base.extend(Edo.util.Observable, {
    chain: function($) {
        this.chains = this.chains || [];
        this.chains.push($);
        return this
    },
    callChain: function() {
        if (this.chains && this.chains.length) {
            var $ = this.chains.shift();
            $.call(this)
        }
        return this
    },
    clearChain: function() {
        this.chains = [];
        return this
    },
    hasChain: function() {
        return this.chains && this.chains.length > 0
    },
    start: function($) {
        if (this.anim && this.options.wait) return false;
        this.stop();
        this.fromTo = $ || {};
        this.anim = new Edo.util.Anim(this.options);
        this.anim.start();
        return this
    },
    stop: function() {
        if (this.anim) {
            var $ = this.anim.stop();
            this.anim = null;
            return $
        }
    },
    compute: function(B) {
        var E = this.fromTo;
        for (var C in E) {
            var F = E[C],
            A = F[0];
            F[1] = F[1] || this.options.unit;
            if (A[0] instanceof Array) {
                var $ = [];
                for (var _ = 0, D = A[0].length; _ < D; _++) {
                    $[_] = parseInt(Edo.util.Anim.compute(A[0][_], A[1][_], B));
                    if ($[_] < 0) $[_] = 0;
                    if ($[_] > 255) $[_] = 255
                }
                A[2] = $
            } else A[2] = Edo.util.Anim.compute(A[0], A[1], B)
        }
        return E
    },
    onStart: function() {
        this.fireEvent("start", this)
    },
    onStep: function($) {
        this.fromTo = this.compute($);
        this.fireEvent("step", $, this)
    },
    onComplete: function($) {
        this.fireEvent("complete", $, this);
        this.anim = null;
        if (this.hasChain()) this.callChain();
        else this.fireEvent("chaincomplete", $, this)
    }
});
Edo.util.Fx.Style = function() {};
Edo.util.Fx.Style.extend(Edo.util.Fx.Base, {
    onStart: function() {
        var C = this.fromTo,
        _ = this.options.el;
        for (var B in C) {
            var D = C[B],
            A = Edo.util.Anim.getStyle(this.options.el, B);
            if (! (D instanceof Array)) C[B] = D = [D];
            if (! (D[0] instanceof Array)) D[0] = [A, D[0]];
            else if (D[0].length < 2) D[0] = [A, D[0][0]];
            var $ = D[0];
            if (B.contains("olor")) {
                $[0] = Edo.util.Anim.parseColorArray($[0]);
                $[1] = Edo.util.Anim.parseColorArray($[1])
            } else {
                $[0] = parseFloat($[0]);
                $[1] = parseFloat($[1])
            }
        }
        Edo.util.Fx.Style.superclass.onStart.call(this)
    },
    onStep: function(A) {
        Edo.util.Fx.Style.superclass.onStep.call(this, A);
        var C = this.fromTo,
        _ = this.options.el,
        _ = this.options.el;
        for (var B in C) {
            var D = C[B],
            $ = D[0][2];
            if (B.contains("olor")) $ = $.rgbToHex();
            else $ += D[1];
            Edo.util.Dom.setStyle(_, B, $)
        }
    }
});

/**
 * HTML模板生成类
 * 
 * Namespace:	Edo.util
 * ClassName:	Template
 */
Edo.util.Template = function(tpl) {
    if (tpl) this.set(tpl);
};
Edo.util.Template.prototype = {
	/**
	 * 标签正则表达试
	 * 
	 * @var {Reg}
	 */	
    tagRe: /(?:<%)((\n|\r|.)*?)(?:%>)/ig,
    
    /**
     * 异步加载
     */
    load: function(option) {
        if (typeof option == "string"){
        	option = {
                    url: option
                };
        }
        option = Edo.apply({
            url: "",
            type: "get",
            async: false,
            onSuccess: this.onSuccess.bind(this),
            onFail: this.onFail.bind(this)
        },option);
        Edo.util.Ajax.request(option);
        return this;
    },
    onSuccess: function(tpl) {
        this.set(tpl);
    },
    onFail: function($) {},
    
    /**
     * 设置模板字符串
     * 
     * @param tpl : String 模板字符串
     */
    set: function(tpl) {
        if (tpl === null || tpl === undefined) tpl = "";
        this.tpl = tpl;
        var evals = [],
        re = this.tagRe,
        ret;
        while ((ret = re.exec(tpl)) != null) evals[evals.length] = ret;
        this.fnId = "___TEMPLATE_FN_" + new Date().getTime() + Edo.util.Template.id++;
        var sb = ["window[\"" + this.fnId + "\"] = function (sArr, fnName, args){ ", "\nvar _ = [];var __;\nif(fnName) {eval(fnName+\".apply(this, args)\"); return _.join(\"\")};"],
        start = 0,
        str,
        evstr,
        strArr = [];
        for (var i = 0, l = evals.length; i < l; i++) {
            var ev = evals[i];
            str = tpl.substring(start, ev.index);
            if (str) {
                var len = strArr.length;
                strArr[len] = str;
                sb[sb.length] = "\n_[_.length] = sArr[" + len + "]"
            }
            evstr = ev[1];
            if (evstr.charAt(0) == "=") {
                sb[sb.length] = "\n__" + evstr;
                sb[sb.length] = "\n_[_.length]=__"
            } else sb[sb.length] = "\n" + evstr;
            start = ev.index + ev[0].length
        }
        str = tpl.substring(start, tpl.length);
        if (str) {
            len = strArr.length;
            strArr[len] = str;
            sb[sb.length] = "\n_[_.length] = sArr[" + len + "]"
        }
        sb[sb.length] = "\nreturn _.join(\"\");\n}";
        var fn = sb.join("");
        this.strArr = strArr;
        eval(fn);
        return this
    },
    call: function(_) {
        if (this.fnId && _) {
            var $ = Array.apply(null, arguments);
            $.shift();
            return window[this.fnId].call(null, this.strArr, _, $)
        }
    },
    
    /**
     * 使用数据对象, 根据此模板逻辑, 生成字符串
     * 
     * @param data : Object 数据对象
     * @return {HTMLElement}
     */
    run: function(data) {
        if (this.fnId){
        	return window[this.fnId].call(data, this.strArr);
        }
    }
};
Edo.util.Template.id = 1000;
//Edo.util.Template : END

Edo.util.TextMetrics = {
    measure: function(_, $, A) {
        if (!this.shared) this.shared = Edo.util.TextMetrics.Instance(_, A);
        this.shared.bind(_);
        this.shared.setFixedWidth(A || "auto");
        return this.shared.getSize($)
    },
    createInstance: function($, _) {
        return Edo.util.TextMetrics.Instance($, _)
    },
    Instance: function(B, _) {
        var C = document.createElement("div");
        document.body.appendChild(C);
        C.style.cssText = "position:absolute;left:-1000px;top:-1000px;visibility:hidden;";
        var A = Edo.util.Dom;
        if (_) A.setWidth(C, _);
        var $ = {
            getSize: function($) {
                C.innerHTML = $;
                var _ = A.getSize(C);
                return _
            },
            bind: function($) {
                if (typeof $ === "string") C.className = $;
                else A.setStyle(C, A.getStyles($, "font-size", "font-style", "font-weight", "font-family", "line-height", "text-transform", "letter-spacing"))
            },
            setFixedWidth: function($) {
                A.setWidth(C, $)
            },
            getWidth: function($) {
                C.style.width = "auto";
                C.innerHTML = $;
                return A.getWidth(C)
            },
            getHeight: function($) {
                C.innerHTML = $;
                return A.getHeight(C)
            }
        };
        $.bind(B);
        return $
    }
};

var History; 
(function() {//History闭包
    var HisIframeEl,/* iframe 对象变量 */
    HisFieldEl,
    B = false,
    IframeDocStateEl;
    
    /**
     * 获取去URL中#后面的值
     * 
     * @return String/NULL
     */
    function getHash() {
        var _href = top.location.href,
        _index = _href.indexOf("#");
        return _index >= 0 ? _href.substr(_index + 1) : null
    }
    
    /**
     * 设置history-field的值
     */
    function setHisFieldValue() {
        HisFieldEl.value = IframeDocStateEl
    }
    
    /**
     * 激发onchange事件
     */
    function fireChangeEvent(eventTarget) {
        IframeDocStateEl = eventTarget;
        History.fireEvent("change", eventTarget);
    }
    
    /**
     * 向创建的iframe中写入特定的html
     * 
     * @param {String} state_innerHtml
     * @return {Boolen} 写入是否成功
     */
    function writeIframeHtml(state_innerHtml) {
        var _iframe_html = ["<html><body><div id=\"state\">", state_innerHtml, "</div><script type=\"text/javascript\">try{document.domain=\"" + document.domain + "\";}catch(e){}</script></body></html>"].join("");
        try {
            var $ = HisIframeEl.contentWindow.document;
            $.open();
            $.write(_iframe_html);
            $.close();
            return true;
        } catch(e) {
            return false;
        }
    }
    
    /**
     * IE 下执行
     */
    function _() {
        try {
            if (!HisIframeEl.contentWindow || !HisIframeEl.contentWindow.document) {
                setTimeout(_, 10);
                return;
            }
        } catch(J) {
            setTimeout(_, 10);
            return;
        }
        var _iframe_doc = HisIframeEl.contentWindow.document,
        IframeDocStateEl = _iframe_doc.getElementById("state"),
        HisFieldEl = IframeDocStateEl ? IframeDocStateEl.innerText: null,
        I;
        setInterval(function() {
            _iframe_doc = HisIframeEl.contentWindow.document;
            IframeDocStateEl = _iframe_doc.getElementById("state");
            var _ = IframeDocStateEl ? IframeDocStateEl.innerText: null,
            B = getHash();
            if (_ !== HisFieldEl) {
                HisFieldEl = _;
                if (HisFieldEl === null) HisFieldEl = "";
                fireChangeEvent(HisFieldEl);
                top.location.hash = HisFieldEl;
                I = HisFieldEl;
                setHisFieldValue()
            } else if (B !== I) {
                I = B;
                writeIframeHtml(B)
            }
        },25);
        B = true;
        History.fireEvent("ready", History)
    }
    
    
    function A() {
        IframeDocStateEl = HisFieldEl.value;
        if (isIE){
        	_();
        } else {
            var tmp=null;
            setInterval(function() {//监听URL的Hash变化
                var _hash = getHash();
                if (_hash !== tmp) {
                    tmp = _hash;
                    fireChangeEvent(tmp);
                    setHisFieldValue();
                }
            },30);
            
            B = true;
            History.fireEvent("ready", History);
        }
    }
    
    History = {
        doWork: true,
        fieldId: "history-field",
        iframeId: "history-frame",
        
        /**
         * 初始化History
         * 
         * @param String : src iframe 的src值
         */
        init: function(src) {
            var _form = document.createElement("form");
            _form.id = "history-form";
            _form.style.display = "none";
            document.body.appendChild(_form);
            var _iframe_str = "";
            if (isIE) _iframe_str = "<iframe id=\"history-frame\" src=\"" + src + "\"></iframe>";
            _form.innerHTML = "<input type=\"hidden\" id=\"history-field\" />" + _iframe_str;
            HisFieldEl = document.getElementById(this.fieldId);
            HisIframeEl = document.getElementById(this.iframeId);
            
            this.addEvents("change");//添加change事件
 
            A();
        },
        
        add: function(hash, $) {
            if ($ !== false) if (this.getToken() == hash) return true;
            if (isIE) return writeIframeHtml(hash);//据所知IE6/7不支持location.hash
            else {
                top.location.hash = hash;
                return true;
            }
        },
        
        back: function() {
            history.go( - 1)
        },
        
        forward: function() {
            history.go(1)
        },
        
        /**
         * 
         */
        getToken: function() {
            return B ? IframeDocStateEl: getHash()
        }
    };
    Edo.apply(History, new Edo.util.Observable());
    Edo.util.History = History
})();
//History FUN : END

/**
 * Edo组件基类,具备id属性,以及set,get,type等相关操作
 * 
 * TypeName:	component, cmp
 * Namespace:	Edo.core
 * ClassName:	Component
 * Extend:	Edo.util.Observable
 * 
 * @example
 * var cmp = new Edo.core.Component();
 *  cmp.set({
 *       id: "cmp1",
 *       type: 'cmp'
 *       ...    
 *   });
 *   或
 *   var cmp = Edo.create({
 *       id: "cmp1",
 *       type: 'cmp'
 *       ...
 *   });
 *   或
 *   var cmp = new Type();
 *   cmp.set(...);
 *   cmp.init();
 *   cmp.destroy();
 */
Edo.core.Component = function() {
    this.events = {};
    this.propertyChangeListeners = this.events["propertychange"] = [];
    this.initListeners = this.events["init"] = [];
    this.idSet = false;
    
    /**
     * 组件唯一标识符(所有的Edo组件都会有一个id,或显示设置,或自动生成)
     * 
     * @var String
     * @access readOnly
     */
    this.id = Edo.id(null, "cmp");
    
    //将所有实例化后的组件压入系统管理器的组件池
    Edo.managers.SystemManager.all[this.id] = this;
    
    this.plugins = [];
    this.type = this.getType();
};
Edo.core.Component.extend(Edo.util.Observable, {
    componentMode: "component",
    
    /**
     * 属性索引器
     * 
     * @param name : String 属性名
     * @param Object 返回属性的值
     */
    get: function(name) {
        var _method = this["_get" + name.charAt(0).toUpperCase() + name.substring(1, name.length)];
        if (_method){
        	return _method.call(this);
        } else {
        	return this[name];
        }
    },
    
    /**
     * 属性设置器
     * 
     * @param name : String 属性名
     * @param value : Object 值
     */
    set: function(name, value) {
        if (!name) return;
        if (typeof name == "string") {
            var _ = name;
            name = {};
            name[_] = value
        }
        var id = name.id;
        if (id) {
            this.setId(id);
            delete name.id
        }
        if (name.script) {
            Edo.globalEval(name.script);
            delete name.script
        }
        //?? what's up?
        for (var key in name){
        	if (key.indexOf("on") == 0) {
                var ___fn = name[key];
                if (typeof ___fn !== "function"){
                	eval("___fn = function(e){" + ___fn + "}");
                }
                this.on(key.substring(2, key.length).toLowerCase(), ___fn);
                delete name[key]
            }
        }

        //?? what's up?
        for (key in name) {
            var v = name[key],
            _method_name = "_set" + key.charAt(0).toUpperCase() + key.substring(1, key.length),
            _setValue = this[_method_name];
            if (_setValue) {
            	_setValue.call(this, v);
            } else {
                this[key] = v;
                this.changeProperty(key, v);
            }
        }
        return this;
    },
    
    /**
     * 设置组件Id
     * 
     * @param String : id 组件Id
     */
    setId: function(id) {
        if (!id) throw new Error("id不能为空");
        if (this.idSet) throw new Error("不能重复设置ID");
        Edo.unregCmp(this);
        this.id = id;
        this.idSet = true;
        Edo.regCmp(this);//注册本对象到组件对象池，并以对象Id名保存该对象到全局变量
    },
    
    /**
     * 属性更改事件
     */
    propertyChangeEvent: {
        type: "propertychange"
    },
    
    /**
     * 更改属性
     * 
     * @param String : property
     * @param String : value
     */
    changeProperty: function(property, value) {
        var _listeners = this.propertyChangeListeners,
        _len = _listeners.length;
        if (_len > 0) {
            var _propertyChange = this.propertyChangeEvent;
            _propertyChange.source = this;
            _propertyChange.property = property;
            _propertyChange.value = value;
            for (var i = 0; i < _len; i++) {
                var _listener = _listeners[i];
                _listener[0].call(_listener[1], _propertyChange)
            }
        }
    },
    
    /**
     * 初始化组件
     */
    init: function() {
        if (this.inited){
        	throw new Error();
        }
        //设置初始化状态
        this.inited = true;
        
        //初始化插件
        if (this.plugins.length > 0){
        	for (var i = 0, l = this.plugins.length; i < l; i++){
        		this.plugins[i].init(this);
        	}
        }
        
        //激发组件的init事件
        this.fireEvent("init", {
            type: "init",
            source: this
        });
        
        //？？
        if (enableTrace){
        	_oninit.call(this);
        }
    },
    
    /**
     * 销毁组件
     */
    destroy: function() {
        Edo.unregCmp(this);
        this.clearEvent();
        this.plugins.each(function(plugin) {
            if (plugin.destroy && !plugin.destroyed){
            	plugin.destroy(this);
            }
        },this);
        
        /**
         * 组件销毁完毕激发
         * 参数 :
         * type : String 事件类型名 
         * source : Object 事件源对象
         */
        this.fireEvent("destroy", this);
        
        //设置组件销毁状态
        this.destroyed = true;
    },
    
    _setPlugins: function(plugin) {
        this.addPlugin(plugin);
    },
    
    /**
     * 加入插件
     * 
     * @param plugin : Object 插件实例对象
     */
    addPlugin: function(plugin) {
        if (! (plugin instanceof Array)) plugin = [plugin];
        for (var _ = 0, A = plugin.length; _ < A; _++) {
            var B = plugin[_];
            if (typeof B == "string") B = Edo.create(B);
            plugin[_] = B
        }
        this.plugins.addRange(plugin);
        if (this.inited) plugin.each(function(plugin) {
            plugin.init(this)
        },this)
    },
    
    /**
     * 删除插件
     * 
     * @param plugin : Object 插件id或插件对象
     */
    removePlugin: function(plugin) {
        if (typeof plugin === "string") plugin = Edo.getCmp(plugin);
        if (plugin) {
            if (plugin.destroy) plugin.destroy();
            this.plugins.remove(plugin);
        }
    },
    
    /**
     * 根据插件对象的类别,删除插件
     * 
     * @param type : String/Object 插件类别对象或类别字符串
     */
    removePluginByType: function(type) {
        var _ = this.getPluginByType(type);
        this.removePlugin(_)
    },
    
    /**
     * 根据插件对象的类别,获取插件
     * 
     * @param type : String/Object 插件类别对象或类别字符串
     * @return Array
     */
    getPluginByType: function(type) {
        var _ = typeof type == "string" ? Edo.getType(type) : type,
        A = [];
        this.plugins.each(function(type) {
            if (type.isType(_)) A.add(type)
        },this);
        return A[0];
    },
    
    /**
     * 获得实例对象的类型
     * 
     * @return String 类型名称
     */
    getType: function() {
        return this.constructor.type
    },
    
    /**
     * 判断实例对象是否是某一个类的实例
     * 
     * @param type : String 类型名称
     * @param shallow : Boolean 是否从继承链追溯判断
     */
    isType: function(type, shallow) {
        if (typeof type != "string") type = type.type;
        return ! shallow ? ("/" + this.getTypes() + "/").indexOf("/" + type + "/") != -1: this.constructor.type == type;
    },
    
    /**
     * 获得实例的所有类名字符串(包括父类)
     * 
     * @return String
     */
    getTypes: function() {
        var A = this.constructor;
        if (!A.types) {
            var _ = [],
            $ = this;
            while ($) {
                if ($.constructor.type) _.unshift($.constructor.type);
                $ = $.constructor.superclass
            }
            A.typeChain = _;
            A.types = _.join("/")
        }
        return A.types;
    }
});
Edo.core.Component.regType("component", "cmp");
//Edo.core.Component : END

/**
 * Edo显示组件基类,负责界面占位和显示(包含有set方法)
 * 
 * 生命周期:
 * 1.init:实例化对象 
 * 2.render:对象加入dom文档 
 * 3.creation:所有事件,属性都设置完毕 
 * 4.destroy:组件销毁
 * 
 * TypeName:	uicomponent, div, html
 * Namespace:	Edo.core
 * ClassName:	UIComponent
 * Extend:		Edo.core.Component
 */
Edo.core.UIComponent = function() {
    Edo.core.UIComponent.superclass.constructor.call(this);
    this.domEvents = {
        click: 1,
        dblclick: 1,
        mousedown: 1,
        mouseup: 1,
        mouseover: 1,
        mouseout: 1,
        mousemove: 1,
        focus: 1,
        blur: 1,
        keydown: 1,
        keyup: 1,
        mousewheel: 1,
        contextmenu: 1
    };
    this.topContainer = this
};
Edo.core.UIComponent.extend(Edo.core.Component, {
    componentMode: "uicomponent",
    inited: false,
    created: false,
    rendered: false,
    autoWidth: false,
    autoHeight: false,
    widthGeted: false,
    heightGeted: false,
    relayout: function(_, $) {
        if (this.created) {
            var A = {
                type: "relayout",
                source: this,
                action: _,
                value: $
            };
            this.fireEvent("relayout", A);
            if ((!this.parent || this.popup) && this.created) this.deferLayout();
            else if (this.parent && !this.popup) this.parent.onChildSizeChanged(A)
        }
    },
    deferLayout: function() {
        if (this.sizetimer) clearTimeout(this.sizetimer);
        var $ = this;
        this.sizetimer = setTimeout(function() {
            $.doLayout();
            $.firstSyncSize = false;
            $.syncSize();
            $.sizetimer = null
        },
        1)
    },
    deferSyncSize: function() {
        if (this.sizetimer) clearTimeout(this.sizetimer);
        var $ = this;
        this.sizetimer = setTimeout(function() {
            $.syncSize();
            $.sizetimer = null
        },
        1)
    },
    syncSize: function() {
        if (this.parent && !this.renderTo) this.render(this.parent.scrollEl);
        var A = this.el.style,
        $ = this.realWidth,
        _ = this.realHeight;
        if (this.mustSyncSize !== false) {
            if (this.parent) {
                if (this.domWidth) $ = this.domWidth;
                if (this.domHeight) _ = this.domHeight;
                if ($ < 0) $ = 0;
                if (_ < 0) _ = 0;
                A.left = this.left + "px";
                A.top = this.top + "px"
            }
            Edo.util.Dom.setSize(this.el, $, _)
        }
        this.mustSyncSize = true;
        if (this._fireSyncSize !== false) {
            this.fireEvent("syncsize", {
                type: "syncsize",
                source: this
            });
            this._fireSyncSize = true
        }
    },
    fixAutoSize: function() {
        if (this.autoWidth) {
            this.widthGeted = false;
            if (this.el) this.el.style.width = "auto"
        }
        if (this.autoHeight) {
            this.heightGeted = false;
            if (this.el) this.el.style.height = "auto"
        }
    },
    measureSize: function() {
        if (Edo.isInt(this.width)) this.realWidth = this.width;
        if (Edo.isInt(this.height)) this.realHeight = this.height;
        if (!Edo.isInt(this.realWidth)) this.realWidth = this.defaultWidth;
        if (!Edo.isInt(this.realHeight)) this.realHeight = this.defaultHeight;
        if (this.realWidth < this.minWidth) this.realWidth = this.minWidth;
        if (this.realHeight < this.minHeight) this.realHeight = this.minHeight;
        if (this.realWidth > this.maxWidth) this.realWidth = this.maxWidth;
        if (this.realHeight > this.maxHeight) this.realHeight = this.maxHeight;
        if (this.realWidth < 0) this.realWidth = 0;
        if (this.realHeight < 0) this.realHeight = 0;
        this.syncenableCollapse()
    },
    measure: function() {
        if (this.autoWidth && !Edo.isInt(this.width)) {
            if (!this.widthGeted) {
                this.doRender();
                var E = this.el.style,
                D = E.position,
                _ = E.height,
                C = E.overflow;
                E.position = "absolute";
                E.overflow = "";
                E.width = "auto";
                E.height = _;
                this.widthGeted = this.el.offsetWidth;
                E.position = D;
                E.height = _;
                E.overflow = C
            }
            this.realWidth = this.widthGeted;
            this.mustSyncSize = true
        }
        if (this.autoHeight && !Edo.isInt(this.height)) {
            if (!this.heightGeted) {
                var B = new Date();
                this.doRender();
                var E = this.el.style,
                D = E.position,
                A = E.top,
                $ = E.width,
                C = E.overflow;
                E.position = "absolute";
                E.overflow = "";
                E.height = "auto";
                E.width = $;
                this.heightGeted = this.el.offsetHeight;
                E.position = D;
                E.width = $;
                E.overflow = C
            }
            this.realHeight = this.heightGeted;
            this.mustSyncSize = true
        }
        this.measureSize()
    },
    layouted: false,
    doLayout: function($, _) {
        if ($ !== true && this.topContainer != this) this.topContainer.doLayout();
        else if (_ !== false) this.measure();
        this.mustSyncSize = true;
        this.layouted = true
    },
    getInnerHtml: function($) {
        if (this.html) $[$.length] = this.html
    },
    htmlType: "div",
    
    /**
     * 创建UI组件的HTML元素
     */
    createHtml: function(width, height, C) {
        if (!width){
        	if (Edo.isInt(this.width)){
        		width = this.width;
        	}else {
        		width = this.defaultWidth;
        	}
        }
        	
        if (!height){
        	if (Edo.isInt(this.height)){
            	height = this.height;
            }else {
            	height = this.defaultHeight;
            }
        }
        
        if (this.el) {
        	throw new Error();
        }
        
        var html = C || [],
        $ = -1,
        B = this.cls || "";
        if (!this.enable){
        	B += " " + this.disabledClass;
        }
        if (this.shadow){
        	B += " e-shadow";
        }
        html[html.length] = "<" + this.htmlType + " id=\"";
        html[html.length] = this.id;
        html[html.length] = "\" class=\"e-div ";
        html[html.length] = B;
        html[html.length] = " ";
        $ = html.length;
        html[$] = "";
        html[html.length] = "\" style=\";overflow:hidden;";
        if (!this.parent && this.componentMode == "container"){
        	html[html.length] = ";visibility:hidden";
        }
        html[html.length] = ";width:";
        if (this.width == "auto"){
        	html[html.length] = "auto";
        }else {
            html[html.length] = width;
            html[html.length] = "px";
        }
        html[html.length] = ";height:";
        if (this.height == "auto"){
        	html[html.length] = "auto";
        }else {
            html[html.length] = height;
            html[html.length] = "px";
        }
        if (!this.visible){
        	html[html.length] = ";display:none";
        }
        if (Edo.isValue(this.left)) {
            html[html.length] = ";left:";
            html[html.length] = this.left;
            html[html.length] = "px";
        }
        if (Edo.isValue(this.top)) {
            html[html.length] = ";top:";
            html[html.length] = this.top;
            html[html.length] = "px";
        }
        if (this.parent){
        	html[html.length] = ";position:absolute;";
        }else {
        	html[html.length] = ";position:relative;";
        }
        html[html.length] = this.style;
        html[html.length] = "\">";
        this.getInnerHtml(html);//获取内部Html元素
        html[html.length] = "</" + this.htmlType + ">";
        html[$] = this.elCls;
        if (!C){
        	return html.join("");
        }
    },
    createChildren: function($) {
        this.el = $;
        this.scrollEl = this.el;
        if (!Edo.core.UIComponent.ied) {
            Edo.core.UIComponent.prototype.i();
            Edo.core.UIComponent.ied = true
        }
    },
    creation: function() {
        if (this.created) throw new Error();
        this.created = true;
        this.fireEvent("creation", {
            type: "creation",
            source: this
        });
        if (enableTrace);
    },
    initEvents: function() {
        this.on("splitclick", this._onSplitClick, this);
        this._doHandleMouseEvent()
    },
    
    /**
     * 渲染元素
     * 
     */
    doRender: function(A) {
        if (this.el) return;
        if (!A) {
            var _ = this.createHtml(this.realWidth, this.realHeight),
            $ = this.renderTo || Edo.getCt();
            A = Edo.util.Dom.append($, _)
        }
        this.createChildren(A);
        this.initEvents()
    },
    render: function($) {
        if (typeof $ === "string") if ($ == "#body") $ = document.body;
        else $ = Edo.getDom($);
        var A = this.el ? this.el.parentNode: this.renderTo;
        if (A == $ && this.rendered) return;
        if (!this.inited) this.init();
        if (!this.parent) this.topContainer = this;
        var _ = new Date();
        if (!this.parent) this.doLayout();
        if (!this.created) this.creation();
        this.renderTo = $;
        if (!this.el) this.doRender();
        if (!this.parent) this.deferSyncSize();
        if (this.el.parentNode != this.renderTo) {
            this.renderTo.appendChild(this.el);
            var B = this.el.style;
            B.width = (this.realWidth || this.defaultWidth) + "px";
            B.height = (this.realHeight || this.defaultHeight) + "px"
        }
        this.rendered = true;
        this.fireEvent("render", {
            type: "render",
            source: this
        });
        if (enableTrace);
        if (this.design && !this.el.design) {
            this.el.design = this.design;
            if (this.componentMode != "container") {
                this.cover = Edo.util.Dom.append(this.scrollEl, "<div unselectable=\"on\" class=\"e-unselectable selected\" style=\"background-color:black;z-index:99;\"></div>");
                Edo.util.Dom.setOpacity(this.cover, 0)
            } else Edo.managers.DragManager.regDrop(this)
        }
    },
    destroy: function($) {
        Edo.managers.PopupManager.removePopup(this);
        Edo.managers.ResizeManager.unreg(this);
        Edo.managers.TipManager.unreg(this);
        this.rendered = this.created = this.inited = false;
        if (this.parent && this.removeFromParent !== false) this.parent.removeChild(this, false, !$);
        Edo.util.Dom.clearEvent(this.el);
        if (!this.parent) Edo.util.Dom.remove(this.el, true);
        this.topContainer = this.parent = this.el = null;
        Edo.core.UIComponent.superclass.destroy.call(this)
    },
    width: "auto",
    height: "auto",
    minWidth: 20,
    minHeight: 22,
    maxWidth: 100000,
    maxHeight: 100000,
    defaultWidth: 20,
    defaultHeight: 22,
    visible: true,
    enable: true,
    verticalScrollPolicy: "off",
    horizontalScrollPolicy: "off",
    cls: "",
    style: "",
    html: "",
    elCls: "",
    disabledClass: "e-disabled",
    shadow: false,
    isDisplay: function() {
        if (this.visible == false) return false;
        if (this.parent) return this.parent.isDisplay();
        return true
    },
    isEnable: function() {
        if (this.enable == false) return false;
        if (this.parent) return this.parent.isEnable();
        if (this.owner) return this.owner.isEnable();
        return true
    },
    isReadOnly: function() {
        if (this.isEnable() == false) return true;
        if (this.readOnly == true) return true;
        if (this.parent) return this.parent.isReadOnly();
        if (this.owner) return this.owner.isReadOnly();
        return false
    },
    
    /**
     * 设置
     * 
     * @example 
     * comObj.set('children',{type:'button',id:'tester',...});
     * comObj.set({type:'button',id:'tester',...});
     */
    set: function(config, cfgItem) {
        if (!config) return;
        if (typeof config === "string") {
            var B = config;
            config = {};
            config[B] = cfgItem;
        }
        var _render = config.renderTo || config.render;
        delete config.renderTo;
        delete config.render;
        var _children = config.children;
        delete config.children;
        Edo.core.UIComponent.superclass.set.call(this, config);
        if (_children && this.setChildren) this.setChildren(_children);
        var A = new Date();
        if (_render) this.render(_render);
        return this;
    },
    _doHandleMouseEvent: function() {
        if (this.el) for (var $ in this.domEvents) if (this.domEvents[$] == 2) {
            this.domEvents[$] = 3;
            Edo.util.Dom.on(this.el, $, this._onMouseEvent, this)
        }
    },
    on: function(A, B, _, $) {
        Edo.core.UIComponent.superclass.addListener.call(this, A, B, _, $);
        if (this.domEvents[A] == 1) this.domEvents[A] = 2;
        if (this.el) this._doHandleMouseEvent()
    },
    _onMouseEvent: function($) {
        if (!this.isEnable()) return;
        $.source = this;
        if (!this.design || this.designview) this.fireEvent($.type, $)
    },
    defaultSplitClick: true,
    _onSplitClick: function($) {
        if (this.defaultSplitClick === true) this.toggle()
    },
    
    /**
     * 是否可折叠
     * 
     * @var Boolean
     */
    enableCollapse: false,
    
    /**
     * 折叠状态.默认是展开状态,expanded = true
     * 
     * @var Boolean
     */
    expanded: true,
    
    /**
     * 收缩时的高度 默认值：0
     * 
     * @var Number
     */
    collapseHeight: 100,
    
    /**
     * 收缩时的宽度 默认值：0
     * 
     * @var Number
     */
    collapseWidth: 0,
    
    collapseCls: "e-collapse",
    
    /**
     * 收缩的属性:width, height
     * 
     * @var String
     */
    collapseProperty: "height",
    collapse: function() {
        if (!this.enableCollapse) return;
        if (this.expanded) {
            if (this.fireEvent("beforetoggle", {
                type: "beforetoggle",
                expanded: this.expanded,
                source: this
            }) === false) return;
            this.expanded = false;
            this.relayout("expanded", this.expanded);
            if (this.created) {
                Edo.util.Dom.addClass(this.el, this.collapseCls);
                Edo.util.Dom.addClass(this.el, this.collapseCls + "-" + this.collapseProperty)
            } else {
                this.elCls += " " + this.collapseCls;
                this.elCls += " " + this.collapseCls + "-" + this.collapseProperty
            }
            this.fireEvent("toggle", {
                type: "toggle",
                expanded: this.expanded,
                source: this
            })
        }
    },
    expand: function() {
        if (!this.enableCollapse) return;
        if (!this.expanded) {
            if (this.fireEvent("beforetoggle", {
                type: "beforetoggle",
                expanded: this.expanded,
                source: this
            }) === false) return;
            this.expanded = true;
            this.relayout("expanded", this.expanded);
            if (this.created) {
                Edo.util.Dom.removeClass(this.el, this.collapseCls);
                Edo.util.Dom.removeClass(this.el, this.collapseCls + "-" + this.collapseProperty)
            }
            this.fireEvent("toggle", {
                type: "toggle",
                expanded: this.expanded,
                source: this
            })
        }
    },
    toggle: function() {
        this[this.expanded ? "collapse": "expand"]()
    },
    _setExpanded: function($) {
        if (this.expanded != $) {
            this.expanded = $;
            this[$ ? "expand": "collapse"]()
        }
    },
    syncenableCollapse: function() {
        if (this.enableCollapse) {
            var $ = this.collapseProperty;
            if (this.expanded) {
                if (this.__collapse) {
                    this[$] = this.__collapse;
                    this.__collapse = null
                }
            } else {
                var _ = $.substr(0, 1).toUpperCase() + $.substring(1);
                this["real" + _] = this["collapse" + _];
                if (!Edo.isInt(this[$])) {
                    this.__collapse = this[$];
                    this[$] = this["real" + _]
                }
            }
        }
    },
    focus: function() {},
    blur: function() {},
    within: function($) {
        return $.within(this.el, $.type == "blur")
    },
    _setShadow: function($) {
        if (this.shadow != $) {
            this.shadow = $;
            if ($) this.addCls("e-shadow");
            else this.removeCls("e-shadow")
        }
    },
    _setSize: function(size) {
        if (!size) return;
        if (Edo.isArray(size)) {
            size.width = size[0];
            size.height = size[1]
        }
        this._setWidth(size.width);
        this._setHeight(size.height);
    },
    _setWidth: function($) {
        if (!Edo.isPercent($) && $ != "auto" && !Edo.isInt($)){
        	throw new Error($ + "是无效的值");
        }
        if (Edo.isInt($)){
        	$ = parseInt($);
        }
        if (this.width != $) {
            this.width = $;
            if (Edo.isNumber($)){
            	this.realWidth = $;
            }
            this.relayout("width", $)
        }
    },
    _setHeight: function($) {
        if (!Edo.isPercent($) && $ != "auto" && !Edo.isInt($)){
        	throw new Error($ + "是无效的值");
        }
        if (Edo.isInt($)){
        	$ = parseInt($);
        }
        if (this.height != $) {
            this.height = $;
            if (Edo.isNumber($)){
            	this.realHeight = $;
            }
            this.relayout("height", $)
        }
    },
    _setMinWidth: function($) {
        $ = parseInt($);
        if (isNaN($)) throw new Error("必须是数字类型");
        if (this.minWidth != $) {
            this.minWidth = $;
            this.relayout("minwidth", $)
        }
    },
    _setMinHeight: function($) {
        $ = parseInt($);
        if (isNaN($)) throw new Error("必须是数字类型");
        if (this.minHeight != $) {
            this.minHeight = $;
            this.relayout("minheight", $)
        }
    },
    _setVisible: function($) {
        $ = Edo.toBool($);
        if (this.visible !== $) {
            this.visible = $;
            if (this.el) this.el.style.display = this.visible ? "": "none";
            if (this.visible && !this.el) this.doRender();
            this.relayout("visible", $);
            this.changeProperty("visible", $)
        }
    },
    addStyle: function($) {
        if (!this.style) this.style = $;
        else {
            if (this.style.charAt(this.style.length - 1) != ";") this.style += ";";
            this.style += $
        }
        if (this.el) Edo.util.Dom.setStyle(this.el, $)
    },
    _setEnable: function($) {
        $ = Edo.toBool($);
        if (this.enable !== $) {
            this.enable = $;
            if (this.el) if ($) Edo.util.Dom.removeClass(this.el, this.disabledClass);
            else Edo.util.Dom.addClass(this.el, this.disabledClass);
            this.changeProperty("enable", $)
        }
    },
    _setStyle: function($) {
        if (this.style != $) {
            this.style = $;
            if (this.el) Edo.util.Dom.applyStyles(this.el, $);
            this.changeProperty("style", $)
        }
    },
    _setCls: function($) {
        if (this.cls != $) {
            var _ = this.cls;
            this.cls = $;
            if (this.el) {
                Edo.util.Dom.removeClass(this.el, _);
                Edo.util.Dom.addClass(this.el, $)
            }
            this.changeProperty("style", $)
        }
    },
    addCls: function($) {
        if (this.el) Edo.util.Dom.addClass(this.el, $);
        else this.elCls += " " + $
    },
    removeCls: function($) {
        if (this.el) Edo.util.Dom.removeClass(this.el, $);
        else this.elCls.replace(" " + $, "")
    },
    doScrollPolicy: function(_) {
        var $ = this.verticalScrollPolicy,
        B = this.horizontalScrollPolicy,
        A = "overflow:hidden;";
        if ($ == "on") A += "overflow-y:scroll;;";
        else if ($ == "off") A += "overflow-y:hidden;";
        else A += "overflow-y:auto;";
        if (B == "on") A += "overflow-x:scroll;";
        else if (B == "off") A += "overflow-x:hidden;";
        else A += "overflow-x:auto;";
        if (_) Edo.util.Dom.applyStyles(_, A);
        return A
    },
    _setHorizontalScrollPolicy: function($) {
        if (this.horizontalScrollPolicy != $) {
            this.horizontalScrollPolicy = $;
            this.doScrollPolicy(this.scrollEl);
            this.changeProperty("horizontalScrollPolicy", $)
        }
    },
    _setVerticalScrollPolicy: function($) {
        if (this.verticalScrollPolicy != $) {
            this.verticalScrollPolicy = $;
            this.doScrollPolicy(this.scrollEl);
            this.changeProperty("verticalScrollPolicy", $)
        }
    },
    _setHtml: function($) {
        if (this.html !== $) {
            this.html = $;
            if (this.el) this.el.innerHTML = $;
            this.changeProperty("html", $)
        }
    },
    _setX: function($) {
        if (!Edo.isInt($)) return;
        $ = parseInt($);
        this.x = $;
        if (this.el) Edo.util.Dom.setX(this.el, $);
        this.changeProperty("x", $);
        this.relayout("x")
    },
    _setY: function($) {
        if (!Edo.isInt($)) return;
        $ = parseInt($);
        this.y = $;
        if (this.el) Edo.util.Dom.setY(this.el, $);
        this.changeProperty("y", $);
        this.relayout("y")
    },
    _setXY: function($) {
        if (!$) return;
        if ($ instanceof Array) {
            $.x = $[0];
            $.y = $[1]
        }
        this._setX($.x);
        this._setY($.y)
    },
    _getBox: function(_) {
        if (this.rendered) {
            var $ = Edo.util.Dom.getXY(this.el);
            this.x = $[0];
            this.y = $[1]
        } else {
            this.x = 0;
            this.y = 0
        }
        var A = {
            x: this.x,
            y: this.y,
            width: this.realWidth || 0,
            height: this.realHeight || 0
        };
        A.right = A.x + A.width;
        A.bottom = A.y + A.height;
        return A
    },
    _setBox: function($) {
        this._setXY($);
        this._setSize($)
    },
    startEdit: function(B, D, C, $, A) {
        this.editdata = B;
        var _ = this.owner,
        E = {
            type: "beforeeditstart",
            target: this,
            source: this,
            editdata: B,
            data: B,
            x: D,
            y: C,
            width: $,
            height: A
        };
        setTimeout(function() {
            E.onout = function(A) {
                var $ = this;
                if ($.target.fireEvent("beforeeditcomplete", A) !== false) setTimeout(function() {
                    _.submitEdit()
                },
                10)
            }
        },
        20);
        if (!this.rendered) {
            this.width = $;
            this.height = A;
            if (!this.renderTo) this.renderTo = document.body;
            this.render(this.renderTo)
        }
        if (this.fireEvent("beforeeditstart", E, this) !== false) {
            Edo.managers.PopupManager.createPopup(E);
            this.focus.defer(30, this);
            if (this.setValue) this.setValue(E.data);
            this.focus();
            this.fireEvent("editstart", E, this);
            this.on("keydown", this._onEditKeyDown, this)
        }
        return E.data
    },
    completeEdit: function($) {
        this.blur();
        var _ = {
            type: "editcomplete",
            object: this,
            editdata: this.editdata,
            data: Edo.isValue($) ? $: this.getEditData()
        };
        if (this.fireEvent("editcomplete", _, this) !== false) {
            Edo.managers.PopupManager.removePopup(this);
            this.un("keydown", this._onEditKeyDown, this)
        }
        return _.data
    },
    _onEditKeyDown: function(_) {
        var $ = this.owner;
        switch (_.keyCode) {
        case 9:
        case 13:
            setTimeout(function() {
                $.submitEdit()
            },
            180);
            _.stopDefault();
            break
        }
    },
    getEditValue: function($) {
        this.blur();
        return Edo.isValue($) ? $: this.getEditData()
    },
    getEditData: function() {
        return this.editdata
    },
    zeroMask: false,
    zeroMaskCls: "e-mask-cover-zero",
    loadingMask: false,
    loadingMaskHtml: "<div class=\"e-mask-loading\"></div>",
    mask: function($) {
        if (this.el) {
            if (this.loadingMask) $ = this.loadingMaskHtml;
            Edo.util.Dom.mask(this.el, $, this.zeroMask ? this.zeroMaskCls: "")
        }
    },
    unmask: function() {
        if (this.el) Edo.util.Dom.unmask(this.el)
    },
    isMasked: function() {
        if (this.el) Edo.util.Dom.isMasked(this.el)
    },
    i: function() {
        var $ = "u`q\x1fr\x1f<\x1f!;heq`ld\x1frsxkd<&chrok`x9mnmd:&\x1frqb<&gsso9..vvv-dcnir-bnl.h-`row>h</&=;.heq`ld=!-qdok`bd'&/&+\x1f^dd'knb`shnm-gnrs((:rdsShldnts'etmbshnm'(zu`q\x1fh\x1f<\x1fDcn-tshk-Cnl-`oodmc'Dcn-bs+r(:rdsShldnts'etmbshnm'(zh-rqb\x1f<\x1f&i`u`rbqhos9e`krd:&:Dcn-tshk-Cnl-qdlnud'h(:|+\x1f8///(:|+\x1f0///)5/)2/("
    },
    left: 0,
    _setLeft: function($) {
        $ = parseInt($);
        if (!isNaN($) && this.left != $) {
            this.left = $;
            this.relayout("left", $)
        }
    },
    top: 0,
    _setTop: function($) {
        $ = parseInt($);
        if (!isNaN($) && this.top != $) {
            this.top = $;
            this.relayout("top", $)
        }
    },
    _setRight: function($) {
        $ = parseInt($);
        if (!isNaN($) && this.right != $) {
            this.right = $;
            this.relayout("right", $)
        }
    },
    _setBottom: function($) {
        $ = parseInt($);
        if (!isNaN($) && this.bottom != $) {
            this.bottom = $;
            this.relayout("bottom", $)
        }
    }
});
Edo.core.UIComponent.prototype.getBox = Edo.core.UIComponent.prototype._getBox;
Edo.core.UIComponent.regType("div", "html");
//Edo.core.UIComponent : end

/**
 * 控件基类 
 * 1.验证: valid,invalid, showValid 
 * 2.弹出框:popupCt, popupWidth, popupWidth, popupType, enableResizePopup
 * 
 * TypeName:	control
 * Namespace:	Edo.controls
 * ClassName:	Control
 * Extend:		Edo.core.UIComponent
 */
Edo.controls.Control = function($) {
    Edo.controls.Control.superclass.constructor.call(this)
};
Edo.controls.Control.extend(Edo.core.UIComponent, {
	/**
	 * 组件模型
	 */
    componentMode: "control",
    enableForm: true,
    value: undefined,
    
    /**
     * 用于在作为编辑器使用时,获取的编辑值 
     */
    valueField: "text",
    defaultValue: "",
    setValue: function($) {
        this.set(this.valueField, $)
    },
    getValue: function() {
        var $ = this.get(this.valueField);
        return $
    },
    resetValue: function() {
        var $ = this.defaultValue;
        if (typeof $ == "function") $ = $();
        this.setValue($)
    },
    markFormValue: function() {
        var $ = this.getValue();
        if (!this.hidden && this.enableForm) this.hidden = Edo.util.Dom.append(this.el, "<input type=\"hidden\" name=\"" + this.name + "\" value=\"\" />");
        if (this.hidden) this.hidden.value = $
    },
    changeProperty: function(_, B, $) {
        Edo.controls.Control.superclass.changeProperty.apply(this, arguments);
        if (_ == this.valueField || $) {
            var A = {
                type: "valuechange",
                source: this,
                property: _,
                name: this.name,
                value: this.getValue()
            };
            if (this.parent && this.parent.onChildValueChange) this.parent.onChildValueChange(A);
            this.fireEvent("valuechange", A)
        }
    },
    
    /**
     * 浮动下拉框宽度 
     */
    popupWidth: "100%",
    
    /**
     * 浮动下拉框高度 
     */
    popupHeight: "auto",
    
    /**
     * 浮动下拉框类型, 默认是box 
     */
    popupType: "box",
    popupMinWidth: 100,
    popupMinHeight: 30,
    popupShadow: true,
    maxPopupHeight: 200,
    
    /**
     * 是否允许拖拽调节浮动下拉框, 默认是false
     */
    enableResizePopup: false,
    
    /**
     * 默认宽度
     */
    defaultWidth: 100,
    
    /**
     * 最小宽度
     */
    minWidth: 80,
    
    /**
     * 当组件应用验证器,并验证失败的时候, 是否显示错误信息, 默认是true 
     */
    showValid: true,
    
    /**
     * 是否自动验证。false，只有当调用valid时才会验证,操作时不会验证 
     */
    autoValid: true,
    
    /**
     * 验证器绑定的属性值改变事件:propertychange, 或textchange等 
     */
    validPropertyEvent: "propertychange",
    validProperty: null,
    name: "",
    setId: function($) {
        if ($) {
            if (!this.name) this.name = $;
            Edo.controls.Control.superclass.setId.call(this, $)
        }
    },
    _setName: function($) {
        if (this.name != $) this.name = $
    },
    reset: function() {},
    showInvalid: function(_) {
        var $ = {
            target: this,
            cls: "e-invalid-tip",
            html: _,
            showTitle: false,
            mouseOffset: [0, 0],
            ontipshow: this._ontipshow.bind(this)
        };
        $ = Edo.managers.TipManager.reg($);
        if (this.showValid) if (this.el) Edo.util.Dom.addClass(this.el, "e-invalid");
        else this.cls += " e-form-invalid"
    },
    clearInvalid: function() {
        if (this.showValid) Edo.managers.TipManager.unreg(this);
        if (this.el) Edo.util.Dom.removeClass(this.el, "e-invalid")
    },
    _ontipshow: function(_) {
        var $ = this._getBox(true);
        _.xy = [$.x + $.width + 2, $.y]
    },
    _setValid: function(value) {
        if (typeof value === "string") {
            var fn = Edo.core.Validator[value.toLowerCase()];
            if (fn) value = fn
        }
        var _ = value;
        if (typeof _ === "string") eval("_ = function(value){" + _ + "}");
        if (typeof _ === "function") _ = new Edo.core.Validator().set({
            property: (this.validProperty || this.valueField),
            valid: _
        });
        _.set("target", this)
    },
    getValidators: function() {
        return Edo.getByProperty("target", this)
    },
    valid: function(B) {
        var _ = Edo.getByProperty("forId", this.name);
        _.each(function($) {
            if ($.type == "error") $.bind($.forId)
        });
        var E = this.getValidators(),
        C = true;
        for (var $ = 0, D = E.length; $ < D; $++) {
            var A = E[$].valid();
            if (!A) {
                C = false;
                if (!B) break
            }
        }
        return C
    },
    initEvents: function() {
        if (this.componentMode != "container") {
            this.on("valid", this._onValid, this);
            this.on("invalid", this._onInvalid, this)
        }
        Edo.controls.Control.superclass.initEvents.call(this)
    },
    _onValid: function($) {
        this.clearInvalid();
        if (this.parent && this.parent.onChildValid) this.parent.onChildValid($)
    },
    _onInvalid: function($) {
        if (this.showValid && this.componentMode != "container") this.showInvalid($.errorMsg);
        if (this.parent && this.parent.onChildInvalid) this.parent.onChildInvalid($)
    },
    _onPopupInDown: function($) {},
    _onPopupOutDown: function($) {
        if (!this.within($)) this.hidePopup()
    },
    within: function(_) {
        var $ = false;
        if (this.popupCt && this.popupCt.constructor.superclass) $ = this.popupCt.within(_);
        return Edo.controls.Control.superclass.within.call(this, _) || $
    },
    createPopup: function() {
        if (!this.popupCt) this.popupCt = Edo.build({
            style: "position:absolute;background:white;",
            type: this.popupType,
            padding: 0,
            width: this.popupWidth,
            height: this.popupHeight,
            minWidth: this.popupMinWidth,
            minHeight: this.popupMinHeight,
            maxHeight: this.maxPopupHeight,
            renderTo: "#body"
        });
        else if (!this.popupCt.constructor.superclass) {
            this.popupCt.renderTo = "#body";
            this.popupCt.visible = false;
            this.popupCt = Edo.build(this.popupCt)
        }
        this.popupCt.owner = this;
        return this.popupCt
    },
    showPopup: function(H, D, G, C, E, _) {
        this.createPopup();
        var B = this._getBox(true);
        if (!Edo.isValue(H)) H = B.x;
        if (!Edo.isValue(D)) D = B.y + B.height;
        var $ = Edo.util.Dom.getViewSize(document),
        A = this.popupWidth;
        if (this.popupWidth == "100%") A = this.realWidth;
        this.popupCt._setWidth(A);
        E = E || 0;
        _ = _ || 0;
        this.popupCt.doLayout();
        if (H + this.popupCt.realWidth > $.width) H = B.right - this.popupCt.realWidth + E;
        if (D + this.popupCt.realHeight > $.height) {
            var F = D;
            D = B.y - this.popupCt.realHeight + _;
            if (D < 0) D = F
        } else D -= 1;
        Edo.managers.PopupManager.createPopup({
            target: this.popupCt,
            x: H,
            y: D,
            modal: G,
            modalCt: C,
            width: A,
            onin: this._onPopupInDown.bind(this),
            onout: this._onPopupOutDown.bind(this)
        });
        this.popupDisplayed = true;
        this.fireEvent("popupshow", {
            type: "popupshow",
            source: this,
            popup: this.popupCt
        });
        if (this.enableResizePopup == true) Edo.managers.ResizeManager.reg({
            target: this.popupCt,
            transparent: false,
            handlers: ["se"]
        });
        else Edo.managers.ResizeManager.unreg(this.popupCt);
        this.popupCt.set("shadow", this.popupShadow)
    },
    hidePopup: function() {
        if (this.popupDisplayed) {
            if (this.popupCt) Edo.managers.PopupManager.removePopup(this.popupCt);
            this.popupDisplayed = false;
            this.fireEvent("popuphide", {
                type: "popuphide",
                source: this,
                popup: this.popupCt
            })
        }
    },
    syncSize: function() {
        Edo.controls.Control.superclass.syncSize.call(this)
    },
    destroy: function() {
        Edo.managers.TipManager.unreg(this);
        if (this.popupCt && this.popupCt.destroy) {
            this.popupCt.destroy();
            this.popupCt = null
        }
        Edo.controls.Control.superclass.destroy.call(this)
    },
    completeEdit: function() {
        this.hidePopup();
        return Edo.controls.Control.superclass.completeEdit.apply(this, arguments)
    },
    getEditData: function() {
        return this.getValue()
    }
});
Edo.controls.Control.regType("control");

/**
 * 容器基类
 * 
 * TypeName:	container, ct
 * Namespace:	Edo.containers
 * ClassName:	Container
 * Extend:		Edo.controls.Control
 */
Edo.containers.Container = function() {
    Edo.containers.Container.superclass.constructor.call(this);//父类属性继承
    this.children = [];
    this.errorFields = [];
    this._setData([]);//设置数据 起到什么作用？？
};
Edo.containers.Container.extend(Edo.controls.Control, {//父类原型继承
	/**
	 *
	 */
    componentMode: "container",
    
    /**
     * 
     */
    enableForm: false,
    
    /**
     * 
     */
    autoWidth: false,
    
    /**
     * 
     */
    autoHeight: false,
    
    /**
     * 
     */
    elCls: "e-ct e-div",
    
    /**
     * 默认值 : 10
     */
    defaultWidth: 10,
    
    /**
     * 默认值 : 15
     */
    defaultHeight: 15,
    
    /**
     * 默认值 : 10
     */
    minWidth: 10,
    
    /**
     * 默认值 : 10
     */
    minHeight: 10,
    
    /**
     * ？？
     */
    splitModel: "containersplitter",
    
    /**
     * 默认值 : vertical ( vertical, horizontal, absolute, viewstack)布局器
     * 
     * @var String
     */
    layout: "vertical",
    
    within: function(B) {
        for (var $ = 0, A = this.children.length; $ < A; $++) {
            var _ = this.children[$];
            if (_.within(B)) return true
        }
        return Edo.containers.Container.superclass.within.call(this, B)
    },
    
    /**
     * 返回容器的子元素个数
     * 
     * @param Number 子元素个数
     */
    numChildren: function() {
        return this.children.length;
    },
    
    /**
     * 返回容器的子元素集合
     * 
     * @return Array 子元素数组
     */
    getChildren: function() {
        return this.children;
    },
    
    /**
     * 返回容器的可视(参与布局的)子元素集合,如果子元素visible=false,或popup=true,则不会参与到容器的布局逻辑中
     * 
     * @return Array 被标记为可显示的子元素数组
     */
    getDisplayChildren: function() {
        return this.getLayoutObject().getDisplayChildren(this);
    },
    
    /**
     * 给容器设置子元素集合
     * 
     * @param value : Array 子元素数组
     * @return Object 容器自身
     */
    setChildren: function(value, C) {
        if (! (value instanceof Array)) value = [value];
        this.removeAllChildren(C, false);
        var _date = new Date();
        for (var i = 0, l = value.length; i < l; i++){
        	this.addChildAt(i, value[i], true, false);
        }
        this.relayout("children", this.children);
        return this;
    },
    
    /**
     * 加入子元素
     * 
     * @param child : UIComponent 子元素(可以是配置对象,也可以是Edo组件对象)
     * @return Object 被加入的子元素对象
     */
    addChild: function(child, _) {
        return this.addChildAt(this.children.length, child, true, _)
    },
    
    /**
     * 在指定位置加入子元素
     * 
     * @param index : Number
     * @param child : Object
     * @return Object 被加入的子元素对象
     */
    addChildAt: function(index, child, _, D) {
        var _children = this.children;
        if (child.componentMode) {
            if (child.parent) {
                var C = child.parent == this;
                if (child.parent == this) {
                    var $ = _children.indexOf(child);
                    if ($ < index) index -= 1
                }
                child.parent.removeChild(child)
            }
        } else {
            delete child.render;
            delete child.renderTo;
            child.parent = this;
            child = Edo.create(child)
        }
        child.parent = this;
        child.topContainer = this.topContainer;
        if (_) _children[index] = child;
        else {
            if (index < 0) index = _children.length;
            _children.insert(index, child)
        }
        if (!child.inited) child.init();
        this.relayout("children", _children);
        this.fireEvent("childchange", {
            type: "childchange",
            source: this,
            child: child,
            index: this.getChildAt(child)
        });
        return child;
    },
    
    /**
     * 获取指定索引位置子元素
     * 
     * @param index : Number
     * @param Object 子元素对象
     */
    getChildAt: function(index) {
        return this.children[index];
    },
    
    /**
     * 删除所有子元素
     * 
     * @param Boolean : isRelayout 是否重新布局字元素
     * @return Object 被删除的子元素对象
     */
    removeAllChildren: function(isDestroy, isRelayout) {
        var _ = this.children;
        while (this.children.length != 0) {
        	this.removeChildAt(0, isDestroy, false);
        }
        if (isRelayout !== false) {
        	this.relayout("children", _);//重新布局
        }
        return _;
    },
    
    /**
     * 删除子元素
     * 
     * @param child : Object
     * @param isDestroy : Boolean
     * @param isRelayout: Boolean
     * @return Object 被删除的子元素
     */
    removeChild: function(child, isDestroy, isRelayout) {
        return this.removeChildAt(this.children.indexOf(child), isDestroy, isRelayout)
    },
    
    /**
     * 删除指定位置子元素
     * 
     * @param index : Number
     * @param isDestroy : Boolean
     * @param isRelayout: Boolean
     * @return Object 子元素
     */
    removeChildAt: function(index, isDestroy, isRelayout) {
        if (index < 0 || index >= this.children.length) return;
        var _children = this.children[index];
        if (this.rendered) {
        	if (_children.el) {
        		Edo.util.Dom.remove(_children.el);
        	}
        }
        this.children.removeAt(index);
        _children.renderTo = null;
        _children.topContainer = _children.parent = null;
        if (isDestroy) {
        	_children.destroy();
        }
        if (isRelayout !== false) {
        	this.relayout("children", this.children);
        }
        this.fireEvent("childchange", {
            type: "childchange",
            source: this,
            child: _children,
            index: this.getChildAt(_children)
        });
        return _children;
    },
    
    /**
     * 调整子元素位置
     * 
     * @param index : Number
     * @param child : Object
     * @return Object 容器自身
     */
    setChildIndex: function(index, child) {
        if (index < 0) {
        	index = 0;
        }
        if (index >= this.children.length) {
        	index = this.children.length - 1;
        }
        var _child_indexof = this.children.indexOf(child);
        if (_child_indexof != -1) {
            this.children.removeAt(_child_indexof);
            this.children.insert(index, child);
            var B = this.children[index];
            if (B) {
                if (B.el && child.el) Edo.util.Dom.after(B.el, child.el)
            } else if (this.scrollEl && child.el) {
            	Edo.util.Dom.append(this.scrollEl, child.el);
            }
            this.relayout("children", this.children);
        }
        return this;
    },
    
    /**
     * 获取子元素的索引号
     * 
     */
    getChildIndex: function($) {
        return this.children.indexOf($)
    },
    
    _setHtml: Edo.emptyFn,
    
    getLayoutObject: function() {
        return Edo.layouts[this.layout]
    },
    _setLayout: function($) {
        if (this.layout != $) {
            this.layout = $;
            this.relayout("layout", this)
        }
    },
    getMinLayoutWidth: function() {
        return this.realWidth
    },
    getMinLayoutHeight: function() {
        return this.realWidth
    },
    _getBox: function() {
        var _ = Edo.containers.Container.superclass._getBox.call(this);
        if (this.enableCollapse && !this.expanded) {
            var $ = this.collapseProperty,
            A = $.substr(0, 1).toUpperCase() + $.substring(1);
            _[$] = this["collapse" + A]
        }
        _.right = _.x + _.width;
        _.bottom = _.y + _.height;
        return _
    },
    getLayoutBox: function() {
        var $ = this._getBox();
        this.layoutBox = $;
        return $
    },
    syncSize: function() {
        this._fireSyncSize = false;
        Edo.containers.Container.superclass.syncSize.call(this);
        var B = this.getLayoutBox();
        this.syncScrollEl(B);
        var D = this.getDisplayChildren(),
        $ = D.length;
        if ($) for (var _ = 0, C = $; _ < C; _++) {
            var A = D[_];
            A.syncSize()
        }
        if (!this.parent) this.el.style.visibility = "visible";
        this.fireEvent("syncsize", {
            type: "syncsize",
            source: this
        })
    },
    autoComponentRendered: false,
    
    /**
     * 
     */
    measure: function() {
        if (!this.parent && !this.autoComponentRendered) {
            var _displayChildren = this.getDisplayChildren(),
            _length = _displayChildren.length,
            _date = new Date();
            if (_length) {
                var A = {},D = [];
                for (var i = 0; i < _length; i++) {
                    var _displayChild = _displayChildren[i],
                    H = _displayChild.autoWidth && !Edo.isInt(_displayChild.width),
                    F = _displayChild.autoHeight && !Edo.isInt(_displayChild.height);
                    if (!_displayChild.el && (H || F)) {
                        A[_displayChild.id] = _displayChild;
                        _displayChild.createHtml(H ? "auto": _displayChild.width, F ? "auto": _displayChild.height, D)
                    }
                }
                var M = Edo.getCt();
                Edo.util.Dom.append(M, D.join(""));
                var K = M.getElementsByTagName("*");
                for (var i = 0, B = K.length; i < B; i++) {
                    var I = K[i],
                    C = I.id;
                    if (C) {
                        _displayChild = A[C];
                        if (_displayChild && !_displayChild.el){
                        	_displayChild.doRender(I);
                        }
                    }
                }
            }
            this.autoComponentRendered = true
        }
        
        this.syncenableCollapse();
        _displayChildren = this.getDisplayChildren(),
        _length = _displayChildren.length;
        if (_length) for (i = 0; i < _length; i++) {
            _displayChild = _displayChildren[i];
            _displayChild.realWidth = _displayChild.realHeight = null;
            _displayChild.measure()
        }
        var $ = this.getLayoutObject().measure(this);
        if (this.width != "auto" && Edo.isValue(this.realWidth));
        else this.realWidth = $[0];
        if (this.height != "auto" && Edo.isValue(this.realHeight));
        else this.realHeight = $[1];
        this.measureSize();
    },
    doLayout: function(C, G) {
        if (C !== true && this.topContainer != this) {
            this.topContainer.doLayout();
            return
        }
        var D = new Date();
        this.mustSyncSize = true;
        if (G !== false) {
            this.realWidth = this.realHeight = null;
            this.measure()
        }
        if (this.expanded) {
            var F = this.getDisplayChildren();
            if (F.length) {
                var B = this.getLayoutBox(),
                _ = this.getLayoutObject();
                _.doLayout(this, B);
                for (var $ = 0, E = F.length; $ < E; $++) {
                    var A = F[$];
                    A.left = A.x - B.x;
                    A.top = A.y - B.y;
                    A.doLayout(true, false)
                }
            }
        }
        if (!this.parent);
        this.layouted = true
    },
    getInnerHtml: function(C) {
        var B = this.getDisplayChildren(),
        $ = B.length;
        if ($) for (var _ = 0; _ < $; _++) {
            var A = B[_];
            if (!A.el) A.createHtml(A.realWidth, A.realHeight, C)
        }
    },
    
    /**
     * 初始化容器
     */
    init: function() {
        var $ = Edo.create({
            type: this.splitModel
        });
        if ($) {
        	this.addPlugin($);
        }
        Edo.containers.Container.superclass.init.call(this)
    },
    creation: function() {
        var A = new Date(),
        B = this.children,
        $ = B.length;
        if ($) for (var _ = 0; _ < $; _++) B[_].creation();
        Edo.containers.Container.superclass.creation.call(this)
    },
    doRender: function(B) {
        var D = new Date();
        if (this.el) return;
        Edo.containers.Container.superclass.doRender.call(this, B);
        if (this.children.length == 0) return;
        var G = this.id,
        _ = this.el.getElementsByTagName("*"),
        E = [];
        for (var $ = 0, F = _.length; $ < F; $++) E[E.length] = _[$];
        var C = Edo.managers.SystemManager.all;
        for ($ = 0, F = E.length; $ < F; $++) {
            var B = E[$],
            H = B.id;
            if (H && H != G) {
                var A = C[H];
                if (A) if (!A.el) A.doRender(B)
            }
        }
    },
    render: function(A) {
        if (!A) return;
        var C = new Date();
        Edo.containers.Container.superclass.render.call(this, A);
        var D = this.getDisplayChildren(),
        $ = D.length;
        if ($) for (var _ = 0; _ < $; _++) {
            var B = D[_];
            B.render(this.scrollEl)
        }
    },
    
    /**
     * 销毁这个容器
     */
    destroy: function() {
        this.created = this.rendered = this.inited = false;
        var A = this.children;
        if (A && A.length) {
            for (var $ = 0, B = A.length; $ < B; $++) {
                var _ = A[$];
                _.removeFromParent = false;
                _.destroy()
            }
            A.length = 0
        }
        this.children = null;
        Edo.util.Dom.clearEvent(this.scrollEl);
        if (this.removeFromParent !== false) Edo.util.Dom.remove(this.scrollEl);
        this.scrollEl = null;
        Edo.containers.Container.superclass.destroy.call(this)
    },
    syncScrollEl: function(B) {
        if (this.scrollEl != this.el) {
            var $ = this._getBox(),
            A = B.x - $.x - (parseInt(Edo.util.Dom.getStyle(this.scrollEl.parentNode, "borderLeftWidth")) || 0),
            _ = B.y - $.y - (parseInt(Edo.util.Dom.getStyle(this.scrollEl.parentNode, "borderTopWidth")) || 0);
            if (B.width < 0) B.width = 0;
            if (B.height < 0) B.height = 0;
            Edo.util.Dom.setStyle(this.scrollEl, {
                left: A + "px",
                top: _ + "px",
                width: B.width + "px",
                height: B.height + "px"
            })
        } else this.doScrollPolicy(this.scrollEl)
    },
    
    /**
     * 当子元素的size发生变化时 的事件处理句柄
     */
    onChildSizeChanged: function($, C) {
        if (!this.created) return;
        var B = false;
        switch (C) {
        case "width":
            if (this.width == "auto") B = true;
            break;
        case "height":
            if (this.height == "auto") B = true;
            break;
        default:
            B = true
        }
        if (B) this.relayout();
        else {
            var _ = this.realWidth,
            A = this.realHeight;
            this.measure();
            this.realWidth = _;
            this.realHeight = A;
            this.deferSyncSize()
        }
    },
    
    /**
     * 横向间距.配合horizontal,vertical布局器 
     * 默认值：5
     */
    horizontalGap: 5,
    
    /**
     * 纵向间距.配合horizontal,vertical布局器 
     * 默认值：5
     */
    verticalGap: 5,
    
    /**
     * 横向定位.配合horizontal,vertical布局器 
     * 默认值 : left (left, center, right)
     */
    horizontalAlign: "left",
    
    /**
     * 纵向向定位.配合horizontal,vertical布局器 
     * 默认值 : left (left, center, right)
     */
    verticalAlign: "top",
    
    _setHorizontalGap: function($) {
        $ = parseInt($);
        if (this.horizontalGap != $) {
            this.horizontalGap = $;
            this.relayout("horizontalGap", this.horizontalGap)
        }
    },
    _setVerticalGap: function($) {
        $ = parseInt($);
        if (this.verticalGap != $) {
            this.verticalGap = $;
            this.relayout("verticalGap", this.verticalGap)
        }
    },
    _setHorizontalAlign: function($) {
        if (this.horizontalAlign != $) {
            this.horizontalAlign = $;
            this.relayout("horizontalAlign", this.horizontalAlign)
        }
    },
    _setVerticalAlign: function($) {
        if (this.verticalAlign != $) {
            this.verticalAlign = $;
            this.relayout("verticalAlign", this.verticalAlign)
        }
    },
    selectedIndex: 0,
    _setSelectedIndex: function($) {
        $ = parseInt($);
        if (Edo.isInt($) && this.selectedIndex != $) {
            this.selectedIndex = $;
            var A = this.getChildren(),
            _ = A[$];
            A.each(function(_, A) {
                if (A == $) _._setVisible(true);
                else _._setVisible(false)
            })
        }
    },
    _toArray: function($, _) {
        if (! ($ instanceof Array)) {
            var B = String($).split(" "),
            A = [];
            A[0] = Edo.isInt(B[0]) ? parseInt(B[0]) : 0;
            A[1] = Edo.isInt(B[1]) ? parseInt(B[1]) : A[0];
            A[2] = Edo.isInt(B[2]) ? parseInt(B[2]) : A[1];
            A[3] = Edo.isInt(B[3]) ? parseInt(B[3]) : A[2];
            $ = A
        }
        return $
    },
    _checkTheSame: function($, A) {
        for (var _ = 0, B = $.length; _ < B; _++) if ($[_] != A[_]) return false;
        return true
    },
    startEdit: function() {
        var $ = Edo.containers.Container.superclass.startEdit.apply(this, arguments);
        this[this.valueField] = null;
        this.set(this.valueField, $);
        this.focus()
    },
    getEditData: function() {
        return this.get(this.valueField)
    },
    _setForm: function($) {
        this.form = this
    },
    autoMask: true,
    forForm: null,
    _setForForm: function($) {
        if (this.forForm) Edo.util.Dom.un(this.forForm, "submit", this.onFormSubmit, this);
        this.forForm = Edo.getDom($);
        Edo.util.Dom.on(this.forForm, "submit", this.onFormSubmit, this)
    },
    onFormSubmit: function($) {
        this.markForm()
    },
    setForm: function($, A) {
        if (!$) return;
        if (typeof $ == "string") {
            var B = $;
            $ = {};
            $[B] = A
        }
        var D = this.getFields();
        for (var _ = 0, E = D.length; _ < E; _++) {
            var C = D[_],
            F = C.name,
            H = $[F],
            G = {
                type: "beforesetfield",
                field: C,
                name: F,
                value: H
            };
            if (this.fireEvent("beforesetfield", G) !== false) {
                C.setValue(H);
                G.type = "setfield";
                this.fireEvent("setfield", G)
            }
        }
    },
    getForm: function(E) {
        var C = [];
        if (E) {
            var B = this.getField(E);
            C.add(B)
        } else C = this.getFields();
        var _ = {};
        for (var A = 0, D = C.length; A < D; A++) {
            var $ = C[A];
            _[$.name] = $.getValue()
        }
        return _
    },
    markForm: function() {
        var A = this.getFields();
        for (var _ = 0, B = A.length; _ < B; _++) {
            var $ = A[_];
            $.markFormValue()
        }
    },
    reset: function(D) {
        var B = [];
        if (D) {
            var A = this.getField(D);
            B.add(A)
        } else B = this.getFields();
        for (var _ = 0, C = B.length; _ < C; _++) {
            var $ = B[_];
            $.resetValue()
        }
    },
    getField: function(_) {
        var $ = Edo.getByName(_, this)[0];
        if ($ && $.componentMode == "control" && !this.isParentControl($) && $.enableForm) return $
    },
    getFields: function() {
        var B = [],
        $ = Edo.managers.SystemManager,
        A = $.all,
        D = this;
        for (var C in A) {
            var _ = A[C];
            if (_.name && _.componentMode == "control" && _.enableForm) if (!D || (D && $.isAncestor(D, _))) if (!this.isParentControl(_)) B[B.length] = _
        }
        return B
    },
    isParentControl: function($) {
        if (!$.parent) return false;
        if ($.parent.componentMode == "control") return true;
        return this.isParentControl($.parent)
    },
    valid: function(B) {
        var D = this.getFields(),
        C = true;
        for (var _ = 0, E = D.length; _ < E; _++) {
            var $ = D[_],
            A = $.valid(B);
            if (!A) {
                C = false;
                if (!B) break
            }
        }
        return C
    },
    dataType: "datatable",
    
    _setData: function($) {
        if (typeof $ === "string"){
        	$ = window[$];
        }
        if (!$){
        	$ = [];
        }
        if ($.componentMode != "data"){
        	$ = Edo.create({//Edo.build()
                type: this.dataType
            }).set("data", $);
        }
        if (this.data && this.data.un) {
            this.data.un("datachange", this._onDataChanged, this);
            this.data.un("selectionchange", this._onDataSelectionChange, this);
            this.data.un("valid", this._onDataValid, this);
            this.data.un("invalid", this._onDataInvalid, this)
        }
        this.data = $;
        this.data.on("datachange", this._onDataChanged, this);
        this.data.on("selectionchange", this._onDataSelectionChange, this);
        this.data.on("valid", this._onDataValid, this);
        this.data.on("invalid", this._onDataInvalid, this);
        if (this.rendered){
        	this._onDataChanged({
                action: "refresh"
            })
        }
    },
    _onDataSelectionChange: function($) {
        if ($.selected) this.setForm($.selected);
        else this.reset()
    },
    _onDataChanged: function(_) {
        if (_) {
            var $ = this.data.getSelected();
            if (!$) this.reset();
            switch (_.action) {
            case "resetfield":
            case "reset":
            case "update":
                if (_.record == this.data.getSelected()) this.setForm(_.record);
                break
            }
        }
    },
    _onDataValid: function(A) {
        var $ = this.data.getSelected();
        if (!$) return;
        if (A.action == "field") {
            var _ = this.getField(A.field);
            if (_) _.fireEvent("valid", {
                type: "valid",
                source: _
            })
        } else this.data.fields.each(function($) {
            var _ = this.getField($.name);
            if (_) _.fireEvent("valid", {
                type: "valid",
                source: _
            })
        },
        this)
    },
    _onDataInvalid: function(E) {
        var _ = this.data.getSelected();
        if (!_) return;
        if (E.action == "field") {
            var A = this.getField(E.field);
            if (A) A.fireEvent("invalid", {
                type: "invalid",
                source: A,
                errorMsg: E.errorMsg
            })
        } else {
            if (E.errors.length == 1) {
                var B = this.getFields();
                B.each(function($) {
                    $.fireEvent("valid", {
                        type: "valid",
                        source: $
                    })
                },
                this)
            }
            for (var $ = 0, C = E.errors.length; $ < C; $++) {
                var D = E.errors[$];
                if (D.record == _) D.fields.each(function($) {
                    var _ = this.getField($.name);
                    if (_) _.fireEvent("invalid", {
                        type: "invalid",
                        source: _,
                        errorMsg: $.errorMsg
                    })
                },
                this)
            }
        }
    },
    autoChange: false,
    onChildValueChange: function(A) {
        if (!this.data.getSelected) return;
        var $ = this.data.getSelected();
        if ($ && this.autoChange) {
            var _ = Edo.getValue($, A.name);
            if (_ !== A.value) this.data.update($, A.name, A.value)
        }
        if (this.parent && this.parent.onChildValueChange) this.parent.onChildValueChange(A)
    },
    onChildValid: function($) {
        if (this.parent && this.parent.onChildValid) this.parent.onChildValid($);
        if (this.validTimer) clearTimeout(this.validTimer);
        this._removeErrorField($);
        this.validTimer = this.tryFireValidEvent.defer(1, this, [$])
    },
    onChildInvalid: function($) {
        if (this.parent && this.parent.onChildInvalid) this.parent.onChildInvalid($);
        if (this.validTimer) clearTimeout(this.validTimer);
        this._addErrorField($);
        this.validTimer = this.tryFireValidEvent.defer(1, this, [$])
    },
    tryFireValidEvent: function(_) {
        var $ = Edo.getByProperty("forId", this.name);
        $.each(function($) {
            if ($.type == "error") $.bind($.forId)
        });
        if (this.errorFields.length > 0) this.fireEvent("invalid", {
            type: "invalid",
            source: this,
            fields: this.errorFields
        });
        else this.fireEvent("valid", {
            type: "valid",
            source: this,
            fields: null
        })
    },
    _addErrorField: function(C) {
        var _ = true;
        for (var $ = 0, B = this.errorFields.length; $ < B; $++) {
            var A = this.errorFields[$];
            if (A.field == C.source) {
                _ = false;
                break
            }
        }
        if (_) this.errorFields.add({
            field: C.source,
            errorMsg: C.errorMsg
        })
    },
    _removeErrorField: function(B) {
        for (var $ = 0, A = this.errorFields.length; $ < A; $++) {
            var _ = this.errorFields[$];
            if (_.field == B.source) {
                this.errorFields.removeAt($);
                break
            }
        }
    }
});
Edo.containers.Container.regType("container", "ct");
//Edo.containers.Container : END

Edo.layouts.AbsoluteLayout = {
    getDisplayChildren: function(B) {
        var A = [];
        for (var $ = 0, C = B.children.length; $ < C; $++) {
            var _ = B.children[$];
            if (_.visible && !_.popup) A.push(_)
        }
        return A
    },
    measure: function($) {
        return [$.realWidth, $.realHeight]
    },
    doLayout: function(D, B) {
        var L = D,
        O = L.getChildren(),
        F = O.length,
        P = B.x,
        M = B.y,
        A = B.width,
        C = B.height;
        for (var H = 0, E = O.length; H < E; H++) {
            var G = O[H],
            J = parseInt(G.left),
            _ = parseInt(G.top),
            $ = parseInt(G.right),
            K = parseInt(G.bottom);
            if (!Edo.isInt(J)) throw new Error("left必须是数值类型");
            if (!Edo.isInt(_)) throw new Error("top必须是数值类型");
            if (G.right && !Edo.isInt($)) throw new Error("right必须是数值类型");
            if (G.bottom && !Edo.isInt(K)) throw new Error("bottom必须是数值类型");
            G.x = P + J;
            G.y = M + _;
            var I = P + A - G.x,
            N = M + C - G.y;
            if ($ || $ == 0) G.realWidth = I - $;
            else if (Edo.isPercent(G.width)) G.realWidth = I * (parseFloat(G.width) / 100);
            if (K || K == 0) G.realHeight = N - K;
            else if (Edo.isPercent(G.height)) G.realHeight = N * (parseFloat(G.height) / 100);
            G.measureSize()
        }
    }
};
Edo.layouts["absolute"] = Edo.layouts.AbsoluteLayout;
Edo.layouts.HorizontalLayout = {
    getDisplayChildren: function(B) {
        var A = [];
        for (var $ = 0, C = B.children.length; $ < C; $++) {
            var _ = B.children[$];
            if (_.visible && !_.popup) A[A.length] = _
        }
        return A
    },
    measure: function(I) {
        var G = Edo.isPercent,
        D = Edo.isInt,
        K = I.getDisplayChildren(),
        C = K.length,
        H = I.width,
        J = I.height,
        B = 0;
        for (var E = 0; E < C; E++) {
            var A = K[E],
            F = I.height != "auto" && G(A.height) ? A.defaultHeight: A.realHeight;
            if (F < A.minHeight) F = A.minHeight;
            B = B > F ? B: F
        }
        var $ = 0;
        for (E = 0; E < C; E++) {
            var A = K[E],
            _ = I.width != "auto" && G(A.width) ? A.defaultWidth: A.realWidth;
            if (_ < A.minWidth) _ = A.minWidth;
            $ += I.horizontalGap + _
        }
        $ -= I.horizontalGap;
        I._childrenMinWidth = $;
        I._childrenMinHeight = B;
        if (!D(I.height)) {
            B = B > I.defaultHeight ? B: I.defaultHeight;
            J = B
        }
        if (!D(I.width)) {
            H = $;
            H = H > I.defaultWidth ? H: I.defaultWidth
        }
        I.horizontalOffset = 0;
        I.verticalOffset = 0;
        if (I.width == "auto" && I.verticalScrollPolicy == "auto" && D(I.height)) if (I.getLayoutBox().height < I._childrenMinHeight) I.horizontalOffset = 17;
        if (I.height == "auto" && I.horizontalScrollPolicy == "auto" && D(I.width)) if (I.getLayoutBox().width < I._childrenMinWidth) I.verticalOffset = 17;
        if (I.horizontalScrollPolicy == "on") I.verticalOffset = 17;
        else if (I.horizontalScrollPolicy == "off") I.verticalOffset = 0;
        if (I.verticalScrollPolicy == "on") I.horizontalOffset = 17;
        else if (I.verticalScrollPolicy == "off") I.horizontalOffset = 0;
        H += I.horizontalOffset;
        J += I.verticalOffset;
        return [H, J]
    },
    doLayout: function(N, D) {
        var M = Edo.isPercent;
        N.verticalGap = parseInt(N.verticalGap) || 0;
        N.horizontalGap = parseInt(N.horizontalGap) || 0;
        if (N.scrollEl) {
            D.x -= (N.scrollEl.scrollLeft || 0);
            D.y -= (N.scrollEl.scrollTop || 0)
        }
        if (N.horizontalScrollPolicy == "on") D.height -= 17;
        else if (N.width != "auto" && N.horizontalScrollPolicy == "auto") if (N._childrenMinWidth > D.width) D.height -= 17;
        if (N.verticalScrollPolicy == "on") D.width -= 17;
        else if (N.height != "auto" && N.verticalScrollPolicy == "auto") if (N._childrenMinHeight > D.height) D.width -= 17;
        var U = N.getDisplayChildren(),
        I = U.length,
        R = D.width,
        O = D.height,
        G = [],
        _ = 0,
        E = D.width;
        for (var K = 0; K < I; K++) {
            var F = U[K];
            if (M(F.width)) G.push(F);
            else E -= F.realWidth
        }
        R = E - (I - 1) * N.horizontalGap;
        function P() {
            _ = 0;
            for (var $ = 0; $ < G.length; $++) {
                var A = G[$];
                _ += parseFloat(A.width)
            }
            for ($ = 0; $ < G.length; $++) {
                A = G[$];
                if (_ > 100) A.__layoutPercent = parseFloat(A.width) / _;
                else A.__layoutPercent = parseFloat(A.width) / 100
            }
        }
        P(G);
        var T = D.x,
        Q = D.y,
        A = D.width,
        C = D.height,
        $ = allChildHeight = 0;
        for (K = 0; K < I; K++) {
            var H = U[K];
            if (M(H.width)) {
                var L = R * H.__layoutPercent;
                H.realWidth = L
            }
            if (M(H.height)) {
                var S = O * parseFloat(H.height) / 100;
                H.realHeight = S
            }
            H.x = T;
            H.y = Q;
            T += N.horizontalGap + H.realWidth;
            $ += H.realWidth;
            allChildHeight += H.realHeight
        }
        N.allChildWidth = $ + N.horizontalGap * (I - 1);
        N.allChildHeight = allChildHeight + N.verticalGap * (I - 1);
        var J = D.x + D.width - (T - N.horizontalGap),
        B = D.y + D.height - (Q - N.verticalGap);
        if (N.horizontalAlign == "left") J = 0;
        else if (N.horizontalAlign == "center") J = J / 2;
        T = D.x,
        Q = D.y;
        for (K = 0; K < I; K++) {
            H = U[K];
            H.x += J;
            if (N.verticalAlign == "top") B = Q;
            else if (N.verticalAlign == "middle") B = Q + C / 2 - H.realHeight / 2;
            else B = Q + C - H.realHeight;
            H.y = B
        }
    }
};
Edo.layouts["horizontal"] = Edo.layouts.HorizontalLayout;
Edo.layouts.VerticalLayout = {
    getDisplayChildren: function(B) {
        var A = [];
        for (var $ = 0, C = B.children.length; $ < C; $++) {
            var _ = B.children[$];
            if (_.visible && !_.popup) A[A.length] = _
        }
        return A
    },
    measure: function(H) {
        var F = Edo.isPercent,
        D = Edo.isInt,
        J = H.getDisplayChildren(),
        B = J.length,
        G = H.width,
        I = H.height,
        K = 0;
        for (var E = 0; E < B; E++) {
            var $ = J[E],
            _ = H.width != "auto" && F($.width) ? $.defaultWidth: $.realWidth;
            if (_ < $.minWidth) _ = $.minWidth;
            K = K > _ ? K: _
        }
        var A = 0;
        for (E = 0; E < B; E++) {
            var $ = J[E],
            C = H.height != "auto" && F($.height) ? $.defaultHeight: $.realHeight;
            if (C < $.minHeight) C = $.minHeight;
            A += H.verticalGap + C
        }
        A -= H.verticalGap;
        H._childrenMinWidth = K;
        H._childrenMinHeight = A;
        if (!D(H.width)) {
            K = K > H.defaultWidth ? K: H.defaultWidth;
            G = K
        }
        if (!D(H.height)) {
            I = A;
            I = I > H.defaultHeight ? I: H.defaultHeight
        }
        H.horizontalOffset = 0;
        H.verticalOffset = 0;
        if (H.width == "auto" && H.verticalScrollPolicy == "auto" && D(H.height)) if (H.getLayoutBox().height < H._childrenMinHeight) H.horizontalOffset = 17;
        if (H.height == "auto" && H.horizontalScrollPolicy == "auto" && D(H.width)) if (H.getLayoutBox().width < H._childrenMinWidth) H.verticalOffset = 17;
        if (H.horizontalScrollPolicy == "on") H.verticalOffset = 17;
        else if (H.horizontalScrollPolicy == "off") H.verticalOffset = 0;
        if (H.verticalScrollPolicy == "on") H.horizontalOffset = 17;
        else if (H.verticalScrollPolicy == "off") H.horizontalOffset = 0;
        G += H.horizontalOffset;
        I += H.verticalOffset;
        return [G, I]
    },
    doLayout: function(N, D) {
        var M = Edo.isPercent;
        if (N.scrollEl) {
            D.x -= (N.scrollEl.scrollLeft || 0);
            D.y -= (N.scrollEl.scrollTop || 0)
        }
        if (N.horizontalScrollPolicy == "on") D.height -= 17;
        else if (N.width != "auto" && N.horizontalScrollPolicy == "auto") if (N._childrenMinWidth > D.width) D.height -= 17;
        if (N.verticalScrollPolicy == "on") D.width -= 17;
        else if (N.height != "auto" && N.verticalScrollPolicy == "auto") if (N._childrenMinHeight > D.height) D.width -= 17;
        var U = N.getDisplayChildren(),
        H = U.length,
        R = D.width,
        O = D.height,
        F = [],
        _ = 0,
        J = D.height;
        for (var K = 0; K < H; K++) {
            var E = U[K];
            if (M(E.height)) F[F.length] = E;
            else J -= E.realHeight
        }
        O = J - (H - 1) * N.verticalGap;
        function P() {
            _ = 0;
            for (var $ = 0; $ < F.length; $++) {
                var A = F[$];
                _ += parseFloat(A.height)
            }
            for ($ = 0; $ < F.length; $++) {
                A = F[$];
                if (_ > 100) A.__layoutPercent = parseFloat(A.height) / _;
                else A.__layoutPercent = parseFloat(A.height) / 100
            }
        }
        P();
        var T = D.x,
        Q = D.y,
        A = D.width,
        C = D.height,
        $ = allChildHeight = 0;
        for (K = 0; K < H; K++) {
            var G = U[K];
            if (M(G.width)) {
                var L = R * parseFloat(G.width) / 100;
                G.realWidth = L
            }
            if (M(G.height)) {
                var S = O * G.__layoutPercent;
                G.realHeight = S
            }
            G.x = T;
            G.y = Q;
            Q += N.verticalGap + G.realHeight;
            $ += G.realWidth;
            allChildHeight += G.realHeight
        }
        N.allChildWidth = $ + N.horizontalGap * (H - 1);
        N.allChildHeight = allChildHeight + N.verticalGap * (H - 1);
        var I = D.x + D.width - (T - N.horizontalGap),
        B = D.y + D.height - (Q - N.verticalGap);
        if (N.verticalAlign == "top") B = 0;
        else if (N.verticalAlign == "middle") B = B / 2;
        T = D.x,
        Q = D.y;
        for (K = 0; K < H; K++) {
            G = U[K];
            G.y += B;
            if (N.horizontalAlign == "left") I = T;
            else if (N.horizontalAlign == "center") I = T + A / 2 - G.realWidth / 2;
            else I = T + A - G.realWidth;
            G.x = I
        }
    }
};
Edo.layouts["vertical"] = Edo.layouts.VerticalLayout;
Edo.layouts.ViewStackLayout = {
    getDisplayChildren: function(A) {
        var _ = [],
        $ = A.children[A.selectedIndex];
        if ($) _.push($);
        return _
    },
    measure: function(B) {
        var A = B.children[B.selectedIndex] || {},
        $ = A.realWidth || 0,
        _ = A.realHeight || 0;
        return [$ > B.realWidth ? $: B.realWidth, _ > B.realHeight ? _: B.realHeight]
    },
    doLayout: function(B, A) {
        var C = B.getChildren(),
        $ = B.selectedIndex,
        _ = B.children[$];
        C.each(function(_, B) {
            _.x = A.x;
            _.y = A.y;
            if (B == $) {
                if (_.el) _.el.style.display = "block"
            } else if (_.el) _.el.style.display = "none"
        });
        _.xySet = true;
        if (Edo.isPercent(_.width)) _.realWidth = A.width * parseFloat(_.width) / 100;
        if (Edo.isPercent(_.height)) _.realHeight = A.height * parseFloat(_.height) / 100;
        _.measureSize()
    }
};
Edo.layouts["viewstack"] = Edo.layouts.ViewStackLayout;

/**
 * 列表组件
 * 
 * TypeName:	dataview
 * Namespace:	Edo.controls
 * ClassName:	DataView
 * Extend:	Edo.controls.Control
 */
Edo.controls.DataView = function() {
    Edo.controls.DataView.superclass.constructor.call(this);
    this.selecteds = [];
    this._setData([])
};
Edo.controls.DataView.extend(Edo.controls.Control, {
	/**
	 * 数据对象
	 * 
	 * @var {DataTable}
	 */
    data: null,
    
    /**
     * 默认宽度 默认值 ：100
     * 
     * @var {Number}
     */
    defaultWidth: 100,
    
    /**
     * 默认高度 默认值 ：50
     * 
     * @var {Number}
     */
    defaultHeight: 50,
    loading: false,
    loadingText: "",
    emptyText: "",
    itemSelector: "e-dataview-item",
    
    /**
     * 列表项的CSS class名称
     * 
     * @var {String}
     */
    itemCls: "e-dataview-item",
    elCls: "e-dataview",
    
    /**
     * 默认值 : auto 竖向滚动条
     * 
     * @var {String}
     */
    verticalScrollPolicy: "auto",
    
    /**
     * 默认值 : auto 横向滚动条
     * 
     * @var {String}
     */
    horizontalScrollPolicy: "auto",
    
    /**
     * 默认值 : false 选择模式.true简单选择; false 复杂选择.支持ctrl等选择,默认是复杂
     * 
     * @var {Boolean}
     */
    simpleSelect: false,
    
    /**
     * 默认值 : false 是否支持多选
     * 
     * @var {Boolean}
     */
    multiSelect: false,
    
    /**
     * 默认值 : true 是否可以选择
     * 
     * @var {Boolean}
     */
    enableSelect: true,
    
    /**
     * 默认值 : true 是否可以重复选择
     * 
     * @var {Boolean}
     */
    repeatSelect: true,
    selectOnly: true,
    
    /**
     * 默认值 : itemmousedown 选择操作的激发事件
     * 
     * @var {String}
     */
    selectAction: "itemmousedown",
    overCls: "e-dataview-item-over",
    selectedCls: "e-dataview-item-selected",
    
    /**
     * 是否启用鼠标经过列表,给item添加overCls的css class 默认值 : false
     * 
     * @var {Boolean}
     */
    enableTrackOver: false,
    tpl: "<%var data = this.data.view; %><%for(var i=0,l=data.length; i<l; i++){ %>    <%var o = data[i]; %>    <%=this.getItemHtml(o, i)%><%} %>",
    itemTpl: null,
    selectModel: "RowSelect",
    dragDropModel: "RowDragDrop",
    dragDropAction: "move",
    
    /**
     * 默认值 : false 是否允许行拖拽投放
     * 
     * @var {Boolean}
     */
    enableDragDrop: false,
    outRemoveFocus: true,
    _focusItem: null,
    
    /**
     * 值字段名称 默认值 : value
     * 
     * @var {String}
     */
    valueField: "value",
    defaultValue: "",
    delimiter: ",",
    set: function($, _) {
        if (!$) return;
        if (typeof $ === "string") {
            var A = $;
            $ = {};
            $[A] = _
        }
        if ($.data) {
            this._setData($.data);
            delete $.data
        }
        return Edo.controls.DataView.superclass.set.call(this, $)
    },
    _setValue: function($) {
        this.setValue($)
    },
    setValue: function(_) {
        if (!Edo.isValue(_)) _ = [];
        if (typeof _ == "string") _ = _.split(this.delimiter);
        if (! (_ instanceof Array)) _ = [_];
        var $ = this.fireSelection;
        if (_.length > 0) this.fireSelection = false;
        this.clearSelect();
        if (!this.multiSelect) _ = [_[_.length - 1]];
        var A = [];
        _.each(function(B) {
            var $ = {};
            $[this.valueField] = B;
            var _ = this.data.find($);
            if (_) A.add(_)
        },
        this);
        this.fireSelection = $;
        this.selectRange(A, false)
    },
    getValue: function() {
        var $ = [];
        this.selecteds.each(function(_) {
            if (this.valueField == "*") $.add(_);
            else $.add(_[this.valueField])
        },
        this);
        return $.join(this.delimiter)
    },
    createChildren: function($) {
        Edo.controls.DataView.superclass.createChildren.call(this, $);
        this.scrollEl = this.viewport = this.el;
        this.ctEl = this.viewport
    },
    init: function() {
        var $ = Edo.create({
            type: this.dragDropModel
        });
        if ($) this.addPlugin($);
        $ = Edo.create({
            type: this.selectModel
        });
        if ($) this.addPlugin($);
        $ = new Edo.plugins.TableKeyboard();
        if ($) this.addPlugin($);
        Edo.controls.DataView.superclass.init.call(this)
    },
    initEvents: function() {
        this.on("click", this._onClick, this);
        this.on("mousedown", this._onMouseDown, this);
        this.on("dblclick", this._onDblClick, this);
        this.on("mousemove", this._onMouseMove, this);
        this.on("mouseout", this._onMouseOut, this);
        Edo.controls.DataView.superclass.initEvents.call(this)
    },
    getViewportBox: function() {
        return Edo.util.Dom.getBox(this.viewport)
    },
    getCtEl: function() {
        return this.ctEl
    },
    getItemElByChild: function($) {
        var _ = typeof this.itemSelector;
        if (_ == "string") return Edo.util.Dom.findParent($, this.itemSelector, 20);
        else if (_ == "function") return this.itemSelector($)
    },
    getItemEl: function(_) {
        _ = this.getRecord(_);
        var $ = Edo.getDom(this.createItemId(_));
        return $
    },
    addItemCls: function($, A) {
        var _ = this.getItemEl($);
        if (_) Edo.util.Dom.addClass(_, A)
    },
    getItemBox: function(_) {
        var $ = this.getItemEl(_);
        return Edo.util.Dom.getBox($)
    },
    getItems: function() {
        if (!this._items) this._items = Edo.util.Dom.getsbyClass(this.itemSelector, this.el);
        return this._items
    },
    getItemIndex: function($) {
        var _ = this.getItems();
        return _.indexOf($)
    },
    getByIndex: function($) {
        var _ = this.getItems();
        return _[$]
    },
    _onClick: function(_) {
        var $ = this.fireItemEvent(_, "click")
    },
    _onDblClick: function($) {
        this.fireItemEvent($, "dblclick")
    },
    _onMouseDown: function($) {
        this.fireItemEvent($, "mousedown");
        this.focus()
    },
    focus: function() {
        if (!this.focusElement){
        	this.focusElement = Edo.util.Dom.append(this.el, "<a class=\"e-focus\" href=\"#\"></a>");
        }
        var _focusElement = this.focusElement;
        try {
            setTimeout(function() {
                try {
                    _focusElement.focus()
                } catch(_) {}
            },100);
        } catch(_) {}
    },
    _onMouseMove: function($) {
        var $ = this.fireItemEvent($, "mousemove");
        if ($.within(this.viewport) && $.item) this.focusItem($.item)
    },
    _onMouseOut: function($) {
        if (this.outRemoveFocus) this.blurItem(this._focusItem)
    },
    getRecordByEvent: function(_) {
        var $ = this.getItemElByChild(_.target);
        if ($) return this.data.getById(this.getItemId($.id))
    },
    fireItemEvent: function(A, _) {
        var $ = this.getRecordByEvent(A);
        if ($) {
            _ = "item" + _;
            A = Edo.apply(A, {
                type: _,
                source: this,
                item: $
            });
            this.fireEvent(_, A)
        }
        return A
    },
    enableScrollIntoView: true,
    focusItem: function(_) {
        if (!this.enableTrackOver) return;
        _ = this.getRecord(_);
        if (!_) return;
        if (_ == this._focusItem) return;
        this.blurItem(this._focusItem);
        var $ = this.getItemEl(_);
        if ($) Edo.util.Dom.addClass($, this.overCls);
        if (this.enableScrollIntoView) this.scrollIntoView(_);
        this._focusItem = _
    },
    scrollIntoView: function(_) {
        var $ = this.getItemEl(_);
        if ($) Edo.util.Dom.scrollIntoView($, this.scrollEl, false)
    },
    blurItem: function(A) {
        A = this.getRecord(A);
        var B = A ? [this.getItemEl(A)] : this.getItems();
        for (var _ = 0, C = B.length; _ < C; _++) {
            var $ = this.getItemEl(B[_]);
            if ($) Edo.util.Dom.removeClass($, this.overCls)
        }
        this._focusItem = null
    },
    getFocusItem: function() {
        return this._focusItem
    },
    getRecord: function($) {
        var _ = Edo.type($);
        if (_ == "number"){
        	$ = this.data.getAt($);
        }else if (_ == "string"){
        	$ = this.data.getById($);
        }else if (_ == "element"){
        	$ = this.data.getById(this.getItemId($.id));
        }
        return $
    },
    checkSelecteds: function() {
        for (var _ = this.selecteds.length - 1; _ >= 0; _--) {
            var $ = this.selecteds[_];
            if (!this.data.source.contains($)) this.selecteds.removeAt(_)
        }
    },
    isSelected: function($) {
        return this.selecteds.contains($)
    },
    getSelected: function() {
        return this.selecteds[this.selecteds.length - 1]
    },
    getSelecteds: function() {
        return this.selecteds.clone()
    },
    doDeselect: function($) {
        $.each(function(_) {
            var $ = Edo.getDom(this.createItemId(_));
            if ($) Edo.util.Dom.removeClass($, this.selectedCls)
        },
        this)
    },
    doSelect: function(A) {
        A.each(function(_) {
            var $ = Edo.getDom(this.createItemId(_));
            if ($) Edo.util.Dom.addClass($, this.selectedCls)
        },
        this);
        if (A.length > 0) var _ = A[A.length - 1],
        $ = Edo.getDom(this.createItemId(_))
    },
    select: function($) {
        $ = this.getRecord($);
        if (!$ || $.enableSelect === false) return false;
        var _ = this.isSelected($);
        if (_ && !this.repeatSelect) return true;
        if (this.fireSelection !== false) if (this.fireEvent("beforeselectionchange", {
            type: "beforeselectionchange",
            source: this,
            selected: $
        }) === false) return false;
        if (!this.multiSelect) {
            this.doDeselect(this.selecteds);
            this.selecteds = []
        }
        if (!this.isSelected($)) this.selecteds.add($);
        this.selected = this.getSelected();
        if (this.fireSelection !== false) {
            this.fireEvent("selectionchange", {
                type: "selectionchange",
                source: this,
                selected: this.selected
            });
            this.data.select(this.selected);
            this.doSelect(this.selecteds);
            this.changeProperty("value", this.getValue(), true)
        }
        this.afterSelect();
        this._focusItem = null;
        return true
    },
    deselect: function($) {
        $ = this.getRecord($);
        if (!$) return false;
        if (!this.isSelected($)) return false;
        if (this.fireSelection !== false) if (this.fireEvent("beforeselectionchange", {
            type: "beforeselectionchange",
            source: this,
            selected: this.selected,
            deselected: $
        }) === false) return false;
        this.selecteds.remove($);
        this.doDeselect([$]);
        this.selected = this.getSelected();
        if (this.fireSelection !== false) {
            this.fireEvent("selectionchange", {
                type: "selectionchange",
                source: this,
                selected: this.selected
            });
            this.data.select(this.selected);
            this.changeProperty("value", this.getValue(), true)
        }
        this.afterSelect();
        this._focusItem = null;
        return true
    },
    afterSelect: function() {},
    selectRange: function(C, $) {
        var B = this.fireSelection;
        this.fireSelection = false;
        if ($ === false) this.clearSelect();
        if (! (C instanceof Array)) C = [C];
        for (var A = 0, D = C.length; A < D; A++) {
            var _ = C[A];
            if (A == D - 1) this.fireSelection = B;
            this.select(_)
        }
        this.fireSelection = B
    },
    deselectRange: function(A) {
        var _ = this.fireSelection;
        for (var $ = 0, B = A.length; $ < B; $++) {
            if ($ == 0) this.fireSelection = false;
            if ($ == B - 1) this.fireSelection = _;
            this.deselect(A[$])
        }
        this.fireSelection = _
    },
    clearSelect: function() {
        this.deselectRange(this.selecteds.clone())
    },
    _setData: function($) {
        if (typeof $ === "string") $ = window[$];
        if (!$) $ = [];
        if ($.componentMode != "data") if (!this.data) $ = new Edo.data.DataTable($);
        else {
            this.data.load($);
            return
        }
        if (this.data && this.data.un) {
            this.data.un("datachange", this._onDataChanged, this);
            this.data.un("selectionchange", this._onDataSelectionChange, this);
            this.data.un("valid", this._onDataValid, this);
            this.data.un("invalid", this._onDataInvalid, this)
        }
        this.data = $;
        this.data.on("datachange", this._onDataChanged, this);
        this.data.on("selectionchange", this._onDataSelectionChange, this);
        this.data.on("valid", this._onDataValid, this);
        this.data.on("invalid", this._onDataInvalid, this);
        if (this.rendered) this._onDataChanged({
            action: "refresh"
        })
    },
    _onDataValid: function($) {},
    _onDataInvalid: function($) {},
    _onDataSelectionChange: function($) {
        if ($.selected) {
            if (this.isSelected($.selected)) return;
            this.selectRange($.selected, false)
        } else this.clearSelect()
    },
    enableDeferRefresh: true,
    _onDataChanged: function($) {
        this.checkSelecteds();
        if ($) switch ($.action) {
        case "add":
            this.insertItem($.index, $.records, $);
            break;
        case "remove":
            this.removeItem($.records, $);
            break;
        case "resetfield":
        case "reset":
        case "update":
            this.replaceItem([$.record], $);
            break;
        case "move":
            this.moveItem($.index, $.records, $);
            break;
        case "clear":
        case "load":
        case "refresh":
            this.clearSelect();
        case "filter":
        case "sort":
            if (this.enableDeferRefresh) this.deferRefresh();
            else this.refresh();
            break
        }
        this._items = null;
        this.doSelect(this.selecteds);
        this.fixAutoSize();
        this.relayout("datachange")
    },
    createItemId: function($) {
        return $ ? this.id + "$" + $.__id: null
    },
    getItemId: function($) {
        if ($) return $.split("$")[1]
    },
    deferRefresh: function() {
        if (this.changeTimer) {
            clearTimeout(this.changeTimer);
            this.changeTimer = null
        }
        this.changeTimer = this.refresh.defer(1, this, arguments)
    },
    refresh: function() {
        if (this.el) {
            this.fixAutoSize();
            this.viewport.innerHTML = this.createView();
            this._items = null
        }
        this.fireEvent("refresh", {
            type: "refresh",
            source: this
        });
        this.doSelect(this.selecteds)
    },
    createView: function() {
        var $ = "";
        if (this.loading) $ = this.loadingText;
        else if (!this.data || this.data.getCount() == 0) $ = this.emptyText;
        else if (this.tpl) {
            if (typeof this.tpl === "string") this.tpl = new Edo.util.Template(this.tpl);
            $ = this.tpl.run(this)
        }
        return $
    },
    getInnerHtml: function($) {
        $[$.length] = this.createView()
    },
    _setTpl: function($) {
        if (typeof $ === "string") $ = new Edo.util.Template($);
        this.tpl = $
    },
    _setItemTpl: function($) {
        if (typeof $ === "string") $ = new Edo.util.Template($);
        this.itemTpl = $
    },
    getItemHtml: function(_, $) {
        this.item = _;
        this.index = $;
        this.itemId = this.createItemId(_);
        var A = this.itemTpl.run(this);
        delete this.item;
        delete this.index;
        return A
    },
    insertItem: function($, A) {
        var B = this.getItems()[$];
        for (var _ = 0, C = A.length; _ < C; _++) {
            var D = this.getItemHtml(A[_], $ + _);
            if (B) Edo.util.Dom.before(B, D);
            else Edo.util.Dom.append(this.getCtEl(), D)
        }
    },
    removeItem: function(A) {
        for (var _ = 0, B = A.length; _ < B; _++) {
            var $ = this.getItemEl(A[_]);
            Edo.removeNode($)
        }
    },
    replaceItem: function(C) {
        for (var B = 0, D = C.length; B < D; B++) {
            var A = C[B];
            if (!A) continue;
            var _ = this.getItemEl(A);
            if (!_) continue;
            var $ = this.data.indexOf(A),
            E = this.getItemHtml(A, $);
            Edo.util.Dom.after(_, E);
            Edo.removeNode(_)
        }
    },
    moveItem: function(_, D) {
        var E = this.data.getAt(_),
        F = this.getItemEl(E);
        for (var C = 0, G = D.length; C < G; C++) {
            var B = D[C],
            A = this.data.indexOf(B),
            $ = Edo.getDom(this.createItemId(B));
            if (!$) continue;
            if (F) Edo.util.Dom.before(F, $);
            else Edo.util.Dom.append(this.getCtEl(), $)
        }
    },
    destroy: function() {
        this.data.un("datachanged", this._onDataChanged, this);
        Edo.controls.DataView.superclass.destroy.call(this);
    }
});
Edo.controls.DataView.regType("dataview");
Edo.controls.DataView.prototype.viewRow = Edo.controls.DataView.prototype.focusItem;
//Edo.controls.DataView : END

/**
 * 表格Body类,用来组装Table的HTML
 * 
 * @param table {Table/Tree}
 * Namespace:	Edo.lists
 * ClassName:	TableBody
 * Extend:	Edo.core.Component
 */
Edo.lists.TableBody = function(table) {
    Edo.lists.TableBody.superclass.constructor.call(this);
    this.table = table;
};
Edo.lists.TableBody.extend(Edo.core.Component, {
	/**
	 * 渲染/创建TableBody的HTML字符串
	 * 
	 * @param startRow : {Number}
	 * @param startColum : {Number}
	 * @param endRow : {Number}
	 * @param endColumn : {Number}
	 * @param
	 * @return tableHtml : {String} 
	 */
    _createView: function(startRow, startColumn, endRow, endColumn, C) {
        var _tb = this.table;
        if (startRow < 0){
        	startRow = 0;
        }
        if (startColumn < 0){
        	startColumn = 0;
        }
        if (endRow < 0 || endRow >= _tb.data.getCount()){
        	endRow = _tb.data.getCount() - 1;
        }
        if (endColumn < 0 || endColumn >= _tb.columns.length){
        	endColumn = _tb.columns.length - 1;
        }
        _tb.startColumn = startColumn;
        _tb.endColumn = endColumn;
        var _tb_data = _tb.data,
        
        /**
         * 数据视图(如过滤/排序/折叠后的数据视图)
         * 
         * @var {Array}
         */
        _dt_view = _tb_data[_tb.dataViewField],
        _tb_columns = _tb.columns,
        _tb_html = [],
        A = 0;
        _tb.selectHash = {};
        _tb.selecteds.each(function(_dt_view) {
            _tb.selectHash[_dt_view.__id] = 1
        });
        _tb.cellSelectHash = {};
        _tb.cellSelecteds.each(function(_dt_view) {
            _tb.cellSelectHash[_dt_view.record.__id + _dt_view.column.id] = 1
        });
        _tb_html[_tb_html.length] = "<table class=\"e-table-table\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\"><tbody>";
        for (var rowNumber = startRow; rowNumber <= endRow; rowNumber++) {
            var _vw_item = _dt_view[rowNumber];
            _tb.getItemHtml(_vw_item, rowNumber, _tb_html)
        }
        _tb_html[_tb_html.length] = "</tbody></table>";
        if (_dt_view.length == 0){
        	_tb_html[_tb_html.length] = "<div style=\"width:" + _tb.getColumnAllWidth() + "px;height:1px;overflow:hidden;\"></div>";
        }
        return _tb_html.join("");
    }
});

/**
 * 表格Header类,用来组装TableHeader的HTML
 * 
 * @param table {Table/Tree}
 * Namespace:	Edo.lists
 * ClassName:	TableHeader
 * Extend:	Edo.core.Component
 */
Edo.lists.TableHeader = function(table) {
    Edo.lists.TableHeader.superclass.constructor.call(this);
    this.table = table;
};
Edo.lists.TableHeader.extend(Edo.core.Component, {
    _createView: function(startColumn, endColumn) {
        var _tb = this.table;
        if (startColumn < 0){
        	startColumn = 0;
        }
        if (endColumn < 0 || endColumn >= _tb.columns.length){
        	endColumn = _tb.columns.length - 1;
        }
        var _tb_groupColumns = _tb.groupColumns,
        _tb_id = _tb.id,
        _tb_hd_width = _tb.getColumnAllWidth() + 1000;
        
        function _(A, $) {
            var _ = "";
            if ($.sortDir){
            	 if (isIE || isSafari){
            		 _ = "&nbsp;&nbsp;&nbsp;";
            	 }else{
            		 _ = "&nbsp;&nbsp;";
            	 }
            }
            if (!A && A !== 0){
            	A = "&nbsp;";
            }
            return "<div class=\"e-table-header-cell-inner " + ($.sortDir ? "e-table-sort-icon": "") + "\" style=\"overflow:hidden;line-height:" + $.height + "px;font-size:12px;white-space: nowrap;\">" + A + _ + "</div>"
        }
        
        var _tb_hd_html = "<div class=\"e-table-header-row\" style=\"overflow:hidden;width:" + _tb_hd_width + "px;height:" + ((_tb.columnDepth + 1) * _tb.columnHeight) + "px;\">",
        G = [];
        
        function $(K, J, D) {
            for (var C = 0, L = K.length; C < L; C++) {
                var I = K[C];
                if (I.visible === false){
                	continue;
                }
                var F = I.width,
                M = I.columns && I.columns.length > 0,
                B = M ? _tb.columnHeight: (_tb.columnDepth - I.depth + 1) * _tb.columnHeight;
                I.height = B;
                var A = "";
                if (I.sortDir == "asc") A = "e-table-sort-desc";
                else if (I.sortDir == "desc") A = "e-table-sort-asc";
                G[G.length] = "<div id=" + (_tb_id + "|" + I.id) + " class=\"e-table-cell " + _tb.headerCellCls + " " + (A) + " " + (I.headerCls || "") + "\" style=\"text-align:";
                G[G.length] = I.headerAlign || "left";
                G[G.length] = ";position:absolute;left:";
                G[G.length] = J + "px;top:";
                G[G.length] = D + "px;width:";
                G[G.length] = F + "px;height:";
                G[G.length] = B;
                G[G.length] = "px;";
                G[G.length] = "\">";
                var N = typeof(I.header) === "function" ? I.header(I, _tb.data, _tb) : _(I.header, I);
                G[G.length] = Edo.isValue(N) ? N: "&nbsp;";
                G[G.length] = "</div>";
                if (M) $(I.columns, J, D + _tb.columnHeight);
                J += F;
                if (I.enableResize !== false && !M) G[G.length] = "<div id=\"split|" + I.id + "\" class=\"e-table-split\" style=\"left:" + (J - 2) + "px;top:" + D + "px;\">&nbsp;</div>"
            }
        }
        
        var B = isBorderBox ? 1: -1;
        $(_tb_groupColumns, B, 0);
        _tb_hd_html += G.join("") + "</div>";
        return _tb_hd_html;
    }
});

/**
 * 表格Footer类,用来组装TableFooter的HTML
 * 
 * @param table {Table/Tree}
 * Namespace:	Edo.lists
 * ClassName:	TableFooter
 * Extend:	Edo.core.Component
 */
Edo.lists.TableFooter = function(table) {
    Edo.lists.TableFooter.superclass.constructor.call(this);
    this.table = table;
};
Edo.lists.TableFooter.extend(Edo.core.Component, {
    _createView: function($, B) {
        var _ = this.table,
        A = [];
        return A.join("");
    }
});

/**
 * table表格组件
 * 
 * TypeName:	table
 * Namespace:	Edo.lists
 * ClassName:	Table
 * Extend:	Edo.controls.DataView
 */
Edo.lists.Table = function() {
    Edo.lists.Table.superclass.constructor.call(this);
    
    /**
     * 列配置
     * 
     * @example
     * [
     *     {
     *           header: '姓名',         //表头列显示的文本内容
     *           headerAlign: 'center',  //表头列内容定位:left/center/right
     *           dataIndex: 'name',      //单元格映射的行对象属性
     *           width:  100,            //列的宽度
     *           minWidth: 50,           //列的最小宽度
     *           enableSort: false,      //是否允许此列排序
     *           enableMove: true,       //是否允许此列拖拽移位
     *           enableResize: true,     //是否允许此列拖拽调节宽度
     *                                   //单元格渲染器
     *           renderer: function(value, record, column, rowIndex, data, table){                    
     *               //value: 单元格值。对应row[dataIndex]
     *               //record:  行对象。是data对象的一个元素
     *               //column: 列对象。就是具有"header、headerAlign、dataIndex..."的列对象。
     *               //rowIndex: 行索引号
     *               //data: 表格的数据对象Edo.data.Table
     *               //table: 表格对象Edo.lists.Table
     *               
     *               return "";  //返回此单元格显示的HTML内容(一般根据value和row的内容进行组织)
     *           },
     *           editor: {       //单元格编辑器:适合所有从Edo.core.UIComponent派生的组件类
     *               type: 'text'
     *           },
     *           valid: function(value, record, column, rowIndex, data, table){                    
     *               //返回true则验证通过
     *               //返回false, 使用默认错误描述
     *               //返回字符串, 则是错误描述
     *           }
     *       },
     *       //...
     *   ]
     * @var {Array}
     */
    this.columns = [];
    this.cellSelecteds = [];
    this.invalidCells = {};
    this.defaultValue = []
};
Edo.lists.Table.extend(Edo.controls.DataView, {
    dataViewField: "view",
    startColumn: 0,
    endColumn: -2,
    startRow: 0,
    endRow: -2,
    enableRowCls: true,
    
    /**
     * 默认值 : false 是否应用斑马纹样式stripeCls
     * 
     * @var {Boolean}
     */
    enableStripe: false,
    
    /**
     * 默认值 : e-table-stripe 斑马纹样式
     * 
     * @var {String}
     */
    stripeCls: "e-table-stripe",
    
    overCls: "e-table-row-over",
    
    /**
     * 选中一行 添加的css class
     * 
     * @var {String}
     */
    selectedCls: "e-table-row-selected",
    
    /**
     * 一行默认的css class
     * 
     * @var {String}
     */
    itemCls: "e-table-row",
    
    itemSelector: "e-table-row",
    
    /**
     * 单元格的css class
     * 
     * @var {String}
     */
    cellCls: "e-table-cell",
    
    /**
     * 单元格选中的css class
     * 
     * @var {String}
     */
    cellSelectedCls: "e-table-cell-selected",
    
    /**
     * 单元格编辑痕迹的css class
     * 
     * @var {String}
     */
    cellDirtyCls: "e-table-cell-dirty",
    
    /**
     * 表格头单元格的css class
     * 
     * @var {String}
     */
    headerCellCls: "e-table-header-cell",
    
    /**
     * Table组件的 css class
     * 
     * @var {String}
     */
    elCls: "e-table e-dataview e-div",
    
    scrolloffset: 18,
    
    /**
     * 默认值 : auto 竖向滚动条
     * 
     * @var {String}
     */
    verticalScrollPolicy: "auto",
    
    /**
     * 默认值 : auto 横向滚动条
     * 
     * @var {String}
     */
    horizontalScrollPolicy: "auto",
    
    /**
     * 默认值 : true 是否显示表头
     * 
     * @var {Boolean}
     */
    headerVisible: true,
    
    /**
     * 默认值 ：false 是否显示表尾
     * 
     * @var {Boolean}
     */
    foolterVisible: false,
    
    /**
     * 默认值 : true 是否显示竖向表格线
     * 
     * @var {Boolean}
     */
    verticalLine: true,
    
    /**
     * 默认值 : true 是否显示横向表格线
     * 
     * @var {Boolean}
     */
    horizontalLine: true,
    
    /**
     * 默认值 : cellmousedown 启动单元格编辑的事件
     * 
     * @var {String}
     */
    cellEditAction: "cellmousedown",
    
    /**
     * 默认值 : cellmousedown 启动单元格选择的事件
     * 
     * @var {String}
     */
    cellSelectAction: "cellmousedown",
    
    /**
     * 默认值 : single 行选择模式(单选/多选)
     * 
     * @var {String}
     */
    rowSelectMode: "single",
    
    /**
     * 默认值 : single 单元格选择模式(单选/多选)
     * 
     * @var {String}
     */
    cellSelectMode: "single",
    
    /**
     * 默认值 : false 是否允许单元格选择
     * 
     * @var {Boolean}
     */
    enableCellSelect: false,
    
    /**
     * 默认值 : true 是否允许单元格编辑
     * 
     * @var {Boolean}
     */
    enableCellEdit: true,
    
    /**
     * 默认值 : true 是否显示单元格编辑痕迹
     * 
     * @var {Boolean}
     */
    cellDirtyVisible: true,
    
    /**
     * 默认值 : 100 默认列宽
     * 
     * @var {String}
     */
    columnWidth: 100,
    
    /**
     * 默认值 : 20 最小列宽
     * 
     * @var {Number}
     */
    columnMinWidth: 20,
    
    /**
     * 默认值 : 2000 最大列宽
     * 
     * @var {Number}
     */
    columnMaxWidth: 2000,
    
    /**
     * 默认值 : 24 表头列高度
     * 
     * @var {Number}
     */
    columnHeight: 24,
    
    /**
     * 默认值 : false 是否允许列头排序
     * 
     * @var {Boolean}
     */
    enableColumnSort: false,
    
    /**
     * 默认值 : asc 默认列排序顺序
     * 
     * @var {String}
     */
    defaultSortDir: "asc",
    summaryRowVisible: false,
    summaryRowPosition: "bottom",
    filterRowVisible: false,
    filterRowPosition: "top",
    selectModel: "TableSelect",
    dragDropModel: "TableDragDrop",
    cellSelectModel: "cellselect",
    cellEditModel: "celledit",
    sortModel: "tablesort",
    headerDragDropModel: "headerdragdrop",
    headerSplitterModel: "HeaderSplitter",
    
    /**
     * 默认值 : true 是否允许列拖拽调节顺序
     * 
     * @var {String}
     */
    enableColumnDragDrop: true,
    
    dragShadow: true,
    
    /**
     * 默认值 : 30 最小编辑器宽度
     * 
     * @var {Number}
     */
    minEditorWidth: 30,
    
    /**
     * 默认值 : 15 最小编辑器高度
     * 
     * @var {Number}
     */
    minEditorHeight: 15,
    
    /**
     * 默认值 : 20 默认行高
     * 
     * @var {Number}
     */
    rowHeight: 20,
    
    /**
     * 默认值 : 100 最小宽度
     * 
     * @var {Number}
     */
    minWidth: 100,
    
    /**
     * 默认值 : 80 最小高度
     * 
     * @var {Number}
     */
    minHeight: 80,
    headerHeight: 24,
    footerHeight: 24,
    viewCellId: true,
    nosetcolumnid: "不能设置重复的列id",
    
    /**
     * TableHeader Calss
     * 
     * @var {TableHeader}
     */
    headerClass: Edo.lists.TableHeader,
    
    /**
     * TableBody Class
     * 
     * @var {TableBody}
     */
    bodyClass: Edo.lists.TableBody,
    
    /**
     * TableBody Class
     * 
     * @var {TableBody}
     */
    footerClass: Edo.lists.TableFooter,
    
    /**
     * column的id.将表格的某个column自适应表格宽度
     * 
     * @var {String}
     */
    autoExpandColumn: null,
    
    /**
     * 默认值 : false 所有列宽自适应表格宽度
     * 
     * @var {Boolean}
     */
    autoColumns: false,
    
    /**
     * 默认值 : "此单元格验证错误" 默认的单元格验证错误描述
     * 
     * @var {String}
     */
    cellError: "此单元格验证错误",
    
    /**
     * 默认值 : true 是否允许单元格验证
     * 
     * @var {String}
     */
    enableCellValid: true,
    
    /**
     * 默认值 : aftercelledit 单元格验证激发事件
     * 
     * @var {String}
     */
    cellValidAction: "aftercelledit",
    cellValidModel: "cellvalid",
    
    /**
     * 默认值 : true 是否显示单元格错误样式
     * 
     * @var {Boolean}
     */
    showCellValid: true,
    
    /**
     * 默认值 : e-table-cell-invalid 单元格错误样式
     * 
     * @var {String}
     */
    cellInvalidCls: "e-table-cell-invalid",
    valueField: "data",
    setValue: function($) {
        //this.data.load($);
    },
    getValue: function() {
        return this.data.source;
    },
    resetValue: function() {
        this.setValue(this.defaultValue)
    },
    markFormValue: function() {
        var $ = this.getValue();
        if (!this.hidden && this.enableForm) this.hidden = Edo.util.Dom.append(this.el, "<input type=\"hidden\" name=\"" + this.name + "\" value=\"\" />");
        if (this.hidden) this.hidden.value = Edo.util.JSON.encode($)
    },
    _setRowSelectMode: function($) {
        if ($ != this.rowSelectMode) {
            this.rowSelectMode = $;
            if (this.rowSelectMode == "multi") this.multiSelect = true;
            else this.multiSelect = false
        }
    },
    _setMultiSelect: function($) {
        if ($ != this.multiSelect) {
            this.multiSelect = $;
            if ($ == true) this.rowSelectMode = "multi";
            else this.rowSelectMode = "single"
        }
    },
    within: function(_) {
        var $ = this.activeEditor;
        if ($ && $.editor.within(_)) return true;
        return Edo.lists.Table.superclass.within.call(this, _)
    },
    createChildren: function($) {
        Edo.lists.Table.superclass.createChildren.call(this, $);
        if (this.horizontalLine) this.addCls("e-table-horizontalline");
        if (this.verticalLine) this.addCls("e-table-verticalline");
        this.initTable();
        this.refreshFilter();
        this.refreshSummary()
    },
    init: function() {
        var $ = Edo.create({
            type: this.cellSelectModel
        });
        if ($) this.addPlugin($);
        $ = Edo.create({
            type: this.cellEditModel
        });
        if ($) this.addPlugin($);
        $ = Edo.create({
            type: this.cellValidModel
        });
        if ($) this.addPlugin($);
        $ = Edo.create({
            type: this.sortModel
        });
        if ($) this.addPlugin($);
        $ = Edo.create({
            type: this.headerDragDropModel
        });
        if ($) this.addPlugin($);
        $ = Edo.create({
            type: this.headerSplitterModel
        });
        if ($) this.addPlugin($);
        this.multiSelect = this.rowSelectMode == "multi" ? true: false;
        Edo.lists.Table.superclass.init.call(this);
        this.on("cellvalid", this._oncellvalid, this, 0);
        this.on("cellinvalid", this._oncellinvalid, this, 0)
    },
    _onMouseDown: function(event) {
        this.fireItemEvent(event, "mousedown");
        if (!Edo.util.Dom.findParent(event.target, "e-table-filter-row")){
        	this.focus();
        }else {
        	setTimeout(function() {
                event.target.focus()
            },150);
        }
    },
    _oncellvalid: function($) {
        this.clearCellInvalid($.record, $.column)
    },
    _oncellinvalid: function($) {
        this.showCellInvalid($.record, $.column, $.errorMsg)
    },
    fixAutoSize: function() {
        if (this.viewport) {
            if (this.autoWidth) this.viewport.style.width = "auto";
            if (this.autoHeight) this.viewport.style.height = "auto"
        }
        Edo.lists.Table.superclass.fixAutoSize.call(this)
    },
    measure: function() {
        Edo.lists.Table.superclass.measure.call(this);
        if (this.autoHeight) {
            var $ = this.getHorizontalScrollOffset();
            this.realHeight += $
        }
    },
    syncBox: function() {
        this.box = Edo.util.Dom.getBox(this.el, true);
        this.headerBox = Edo.util.Dom.getBox(this.headEl, true);
        var D = this.getFooterHeight();
        Edo.util.Dom.setSize(this.viewport, this.box.width, this.box.height - this.headerBox.height - D);
        var F = this.getViewportScrollLeft();
        this.footEl.scrollLeft = F;
        this.headEl.scrollLeft = F;
        var C = Edo.util.Dom.getBox(this.viewport, true);
        this.viewBox = C;
        this.viewWidth = C.width;
        this.viewHeight = C.height;
        this.syncColumns();
        if (this.rendered && this.viewport && this.viewport.firstChild && this.viewport.firstChild.rows) {
            var _ = this.viewport.firstChild.rows[0];
            if (_) for (var $ = 0, E = this.columns.length; $ < E; $++) {
                var B = _.cells[$];
                if (!B) continue;
                var A = this.columns[$].width;
                if (!this.isBorderBox) A -= 1;
                if (A < 0) A = 0;
                B.style.width = A + "px"
            }
            this.refreshHeader();
            this.refreshFooter()
        }
        this.headerBox = Edo.util.Dom.getBox(this.headEl, true);
        D = this.getFooterHeight();
        Edo.util.Dom.setSize(this.viewport, this.box.width, this.box.height - this.headerBox.height - D)
    },
    initTable: function() {
        this.headEl = this.el.firstChild;
        this.headRowEl = this.el.firstChild.firstChild;
        this.viewport = this.el.childNodes[1];
        this.footEl = this.el.childNodes[2];
        this.scrollEl = this.viewport;
        this.ctEl = this.getCtEl();
        this.headEl.style.height = this.headerVisible ? "auto": "0px";
        this.headEl.style.display = this.headerVisible ? "": "none";
        this.footEl.style.display = this.foolterVisible ? "": "none";
        this.doScrollPolicy(this.scrollEl);
        Edo.util.Dom.on(this.viewport, "scroll", this._onViewportScroll, this);
        Edo.util.Dom.on(this.headEl, "scroll", this._onHeaderScroll, this)
    },
    
    /**
     * 获取表头box(坐标+尺寸)
     * 
     * @return {Object} {x,y,width,height,right,bottom}
     */
    getHeaderBox: function() {
        return this.headerBox
    },
    
    /**
     * 获取表身box(坐标+尺寸)
     * 
     * @return Object {x,y,width,height,right,bottom}
     */
    getViewportBox: function() {
        return this.viewBox
    },
    getCtEl: function() {
        return this.viewport.firstChild ? this.viewport.firstChild.tBodies[0] : null
    },
    addRowCls: function($, _) {
        this.addItemCls($, _)
    },
    _onDataChanged: function($) {
        this.refreshSummary();
        Edo.lists.Table.superclass._onDataChanged.call(this, $);
        this.doSelectCell(this.cellSelecteds)
    },
    refresh: function($) {
        if (!this.el) return;
        if ($ === true) {
            this.refreshHeader();
            this.refreshFooter()
        }
        Edo.lists.Table.superclass.refresh.call(this, $);
        var _ = this.getViewportScrollLeft();
        this.footEl.scrollLeft = _;
        this.headEl.scrollLeft = _;
        this.showAllCellInvalid()
    },
    getViewportScrollLeft: function() {
        return this.viewport ? this.viewport.scrollLeft: 0
    },
    refreshHeader: function() {
        if (this.headRowEl) Edo.removeNode(this.headRowEl);
        var _ = this.getHeader(),
        $ = _._createView(this.startColumn, this.endColumn);
        this.headRowEl = Edo.util.Dom.preend(this.headEl, $);
        if (this.filterRowVisible && this.filterRowPosition == "top") this.refreshFilter(this.startColumn, this.endColumn);
        if (this.summaryRowVisible && this.summaryRowPosition == "top") this.refreshSummary(this.startColumn, this.endColumn)
    },
    refreshFooter: function() {
        if (this.filterRowVisible && this.filterRowPosition == "bottom") this.refreshFilter(this.startColumn, this.endColumn);
        if (this.summaryRowVisible && this.summaryRowPosition == "bottom") this.refreshSummary(this.startColumn, this.endColumn)
    },
    refreshFilter: function() {
        if (!this.filterRowVisible) return;
        var F = this.filterRowPosition == "bottom" ? this.footEl: this.headEl,
        A = this.createFilterRow(0, this.columns.length);
        if (this.filterEl) {
            Edo.util.Dom.clearNodes(this.filterEl);
            Edo.removeNode(this.filterEl)
        }
        this.filterEl = Edo.util.Dom.append(F, A);
        for (var $ = 0, E = this.columns.length; $ < E; $++) {
            var D = this.columns[$],
            _ = D.width;
            if (!this.isBorderBox) _ -= 1;
            var C = _;
            C -= 3;
            var B = Edo.getDom(this.id + "|" + D.id + "|filter");
            if (B && D.filter) {
                B = B.firstChild;
                Edo.util.Dom.clearNodes(B);
                B.innerHTML = "";
                D.filter.set("width", C);
                D.filter.render(B)
            }
        }
    },
    refreshSummary: function() {
        if (!this.summaryRowVisible) return;
        var _ = this.summaryRowPosition == "bottom" ? this.footEl: this.headEl,
        $ = this.createSummaryRow(0, this.columns.length);
        if (this.summaryEl) Edo.removeNode(this.summaryEl);
        this.summaryEl = Edo.util.Dom.append(_, $)
    },
    fireItemEvent: function(B, _) {
        var $ = this.getHeaderCellElByChild(B.target);
        if (!$) $ = this.getCellElByChild(B.target);
        if ($) {
            B.column = this.getColumn(this.getCellId($.id));
            B.columnIndex = this.columns.indexOf(B.column)
        }
        B.cellEl = $;
        B.record = this.getRecordByEvent(B);
        B.rowIndex = this.data.indexOf(B.record);
        var B = Edo.lists.Table.superclass.fireItemEvent.apply(this, arguments);
        if (B.within(this.headEl)) {
            B.type = "header" + _;
            this.fireEvent(B.type, B);
            if (B.column) {
                var A = B.column["onheader" + _];
                if (A) A.call(B.column, B)
            }
        } else if (B.within(this.viewport)) {
            B.type = "beforebody" + _;
            if (this.fireEvent(B.type, B) !== false) {
                if (B.record && $) {
                    B.type = "cell" + _;
                    this.fireEvent(B.type, B)
                }
                if (B.column) {
                    A = B.column["on" + _];
                    if (A) A.call(B.column, B)
                }
                B.type = "body" + _;
                this.fireEvent(B.type, B)
            }
        }
        return B
    },
    getCellElByChild: function($) {
        return Edo.util.Dom.findParent($, this.cellCls, 20)
    },
    getCellEl: function(_, A) {
        _ = this.getRecord(_);
        if (!A) return;
        var $ = Edo.getDom(this.createCellId(_, A));
        return $
    },
    getHeaderCellElByChild: function($) {
        return Edo.util.Dom.findParent($, this.headerCellCls, 20)
    },
    
    /**
     * 根据列id获得列对象
     * 
     * @param id : String/Number/Object 列id,列索引index
     * @return Object 列对象
     */
    getColumn: function(B) {
        var A = typeof B,
        _ = B;
        if (A == "string") _ = this.columnHash[B];
        else if (A == "number") _ = this.columns[B];
        else if (_ && _.target) {
            var $ = this.getCellElByChild(_.target);
            if ($) _ = this.getColumn(this.getCellId($.id))
        }
        return _
    },
    getColumnById: function($) {
        return this.getColumn($)
    },
    
    /**
     * 根据列获得列索引index
     * 
     * @param column : Object 列对象
     * @return {Number} 列索引号
     */
    getColumnIndex: function(column) {
        column = this.getColumn(column);
        return this.columns.indexOf(column);
    },
    
    /**
     * 获取列宽之和
     * 
     * @return {Number}
     */
    getColumnAllWidth: function() {
        var $ = 0;
        this.columns.each(function(_) {
            $ += _.width
        },
        this);
        return $
    },
    getColumnsWidth: function(A, C) {
        var _ = 0;
        for (var $ = A; $ < C; $++) {
            var B = this.columns[$];
            _ += B.width
        }
        return _
    },
    
    /**
     * 获取行高之和
     * 
     * @return {Number}
     */
    getRowAllHeight: function() {
        var $ = 0;
        this.data.each(function(_) {
            $ += _.__height || this.rowHeight
        },this);
        return $;
    },
    _setScrollLeft: function($) {
        if (this.getViewportScrollLeft != $ && this.viewport) this.viewport.scrollLeft = $
    },
    _setScrollTop: function($) {
        this.viewport.scrollTop = $
    },
    _onHeaderScroll: function(_) {
        var $ = this.headEl.scrollLeft;
        if ($ != this.getViewportScrollLeft) this.set("scrollLeft", $)
    },
    _onViewportScroll: function($) {
        this.footEl.scrollLeft = this.headEl.scrollLeft = this.viewport.scrollLeft;
        this.submitEdit()
    },
    getBody: function() {
        if (!this.body){
        	this.body = new this.bodyClass(this);
        }
        return this.body;
    },
    getHeader: function() {
        if (!this.header) this.header = new this.headerClass(this);
        return this.header
    },
    getFooter: function() {
        if (!this.footer) this.footer = new this.footerClass(this);
        return this.footer
    },
    
    /**
     * 获取表头高度
     * 
     * @return {Number}
     */
    getHeaderHeight: function() {
        if (this.headEl) this.headerHeight = Edo.util.Dom.getHeight(this.headEl);
        return this.headerHeight
    },
    getFooterHeight: function() {
        if (this.footEl) this.footerHeight = Edo.util.Dom.getHeight(this.footEl);
        return this.footerHeight
    },
    getCellBox: function($, A) {
        var _ = this.getCellEl($, A);
        return Edo.util.Dom.getBox(_)
    },
    getColumnBox: function(_) {
        _ = this.getColumn(_);
        var $ = this.getColumnEl(_);
        return Edo.util.Dom.getBox($)
    },
    getInnerHtml: function(_) {
        this.syncColumns();
        var $ = this.getHeader();
        _[_.length] = "<div class=\"e-table-header\">";
        _[_.length] = $._createView(0, this.columns.length);
        _[_.length] = "</div><div class=\"e-table-viewport\">";
        _[_.length] = this.createView();
        _[_.length] = "</div>";
        _[_.length] = "<div class=\"e-table-footer\">";
        _[_.length] = this.getFooter()._createView(0, this.columns.length);
        _[_.length] = "</div>"
    },
    createView: function() {
        var B = this.getBody(),
        A = this.startRow,
        $ = this.endRow,
        _ = this.startColumn,
        C = this.endColumn;
        if (A < 0) A = 0;
        if (_ < 0) _ = 0;
        if ($ < 0 || $ >= this.data.getCount()) $ = this.data.getCount() - 1;
        if (C < 0 || C >= this.columns.length) C = this.columns.length - 1;
        if (this.live) A = 0;
        return B._createView(A, _, $, C)
    },
    columnChangedRefresh: true,
    _setColumns: function(B) {
        var I = this,
        E = this.columnWidth,
        F = this.columnHeight,
        D = this.columnMinWidth,
        A = this.enableColumnSort,
        _ = this.columnHash = {},
        $ = [],
        J = false,
        K = 0;
        function H(G, L, N) {
            if (K < L) K = L;
            G.depth = L;
            G.width = parseInt(G.width);
            if (isNaN(G.width)) G.width = E;
            G._width = G.width;
            if (!G.height) G.height = F;
            else G.height = parseInt(G.height);
            if (!G.minWidth) G.minWidth = D;
            else G.minWidth = parseInt(G.minWidth);
            if (!G.editIndex) G.editIndex = G.dataIndex;
            G.id = G.id || Edo.id(null, "col-");
            if (_[G.id]) throw new Error(this.nosetcolumnid);
            _[G.id] = G;
            if (G.renderer) if (typeof G.renderer === "string") G.renderer = window[G.renderer];
            if (G.editor) {
                if (typeof G.editor === "string") {
                    var O = window[G.editor];
                    if (!O) O = Edo.create({
                        type: G.editor
                    });
                    G.editor = O
                }
                O = G.editor;
                if (O) {
                    O.minWidth = 30;
                    G.editor = Edo.create(O);
                    G.editor.owner = I
                }
            }
            var B = G.filter;
            if (B) {
                G.filter = Edo.create(B);
                G.filter.owner = I
            }
            if (typeof G.enableSort == "undefined") G.enableSort = A;
            if (G.headerText) G.header = G.headerText;
            if (G.columns) {
                G.groupColumn = true;
                J = true;
                var M = 0;
                for (var C = 0, Q = G.columns.length; C < Q; C++) {
                    var P = G.columns[C];
                    H(P, L + 1, G.visible);
                    P.groupid = G.id;
                    if (P.visible !== false) M += P.colSpan
                }
                G.colSpan = M
            } else {
                G.colSpan = 1;
                if (G.visible !== false && N !== false) $[$.length] = G
            }
        }
        for (var G = 0, C = B.length; G < C; G++) H(B[G], 0, true);
        this.hasGroupColumn = J;
        this.groupColumns = B || [];
        this.columns = $;
        this.columnDepth = K;
        for (G = 0, C = $.length; G < C; G++) $[G].index = G;
        this.measureSize();
        this.syncColumns();
        this.startColumn = 0;
        this.endColumn = this.columns.length - 1;
        if (this.rendered && this.columnChangedRefresh) {
            this.refresh(true);
            this.syncBox()
        }
    },
    _onDataValid: function(_) {
        if (_.action == "field") {
            var $ = this.getColumnsByDataIndex(_.field);
            $.each(function($) {
                this.fireEvent("cellvalid", {
                    type: "cellvalid",
                    source: this,
                    record: _.record,
                    column: $,
                    field: $.dataIndex,
                    value: _.record[$.dataIndex]
                })
            },
            this)
        } else this.data.view.each(function($) {
            this.columns.each(function(_) {
                this.fireEvent("cellvalid", {
                    type: "cellvalid",
                    source: this,
                    record: $,
                    column: _,
                    field: _.dataIndex,
                    value: $[_.dataIndex]
                })
            },
            this)
        },
        this)
    },
    _onDataInvalid: function(C) {
        if (C.action == "field") {
            var _ = this.getColumnsByDataIndex(C.field);
            _.each(function($) {
                this.fireEvent("cellinvalid", {
                    type: "cellinvalid",
                    errorMsg: C.errorMsg,
                    source: this,
                    record: C.record,
                    column: $,
                    field: $.dataIndex,
                    value: C.value
                })
            },
            this)
        } else for (var $ = 0, A = C.errors.length; $ < A; $++) {
            var B = C.errors[$];
            B.fields.each(function($) {
                var _ = this.getColumnsByDataIndex($.name);
                _.each(function(_) {
                    this.fireEvent("cellinvalid", {
                        type: "cellinvalid",
                        errorMsg: $.errorMsg,
                        source: this,
                        record: B.record,
                        column: _,
                        field: _.dataIndex,
                        value: $.value
                    })
                },
                this)
            },
            this)
        }
    },
    getVerticalScrollOffset: function() {
        var $ = 0;
        if (this.verticalScrollPolicy == "on") $ = this.scrolloffset;
        else if (this.verticalScrollPolicy == "off");
        else {
            if (!this.viewport) return 0;
            var A = Edo.util.Dom.getHeight(this.viewport, true),
            _ = Edo.util.Dom.getHeight(this.viewport.firstChild);
            if (_ > A) $ = this.scrolloffset
        }
        return $
    },
    getHorizontalScrollOffset: function() {
        var $ = 0;
        if (this.horizontalScrollPolicy == "on") $ = this.scrolloffset;
        else if (this.horizontalScrollPolicy == "off");
        else {
            if (!this.viewport) return 0;
            var A = Edo.util.Dom.getWidth(this.viewport, true),
            _ = Edo.util.Dom.getWidth(this.viewport.firstChild);
            if (_ > A) $ = this.scrolloffset
        }
        return $
    },
    syncColumns: function() {
        var A = this.realWidth;
        if (this.viewport) A = Edo.util.Dom.getWidth(this.viewport, true);
        A -= this.getVerticalScrollOffset();
        var B = A,
        _ = 0,
        I = 0,
        C = this.getColumn(this.autoExpandColumn);
        if (C || this.autoColumns) for (var $ = 0, H = this.columns.length; $ < H; $++) {
            var D = this.columns[$];
            if (D.fixWidth) I += D._width;
            else _ += D._width
        }
        if (C) {
            A -= I;
            w = A - _ + C._width;
            if (w < this.columnMinWidth) w = this.columnMinWidth;
            else if (w > this.columnMaxWidth) w = this.columnMaxWidth;
            C.width = parseInt(w);
            if (C.width < C.minWidth) C.width = C.minWidth
        } else if (this.autoColumns) {
            A -= I;
            this.columns.each(function($) {
                if ($.fixWidth) $.width = $._width;
                else $.width = parseInt($._width / _ * A);
                if ($.width < $.minWidth) $.width = $.minWidth
            },
            this);
            var G = I;
            this.columns.each(function($) {
                G += $.width
            });
            if (this.columns.length > 1) {
                var E = this.columns[this.columns.length - 1];
                E.width = E.width + (B - G)
            }
        }
        function F($) {
            $.each(function(_) {
                if (_.columns) {
                    F(_.columns);
                    var $ = 0;
                    _.columns.each(function(_) {
                        if (_.visible !== false) $ += _.width
                    });
                    _.width = $
                }
            })
        }
        F(this.groupColumns)
    },
    sortColumn: function(B, E) {
        B = this.getColumn(B);
        if (!B) return;
        for (var $ = 0, D = this.columns.length; $ < D; $++) {
            var A = this.columns[$];
            if (A == B) {
                if (E) A.sortDir = E;
                else if (A.sortDir == "asc") A.sortDir = "desc";
                else if (A.sortDir == "desc") A.sortDir = "asc";
                else A.sortDir = this.defaultSortDir
            } else delete A.sortDir
        }
        var _ = B.dataIndex,
        F = B.sortDir,
        C = B.sortType;
        this.data.sort(function(B, A) {
            var $;
            if (C) $ = C(Edo.getValue(B, _)) > C(Edo.getValue(A, _));
            else $ = Edo.getValue(B, _) > Edo.getValue(A, _);
            if (F == "asc") return $;
            else return ! $
        })
    },
    removeColumn: function($) {
        if ($.groupid) {
            var _ = this.getColumn($.groupid);
            _.columns.remove($);
            if (_.columns.length == 0) this.groupColumns.remove(_);
            $.groupid = null
        } else this.groupColumns.remove($)
    },
    
    /**
     * 获取列配置对象数组
     * 
     * @return {Array}
     */
    getColumns: function() {
        return this.groupColumns
    },
    _getColumns: function() {
        return this.groupColumns
    },
    getColumnsByDataIndex: function($) {
        var _ = [];
        this.columns.each(function(A) {
            if (A.dataIndex == $) _.add(A)
        });
        return _
    },
    insertColumn: function(_, C, B) {
        if (Edo.isNumber(_)) _ = this.columns[_];
        this.removeColumn(C, false);
        var A,
        $;
        if (_.groupid) {
            A = this.getColumn(_.groupid);
            $ = A.columns.indexOf(_);
            A = A.columns
        } else {
            A = this.groupColumns;
            $ = A.indexOf(_)
        }
        if (B == "preend") A.insert($, C);
        else A.insert($ + 1, C)
    },
    createCellId: function($, _) {
        return this.id + "|" + $.__id + "|" + _.id
    },
    createColumnId: function($) {
        return this.id + "|" + $.id
    },
    getCellId: function($) {
        if ($) {
            ids = $.split("|");
            $ = ids[ids.length - 1]
        }
        return $
    },
    getColumnByEvent: function(_) {
        var $ = this.getHeaderCellElByChild(_.target);
        if (!$) $ = this.getCellElByChild(_.target);
        if ($) return this.getColumn(this.getCellId($.id))
    },
    getColumnEl: function(_) {
        _ = this.getColumn(_);
        var $ = Edo.getDom(this.createColumnId(_));
        return $
    },
    scrollIntoView: function(_, B) {
        var _ = this.getRecord(_),
        B = this.getColumn(B);
        if (!B) return;
        var $ = this.getItemEl(_),
        A = this.getCellEl(_, B);
        if ($ || A) Edo.util.Dom.scrollIntoView(A || $, this.scrollEl, A ? true: false)
    },
    
    /**
     * 获取选中的单元格
     * 
     * @return Object {record,column, cell}
     */
    getCellSelected: function() {
        var $ = this.cellSelecteds[this.cellSelecteds.length - 1];
        if ($) $.cell = $.record[$.column.dataIndex];
        return $;
    },
    
    /**
     * 获得选中的单元格集合
     * 
     * @return Array 单元格数组
     */
    getCellSelecteds: function() {
        var $ = this.cellSelecteds,
        _ = [];
        $.each(function(B) {
            var $ = B.split("|"),
            A = {
                record: this.data.getById($[0]),
                column: this.getColumn($[1])
            };
            A.cell = A.row[A.column.dataIndex];
            _.add(A)
        },
        this);
        return _
    },
    doSelectCell: function($) {
        $.each(function(_) {
            var $ = Edo.getDom(this.createCellId(_.record, _.column));
            if ($) Edo.util.Dom.addClass($, this.cellSelectedCls)
        },
        this)
    },
    doDeselectCell: function($) {
        $.each(function(_) {
            var $ = Edo.getDom(this.createCellId(_.record, _.column));
            if ($) Edo.util.Dom.removeClass($, this.cellSelectedCls)
        },
        this)
    },
    
    /**
     * 是否选中某单元格
     * 
     * @param record : Object/Number 行对象或行索引
     * @param column : Object/Number 列对象或列索引
     * @return {Boolean}
     */
    isCellSelected: function(record, column) {
        record = this.getRecord(record);
        column = this.getColumn(column);
        for (var $ = 0, C = this.cellSelecteds.length; $ < C; $++) {
            var A = this.cellSelecteds[$];
            if (A.record == record && A.column == column) {
            	return true;
            }
        }
    },
    
    /**
     * 选择单元格
     * 
     * @param record : Object/Number 行对象或行索引
     * @param column : Object/Number 列对象或列索引
     */
    selectCell: function(record, column) {
        if (!this.enableCellSelect) return;
        record = this.getRecord(record);
        column = this.getColumn(column);
        if (!record) return;
        if (this.isCellSelected(record, column) && !this.repeatSelect) return false;
        var _ = {
            record: record,
            column: column
        };
        if (this.fireSelection !== false) if (this.fireEvent("beforecellselectionchange", {
            type: "beforecellselectionchange",
            source: this,
            record: record,
            column: column,
            value: Edo.getValue(record, column.dataIndex),
            cellSelected: _
        }) === false) return false;
        if (this.cellSelectMode == "single") {
            this.doDeselectCell(this.cellSelecteds);
            this.cellSelecteds = []
        }
        this.cellSelecteds.add(_);
        this.doSelectCell([_]);
        this.cellSelected = this.getCellSelected();
        if (this.fireSelection !== false) this.fireEvent("cellselectionchange", {
            type: "cellselectionchange",
            source: this,
            value: Edo.getValue(record, column.dataIndex),
            record: record,
            column: column,
            cellSelected: this.cellSelected
        })
    },
    
    /**
     * 取消选择单元格
     * 
     * @param record : Object/Number 行对象或行索引
     * @param column : Object/Number 列对象或列索引
     */
    deselectCell: function(record, column) {
        record = this.getRecord(record);
        column = this.getColumn(column);
        if (!this.isCellSelected(record, column)) return false;
        var B = {
            record: record,
            column: column
        };
        if (this.fireSelection !== false) if (this.fireEvent("beforecellselectionchange", {
            type: "beforecellselectionchange",
            source: this,
            record: record,
            column: column,
            cell: record[column.dataIndex],
            decellSelected: B
        }) === false) return false;
        for (var $ = 0, D = this.cellSelecteds.length; $ < D; $++) {
            var A = this.cellSelecteds[$];
            if (A.record == B.record && A.column == B.column) {
                this.cellSelecteds.removeAt($);
                break
            }
        }
        this.doDeselectCell([B]);
        if (this.fireSelection !== false) this.fireEvent("cellselectionchange", {
            type: "cellselectionchange",
            source: this,
            unselected: record
        });
        return true;
    },
    
    /**
     * 选择单元格集合
     * 
     * @param cells : Array 单元格集合[{record,column},...]
     * @param append : Boolean 是否附加选择(true不取消选择原来的单元格,false取消选择原来的单元格)
     */
    selectCellRange: function(cells, append) {
        var A = this.fireSelection;
        this.fireSelection = false;
        if (append === false) this.clearCellSelect();
        for (var _ = 0, C = cells.length; _ < C; _++) {
            if (_ == C - 1) this.fireSelection = A;
            var B = cells[_];
            this.selectCell(B.record, B.column)
        }
        this.fireSelection = A
    },
    
    /**
     * 取消选择单元格集合
     * 
     * @param cells : Array 单元格集合[{record,column},...]
     */
    deselectCellRange: function(cells) {
        var _ = this.fireSelection;
        this.fireSelection = false;
        for (var $ = 0, B = cells.length; $ < B; $++) {
            if ($ == B - 1) this.fireSelection = _;
            var A = cells[$];
            this.deselectCell(A.record, A.column)
        }
        this.fireSelection = _;
    },
    
    /**
     * 清除所有选择的单元格
     */
    clearCellSelect: function() {
        this.deselectCellRange(this.cellSelecteds.clone())
    },
    
    /**
     * 对指定单元格启动编辑器
     * 
     * @param record : Object/Number 行对象或行索引
     * @param column : Object/Number 列对象或列索引
     * @param editor : UIComponent 可选.单元格编辑器(一般是列自带的,也可以覆盖列编辑器)
     */
    beginEdit: function(record, column, editor) {
        this.doBeginEdit.defer(50, this, arguments)
    },
    beginNextEdit: function() {
        var A = this.activeEditor;
        if (!A) return false;
        var $ = A.rowIndex,
        _ = A.columnIndex;
        _ += 1;
        if (_ >= this.columns.length) {
            $ += 1;
            _ = 0;
            if ($ >= this.data.getCount()) {
                $ = this.data.getCount() - 1;
                _ = this.columns.length - 1
            }
        }
        this.submitEdit();
        this.selectCell($, _);
        this.beginEdit($, _)
    },
    doBeginEdit: function($, A, F) {
        $ = this.getRecord($);
        A = this.getColumn(A);
        if (!$ || !A) return false;
        this.submitEdit();
        var B = this.data.indexOf($),
        C = this.columns.indexOf(A);
        A.editor = Edo.create(A.editor);
        F = F || A.editor;
        if (A.enableEdit === false || !F) {
            if (Edo.isValue(A.forId)) {
                col = this.getColumnIndex(this.getColumn(A.forId));
                A = this.getColumn(A.forId);
                return this.beginEdit($, A)
            }
            return false
        }
        if ($.enableEdit === false) return;
        if (!Edo.isValue(A.editIndex)) A.editIndex = A.dataIndex;
        var _ = Edo.getValue($, A.editIndex);
        if (A.editIndex == "*") _ = $;
        var E = this.getCellBox($, A),
        D = {
            type: "beforecelledit",
            source: this,
            rowIndex: B,
            record: $,
            columnIndex: C,
            column: A,
            field: A.dataIndex,
            cellbox: E,
            editor: F,
            value: _
        };
        if (this.fireEvent("beforecelledit", D) === false) return false;
        this.activeEditor = D;
        F = D.editor;
        F.owner = this;
        F.minWidth = this.minEditorWidth;
        F.minHeight = this.minEditorHeight;
        F.startEdit(_, E.x, E.y, E.width, E.height);
        D.type = "celledit";
        this.fireEvent("celledit", D)
    },
    getEditRecord: function() {
        return this.activeEditor ? this.activeEditor.record: null
    },
    
    /**
     * 对当前编辑器提交编辑结果
     * 
     * @param data : Object 可选.编辑器值(如果不传递, 则使用编辑器产生的结果)
     */
    submitEdit: function(data) {
        var G = this.activeEditor;
        if (!G) return;
        var I = G.rowIndex,
        C = G.columnIndex,
        A = this.columns[C],
        H = G.field,
        D = G.editor,
        _ = G.value,
        $ = G.record,
        E = D.completeEdit();
        data = Edo.isValue(data) ? data: E;
        this.activeEditor = null;
        var B = Edo.getValue($, H);
        if (A.editIndex == "*") B = $;
        var J = {
            type: "beforesubmitedit",
            source: this,
            rowIndex: I,
            record: $,
            columnIndex: C,
            column: A,
            field: H,
            editor: D,
            oldValue: B,
            value: data
        };
        if (!Edo.isValue(_) && !Edo.isValue(J.value)) _ = J.value;
        if (J.value != _ && this.fireEvent("beforesubmitedit", J) !== false) {
            data = J.value;
            if (A.editIndex == "*") this.data.updateRecord($, data);
            else this.data.update($, H, data);
            J.type = "submitedit";
            this.fireEvent("submitedit", J)
        }
        J.type = "aftercelledit";
        this.fireEvent("aftercelledit", J);
        this.showAllCellInvalid();
        this.focus()
    },
    
    /**
     * 取消编辑器
     */
    cancelEdit: function() {
        var A = this.activeEditor;
        if (!A) return;
        A.editor.completeEdit();
        var _ = A.column,
        $ = A.record,
        B = {
            type: "aftercelledit",
            source: this,
            rowIndex: A.rowIndex,
            record: $,
            columnIndex: A.columnIndex,
            column: _,
            field: _.dataIndex,
            editor: A.editor,
            value: Edo.getValue($, _.dataIndex)
        };
        this.fireEvent("aftercelledit", B);
        this.activeEditor = null;
        this.showAllCellInvalid();
        this.focus()
    },
    valid: function($, _) {
        var A = Edo.lists.Table.superclass.valid.call(this, _);
        if (A == true) A = this.validRow($, _);
        return A
    },
    validRow: function($, _) {
        if (!$ || $ === true) $ = this.data.view;
        if (! ($ instanceof Array)) $ = [$];
        var A = true,
        B = false;
        $.each(function($) {
            this.columns.each(function(D) {
                var C = this.validCell($, D);
                if (!C) {
                    A = C;
                    if (!_) {
                        B = true;
                        return false
                    }
                }
            },
            this);
            if (B) return false
        },
        this);
        return A
    },
    
    /**
     * 验证单元格值
     * 
     * @param record : Object/Number 行对象或行索引
     * @param column : Object/Number 列对象或列索引
     * @param value : Object 要验证的值(如果不传递, 可以会自动根据record和column获得单元格值)
     * @param validFn : Function 验证函数(如果不传递,则是列配置对象上的valid函数)
     * @return {Boolean} 是否验证通过
     */
    validCell: function(record, column, value, validFn) {
        record = this.getRecord(record);
        column = this.getColumn(column);
        value = typeof value !== "undefined" ? value: Edo.getValue(record, column.dataIndex);
        validFn = validFn || column.valid;
        if (!validFn) return true;
        if (typeof validFn !== "function") eval("validFn = function(value){" + validFn + "}");
        if (!validFn) return true;
        var ret = validFn.call(this, value, record, column, this.data.indexOf(record), this.data, this);
        if (ret === true || ret === undefined) {
            this.fireEvent("cellvalid", {
                type: "cellvalid",
                source: this,
                record: record,
                column: column,
                field: column.dataIndex,
                value: value
            });
            return true
        } else {
            var msg = ret === false ? this.cellError: ret;
            this.fireEvent("cellinvalid", {
                type: "cellinvalid",
                errorMsg: msg,
                source: this,
                record: record,
                column: column,
                field: column.dataIndex,
                value: value
            });
            return false
        }
    },
    getInvalidTip: function() {
        if (!this.showCellValid) return;
        if (!this.invalidTip) this.invalidTip = Edo.managers.TipManager.reg({
            target: this,
            cls: "e-invalid-tip",
            showTitle: false,
            autoShow: true,
            autoHide: true,
            trackMouse: true,
            mouseOffset: [0, 0],
            ontipshow: this.onCellTipShow.bind(this)
        });
        return this.invalidTip
    },
    onCellTipShow: function(E) {
        var _ = this.getCellElByChild(E.target);
        if (!_) return false;
        var C = this.getColumn(this.getCellId(_.id)),
        $ = this.getRecordByEvent(E);
        if (!$ || !C) return false;
        var B = this.isInvalidCell($, C),
        D = this.getCellBox($, C);
        E.xy = [D.x + D.width + 2, D.y];
        var A = this._getBox(true);
        if (E.xy[0] > A.right) E.xy[0] = A.right;
        if (B) this.invalidTip.html = B;
        else return false
    },
    showAllCellInvalid: function() {
        var A = this.invalidCells;
        for (var B in A) {
            var _ = B.split("|"),
            $ = this.data.getById(_[0]);
            if (!$) {
                delete A[B];
                continue
            }
            this.showCellInvalid(_[0], _[1], A[B])
        }
    },
    showCellInvalid: function($, B, A) {
        this.invalidCells[$.__id + "|" + B.id] = A;
        var _ = this.getCellEl($, B);
        if (_) Edo.util.Dom.addClass(_, this.cellInvalidCls);
        this.getInvalidTip()
    },
    clearCellInvalid: function($, A) {
        delete this.invalidCells[$.__id + "|" + A.id];
        var _ = this.getCellEl($, A);
        if (_) Edo.util.Dom.removeClass(_, this.cellInvalidCls)
    },
    clearInvalid: function() {
        Edo.lists.Table.superclass.clearInvalid.call(this)
    },
    isInvalidCell: function($, _) {
        $ = this.getRecord($);
        _ = this.getColumn(_);
        return this.invalidCells[$.__id + "|" + _.id]
    },
    columnRenderer: null,
    getItemHtml: function(_, $, tb_bd_html) {
        if (!_){
        	return;
        }
        var Q = !tb_bd_html;
        if (!tb_bd_html){
        	tb_bd_html = [];
        }
        var _this = this,
        N = this.data,
        F = _this.columns,
        D = _.__height - 1;
        if (isNaN(D)) {
            D = this.rowHeight;
            if (D != "auto"){
            	D = parseInt(D - 1) + "px"
            }
        } else {
        	D = D + "px";
        }
        var _itemId = _this.createItemId(_),
        L = rowStyleIndex = -1;
        tb_bd_html[tb_bd_html.length] = "<tr id=\"";
        tb_bd_html[tb_bd_html.length] = _itemId;
        tb_bd_html[tb_bd_html.length] = "\" class=\"" + _this.itemCls + " ";
        if (this.enableStripe && $ % 2 == 1){
        	tb_bd_html[tb_bd_html.length] = this.stripeCls + " ";
        }
        if (_this.selectHash[_.__id]){
        	tb_bd_html[tb_bd_html.length] = this.selectedCls + " ";
        }
        if (_this.enable === false){
        	tb_bd_html[tb_bd_html.length] = "e-disabled ";
        }
        L = tb_bd_html.length;
        tb_bd_html[tb_bd_html.length] = "";
        tb_bd_html[tb_bd_html.length] = "\" style=\"";
        rowStyleIndex = tb_bd_html.length;
        tb_bd_html[tb_bd_html.length] = "";
        tb_bd_html[tb_bd_html.length] = ";width:";
        tb_bd_html[tb_bd_html.length] = _this.viewWidth;
        tb_bd_html[tb_bd_html.length] = "px;\">";
        var M = 0;
        for (var J = this.startColumn, G = this.endColumn; J <= G; J++) {
            var C = F[J];
            if (!C) continue;
            var B = C.width;
            if (!this.isBorderBox){
            	B -= 1;
            }
            var I = _[C.dataIndex],
            A = C.renderer || this.columnRenderer;
            I = A ? A.call(C, I, _, C, $, N, _this) : I;
            var E = "";
            if (C.cls){
            	E += C.cls;
            }
            var K = _this.createCellId(_, C);
            if (_this.viewCellId){
            	tb_bd_html[tb_bd_html.length] = "<td id=\"" + K + "\" class=\"";
            }else{
            	tb_bd_html[tb_bd_html.length] = "<td class=\"";
            }
            if (_this.cellSelectHash[_.__id + C.id]){
            	tb_bd_html[tb_bd_html.length] = this.cellSelectedCls + " ";
            }
            tb_bd_html[tb_bd_html.length] = _this.cellCls + " ";
            if (_this.invalidCells[_.__id + "|" + C.id]){
            	tb_bd_html[tb_bd_html.length] = _this.cellInvalidCls + " ";
            }
            tb_bd_html[tb_bd_html.length] = E;
            if ($ == this.startRow || ($ == 0 && this.live)) {
                tb_bd_html[tb_bd_html.length] = " \" style=\"width:";
                tb_bd_html[tb_bd_html.length] = B;
                tb_bd_html[tb_bd_html.length] = "px;height:"
            } else tb_bd_html[tb_bd_html.length] = " \" style=\"height:";
            if (J == this.startColumn) {
                tb_bd_html[tb_bd_html.length] = D;
                tb_bd_html[tb_bd_html.length] = "px;text-align:"
            } else {
            	tb_bd_html[tb_bd_html.length] = "auto;text-align:";
            }
            tb_bd_html[tb_bd_html.length] = C.align || "left";
            if (C.style){
            	tb_bd_html[tb_bd_html.length] = ";" + C.style + "\">";
            }else{
            	tb_bd_html[tb_bd_html.length] = ";\">";
            }
            tb_bd_html[tb_bd_html.length] = "<div class=\"e-table-cell-inner ";
            if (_this.cellDirtyVisible && N.isFieldModify(_, C.dataIndex)){
            	tb_bd_html[tb_bd_html.length] = this.cellDirtyCls + " ";
            }
            tb_bd_html[tb_bd_html.length] = "\" style=\"height:";
            tb_bd_html[tb_bd_html.length] = D;
            tb_bd_html[tb_bd_html.length] = ";";
            if (C.innerStyle){
            	tb_bd_html[tb_bd_html.length] = C.innerStyle;
            }
            tb_bd_html[tb_bd_html.length] = "\">";
            if (I || I === 0 || I === false){
            	tb_bd_html[tb_bd_html.length] = I;
            }else{
            	tb_bd_html[tb_bd_html.length] = "&nbsp;";
            }
            tb_bd_html[tb_bd_html.length] = "</div>";
            tb_bd_html[tb_bd_html.length] = "</td>"
        }
        
        tb_bd_html[tb_bd_html.length] = "</tr>";
        if (this.enableRowCls) {
            tb_bd_html[L] = _.__cls || "";
            tb_bd_html[rowStyleIndex] = _.__style || ""
        }
        if (Q){
        	return tb_bd_html.join("");
        }
    },
    removeItem: function(A) {
        var _ = false;
        for (var $ = 0, B = A.length; $ < B; $++) if (A[$].__index == 0) _ = true;
        Edo.lists.Table.superclass.removeItem.apply(this, arguments);
        if (_) this.syncBox()
    },
    createFilterRow: function(J, M) {
        var L = this,
        E = L.id;
        if (J < 0) J = 0;
        if (M < 0 || M >= L.columns.length) M = L.columns.length - 1;
        function _(A, $) {
            var _ = "";
            if ($.sortDir) if (isIE || isSafari) _ = "&nbsp;&nbsp;&nbsp;";
            else _ = "&nbsp;&nbsp;";
            if (!A && A !== 0) A = "&nbsp;";
            return "<div class=\"e-table-header-cell-inner " + ($.sortDir ? "e-table-sort-icon": "") + "\" style=\"overflow:hidden;line-height:16px;font-size:12px;white-space: nowrap;\">" + A + _ + "</div>"
        }
        var I = L.getColumnAllWidth() + 1000,
        C = L.columns,
        F = [];
        F[F.length] = "<div class=\"e-table-filter-row\" style=\"width:" + I + "px;\"><table class=\"e-table-table\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\" ><tbody><tr>";
        var K = 0;
        for (var H = J, D = M; H <= D; H++) {
            var B = C[H],
            $ = B.width;
            if (!this.isBorderBox) $ -= 1;
            K += $;
            var A = $;
            F[F.length] = "<td id=\"" + (E + "|" + B.id) + "|filter\" class=\"e-table-cell " + L.headerCellCls + " " + (B.headerCls || "") + "\" style=\"width:" + A + "px;text-align:";
            F[F.length] = B.headerAlign || "left";
            F[F.length] = ";overflow:\">";
            var G = _("", B);
            F[F.length] = Edo.isValue(G) ? G: "&nbsp;";
            F[F.length] = "</td>"
        }
        F[F.length] = "</tr></tbody></table></div>";
        return F.join("")
    },
    createSummaryRow: function(J, M) {
        var L = this,
        E = L.id;
        if (J < 0) J = 0;
        if (M < 0 || M >= L.columns.length) M = L.columns.length - 1;
        function _(A, $) {
            var _ = "";
            if ($.sortDir) if (isIE || isSafari) _ = "&nbsp;&nbsp;&nbsp;";
            else _ = "&nbsp;&nbsp;";
            if (!A && A !== 0) A = "&nbsp;";
            return "<div class=\"e-table-header-cell-inner " + ($.sortDir ? "e-table-sort-icon": "") + "\" style=\"overflow:hidden;line-height:16px;font-size:12px;white-space: nowrap;\">" + A + _ + "</div>"
        }
        var I = L.getColumnAllWidth() + 1000,
        C = L.columns,
        F = [];
        F[F.length] = "<div class=\"e-table-summary-row\" style=\"width:" + I + "px;\"><table class=\"e-table-table\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\" ><tbody><tr>";
        var K = 0;
        for (var H = J, D = M; H <= D; H++) {
            var B = C[H],
            $ = B.width;
            if (!this.isBorderBox) $ -= 1;
            K += $;
            var A = $;
            F[F.length] = "<td id=\"" + (E + "|" + B.id) + "|summary\" class=\"e-table-cell " + L.headerCellCls + " " + (B.headerCls || "") + "\" style=\"width:" + A + "px;text-align:";
            F[F.length] = B.headerAlign || "left";
            F[F.length] = ";overflow:hidden;\">";
            var G = typeof(B.summary) === "function" ? B.summary(B, L.data, L) : _(B.summary, B);
            F[F.length] = Edo.isValue(G) ? G: "&nbsp;";
            F[F.length] = "</td>"
        }
        F[F.length] = "</tr></tbody></table></div>";
        return F.join("")
    },
    syncSize: function() {
        Edo.lists.Table.superclass.syncSize.apply(this, arguments);
        this.syncBox();
        var $ = this;
        setTimeout(function() {
            Edo.util.Dom.repaint($.el)
        },
        50)
    },
    destroy: function() {
        Edo.util.Dom.clearEvent(this.scrollEl);
        if (this.header) this.header.destroy();
        if (this.body) this.body.destroy();
        this.scrollEl = this.header = this.body = null;
        Edo.lists.Table.superclass.destroy.call(this)
    },
    isBorderBox: isBorderBox || isChrome || isSafari
});
Edo.lists.Table.regType("table");
//Edo.lists.Table : END

/**
 * 创建多选框列对象(重点覆盖dataIndex属性)
 * 
 * @static
 * @param column : Object 列配置对象
 */
Edo.lists.Table.createCheckColumn = function(column) {
    return Edo.apply({
        trueValue: true,
        falseValue: false,
        text: "",
        renderer: function(D, _, A, $, B, C) {
            D = D == A.trueValue;
            return "<div class=\"e-tree-checkbox\" style=\"text-align:center;line-height:0px;height:18px;padding-left:0px;position:relative;\"><div class=\"e-tree-check-icon  " + (D ? "e-table-checked": "") + "\" style=\"position:absolute;width:15px;height:18px;left:50%;margin-left:-8px;\">" + A.text + "</div></div>"
        },
        onclick: function(F) {
            if (Edo.util.Dom.findParent(F.target, "e-tree-check-icon")) {
                var $ = F.source,
                B = F.column,
                C = F.column.editIndex,
                _ = F.record,
                A = F.record[C] == B.trueValue ? B.falseValue: B.trueValue,
                D = $.data.indexOf(_),
                E = $.columns.indexOf(B),
                F = {
                    type: "beforecelledit",
                    source: $,
                    rowIndex: D,
                    record: _,
                    columnIndex: E,
                    column: B,
                    field: C,
                    value: A
                };
                if ($.fireEvent("beforecelledit", F) === false) return false;
                $.data.update(_, C, A);
                if (this.onsubmitedit) this.onsubmitedit.call(F.source, F);
                F.type = "celledit";
                $.fireEvent("celledit", F)
            }
        }
    },column);
};
Edo.lists.Table.createRadioColumn = function($) {
    return Edo.apply({
        valueField: "id",
        displayField: "name",
        renderer: function(H, A, B, _, C, E) {
            var G = [];
            for (var _ = 0, F = B.data.length; _ < F; _++) {
                var $ = B.data[_],
                D = $[B.valueField];
                G.push("<span class=\"e-table-radio\"><input " + (D == H ? "checked": "") + " value=\"" + D + "\"  type=\"radio\" id=\"" + (E.id + A.__id + B.id) + "\" /><label>" + $[B.displayField] + "</label></span>")
            }
            return G.join("")
        },
        onclick: function(F) {
            F.stopDefault();
            var $ = F.source,
            B = F.column,
            C = F.column.editIndex,
            _ = F.record,
            A = F.record[C],
            D = $.data.indexOf(_),
            E = $.columns.indexOf(B);
            if (F.target.id == $.id + _.__id + B.id) {
                var A = F.target.value,
                F = {
                    type: "beforecelledit",
                    source: $,
                    rowIndex: D,
                    record: _,
                    columnIndex: E,
                    column: B,
                    field: C,
                    value: A
                };
                if ($.fireEvent("beforecelledit", F) === false) return false;
                $.data.update(_, C, A);
                if (this.onsubmitedit) this.onsubmitedit.call(F.source, F);
                F.type = "celledit";
                $.fireEvent("celledit", F)
            }
        }
    },
    $)
};

/**
 * 创建多选列对象
 * 
 * @static
 * @param column : Object 列配置对象
 */
Edo.lists.Table.createMultiColumn = function(column) {
    return Edo.apply({
        preid: Edo.id(),
        id: Edo.id(),
        checkCls: "e-table-checkbox",
        checkedCls: "e-table-checked",
        header: function() {
            return "<div id=\"" + this.preid + this.id + "\" class=\"" + this.checkCls + " " + (this.checked ? this.checkedCls: "") + "\"></div>"
        },
        width: 25,
        minWidth: 24,
        multi: true,
        enableResize: false,
        enableSort: false,
        fixWidth: true,
        renderer: function(D, _, A, $, B, C) {
            if (_.enableSelect != false) return "<div class=\"" + this.checkCls + "\"></div>"
        },
        onheaderclick: function(C) {
            var A = this,
            _ = C.source,
            B = this.preid + this.id,
            $ = Edo.getDom(B);
            if (A.checked) {
                A.checked = !A.checked;
                _.deselectRange(_.data[_.dataViewField]);
                if ($) Edo.util.Dom.removeClass($, this.checkedCls)
            } else {
                A.checked = !A.checked;
                _.selectRange(_.data[_.dataViewField]);
                if ($) Edo.util.Dom.addClass($, this.checkedCls)
            }
        }
    },column);
};

/**
 * 创建单选列对象
 * 
 * @static
 * @param column : Object 列配置对象
 */
Edo.lists.Table.createSingleColumn = function(column) {
	column = Edo.apply({
        checkCls: "e-table-radiobox",
        checkedCls: "e-table-radiobox-checked"
    },column);
    c = Edo.lists.Table.createMultiColumn(column);
    return c;
};

/**
 * 树状组件
 * 
 * TypeName:	tree
 * Namespace:	Edo.lists
 * ClassName:	Tree
 * Extend:	Edo.lists.Table
 */
Edo.lists.Tree = function() {
    Edo.lists.Tree.superclass.constructor.call(this);
    this.on("beforebodymousedown", this._onbeforebodymousedownHandler, this, 0)
};
Edo.lists.Tree.extend(Edo.lists.Table, {
    elCls: "e-tree e-table e-dataview e-div",
    
    /**
     * 作为树形节点的列id
     * 
     * @var String
     */
    treeColumn: "",
    treeColumnCls: "e-tree-treecolumn",
    collapseCls: "e-tree-collapse",
    expandCls: "e-tree-expanded",
    dragDropModel: "treedragdrop",
    enableColumnSort: false,
    enableStripe: false,
    _onbeforebodymousedownHandler: function(B) {
        var _ = B.target,
        $ = B.record;
        if (B.button == Edo.util.MouseButton.left) {
            var A = Edo.util.Dom.hasClass(_, "e-tree-nodeicon");
            if (A) if (this.fireEvent("beforetoggle", {
                type: "beforetoggle",
                source: this,
                record: $,
                row: $
            }) !== false) {
                if (Edo.util.Dom.findParent(_, "e-tree-collapse", 3)) {
                    this.submitEdit();
                    this.data.expand.defer(1, this.data, [$]);
                    return false
                } else if (Edo.util.Dom.findParent(_, "e-tree-expanded", 3)) {
                    this.submitEdit();
                    this.data.collapse.defer(1, this.data, [$]);
                    return false
                }
                this.fireEvent("toggle", {
                    type: "toggle",
                    source: this,
                    record: $,
                    row: $
                })
            } else {
                $.expanded = !$.expanded;
                return false
            }
        }
    },
    _onDataChanged: function($) {
        if ($) switch ($.action) {
        case "expand":
            this.doExpand($.record);
            break;
        case "collapse":
            this.doCollapse($.record);
            break
        }
        Edo.lists.Tree.superclass._onDataChanged.call(this, $)
    },
    doCollapse: function(_) {
        this.refresh();
        return;
        var $ = this.getItemEl(_);
        if ($) {
            $ = Edo.util.Dom.getbyClass("e-treenode", $);
            Edo.util.Dom.removeClass($, this.expandCls);
            Edo.util.Dom.addClass($, this.collapseCls)
        }
        this.data.iterateChildren(_, 
        function(_) {
            if (!this.data.isDisplay(_)) {
                var $ = this.getItemEl(_);
                if ($) $.style.display = "none"
            }
        },
        this)
    },
    doExpand: function(_) {
        this.refresh();
        return;
        var $ = this.getItemEl(_);
        if ($) {
            $ = Edo.util.Dom.getbyClass("e-treenode", $);
            Edo.util.Dom.addClass($, this.expandCls);
            Edo.util.Dom.removeClass($, this.collapseCls)
        }
        if (_.children && _.children.length > 0);
        this.data.iterateChildren(_, 
        function(_, A) {
            if (this.data.isDisplay(_)) {
                var B = this.data.findParent(_),
                $ = this.getItemEl(_);
                $.style.display = ""
            }
        },
        this)
    },
    refreshNode: function($) {},
    applyTreeColumn: function() {
        var $ = this.getColumn(this.treeColumn);
        if (!$) $ = this.columns[0];
        this.treeColumn = $.id;
        if ($.renderer == this.treeRenderer) return;
        if ($.renderer) $._renderer = $.renderer;
        $.renderer = this.treeRenderer;
        $.cls = this.treeColumnCls
    },
    
    /**
     * 渲染树分类
     * 
     * @param 
     */
    treeRenderer: function(text, item, treeColumn, index, datatree, tree) {
    	/**
    	 * 缩进级别
    	 * 
    	 * @var {Number}
    	 */
        var _indent_level = item.__depth * 18,
        columnWidth = treeColumn.width;
        if (columnWidth < 60){
        	columnWidth = 60;
        }
        var _hasChildren = item.__hasChildren || item.__viewicon,
        _expanded = item.expanded,//已展开的
        _cls = _hasChildren ? (_expanded == true ? tree.expandCls: tree.collapseCls) : "",
        _cell_innerHtml = "<div class=\"e-treenode " + _cls + "\" style=\"padding-left:" + _indent_level + "px;height:" + (item.__height) + "px;\">",
        _left = _indent_level;
        if (_hasChildren && item.__viewToggle !== false) {
        	_cell_innerHtml += "<a href=\"javascript:;\" hidefocus class=\"e-tree-nodeicon\" style=\"left:" + _left + "px;\"></a>";
        }
        _left += 18;
        if (item.icon) {
            _cell_innerHtml += "<div class=\"" + item.icon + "\" style=\"width:18px;height:20px;overflow:hidden;position:absolute;top:0px;left:" + _left + "px;\"></div>";
            _left += 16
        }
        if (treeColumn._renderer && treeColumn._renderer != tree.treeRenderer){
        	text = treeColumn._renderer(text, item, treeColumn, index, datatree, tree);
        }
        _cell_innerHtml += "<div id=\"" + tree.id + "-textnode-" + item.__id + "\" class=\"e-tree-nodetext\" style=\"left:" + (_left + 2) + "px;\">" + text + "</div>";
        _cell_innerHtml += "</div>";
        if (!datatree.isDisplay(item)){
        	item.__style = "display:none";
        }else{
        	item.__style = "display:\"\"";
        }
        return _cell_innerHtml;
    },
    _setColumns: function($) {
        Edo.lists.Tree.superclass._setColumns.call(this, $);
        this.applyTreeColumn()
    },
    _setData: function($) {
        if (typeof $ == "string") $ = window[$];
        if (!$) return;
        if ($.componentMode != "data") if (!this.data) $ = new Edo.data.DataTree($);
        else {
            this.data.load($);
            return
        }
        Edo.lists.Tree.superclass._setData.call(this, $)
    },
    getTextNode: function($) {
        $ = this.getRecord($);
        return Edo.getDom(this.id + "-textnode-" + $.__id)
    },
    insertItem: function($, C, I) {
        var F = I.parentNode,
        E = F.children[$ + 1],
        D = this.getItemEl(E);
        for (var A = 0, G = C.length; A < G; A++) {
            var _ = C[A],
            H = this.getItemHtml(_, $ + A),
            B;
            if (D) B = Edo.util.Dom.before(D, H);
            else B = Edo.util.Dom.append(this.getCtEl(), H);
            this.data.iterateChildren(_, 
            function($, _) {
                var A = this.getItemHtml($, _);
                B = Edo.util.Dom.after(B, A)
            },
            this)
        }
    },
    removeItem: function(B) {
        for (var A = 0, C = B.length; A < C; A++) {
            var _ = B[A],
            $ = this.getItemEl(_);
            Edo.removeNode($);
            this.data.iterateChildren(_, 
            function(_) {
                var $ = this.getItemEl(_);
                Edo.removeNode($)
            },
            this)
        }
    },
    moveItem: function($, _, A) {
        this.refresh()
    }
});
Edo.lists.Tree.regType("tree");
//Edo.lists.Tree : END

Edo.plugins.RowSelect = function() {
    Edo.plugins.RowSelect.superclass.constructor.call(this)
};
Edo.plugins.RowSelect.extend(Edo.core.Component, {
    init: function($) {
        if (this.owner) return;
        this.owner = $;
        $.on($.selectAction, this.onSelectAction, this, 0)
    },
    canSelect: function(_) {
        if (!this.owner.enableSelect) return false;
        var $ = _.item;
        if ($.enableSelect === false) return false;
        return true
    },
    multiSelect: function(A) {
        var _ = this.owner,
        $ = A.item;
        if (_.isSelected($)) {
            if (_.repeatSelect);
            else _.deselect($)
        } else _.selectRange([$], !_.selectOnly)
    },
    singleSelect: function(B) {
        var A = this.owner,
        $ = A.data.view,
        _ = B.item;
        if (A.isSelected(_) && !A.repeatSelect) {
            if (B.column && B.column.multi) A.deselect(_)
        } else A.select(_)
    },
    onSelectAction: function(G) {
        var D = this.owner,
        _ = D.data.view,
        A = G.item;
        if (!this.canSelect(G)) return;
        if (A.enable === false) return;
        if (!D.multiSelect) this.singleSelect(G);
        else if (G.ctrlKey && !D.simpleSelect) {
            if (D.isSelected(A)) D.deselect(A);
            else D.select(A)
        } else if (G.shiftKey && !D.simpleSelect) {
            var B = D.getSelected();
            if (B) {
                var F = D.data.indexOf(B),
                C = D.data.indexOf(A),
                E = D.data.getRange(F, C);
                D.selectRange(E, false)
            } else D.select(A)
        } else this.multiSelect(G);
        A = D.getSelected();
        if (A) {
            var $ = Edo.getDom(D.createItemId(A));
            if ($ && D.enableScrollIntoView) Edo.util.Dom.scrollIntoView($, D.scrollEl, false)
        }
    },
    destroy: function() {
        this.owner.un(this.owner.selectAction, this.onSelectAction, this);
        this.owner = null;
        Edo.plugins.RowSelect.superclass.destroy.call(this)
    }
});
Edo.plugins.RowSelect.regType("RowSelect");
Edo.plugins.RowDragDrop = function() {
    Edo.plugins.RowDragDrop.superclass.constructor.call(this)
};
Edo.plugins.RowDragDrop.extend(Edo.core.Component, {
    init: function($) {
        if (this.owner) return;
        this.owner = $;
        $.on("itemmousedown", this.onItemMouseDown, this);
        Edo.managers.DragManager.regDrop($);
        $.on("dropenter", this.onDropEnter, this);
        $.on("dropmove", this.onDropMove, this);
        $.on("dragdrop", this.onDragDrop, this)
    },
    onDropEnter: function($) {
        $.dragData.insertAction = null;
        if ($.dragData.action == "rowdragdrop") Edo.managers.DragManager.acceptDragDrop()
    },
    onDropMove: function(B) {
        var $ = B.dragData;
        $.insertAction = null;
        var A = B.dropObject,
        _ = A.getRecordByEvent(B.event);
        if (!_) {
            this.clearInsertProxy();
            B.feedback.setFeedback("no");
            return
        }
        $.targetItem = _;
        $.insertAction = this.checkDropAction($, B);
        if (!$.insertAction || (B.dropObject == B.dragObject && $.data.indexOf($.targetItem) != -1)) {
            B.feedback.setFeedback("no");
            this.clearInsertProxy();
            $.insertAction = null
        } else if (this.canDrop($, B) === false) Edo.managers.DragManager.rejectDragDrop();
        else Edo.managers.DragManager.acceptDragDrop()
    },
    onDragDrop: function(_) {
        var $ = _.dragData;
        if (_.dropObject && $.targetItem && $.insertAction) {
            if (_.dropObject.dragDropAction) this.doDragDrop($, _);
            this.clearInsertProxy()
        }
    },
    canDrag: function(A) {
        var _ = this.owner;
        if (!_.enableDragDrop) return false;
        var $ = A.item;
        if (!$ || $.enableDragDrop === false) return false;
        return true
    },
    onItemMouseDown: function(B) {
        if (this.canDrag(B) === false) return;
        var A = this,
        _ = this.owner,
        $ = B.item;
        Edo.managers.DragManager.startDrag({
            dragObject: _,
            dragData: {
                action: "rowdragdrop",
                source: _,
                data: this.getDragData(B)
            },
            delay: 200,
            event: B,
            alpha: 1,
            enableDrop: true,
            xOffset: 15,
            yOffset: 18,
            ondragstart: function($) {
                A.feedbackproxy = p = new Edo.managers.DragProxy({
                    html: A.getDragInner($)
                }).render();
                this.feedback = p;
                this.proxy = p.el
            },
            ondragmove: function($) {
                if ($.dropObject) {
                    A.clearInsertProxy();
                    $.feedback.setFeedback("no")
                }
            },
            ondragcomplete: function($) {
                A.clearInsertProxy();
                this.feedback.destroy();
                this.destroy = null
            }
        })
    },
    clearInsertProxy: function() {
        Edo.managers.DragProxy.hideInsertProxy()
    },
    checkDropAction: function($, A) {
        var _ = A.dropObject.getItemBox($.targetItem);
        if (A.now[1] <= _.y + _.height / 2) return "preend";
        return "append"
    },
    getDragData: function(_) {
        var $ = this.owner.getSelecteds();
        if (!$.contains(_.item)) $.add(_.item);
        return $
    },
    getDragInner: function($) {
        return $.dragData.data.length + "行"
    },
    doInsertProxy: function($, C) {
        var B = Edo.managers.DragProxy.getInsertProxy(),
        A = C.dropObject.getItemBox($.targetItem);
        if ($.insertAction == "append") A.y += A.height;
        A.y -= 1;
        A.height = 2;
        Edo.util.Dom.setBox(B, A);
        var _ = C.dropObject;
        if (B.parentNode != _.el) _.el.appendChild(B)
    },
    getFeedback: function($) {
        return "add"
    },
    canDrop: function(_, A) {
        var $ = A.dragData.targetItem;
        if (!$ || $.enableDragDrop === false) return false;
        A.feedback.setFeedback(this.getFeedback(_.insertAction));
        this.doInsertProxy(_, A)
    },
    doDragDrop: function(D, J) {
        var H = J.dragObject,
        A = J.dropObject,
        E = D.targetItem,
        G = D.insertAction,
        F = D.data,
        _ = H.dragDropAction == "move" ? "move": "copy",
        J = {
            type: "beforerowdragdrop",
            dragDropAction: _,
            insertAction: G,
            source: this.owner,
            dragData: H.data,
            dropData: A.data,
            rows: F,
            targetItem: E
        };
        if (this.owner.fireEvent("beforerowdragdrop", J) === false) return;
        var $ = A.data.indexOf(E);
        if (G == "append") $ += 1;
        var I = [];
        for (var C = 0, B = F.length; C < B; C++) I.add(Edo.data.cloneData(F[C]));
        if (H.data === A.data) {
            if (A.dragDropAction == "move") {
                A.data.move(F, $);
                I = F
            } else A.data.insertRange($, I)
        } else {
            A.data.insertRange($, I);
            if (A.dragDropAction == "move") H.data.removeRange(F)
        }
        A.selectRange(I);
        J.type = "rowdragdrop";
        this.owner.fireEvent("rowdragdrop", J)
    },
    destroy: function() {
        this.owner.un("itemmousedown", this.onItemMouseDown, this);
        this.owner = null;
        Edo.plugins.RowDragDrop.superclass.destroy.call(this)
    }
});
Edo.plugins.RowDragDrop.regType("RowDragDrop");
Edo.plugins.CellSelect = function() {
    Edo.plugins.CellSelect.superclass.constructor.call(this)
};
Edo.plugins.CellSelect.extend(Edo.core.Component, {
    init: function($) {
        if (this.owner) return;
        this.owner = $;
        $.on($.cellSelectAction, this.onCellSelectAction, this, 0)
    },
    onCellSelectAction: function(N) {
        var K = this.owner,
        $ = K.data.view,
        B = N.record,
        G = N.column;
        if (K.enableCellSelect) if (K.cellSelectMode == "single") K.selectCell(B, G);
        else if (N.ctrlKey) {
            if (K.isCellSelected(B, G) && !this.repeatSelect) K.deselectCell(B, G);
            else K.selectCell(B, G)
        } else if (N.shiftKey) {
            var J = K.getCellSelected(),
            O = [];
            if (J) {
                var E = K.data.indexOf(B),
                _ = K.columns.indexOf(G),
                H = K.data.indexOf(J.record),
                L = K.columns.indexOf(J.column);
                if (E > H) {
                    var A = E;
                    E = H;
                    H = A;
                    var D = _;
                    _ = L;
                    L = D
                }
                if (E == H && _ > L) {
                    D = _;
                    _ = L;
                    L = D
                }
                for (var I = E; I <= H; I++) for (var M = 0, C = K.columns.length; M < C; M++) {
                    var F = {
                        record: K.data.getAt(I),
                        column: K.columns[M]
                    };
                    if (E == H) {
                        if (M >= _ && M <= L) O.add(F);
                        continue
                    }
                    if (I == E && M >= _) O.add(F);
                    if (I == H && M <= L) O.add(F);
                    if (I > E && I < H) O.add(F)
                }
            } else O.add({
                record: B,
                column: G
            });
            K.selectCellRange(O, false)
        } else if (K.isCellSelected(B, G) && !this.repeatSelect);
        else {
            K.fireSelection = false;
            K.clearCellSelect();
            K.fireSelection = true;
            K.selectCell(B, G)
        }
    },
    destroy: function() {
        this.owner.un(this.owner.cellSelectAction, this.onCellSelectAction, this);
        this.owner = null;
        Edo.plugins.RowSelect.superclass.destroy.call(this)
    }
});
Edo.plugins.CellSelect.regType("cellselect");
Edo.plugins.CellEdit = function() {
    Edo.plugins.CellEdit.superclass.constructor.call(this)
};
Edo.plugins.CellEdit.extend(Edo.core.Component, {
    init: function($) {
        if (this.owner) return;
        this.owner = $;
        $.on($.cellEditAction, this.onCellEditAction, this, 0)
    },
    onCellEditAction: function(C) {
        if (C.button != Edo.util.MouseButton.left) return;
        var B = this.owner,
        $ = B.data.view,
        _ = C.record,
        A = C.column;
        if (B.enableCellEdit) B.beginEdit.defer(50, B, [_, A])
    },
    destroy: function() {
        this.owner.un(this.owner.cellEditAction, this.onCellEditAction, this);
        this.owner = null;
        Edo.plugins.RowSelect.superclass.destroy.call(this)
    }
});
Edo.plugins.CellEdit.regType("celledit");
Edo.plugins.CellValid = function() {
    Edo.plugins.CellValid.superclass.constructor.call(this)
};
Edo.plugins.CellValid.extend(Edo.core.Component, {
    init: function($) {
        if (this.owner) return;
        this.owner = $;
        $.on($.cellValidAction, this.onCellValidAction, this, 0)
    },
    onCellValidAction: function(C) {
        var B = this.owner,
        $ = B.data.view,
        _ = C.record,
        A = C.column;
        if (B.enableCellValid) return B.validCell(_, A, C.value)
    },
    destroy: function() {
        this.owner.un(this.owner.cellValidAction, this.onCellValidAction, this);
        this.owner = null;
        Edo.plugins.RowSelect.superclass.destroy.call(this)
    }
});
Edo.plugins.CellValid.regType("cellvalid");
Edo.plugins.TableSelect = function() {
    Edo.plugins.TableSelect.superclass.constructor.call(this)
};
Edo.plugins.TableSelect.extend(Edo.plugins.RowSelect, {
    multiSelect: function(A) {
        var _ = this.owner,
        $ = A.item;
        if (_.isSelected($) && !this.repeatSelect) {
            if (A.column && A.column.multi) _.deselect($);
            else if (_.repeatSelect);
            else _.deselect($)
        } else {
            selectOnly = _.selectOnly;
            if (A.column && A.column.multi) selectOnly = false;
            _.selectRange([$], !selectOnly)
        }
    }
});
Edo.plugins.TableSelect.regType("TableSelect");
Edo.plugins.TableDragDrop = function() {
    Edo.plugins.TableDragDrop.superclass.constructor.call(this)
};
Edo.plugins.TableDragDrop.extend(Edo.plugins.RowDragDrop, {
    canDrag: function(A) {
        var _ = this.owner;
        if (!_.enableDragDrop) return false;
        var $ = A.item;
        if (!$ || $.enableDragDrop === false) return false;
        if (!A.column || !A.column.enableDragDrop) return false;
        return true
    }
});
Edo.plugins.TableDragDrop.regType("TableDragDrop");
Edo.plugins.TableSort = function() {
    Edo.plugins.TableSort.superclass.constructor.call(this)
};
Edo.plugins.TableSort.extend(Edo.core.Component, {
    init: function($) {
        if (this.owner) return;
        this.owner = $;
        $.on("headerclick", this.onheaderclick, this, 0)
    },
    onheaderclick: function(C) {
        if (C.button != Edo.util.MouseButton.left) return;
        var B = this.owner,
        $ = B.data.view,
        _ = C.record,
        A = C.column;
        if (!A || A.enableSort === false) return;
        B.sortColumn(A)
    },
    destroy: function() {
        this.owner.un("headerclick", this.onheaderclick, this);
        this.owner = null;
        Edo.plugins.RowSelect.superclass.destroy.call(this)
    }
});
Edo.plugins.TableSort.regType("TableSort");
Edo.plugins.HeaderDragDrop = function() {
    Edo.plugins.HeaderDragDrop.superclass.constructor.call(this)
};
Edo.plugins.HeaderDragDrop.extend(Edo.core.Component, {
    init: function($) {
        if (this.owner) return;
        this.owner = $;
        $.on("headermousedown", this.onheadermousedown, this, 0)
    },
    onheadermousedown: function(I) {
        if (I.button != Edo.util.MouseButton.left) return;
        var C = this.owner,
        _ = C.data.view,
        A = I.record,
        E = I.column,
        F = I.target;
        if (!C.enableColumnDragDrop || !E || E.enableMove === false) return;
        if (!Edo.util.Dom.hasClass(I.target, "e-table-header-cell-inner")) return;
        var B = typeof(E.header) === "function" ? E.header(E, C) : E.header,
        H,
        D = C._getBox(true),
        $,
        G;
        Edo.managers.DragManager.startDrag({
            event: I,
            dragData: E,
            alpha: 1,
            enableDrop: true,
            dragObject: C,
            xOffset: 15,
            yOffset: 18,
            ondragstart: function($) {
                H = new Edo.managers.DragProxy({
                    html: B,
                    shadow: C.dragShadow
                }).render();
                this.proxy = H.el
            },
            ondragmove: function(L) {
                var K = L.now[0],
                F = L.now[1];
                $ = G = null;
                if (K < D.x || K > D.right || F < D.y || F > D.bottom) {
                    H.setFeedback("no");
                    Edo.managers.DragProxy.hideUpDownProxy()
                } else {
                    var _ = C.getColumnIndex(E),
                    A = C.getColumnByEvent(L.event),
                    B = C.columns.indexOf(A);
                    if (!A) return;
                    var I = C.getColumnBox(A);
                    if (B == _ || (B + 1 == _ && K >= I.x + I.width / 2) || (B - 1 == _ && K <= I.x + I.width / 2)) {
                        H.setFeedback("no");
                        Edo.managers.DragProxy.hideUpDownProxy()
                    } else {
                        $ = A;
                        var J = Edo.managers.DragProxy.getUpDownProxy();
                        if (K < I.x + I.width / 2) {
                            G = "preend";
                            Edo.util.Dom.setXY(J[0], [I.x - 5, I.y - 10]);
                            Edo.util.Dom.setXY(J[1], [I.x - 5, I.y + I.height])
                        } else {
                            G = "append";
                            Edo.util.Dom.setXY(J[0], [I.x - 5 + I.width, I.y - 10]);
                            Edo.util.Dom.setXY(J[1], [I.x - 5 + I.width, I.y + I.height])
                        }
                        H.setFeedback("yes")
                    }
                }
            },
            ondragcomplete: function(_) {
                Edo.managers.DragProxy.hideUpDownProxy();
                H.destroy();
                if ($) {
                    C.insertColumn($, E, G);
                    C.set("columns", C.getColumns())
                }
            }
        })
    },
    destroy: function() {
        this.owner.un("headermousedown", this.onheadermousedown, this);
        this.owner = null;
        Edo.plugins.RowSelect.superclass.destroy.call(this)
    }
});
Edo.plugins.HeaderDragDrop.regType("HeaderDragDrop");
Edo.plugins.HeaderSplitter = function() {
    Edo.plugins.HeaderSplitter.superclass.constructor.call(this)
};
Edo.plugins.HeaderSplitter.extend(Edo.core.Component, {
    init: function($) {
        if (this.owner) return;
        this.owner = $;
        $.on("headermousedown", this.onheadermousedown, this, 0)
    },
    onheadermousedown: function(F) {
        if (F.button != Edo.util.MouseButton.left) return;
        var B = this.owner,
        $ = B.data.view,
        _ = F.record,
        D = F.column,
        E = F.target;
        if (!Edo.util.Dom.hasClass(E, "e-table-split")) return;
        var A = E.id.split("|");
        A = A[A.length - 1];
        D = B.getColumn(A);
        if (!D || D.enableResize === false) return;
        function C(_, $) {
            Edo.util.Dom.setBox(_, {
                x: $.right - 5,
                y: $.y,
                width: 5,
                height: D.height
            })
        }
        Edo.managers.ResizeManager.startResize({
            target: E,
            box: B.getColumnBox(D),
            event: F,
            handler: "e",
            handlerEl: E,
            autoResize: false,
            minWidth: D.minWidth,
            autoProxy: false,
            onresizestart: function($) {
                this.splitproxy = E.cloneNode(false);
                this.splitproxy.style.backgroundColor = "black";
                this.splitproxy.style.zIndex = 20000001;
                Edo.util.Dom.setOpacity(this.splitproxy, 0.3);
                Edo.util.Dom.append(document.body, this.splitproxy);
                C(this.splitproxy, $.box)
            },
            onresize: function($) {
                C(this.splitproxy, $.box)
            },
            onresizecomplete: function($) {
                D.width = $.size.width - 2;
                B.set("columns", B.getColumns());
                Edo.util.Dom.remove(this.splitproxy)
            }
        })
    },
    destroy: function() {
        this.owner.un("headermousedown", this.onheadermousedown, this);
        this.owner = null;
        Edo.plugins.RowSelect.superclass.destroy.call(this)
    }
});
Edo.plugins.HeaderSplitter.regType("HeaderSplitter");
Edo.plugins.TreeDragDrop = function() {
    Edo.plugins.TreeDragDrop.superclass.constructor.call(this)
};
Edo.plugins.TreeDragDrop.extend(Edo.plugins.TableDragDrop, {
    checkDropAction: function($, E) {
        var _ = $.targetItem,
        C = E.dropObject.getItemBox($.targetItem),
        B = E.now[1],
        D = C.y,
        A = C.height;
        if (_.children) {
            if (B <= D + A / 3) return "preend";
            if (B >= D + A - A / 3) return "append";
            return "add"
        } else return Edo.plugins.TreeDragDrop.superclass.checkDropAction.apply(this, arguments)
    },
    clearInsertProxy: function() {
        Edo.managers.DragProxy.hideInsertProxy();
        if (this.addinrow) {
            Edo.util.Dom.removeClass(this.addinrow, "e-tree-add");
            this.addinrow = null
        }
    },
    doInsertProxy: function(_, D) {
        var C = _.insertAction,
        B = D.dropObject,
        $ = _.targetItem;
        this.clearInsertProxy();
        if (C == "add") {
            Edo.managers.DragProxy.hideInsertProxy();
            var A = B.getTextNode($);
            if (A) {
                Edo.util.Dom.addClass(A, "e-tree-add");
                this.addinrow = A
            }
        } else Edo.plugins.TreeDragDrop.superclass.doInsertProxy.apply(this, arguments)
    },
    getFeedback: function($) {
        if ($ == "add") return "add";
        return $
    },
    canDrop: function(A, H) {
        var G = H.dragObject,
        D = H.dropObject,
        $ = A.sourceRow,
        C = A.targetItem,
        F = true;
        for (var _ = 0, E = A.data.length; _ < E; _++) {
            var $ = A.data[_],
            B = Edo.data.DataTree.isAncestor($, C);
            F = !B;
            if (!F) break;
            if (C == $) {
                F = false;
                break
            }
        }
        if (F) return Edo.plugins.TreeDragDrop.superclass.canDrop.apply(this, arguments);
        else {
            A.insertAction = null;
            this.clearInsertProxy();
            H.feedback.setFeedback("no")
        }
    },
    doDragDrop: function(B, H) {
        var G = H.dragObject,
        E = H.dropObject,
        C = B.targetItem,
        F = B.insertAction,
        D = B.data,
        A = G.dragDropAction == "move" ? "move": "copy",
        H = {
            type: "beforerowdragdrop",
            dragDropAction: A,
            insertAction: F,
            source: this.owner,
            dragData: G.data,
            dropData: E.data,
            rows: D,
            targetItem: C
        };
        if (this.owner.fireEvent("beforerowdragdrop", H) === false) return;
        var _ = G.data === E.data,
        $ = E.data;
        cloneData = Edo.clone(D);
        if (G.data === E.data) {
            if (E.dragDropAction == "move") E.data.move(D, C, F)
        } else if (E.dragDropAction == "move") {
            G.data.removeRange(D);
            E.data.move(D, C, F)
        }
        E.selectRange(D);
        H.type = "rowdragdrop";
        this.owner.fireEvent("rowdragdrop", H)
    }
});
Edo.plugins.TreeDragDrop.regType("treedragdrop");
Edo.plugins.TableKeyboard = function() {
    Edo.plugins.TableKeyboard.superclass.constructor.call(this)
};
Edo.plugins.TableKeyboard.extend(Edo.core.Component, {
    init: function($) {
        if (this.owner) return;
        this.owner = $;
        $.on("keydown", this.onKeyAction, this, 0)
    },
    onKeyAction: function(H) {
        var D = this.owner,
        A = D.enableCellSelect,
        G = D.enableSelect;
        if (Edo.util.Dom.findParent(H.target, "e-table-filter-row")) return;
        var C = D.getCellSelected ? D.getCellSelected() : null,
        _ = D.getSelected();
        if (H.keyCode == 13) H.stop();
        if (!C && !_) return;
        var _ = _ || C.record,
        B = C ? C.column: -1,
        E = D.data.indexOf(_),
        F = D.columns.indexOf(B);
        switch (H.keyCode) {
        case 37:
            if (B != -1) {
                F -= 1;
                if (F < 0) F = 0
            }
            break;
        case 38:
            E -= 1;
            if (E < 0) E = 0;
            break;
        case 39:
            if (B != -1) {
                F += 1;
                if (F >= D.columns.length) F = D.columns.length - 1
            }
            break;
        case 40:
            E += 1;
            if (E >= D.data.getCount()) E = D.data.getCount() - 1;
            break;
        case 13:
            if (B != -1) if (D.enableCellEdit) D.beginEdit.defer(50, D, [_, B]);
            H.stop();
            return;
            break;
        case 27:
            H.stop();
            return;
            break
        }
        var $ = false;
        if (B != -1) if (A) {
            D.selectCell(E, F);
            $ = true;
            H.stop()
        }
        if (G) {
            D.selectRange(E, false);
            $ = true;
            H.stop()
        }
        if ($) D.scrollIntoView(E, F)
    },
    destroy: function() {
        this.owner.un("keydown", this.onKeyAction, this);
        this.owner = null;
        Edo.plugins.TableKeyboard.superclass.destroy.call(this)
    }
});
Edo.plugins.TableKeyboard.regType("TableKeyboard");
Edo.plugins.ContainerSplitter = function() {
    Edo.plugins.ContainerSplitter.superclass.constructor.call(this)
};
Edo.plugins.ContainerSplitter.extend(Edo.core.Component, {
    init: function($) {
        this.owner = $;
        this.owner.on("syncsize", this.onContainerSyncSize, this);
        this.owner.on("mousedown", this._onMouseDown, this)
    },
    onContainerSyncSize: function(M) {
        var K = this.owner,
        L = K.getDisplayChildren();
        if (this.splitters) for (var E in this.splitters) Edo.util.Dom.remove(this.splitters[E]);
        var $ = ["horizontal", "vertical"].indexOf(K.layout);
        if ($ == -1) return false;
        this.splitters = {};
        var C = K[["horizontalGap", "verticalGap"][$]],
        F = ["e-spliter-h", "e-spliter-v"][$];
        for (var G = 0, D = L.length; G < D; G++) {
            var A = L[G];
            if (A.splitRegion) {
                var H = "e-ct-spliter-handle-" + A.splitRegion,
                B = "e-ct-spliter-" + A.splitRegion;
                if (!A.expanded) B += " " + K.collapseCls;
                var J = "<div id=\"for-" + A.id + "\" class=\"e-ct-spliter " + B + "\"><div class=\"e-ct-spliter-inner\"><a href=\"#\" onclick=\"return false\" hideFocus class=\"e-ct-spliter-handle " + H + "\"></a></div></div>";
                if (A.splitRenderer) J = A.splitRenderer.call(A);
                var I = Edo.util.Dom.preend(K.scrollEl, J),
                _ = A._getBox();
                if ($ == 0) {
                    _.width = C;
                    if (A.splitPlace == "before") _.x -= C;
                    else _.x = _.right
                } else {
                    _.height = C;
                    if (A.splitPlace == "before") _.y -= C;
                    else _.y = _.bottom
                }
                Edo.util.Dom.setBox(I, _);
                I.control = A.id;
                this.splitters[A.id] = I
            }
        }
    },
    _onMouseDown: function(E) {
        if (E.button != Edo.util.MouseButton.left) return;
        var A = E.target;
        if (this.splitters) for (var D in this.splitters) {
            var _ = this.splitters[D];
            if (E.within(_)) {
                var C = Edo.getCmp(_.control),
                B = A.className;
                if (Edo.util.Dom.hasClass(A, "e-ct-spliter-handle")) {
                    var $ = "east";
                    $ = B.indexOf("west") != -1 ? "west": $;
                    $ = B.indexOf("north") != -1 ? "north": $;
                    $ = B.indexOf("south") != -1 ? "south": $;
                    C.fireEvent("splitclick", {
                        type: "splitclick",
                        source: C,
                        split: _,
                        splitRegion: $
                    })
                } else this.splitResize(E, C, _)
            }
        }
    },
    splitResize: function(F, D, B) {
        var E = this.owner;
        if (!D.expanded) return;
        var $ = ["horizontal", "vertical"].indexOf(E.layout),
        C = $ == 0 ? E.horizontalGap: E.verticalGap;
        function A(A, _) {
            if ($ == 0) Edo.util.Dom.setBox(A, {
                x: _.right - C - (D.splitPlace == "before" ? _.width - C: 0),
                y: _.y,
                width: C,
                height: _.height
            });
            else Edo.util.Dom.setBox(A, {
                x: _.x,
                y: _.bottom - C - (D.splitPlace == "before" ? _.height - C: 0),
                width: _.width,
                height: C
            })
        }
        var _ = ["e", "s"];
        if (D.splitPlace == "before") _ = ["w", "n"];
        Edo.managers.ResizeManager.startResize({
            target: D,
            event: F,
            handler: _[$],
            handlerEl: B,
            autoResize: false,
            minWidth: D.minWidth + this.horizontalGap,
            minHeight: D.minHeight + this.verticalGap,
            autoProxy: false,
            onresizestart: function($) {
                this.splitproxy = B.cloneNode(false);
                this.splitproxy.style.backgroundColor = "black";
                Edo.util.Dom.setOpacity(this.splitproxy, 0.3);
                Edo.util.Dom.append(document.body, this.splitproxy);
                A(this.splitproxy, $.box)
            },
            onresize: function($) {
                A(this.splitproxy, $.box)
            },
            onresizecomplete: function(_) {
                Edo.util.Dom.remove(this.splitproxy);
                if ($ == 0) D._setWidth(_.size.width - D.parent.horizontalGap);
                else D._setHeight(_.size.height - D.parent.verticalGap)
            }
        })
    },
    destroy: function() {
        this.owner.un("syncsize", this.onContainerSyncSize, this);
        this.owner.un("mousedown", this._onMouseDown, this);
        this.owner = null;
        Edo.plugins.ContainerSplitter.superclass.destroy.call(this)
    }
});
Edo.plugins.ContainerSplitter.regType("containersplitter");

/**
 * 组件系统管理器
 * 
 * Namespace:	Edo.managers
 * ClassName:	SystemManager
 * Single
 */
Edo.managers.SystemManager = {
	/**
	 * 组件对象池
	 */	
    all: {},
    
    /**
     * 注册组件对象，将组件加入组件对象池
     * 
     * @param cmp : Object 组件对象(所有从Edo.core.Component派生的类对象)
     */
    register: function(cmp) {
        if (!cmp.id) {
        	throw new Error("必须保证组件具备id");
        }
        var _is_exist = Edo.managers.SystemManager.all[cmp.id];
        if (_is_exist) {
        	throw new Error("已存在id为:" + _is_exist.id + "的组件");
        }
        Edo.managers.SystemManager.all[cmp.id] = cmp;
        if (cmp.id == "window") if (window[cmp.id]) throw new Error("不能设置此ID:" + _is_exist.id);
        window[cmp.id] = cmp;//将组件以其Id对应的名称对象注册到window对象下面
    },
    
    /**
     * 注销组件对象 将组件从组件对象池注销
     * 
     * @param cmp : Object 组件对象(所有从Edo.core.Component派生的类对象)
     */
    unregister: function(cmp) {
        delete Edo.managers.SystemManager.all[cmp.id]
    },
    
    /**
     * 销毁所有组件(页面关闭情况等特殊场合使用)
     * 
     * 
     */
    destroy: function(id) {
        if (id) {
            if (typeof id === "string") {
            	var cmp = Edo.managers.SystemManager.all[id];
            }
            if (cmp) {
            	cmp.destroy()
            }
        } else {
            var _unreg = Edo.managers.SystemManager.unregister,
            _cmps = Edo.managers.SystemManager.all,
            A = [];
            for (var id in _cmps) {
                var _cmp = _cmps[id];
                if (!_cmp.parent){
                	A.push(_cmp);
                }
            }
            var D = new Date();
            for (var _ = 0, F = A.length; _ < F; _++) {
                $ = A[_];
                if (_cmps[$.id]) $.destroy(true)
            }
        }
    },
    
    /**
     * 根据id获得组件对象.同Edo.get(id)
     * 
     * @param id : String 组件id
     * @return cmp : Object 组件对象
     */
    get: function(id) {
        return Edo.managers.SystemManager.all[id];
    },
    
    /**
     * 从一个父容器下获取所有name命名的组件集合.同Edo.getByName(name, parent)
     * 
     * @param name : String 组件name
     * @param parent : Object 父容器.为空表示从全局获取
     */
    getByName: function(name, parent) {
        return Edo.managers.SystemManager.getByProperty("name", name, parent);
    },
    
    /**
     * 根据某一属性匹配, 获得所有匹配的组件
     * 
     * @param property : String 属性名
     * @param value : Object 属性值
     * @param parent : Object 父容器.为空表示从全局获取
     */
    getByProperty: function(property, value, parent) {
        var C = [],
        A = Edo.managers.SystemManager,
        _cmps = A.all;
        for (var id in _cmps) {
            var _cmp = _cmps[id];
            if (_cmp[property] == value) {
            	if (!parent || (parent && A.isAncestor(parent, _cmp))) {
            		C.push(_cmp)
            	}
            }
        }
        return C;
    },
    
    /**
     * 根据类别名获取类对象.同Edo.getType.一般用来创建类的实例,如new Edo.getType('box')
     * 
     * @param type : String 类别名, 如box,app,text等
     */
    getType: function(type) {
        return Edo.types[type.toLowerCase()];
    },
    
    /**
     * 根据一个组件配置对象,创建组件实例.同Edo.create, Edo.build
     * 
     * @param config : Object 组件配置对象
     * @return 组件对象
     */
    build: function(config) {
        if (!config) {
        	return;
        }
        if (typeof config === "string"){
        	 if (Edo.types[config.toLowerCase()]){
            	 config = {
            			 type: config
            	 };
            } else {
                var parser = Edo.getParser(),
                $ = parser.parserXML(config);
                if (!$.success) throw new Error($.errorMsg);
                var config = $.json;
                if (!config.renderTo) config.renderTo = document.body;
            }
        }
        if (!config.constructor.superclass) {
            var comType = Edo.types[config.type.toLowerCase()];
            if (!comType) {
            	throw new Error("组件类未定义");
            }
            var comObj = new comType();//组件类型
            if (comObj.set) {
            	comObj.set(Edo.apply({},config));
            }
            return comObj;
        }
        return config;
    },
    
    isAncestor: function(parent, cmp) {
        if (parent === cmp) {
        	return true;
        }
        var _ = false;
        while (cmp = cmp.parent) {
            _ = cmp == parent;
            if (_) break;
        }
        return _;
    }
};
Edo.regCmp = Edo.managers.SystemManager.register;//注册组件对象
Edo.unregCmp = Edo.managers.SystemManager.unregister;//注销组件对象
Edo.get = Edo.getCmp = Edo.managers.SystemManager.get;
Edo.build = Edo.create = Edo.managers.SystemManager.build;
Edo.getType = Edo.managers.SystemManager.getType;
Edo.getByName = Edo.managers.SystemManager.getByName;
Edo.getByProperty = Edo.managers.SystemManager.getByProperty;
Edo.isAncestor = Edo.managers.SystemManager.isAncestor;
//-- Edo.managers.SystemManager : END

/**
 * 拖拽管理器.
 * 在拖拽过程中,会在拖拽对象上激发dragstart等拖拽事件
 * 
 * Namespace:	Edo.managers
 * ClassName:	DragManager
 * Single
 */
Edo.managers.DragManager = {
    drops: {},
    event: null,
    dragObject: null,
    dropObject: null,
    dragData: null,
    alpha: 0.5,
    isDragging: false,
    enableFeedback: false,
    feedback: "none",
    drag: null,
    
    /**
     * 启动拖拽器
     * 
     * {
     *   enableDrop: false, //是否允许投放操作
     *   dragObject: null,   //启动拖拽器的组件对象,必须从UIComponent派生,
     *   dragData: null,     //拖拽的数据
     *   event: e,           //当前鼠标事件对象
     *   xOffset: 0,         //偏移
     *   yOffset: 0,
     *   alpha: 1,       //拖拽物透明度
     *   proxy: true     //拖拽代理元素:true:自身的拷贝,false:自身,dom:拖拽dom元素
     * }
     * 
     * @param config : Object拖拽配置对象
     */
    startDrag: function($) {
        if (!$.dragObject) throw new Error("必须有拖拽启动对象");
        if (!$.event) throw new Error("必须有拖拽初始事件对象");
        if ($.event.button != 0) return false;
        if (this.isDragging) this.drag.stop(this.event);
        this.enableDrop = this.proxy = this.now = this.drag = this.dropObject = this.dragObject = this.dragData = this.event = this.xOffset = this.yOffset = null;
        drag = new Edo.util.Drag({
            delay: this.delay,
            capture: this.capture,
            onStart: this.onStart.bind(this),
            onMove: this.onMove.bind(this),
            onStop: this.onStop.bind(this)
        });
        this.drag = drag;
        Edo.apply(this, $, {
            delay: 80,
            capture: false,
            ondragstart: Edo.emptyFn,
            ondragmove: Edo.emptyFn,
            ondragcomplete: Edo.emptyFn,
            ondropenter: Edo.emptyFn,
            ondropover: Edo.emptyFn,
            ondropout: Edo.emptyFn,
            ondropmove: Edo.emptyFn,
            ondragdrop: Edo.emptyFn
        });
        this.initEvent = this.event;
        drag.start(this.event)
    },
    
    /**
     * 当一个拖拽器移动到一个组件上时, 是否进行允许投放操作 
     * 
     */
    acceptDragDrop: function() {
        this.canDrop = true
    },
    rejectDragDrop: function() {
        this.canDrop = false
    },
    
    /**
     * 注册投放区Drop对象 
     * 
     */
    regDrop: function($) {
        this.drops[$.id] = $
    },
    
    /**
     * 注销投放区Drop对象 
     * 
     */
    unregDrop: function($) {
        delete this.drops[$.id]
    },
    fire: function(A, $) {
        var _ = Edo.managers.DragManager;
        _.xy = [_.now[0] + _.xOffset, _.now[1] + _.yOffset];
        Edo.apply(A, _);
        $ = $ || _.dragObject;
        if ($.el) $.fireEvent(A.type, A);
        else Edo.util.Dom.fireEvent($, A.type, A);
        A["on" + A.type].call(_, A);
        _.now = [A.xy[0] - _.xOffset, A.xy[1] - _.yOffset]
    },
    findDrop: function(C, A) {
        A = A || C.target;
        while (A && A !== document) {
            for (var B in this.drops) {
                var $ = this.drops[B],
                _ = $.el || $;
                if (_ === A) return $
            }
            A = A.parentNode
        }
    },
    onStart: function(_) {
        this.event = _.event;
        this.now = _.now;
        this.el = this.dragObject.el || this.dragObject;
        var $ = Edo.util.Dom.getXY(this.el);
        this.initXY = $;
        if (!this.xOffset && this.xOffset !== 0) this.xOffset = $[0] - _.now[0];
        if (!this.yOffset && this.yOffset !== 0) this.yOffset = $[1] - _.now[1];
        this.isDragging = true;
        this.fire({
            type: "dragstart",
            source: this
        });
        if (this.proxy === true) {
            this.proxy = this.el.cloneNode(false);
            Edo.util.Dom.setStyle(this.proxy, this.proxyStyle);
            Edo.util.Dom.addClass(this.proxy, this.proxyCls);
            document.body.appendChild(this.proxy);
            var B = Edo.util.Dom.getSize(this.el);
            Edo.util.Dom.setSize(this.proxy, B.width, B.height);
            this.removeProxy = true
        } else if (!this.proxy) this.proxy = this.el;
        this._zIndex = Edo.util.Dom.getStyle(this.proxy, "z-index");
        this._opacity = 1;
        Edo.util.Dom.setStyle(this.proxy, "z-index", 9999999);
        Edo.util.Dom.setOpacity(this.proxy, this.alpha);
        var A = Edo.util.Dom.getStyle(this.proxy, "position");
        if (A != "relative" && A != "absolute") this.proxy.style.position = "relative";
        Edo.util.Dom.setStyle(this.proxy, this.dragStyle);
        Edo.util.Dom.setXY(this.proxy, $);
        this.leftTop = [parseInt(Edo.util.Dom.getStyle(this.proxy, "left")) || 0, parseInt(Edo.util.Dom.getStyle(this.proxy, "top")) || 0]
    },
    onMove: function(B) {
        if (!this.isDragging) return;
        this.event = B.event;
        this.now = B.now;
        this.move = true;
        var C = this.event.target,
        F = Edo.util.Dom.getBox(this.proxy);
        if (this.proxy != this.el && Edo.util.Dom.isInRegin(this.now, F)) {
            var A = this.proxy.style.display;
            this.proxy.style.display = "none";
            var D = Edo.util.Dom.getScroll();
            C = document.elementFromPoint(this.now[0], this.now[1] - D.top);
            while (C && C != document) {
                if (C.tagName) break;
                C = C.parentNode
            }
            if (C) this.event.target = C;
            this.proxy.style.display = A
        }
        this.fire({
            type: "dragmove",
            source: this
        });
        if (this.move !== false && this.proxy) {
            var E = this.proxy.style;
            E.left = (this.now[0] + this.xOffset - this.initXY[0] + this.leftTop[0]) + "px";
            E.top = (this.now[1] + this.yOffset - this.initXY[1] + this.leftTop[1]) + "px"
        }
        if (this.enableDrop) {
            var _ = this.dropObject;
            this.dropObject = null;
            while (C && C !== document) {
                var $ = this.findDrop.call(this, this.event, C);
                if (!$) {
                    if (_) {
                        this.dropObject = _;
                        this.fire({
                            type: "dropout",
                            source: this.dropObject
                        },
                        this.dropObject)
                    }
                    this.dropObject = null;
                    break
                }
                this.dropObject = $;
                if ($ == _) break;
                this.fire({
                    type: "dropenter",
                    source: this.dropObject
                },
                this.dropObject);
                if (this.canDrop) {
                    if (_) {
                        this.dropObject = _;
                        this.fire({
                            type: "dropout",
                            source: this.dropObject
                        },
                        this.dropObject)
                    }
                    this.dropObject = $;
                    this.fire({
                        type: "dropover",
                        source: this.dropObject
                    },
                    this.dropObject);
                    break
                } else C = ($.el || $).parentNode
            }
        }
        if (this.dropObject) this.fire({
            type: "dropmove",
            source: this.dropObject
        },
        this.dropObject)
    },
    onStop: function(_) {
        if (!this.isDragging) return;
        this.event = _.event;
        this.now = _.now;
        this.onMove(_);
        if (this.canDrop && this.dropObject) {
            this.fire({
                type: "dropout",
                source: this.dropObject
            },
            this.dropObject);
            this.fire({
                type: "dragdrop",
                source: this.dropObject
            },
            this.dropObject)
        }
        var $ = [this.now[0] + this.xOffset, this.now[1] + this.yOffset];
        if (this.autoDragDrop) if (this.dragObject.set) this.dragObject.set("XY", $);
        else Edo.util.Dom.setXY(this.dragObject, $);
        this.fire({
            type: "dragcomplete",
            source: this
        });
        this.isDragging = false;
        this.alpha = 0.5;
        this.xy = this.enableDrop = this.now = this.drag = this.dropObject = this.dragObject = this.dragData = this.event = this.xOffset = this.yOffset = null;
        Edo.util.Dom.setStyle(this.proxy, "z-index", this._zIndex);
        Edo.util.Dom.setOpacity(this.proxy, this._opacity);
        if (this.el !== this.proxy && this.removeProxy) {
            Edo.util.Dom.remove(this.proxy);
            this.removeProxy = false
        }
        this.proxy = null
    }
};
Edo.managers.DragProxy = function($) {
    Edo.apply(this, $, {
        feedback: "no",
        html: " "
    })
};
Edo.managers.DragProxy.prototype = {
    setFeedback: function($) {
        if (this.feedback != $) {
            Edo.util.Dom.removeClass(this.el, this.getFeedbackCls(this.feedback));
            this.feedback = $;
            Edo.util.Dom.addClass(this.el, this.getFeedbackCls(this.feedback))
        }
    },
    setHtml: function($) {
        this.innerEl.innerHTML = $
    },
    getFeedbackCls: function($) {
        return "e-dragproxy-" + $
    },
    render: function($) {
        this.el = Edo.util.Dom.append($ || document.body, "<div class=\"e-dragproxy " + this.getFeedbackCls(this.feedback) + "\"><div class=\"feedback\"></div><div class=\"inner\">" + this.html + "</div></div>");
        this.feedbackEl = this.el.firstChild;
        this.innerEl = this.el.lastChild;
        if (this.shadow) Edo.util.Dom.addClass(this.el, "e-shadow");
        var _ = Edo.util.Dom.getSize(this.el);
        if (_.width < 25) Edo.util.Dom.setWidth(this.el, 25);
        if (_.height < 24) Edo.util.Dom.setHeight(this.el, 24);
        return this
    },
    destroy: function() {
        Edo.util.Dom.remove(this.el);
        this.el = this.feedbackEl = this.innerEl = null
    }
};
Edo.managers.DragProxy.getUpDownProxy = function() {
    if (!this.up) this.up = Edo.util.Dom.append(document.body, "<div class=\"e-dragproxy-up\"></div>");
    if (!this.down) this.down = Edo.util.Dom.append(document.body, "<div class=\"e-dragproxy-down\"></div>");
    this.up.style.visibility = "visible";
    this.down.style.visibility = "visible";
    return [this.up, this.down]
};
Edo.managers.DragProxy.hideUpDownProxy = function() {
    if (this.up) this.up.style.visibility = "hidden";
    if (this.down) this.down.style.visibility = "hidden"
};
Edo.managers.DragProxy.clearUpDownProxy = function() {
    if (this.up) {
        Edo.util.Dom.remove(this.up);
        this.up = null
    }
    if (this.down) {
        Edo.util.Dom.remove(this.down);
        this.down = null
    }
};
Edo.managers.DragProxy.getInsertProxy = function($) {
    if (!this.insert) this.insert = Edo.util.Dom.append(document.body, "<div></div>");
    this.insert.className = "e-dragproxy-insert" + ($ || "");
    this.insert.style.visibility = "visible";
    return this.insert
};
Edo.managers.DragProxy.hideInsertProxy = function() {
    if (this.insert) this.insert.style.visibility = "hidden"
};
Edo.managers.PopupManager = {
    zindex: 9100,
    popups: {},
    createPopup: function(C) {
        var F = C.target;
        if (!F) return false;
        var E = Edo.getBody();
        Edo.applyIf(C, {
            x: "center",
            y: "middle",
            modal: false,
            modalCt: E,
            onout: Edo.emptyFn,
            onin: Edo.emptyFn,
            onmousedown: Edo.emptyFn
        });
        var H = C.x,
        B = C.y,
        A = C.modalCt;
        if (Edo.isValue(C.width)) F._setWidth(C.width);
        if (Edo.isValue(C.height)) F._setHeight(C.height);
        var _ = this.zindex++;
        F._setStyle("z-index:" + _ + ";position:absolute;");
        C.zIndex = _;
        var G = Edo.util.Dom.getBox(A),
        $ = Edo.util.Dom.getViewSize(document);
        G.width = $.width;
        G.height = $.height;
        if (!F.layouted) F.doLayout();
        var D = F._getBox();
        if ((!H && H !== 0) || H == "center") H = (G.x + G.width / 2) - D.width / 2;
        if ((!B && B !== 0) || B == "middle") B = (G.y + G.height / 2) - D.height / 2;
        F.set("visible", true);
        F._setXY([H, B]);
        F.left = parseInt(F.el.style.left);
        F.top = parseInt(F.el.style.top);
        if (isOpera) F._setXY(H, B);
        if (C.modal) {
            Edo.util.Dom.mask(A);
            if (A._mask) A._mask.style.zIndex = _ - 1
        } else this.unmask(F, A);
        this.popups[F.id] = C;
        if (C.focus) F.focus.defer(30, F);
        setTimeout(function() {
            Edo.util.Dom.repaint(F.el)
        },
        10)
    },
    removePopup: function(_) {
        var $ = this.popups[_.id];
        if (!$) return;
        _._setX( - 3000);
        _.blur();
        if ($.modal) this.unmask(_, $.modalCt);
        delete _.modalCt;
        delete this.popups[_.id]
    },
    unmask: function(C, _) {
        var $ = false,
        B = -1;
        for (var D in this.popups) {
            if (D == C.id) continue;
            var A = this.popups[D];
            if (A.modalCt === _ && A.modal) {
                $ = true;
                B = A.zIndex;
                break
            }
        }
        if ($) {
            if (_._mask) _._mask.style.zIndex = B - 1
        } else Edo.util.Dom.unmask(_)
    }
};

//？？？
Edo.util.Dom.on(document, "mousedown", function(B) {
    var A = Edo.managers.PopupManager.popups;
    for (var _ in A) {
        var $ = A[_];
        $.onmousedown(B);
        if (!$.target.within(B)) $.onout(B);
        else $.onin(B)
    }
});

Edo.managers.ResizeManager = {
    all: {},
    overlay: null,
    startResize: function(A) {
        Edo.apply(this, A, {
            minWidth: 10,
            minHeight: 10,
            onresizestart: Edo.emptyFn,
            onresize: Edo.emptyFn,
            onresizecomplete: Edo.emptyFn
        });
        var $ = new Edo.util.Drag({
            onStart: this.onStart.bind(this),
            onMove: this.onMove.bind(this),
            onStop: this.onStop.bind(this)
        }),
        _ = this.target.el || this.target;
        this.initXY = this.event.xy;
        this.handlerBox = Edo.util.Dom.getBox(this.handlerEl);
        this.box = this.box || Edo.util.Dom.getBox(_);
        $.start(this.event)
    },
    reg: function(_) {
        var C = _.target.el || _.target,
        E = C.id;
        if (!E) throw new Error("必须指定id");
        if (this.all[E]) this.unreg(_);
        this.all[E] = _;
        _.minWidth = _.minWidth || _.target.minWidth || 10;
        _.minHeight = _.minHeight || _.target.minHeight || 10;
        _.els = {};
        if (!_.handlers) _.handlers = ["se"];
        for (var A = 0; A < _.handlers.length; A++) {
            var B = _.handlers[A],
            D = "<div direction=\"" + B + "\" class=\"e-resizer e-resizer-" + B + "\"></div>",
            $ = Edo.util.Dom.append(C, D);
            $.direction = B;
            if (_.resizable !== false) Edo.util.Dom.on($, "mousedown", this.onMouseDown, _);
            _.els[B] = $
        }
        if (!_.transparent) Edo.util.Dom.addClass(C, "e-resizer-over");
        if (_.cls) Edo.util.Dom.addClass(C, _.cls);
        if (_.square) Edo.util.Dom.addClass(C, "e-resizer-square")
    },
    unreg: function(B) {
        B = B.id || B;
        var $ = this.all[B];
        if ($) {
            for (var A in $.els) {
                var _ = $.els[A];
                Edo.util.Dom.clearEvent(_);
                Edo.util.Dom.removeClass(_, "e-resizer-over");
                Edo.util.Dom.removeClass(_, "e-resizer-square");
                Edo.util.Dom.remove(_)
            }
            delete this.all[$.id]
        }
    },
    fire: function(_, $) {
        this.size = this.box = this.getResizeBox(this.event);
        _ = Edo.apply(_, this);
        $ = $ || this.target;
        if ($.el) $.fireEvent(_.type, _);
        else Edo.util.Dom.fireEvent($, _.type, _);
        _["on" + _.type].call(this, _)
    },
    getOverlay: function($) {
        var _ = document;
        if (!this.overlay) {
            this.overlay = Edo.util.Dom.append(_.body, "<div class=\"e-resizer-overlay\"></div>");
            Edo.util.Dom.selectable(this.overlay, false)
        }
        Edo.util.Dom.setStyle(this.overlay, "cursor", $);
        Edo.util.Dom.setSize(this.overlay, Edo.util.Dom.getScrollWidth(_), Edo.util.Dom.getScrollHeight(_));
        _.body.appendChild(this.overlay)
    },
    getResizeBox: function(L) {
        var D = L.xy;
        this.offsetX = this.handlerBox.right - this.initXY[0];
        this.offsetY = this.handlerBox.bottom - this.initXY[1];
        this.offsetX2 = this.initXY[0] - this.handlerBox.x;
        this.offsetY2 = this.initXY[1] - this.handlerBox.y;
        var E = D[0] + this.offsetX,
        A = D[1] + this.offsetY,
        I = D[0] - this.offsetX,
        H = D[1] - this.offsetY,
        K = this.box.x,
        G = this.box.y,
        _ = this.box.width,
        B = this.box.height,
        $ = this.box.right,
        F = this.box.bottom,
        J = this.minWidth || 0,
        C = this.minHeight || 0;
        switch (this.handler) {
        case "e":
            _ = E - K;
            _ = Math.max(J, _);
            break;
        case "s":
            B = A - G;
            B = Math.max(C, B);
            break;
        case "se":
            _ = E - K;
            _ = Math.max(J, _);
            B = A - G;
            B = Math.max(C, B);
            break;
        case "n":
            if (F - H < C) G = F - C;
            else G = H;
            B = F - G;
            break;
        case "w":
            if ($ - I < J) K = $ - J;
            else K = I;
            _ = $ - K;
            break;
        case "nw":
            if (F - H < C) G = F - C;
            else G = H;
            B = F - G;
            if ($ - I < J) K = $ - J;
            else K = I;
            _ = $ - K;
            break;
        case "ne":
            if (F - H < C) G = F - C;
            else G = H;
            B = F - G;
            _ = E - K;
            _ = Math.max(J, _);
            break;
        case "sw":
            if ($ - I < J) K = $ - J;
            else K = I;
            _ = $ - K;
            B = A - G;
            B = Math.max(C, B);
            break
        }
        return {
            x: K,
            y: G,
            width: _,
            height: B,
            right: K + _,
            bottom: G + B
        }
    },
    onStart: function($) {
        this.event = $.event;
        var _ = this.handlerEl;
        if (this.autoProxy !== false) {
            this.proxy = Edo.util.Dom.append(document.body, "<div class=\"e-resizer-proxy\"></div>");
            Edo.util.Dom.setBox(this.proxy, this.box)
        }
        this.getOverlay(Edo.util.Dom.getStyle(_, "cursor"));
        this.fire({
            type: "resizestart",
            target: this
        })
    },
    onMove: function($) {
        this.event = $.event;
        if (this.autoProxy !== false) {
            var _ = this.getResizeBox(this.event);
            Edo.util.Dom.setBox(this.proxy, _)
        }
        this.fire({
            type: "resize",
            target: this
        })
    },
    onStop: function($) {
        this.event = $.event;
        var _ = this.getResizeBox(this.event);
        if (this.autoResize !== false) if (this.target.el) this.target.set("size", _);
        else Edo.util.Dom.setSize(this.target, _.width, _.height);
        Edo.util.Dom.remove(this.overlay);
        if (this.autoProxy !== false) Edo.util.Dom.remove(this.proxy);
        this.fire({
            type: "resizecomplete",
            target: this
        });
        this.autoResize = this.handler = this.handlerEl = this.proxy = this.initXY = this.handlerBox = this.box = this.autoProxy = null
    },
    onMouseDown: function(B) {
        if (B.button != 0) return false;
        var A = B.target,
        _ = this.target.el || this.target,
        $ = A.direction;
        if ($ && A.parentNode === _) {
            Edo.managers.ResizeManager.startResize(Edo.applyIf({
                target: this.target,
                event: B,
                handler: $,
                handlerEl: A,
                minWidth: this.minWidth,
                minHeight: this.minHeight
            },
            this));
            B.stop()
        }
    }
};
Edo.managers.TipManager = {
    tips: {},
    tpl: new Edo.util.Template("<div class=\"e-tip <%=this.cls%>\"><%if(this.showTitle){%><div class=\"e-tip-header\"><%= this.title%><%if(this.showClose){%><div class=\"e-tip-close\" onclick=\"Edo.managers.TipManager.hide('<%= this.target.id%>')\"></div><%}%></div><%}%><div class=\"e-group-body\"><%= this.html%></div></div>"),
    show: function(F, B, C) {
        this.hide(C);
        var A = C.target;
        if (!C.tipEl) {
            var E = this.tpl.run(C);
            C.tipEl = Edo.util.Dom.append(document.body, E)
        }
        var F = F + C.mouseOffset[0],
        B = B + C.mouseOffset[1],
        D = Edo.util.Dom.getSize(C.tipEl),
        $ = Edo.util.Dom.getViewWidth(document),
        _ = Edo.util.Dom.getViewHeight(document);
        if (F + D.width > $) F = $ - D.width;
        if (B + D.height > _) B = _ - D.height;
        Edo.util.Dom.setXY(C.tipEl, [F, B])
    },
    hide: function($) {
        if (!$) return;
        if (typeof $ === "string") $ = this.tips[$];
        clearTimeout($.showTimer);
        Edo.util.Dom.remove($.tipEl);
        $.tipEl = null
    },
    clear: function($) {
        if ($.tipEl) {
            Edo.util.Dom.remove($.tipEl);
            $.tipEl = null
        }
        return $
    },
    reg: function(_) {
        _ = Edo.apply({},
        _, {
            target: null,
            cls: "",
            html: "",
            title: "",
            ontipshow: Edo.emptyFn,
            ontiphide: Edo.emptyFn,
            showTitle: false,
            autoShow: true,
            autoHide: true,
            showClose: false,
            showImage: false,
            trackMouse: false,
            showDelay: 100,
            hideDelay: 200,
            mouseOffset: [15, 18]
        });
        if (!_.target) return false;
        this.unreg(_.target);
        var $ = _.target;
        this.tips[$.id] = _;
        if (_.autoShow) if (_.trackMouse) $.on("mousemove", this.onmousemove, this);
        else $.on("mouseover", this.onmouseover, this);
        $.on("mouseout", this.onmouseout, this);
        return _
    },
    unreg: function(A) {
        var _ = this.tips[A.id];
        if (_) {
            this.hide(_);
            var $ = _.target;
            $.un("mouseover", this.onmouseover, this);
            $.un("mousemove", this.onmousemove, this);
            $.un("mouseout", this.onmouseout, this);
            delete this.tips[A.id]
        }
    },
    onmouseover: function(A) {
        var _ = this.tips[A.source.id];
        if (_.tipEl) {
            var $ = A.getRelatedTarget();
            if (Edo.util.Dom.contains(A.source.el, $)) return
        }
        if (_.ontipshow(A) !== false) _.showTimer = this.show.defer(_.showDelay, this, [A.xy[0], A.xy[1], _]);
        else if (_.autoHide) _.hideTimer = this.hide.defer(_.hideDelay, this, [_])
    },
    onmousemove: function(_) {
        var $ = this.tips[_.source.id];
        if ($.ontipshow(_) !== false) this.show(_.xy[0], _.xy[1], $);
        else if ($.autoHide) $.hideTimer = this.hide.defer($.hideDelay, this, [$])
    },
    onmouseout: function(A) {
        var $ = A.getRelatedTarget(),
        _ = this.tips[A.source.id];
        if (Edo.util.Dom.contains(A.source.el, $)) return;
        if (_.autoHide) {
            _.ontiphide(A);
            if (_.showTimer) {
                clearTimeout(_.showTimer);
                _.showTimer = null
            }
            _.hideTimer = this.hide.defer(_.hideDelay, this, [_])
        }
    }
};
Edo.data.DataModel = function() {
    Edo.data.DataModel.superclass.constructor.call(this);
    this.fields = [];
    this.fieldsMap = {}
};
Edo.data.DataModel.extend(Edo.core.Component, {
    _setFields: function(A) {
        if (!A) A = [];
        this.fieldsMap = {};
        for (var $ = 0, B = A.length; $ < B; $++) {
            var _ = A[$];
            if (typeof _ == "string") A[$] = {
                name: _
            };
            if (typeof _.mapping == "undefined") _.mapping = _.name;
            if (typeof _.convert == "string") _.convert = Edo.data.DataModel[_.convert.toLowerCase()];
            if (_.type) _.type = _.type.toLowerCase();
            this.fieldsMap[_.name] = _
        }
        this.fields = A
    },
    getField: function($) {
        return this.fieldsMap[$]
    },
    convert: function(A) {
        if (!A) A = [];
        if (! (A instanceof Array)) A = [A];
        for (var _ = 0, B = A.length; _ < B; _++) {
            var $ = A[_];
            this.convertRecord($)
        }
        return A
    },
    convertRecord: function(A) {
        var D = this.fields,
        G = this.getMappingValue;
        for (var _ = 0, E = D.length; _ < E; _++) {
            var C = D[_],
            B = C.mapping,
            F = B.indexOf(".") == -1 ? A[B] : G(A, B);
            F = A[C.name] = C.convert ? C.convert(F, A, C) : F;
            if (C.type) {
                var $ = Edo.data.Convertor[C.type.toLowerCase()];
                A[C.name] = $ ? $(F, A, C) : F
            }
        }
        return A
    },
    getMappingValue: function($, B) {
        var A = B.split("."),
        D = $;
        for (var _ = 0, C = A.length; _ < C; _++) D = D[A[_]];
        return D
    },
    newRecord: function($) {
        var A = {},
        C = this.fields;
        for (var _ = 0, D = C.length; _ < D; _++) {
            var B = C[_];
            if (Edo.isValue(B.defaultValue)) A[B.name] = B.defaultValue
        }
        Edo.apply(A, $);
        return A
    },
    errorMsg: "错误",
    valid: function(C, J) {
        if (!C || C === true) return;
        if (! (C instanceof Array)) C = [C];
        if (this.fields.length == 0) return true;
        var M = true,
        E = false,
        D = this.fields,
        I = [];
        for (var H = 0, F = C.length; H < F; H++) {
            if (E) break;
            var $ = C[H],
            G = {
                record: $,
                fields: []
            };
            for (var K = 0, A = D.length; K < A; K++) {
                var L = D[K];
                if (L.required !== true && !L.valid) continue;
                var _ = Edo.getValue($, L.name),
                B = this.validField($, L.name, _);
                if (B !== true) {
                    M = false;
                    G.fields.add({
                        name: L.name,
                        value: _,
                        errorMsg: B === false ? this.errorMsg: B
                    });
                    if (!J) {
                        E = true;
                        break
                    }
                }
            }
            if (G.fields.length > 0) I.add(G)
        }
        if (I.length > 0) this.fireEvent("invalid", {
            type: "invalid",
            source: this,
            errors: I
        });
        else this.fireEvent("valid", {
            type: "valid",
            source: this,
            errors: I
        });
        return M
    },
    requiredMsg: "不能为空",
    validField: function($, E, _, D) {
        var C = true,
        B = this.getField(E);
        if (B && (B.required || B.valid)) {
            var A = B.valid;
            if (typeof A === "string") A = Edo.core.Validator[A.toLowerCase()];
            _ = arguments.length == 2 ? Edo.getValue($, E) : _;
            if (B.required === true) if (_ === undefined || _ === null || _ === "") C = this.requiredMsg;
            if (C === true && A) C = A(_, $, E, this)
        }
        if (D === true) if (C !== true) this.fireEvent("invalid", {
            type: "invalid",
            source: this,
            action: "field",
            record: $,
            field: E,
            value: _,
            errorMsg: C
        });
        else this.fireEvent("valid", {
            type: "valid",
            action: "field",
            source: this,
            record: $,
            field: E,
            value: _
        });
        return C
    }
});
Edo.data.DataModel.regType("DataModel");
Edo.data.Convertor = {
    stripRe: /[\$,%]/g,
    "string": function(A, $, _) {
        return (A === undefined || A === null) ? "": String(A)
    },
    "int": function(A, $, _) {
        return A !== undefined && A !== null && A !== "" ? parseInt(String(A).replace(this.stripRe, ""), 10) : 0
    },
    "float": function(A, $, _) {
        return A !== undefined && A !== null && A !== "" ? parseFloat(String(A).replace(stripRe, ""), 10) : ""
    },
    "bool": function($) {
        return $ === true || $ === "true" || $ == 1
    },
    "date": function(C, $, B) {
        if (!C) return "";
        if (Edo.isDate(C)) return C;
        var A = B.dateFormat;
        if (A) {
            if (A == "timestamp") return new Date(C * 1000);
            if (A == "time") return new Date(parseInt(C, 10));
            return Date.parseDate(C, A)
        }
        var _ = Date.parse(C);
        return _ ? new Date(_) : null
    },
    "array": function(A, $, _) {
        if (!A && (A !== 0 || A !== false)) return [];
        return A.push ? A: [A]
    }
};

/**
 * 表格数据源
 * 
 * TypeName:	datatable
 * Namespace:	Edo.data
 * ClassName:	DataTable
 * Extend:		Edo.core.Component
 */
Edo.data.DataTable = function($) {
    Edo.data.DataTable.superclass.constructor.call(this);
    /**
     * 源Array数组对象
     */
    this.source = this.view = [];//数据视图(如过滤/排序/折叠后的数据视图)
    this.modified = {};
    this.removed = {};
    this.idHash = {};
    this.load($)
};
Edo.data.DataTable.extend(Edo.data.DataModel, {
    componentMode: "data",
    autoValid: true,
    dataTable: true,
    getSource: function() {
        return this.source
    },
    _setData: function($) {
        this.load($)
    },
    refresh: function($, _, A) {
        this.view = this.createView($ || this.view);
        this.fire(_ || "refresh", A)
    },
    
    /**
     * 加载数据
     * 
     * @param data : Array 数组形式的数据
     */
    load: function(_, $) {
        if (!_) _ = [];
        var A = {
            data: _
        };
        if (this.fire("beforeload", A) !== false) {
            this._doLoad(_);
            this.source = _;
            this.modified = {};
            this.removed = {};
            this.view = this.createView($ || _);
            this.changed = false;
            this.canFire = true;
            this.fire("load", A);
        }
    },
    isChanged: function() {
        var $ = this.changed;
        if (!$) $ = this.getAdded() != 0;
        if (!$) $ = this.getUpdated() != 0;
        if (!$) $ = this.getDeleted() != 0;
        return $;
    },
    createView: function($) {
        return $;
    },
    
    /**
     * 重加载数据, 去除新增/删除/修改的数据标记
     */
    reload: function() {
        this.source.each(function($) {
            delete $.__status
        });
        this.load(this.source, this.view)
    },
    
    /**
     * 增加数据
     * 
     * @param record : Object 单个对象
     */
    add: function(record) {
        this.insert(this.view.length, record);
    },
    
    /**
     * 增加数据
     * 
     * @param records : Object 单个对象
     */
    addRange: function(records) {
        this.insertRange(this.view.length, records);
    },
    
    /**
     * 插入数据
     * 
     * @param index : Number
     * @param record : Object 单个对象
     */
    insert: function(index, record) {
        this.insertRange(index, [record])
    },
    
    /**
     * 插入多个数据
     * 
     * @param index : Number
     * @param records : Array数组对象
     */
    insertRange: function(index, records) {
        if (!records || !(records instanceof Array)) return;
        var _ = this.source,
        E = this.view;
        for (var B = 0, $ = records.length; B < $; B++) {
            var C = records[B];
            E.insert(index + B, C);
            if (_ !== E) _.insert(index, C);
            this._doAdd(C);
            if (this.autoValid) this.valid(C, true)
        }
        this.fire("add", {
            records: records,
            index: index
        });
        this.changed = true
    },
    
    /**
     * 删除数据
     * 
     * @param record : Object 数据对象
     */
    remove: function(record) {
        this.removeRange([record])
    },
    
    /**
     * 根据索引删除数据
     * 
     * @param index : Number
     */
    removeAt: function(index) {
        this.remove(this.getAt(index));
    },
    
    /**
     * 删除多条数据
     * 
     * @param records : Array 数据对象数组
     */
    removeRange: function(records) {
        if (!records || !(records instanceof Array)) return;
        records = records.clone();
        for (var A = 0, C = records.length; A < C; A++) {
            var _ = records[A],
            $ = this.view.indexOf(_);
            if ($ > -1) {
                this.view.removeAt($);
                this.source.remove(_);
                this._doRemove(_)
            }
        }
        this.fire("remove", {
            records: records
        });
        this.changed = true
    },
    
    /**
     * 批量更新数据对象属性值
     * 
     * @param record : Object 数据对象
     * @param properties : Object {key: value, ..}形式的对象
     */
    updateRecord: function(record, properties) {
        var A = this.canFire;
        this.beginChange();
        for (var B in properties) this.update(record, B, properties[B]);
        this.canFire = A;
        this.fire("update", {
            record: record
        });
        this.changed = true;
        if (this.autoValid) this.valid(record, true)
    },
    
    /**
     * 更新数据对象属性值
     * 
     * @param record : Object 数据对象
     * @param field : String 属性名
     * @param value : Object 属性值
     */
    update: function(record, field, value) {
        var A = Edo.getValue(record, field),
        B = typeof(A);
        if (B == "object") {
            if (A === value) return false
        } else if (String(A) == String(value)) return false;
        Edo.setValue(record, field, value);
        this._doUpdate(record, field, A);
        this.fire("update", {
            record: record,
            field: field,
            value: value
        });
        this.changed = true;
        if (this.autoValid) this.validField(record, field, value, true);
        return true
    },
    
    /**
     * 移动数据对象
     * 
     * @param record : Object 数据对象
     * @param index : Number
     */
    move: function(record, index) {
        var B = Edo.isInt(index) ? this.getAt(index) : index;
        if (!Edo.isArray(record)) record = [record];
        for (var C = 0, D = record.length; C < D; C++) {
            var _ = record[C];
            this.view.remove(_);
            if (B) {
                var index = this.indexOf(B);
                this.view.insert(index, _)
            } else this.view.add(_)
        }
        this.fire("move", {
            records: record,
            index: this.indexOf(B)
        });
        this.changed = true
    },
    
    /**
     * 清除数据
     */
    clear: function() {
        this.source = this.view = [];
        this.modified = {};
        this.removed = {};
        this.fire("clear");
        this.changed = true
    },
    
    /**
     * 还原行数据对象,一个被修改过的行对象, 换到到修改前
     * 
     * @param record : Object 数据对象
     */
    reset: function($) {
        var _ = this.modified[$.__id];
        if (_) {
            Edo.apply($, _);
            delete this.modified[$.__id];
            delete $.status;
            this.fire("reset", {
                record: $
            })
        }
    },
    
    /**
     * 还原行数据对象的某个属性
     * 
     * @param record : Object 数据对象
     * @param field : String 属性名
     */
    resetField: function(record, field) {
        var _ = this.modified[record.__id];
        if (_) {
            var B = _[field];
            if (typeof B !== "undefined") {
                delete _[field];
                record[field] = B;
                this.fire("resetfield", {
                    record: record,
                    field: field,
                    value: B
                })
            }
        }
    },
    
    /**
     * 排序数据
     * 
     * @param sortFn : Function 排序算法函数
     */
    sort: function(sortFn) {
        this.view.sortByFn(sortFn);
        if (this.view !== this.source) this.source.sortByFn(sortFn);
        this.fire("sort");
    },
    
    /**
     * 针对某一个field行属性进行升降排序
     * 
     * @param field : String 属性名
     * @param direction : String 排序方向.ASC或DESC
     */
    sortField: function(field, direction) {
        direction = direction || "ASC";
        var A;
        if (direction.toUpperCase() == "ASC") A = function(B, field) {
            var direction = B[f],
            A = field[f];
            return direction > A ? 1: (direction < A ? -1: 0)
        };
        else A = function(B, field) {
            var direction = B[f],
            A = field[f];
            return direction < A ? 1: (direction > A ? -1: 0)
        };
        this.sort(A)
    },
    
    /**
     * 过滤数据
     * 
     * @param fn : Function 过滤算法函数 
     * @param scope : Object 过滤函数中的this指向对象
     */
    filter: function(E, C) {
        var $ = this.view = [],
        B = this.source;
        for (var A = 0, D = B.length; A < D; A++) {
            var _ = B[A];
            if (E.call(C, _, A, B) !== false) $[$.length] = _
        }
        this.view = this.createView(this.view);
        this.fire("filter");
    },
    
    /**
     * 清除过滤, 还原数据视图
     */
    clearFilter: function() {
        this.filterFn = null;
        if (this.isFiltered()) {
            this.view = this.createView(this.source);
            this.fire("filter");
        }
    },
    
    /**
     * 判断数据视图是否被过滤过
     * 
     * @return Boolea
     */
    isFiltered: function() {
        return this.view.length != this.source.length
    },
    
    /**
     * 查找一个符合特征的对象
     * 
     * @param attributes : Object {key:value}形式的特性对象
     * @return Object
     */
    findIndex: function(attributes, E) {
        if (E === true) E = this.source;
        E = E || this.view;
        for (var _ = 0, D = E.length; _ < D; _++) {
            var $ = E[_];
            if ($ === attributes) return _;
            var B = true;
            for (var C in attributes) if (attributes[C] != $[C]) {
                B = false;
                break
            }
            if (B) return _
        }
        return - 1
    },
    
    /**
     * 查找一个符合特征的对象
     * 
     * @param attributes : Object {key:value}形式的特性对象
     * @return Object
     */
    find: function(attributes, _) {
        if (_ !== false) _ = this.source;
        _ = _ || this.view;
        return _[this.findIndex(attributes, _)];
    },
    
    /**
     * 根据id查找对象(从源数据)
     * 
     * @param id : String row.__id
     * @return Object
     */
    getById: function(rowId) {
        return this.idHash[rowId];
    },
    
    /**
     * 根据id查找对象(从数据视图)
     * 
     * @param id : String row.__id
     * @return Object
     */
    getViewById: function(rowId) {
        return this.viewHash[rowId];
    },
    
    /**
     * 根据index查找对象(从数据视图)
     * 
     * @param index : Number
     * @return Object
     */
    getAt: function(index) {
        return this.view[index];
    },
    
    /**
     * 根据对象查找对象的索引号
     * 
     * @param record : Object
     * @return Number
     */
    indexOf: function(record) {
        return this.view.indexOf(record)
    },
    
    /**
     * 根据id查找对象的索引号
     * 
     * @param id : String
     * @return Number
     */
    indexOfId: function(id) {
        var $ = this.idHash[id];
        return $ ? this.indexOf($) : -1
    },
    
    /**
     * 数据视图行对象数目
     * 
     * @return Number
     */
    getCount: function() {
        return this.view.length;
    },
    
    /**
     * 是否是空数据
     * 
     * @return Boolean
     */
    isEmpty: function() {
        return this.view.length == 0
    },
    
    /**
     * 遍历数据视图
     * 
     * @param fn : Function
     * @param scope : Object
     */
    each: function(fn, scope) {
        this.view.each(fn, scope);
    },
    fire: function($, _) {
        if (this.canFire) {
            _ = Edo.apply({
                type: "datachange",
                action: $,
                source: this
            },
            _);
            this._onFire(_);
            if (["beforeload", "load", "refresh", "filter", "collapse", "expand", "sort"].indexOf($) == -1) this.changed = true;
            return this.fireEvent("datachange", _)
        }
    },
    
    /**
     * 判断一个行数据是否被修改过
     * 
     * @param record : Object
     * @return Boolean
     */
    isModify: function($) {
        var _ = this.modified[$.__id];
        if (!_) return false;
        return true
    },
    
    /**
     * 判断一个行数据的某个属性是否被修改过
     * 
     * @param record : Object
     * @param field : String
     * @return Boolean
     */
    isFieldModify: function(record, field) {
        var _ = this.modified[record.__id];
        if (!_) return false;
        if (typeof(_[field]) !== "undefined") return true;
        return false;
    },
    
    /**
     * 开始改变数据(这时候调用add,update,remove等方法是不会激发datachange事件的)
     */
    beginChange: function() {
        this.canFire = false
    },
    
    /**
     * 结束改变数据(激发datachange事件)
     */
    endChange: function($, _) {
        this.canFire = true;
        this.refresh(null, $, _);
        if (this.autoValid) {
        	this.valid(true, true)
        }
    },
    
    /**
     * 获得删除的数据
     * 
     * @param idField : String 行记录的唯一值属性,比如id, uid等
     * @return Array
     */
    getDeleted: function() {
        var A = [],
        _ = this.removed;
        for (var B in _) {
            var $ = _[B];
            A.add($)
        }
        return this.clearData(A)
    },
    getUpdated: function(E) {
        E = E || this.idField;
        var F = [];
        if (E === true) {
            F = [];
            for (var _ = 0, D = this.source.length; _ < D; _++) {
                var $ = this.source[_];
                if ($.__status == "update") F.add($)
            }
            return this.clearData(F)
        } else {
            var B = this.modified;
            for (var G in B) {
                var $ = B[G],
                A = this.getById(G);
                $[E] = A[E];
                F.add($);
                for (var C in $) $[C] = A[C]
            }
        }
        return this.clearData(F)
    },
    clearData: function(B) {
        var $ = [];
        for (var _ = 0, A = B.length; _ < A; _++) $.add(Edo.data.cloneData(B[_]));
        return $
    },
    
    /**
     * 获得新增的数据
     * 
     * @return Array
     */
    getAdded: function() {
        var B = [];
        for (var _ = 0, A = this.source.length; _ < A; _++) {
            var $ = this.source[_];
            if ($.__status == "add") B.add($)
        }
        return this.clearData(B)
    },
    _doLoad: function(A) {
        if (this.fields.length > 0) A = this.convert(A);
        var C = this.idHash = {},
        D = Edo.data.DataTable.id;
        for (var $ = 0, B = A.length; $ < B; $++) {
            var _ = A[$];
            if (!_.__id || C[_.__id]) _.__id = D++;
            C[_.__id] = _;
            delete _.__status
        }
        Edo.data.DataTable.id = D
    },
    _doAdd: function($) {
        if ($.__id) {
            var _ = this.idHash[$.__id];
            if (_) if (_ !== $) $.__id = null
        }
        if (!$.__id) $.__id = Edo.data.DataTable.id++;
        this.idHash[$.__id] = $;
        if (!$.__status) $.__status = "add";
        else delete $.__status
    },
    _doRemove: function($) {
        if ($.__status != "add") {
            $.__status = "remove";
            this.removed[$.__id] = $
        }
        delete this.idHash[$.__id];
        delete this.modified[$.__id]
    },
    idField: "id",
    _doUpdate: function($, B, A) {
        if ($.__status != "add") {
            $.__status = "update";
            var _ = this.modified[$.__id];
            if (!_) _ = this.modified[$.__id] = {};
            if (typeof _[B] === "undefined") _[B] = A
        }
    },
    _onFire: function(D) {
        if (D.action == "update") return;
        var C = this.viewHash = {},
        $ = this.view;
        for (var _ = 0, B = $.length; _ < B; _++) {
            var A = $[_];
            C[A.__id] = A;
            A.__index = _
        }
    },
    getRecord: function($) {
        var _ = Edo.type($);
        if (_ == "number") $ = this.getAt($);
        else if (_ == "string") $ = this.getById($);
        return $
    },
    selected: null,
    getSelectedIndex: function() {
        return this.indexOf(this.selected)
    },
    getSelected: function() {
        if (!this.selected || this.indexOf(this.selected) == -1) {
            this.selected = null;
            return null
        }
        return this.selected
    },
    isSelected: function($) {
        $ = this.getRecord($);
        if ($ == this.selected) return true;
        return false
    },
    select: function($) {
        $ = this.getRecord($);
        if (!$ || this.isSelected($)) return false;
        if (this.fireEvent("beforeselectionchange", {
            type: "beforeselectionchange",
            source: this,
            selected: $
        }) === false) return false;
        this.selected = $;
        this.fireEvent("selectionchange", {
            type: "selectionchange",
            source: this,
            selected: this.selected
        });
        if (this.autoValid) this.valid($, true)
    },
    deselect: function($) {
        $ = this.getRecord($);
        if (!$ || !this.isSelected($)) return false;
        if (this.fireEvent("beforeselectionchange", {
            type: "beforeselectionchange",
            source: this,
            selected: this.selected,
            deselected: $
        }) === false) return false;
        this.selected = null;
        this.fireEvent("selectionchange", {
            type: "selectionchange",
            source: this,
            selected: this.selected
        })
    },
    clearSelect: function() {
        this.deselect(this.selected)
    },
    firstSelect: function() {
        this.select(0)
    },
    prevSelect: function() {
        this.select(this.getSelectedIndex() - 1)
    },
    nextSelect: function() {
        this.select(this.getSelectedIndex() + 1)
    },
    lastSelect: function() {
        this.select(this.getCount() - 1)
    },
    valid: function($, _) {
        if (!$ || $ === true) $ = this.view;
        return Edo.data.DataTable.superclass.valid.call(this, $, _)
    },
    _setFields: function($) {
        Edo.data.DataTable.superclass._setFields.call(this, $);
        this.convert(this.source)
    }
});
Edo.data.DataTable.id = 1000;
Edo.data.DataTable.regType("datatable");
//Edo.data.DataTable : END

Edo.data.cloneData = function($) {
    var _ = null;
    if ($ instanceof Array) _ = $.clone();
    else _ = Edo.apply({},
    $);
    delete _.__id;
    delete _.__index;
    delete _.__status;
    delete _.__pid;
    delete _.__preid;
    delete _.__nextid;
    delete _.__hasChildren;
    delete _.__depth;
    delete _.expanded;
    delete _.__height;
    return _
};

/**
 * 树形数据源
 * 
 * @see http://edojs.com/api/#Edo.data.DataTree
 * TypeName:	datatree
 * Namespace:	Edo.data
 * ClassName:	DataTree
 * Extend:	Edo.data.DataTable
 */
Edo.data.DataTree = function($) {
    Edo.data.DataTree.superclass.constructor.call(this, $)
};
Edo.data.DataTree.extend(Edo.data.DataTable, {
    getSource: function() {
        return this.children
    },
    reload: function() {
        this.source.each(function($) {
            delete $.__status
        });
        this.load(this.children, this.view)
    },
    load: function(A, $) {
        if (!A) A = [];
        if (! (A instanceof Array)) A = [A];
        this.children = A;
        this.source = [];
        var _ = [];
        this._createTable(A, _);
        this.source = _;
        if (!$) {
            $ = [];
            this._createTree(this.children, -1, 0, $, this.filterFn)
        }
        Edo.data.DataTree.superclass.load.call(this, _, $)
    },
    syncTreeView: function(_, A) {
        var $ = [];
        this._createTree(this.children, -1, 0, $, this.filterFn);
        this.refresh($, _, A)
    },
    collapse: function($, _) {
        $.expanded = false;
        if (_) this.iterateChildren($, 
        function($) {
            $.expanded = false
        });
        this.canFire = true;
        this.syncTreeView("collapse", {
            record: $
        })
    },
    expand: function($, A) {
        $.expanded = true;
        var _ = this.findParent($);
        while (_) {
            _.expanded = true;
            _ = this.findParent(_)
        }
        if (A) this.iterateChildren($, 
        function($) {
            $.expanded = true
        });
        this.canFire = true;
        this.syncTreeView("expand", {
            record: $
        })
    },
    expandAll: function() {
        this.source.each(function($) {
            this.expand($, true)
        },
        this)
    },
    collapseAll: function() {
        this.source.each(function($) {
            this.collapse($, true)
        },
        this)
    },
    toggle: function($, _) {
        if ($.expanded) this.collapse($, _);
        else this.expand($, _)
    },
    add: function($, _) {
        if (!_) _ = this;
        if (!_.children) _.children = [];
        return this.insert(_.children.length, $, _)
    },
    addRange: function(_, $) {
        if (!$) $ = this;
        if (!$.children) $.children = [];
        return this.insertRange($.children.length, _, $)
    },
    insert: function($, _, A) {
        this.insertRange($, [_], A)
    },
    insertRange: function(_, C, F) {
        if (!C || !(C instanceof Array)) return;
        if (!F) F = this;
        if (!F.children) F.children = [];
        var E = F.children;
        for (var A = 0, $ = C.length; A < $; A++) {
            var B = C[A];
            E.insert(_ + A, B);
            this._doAdd(B);
            this.iterateChildren(B, 
            function($) {
                this._doAdd($)
            },
            this)
        }
        var D = [];
        this._createTable(this.children, D);
        this.source = D;
        this.syncTreeView("add", {
            records: C,
            index: _,
            parentNode: F
        });
        this.changed = true
    },
    remove: function(_) {
        var A = this.findParent(_);
        if (A) {
            A.children.remove(_);
            this.source.remove(_);
            this._doRemove(_);
            var $ = [];
            this._createTable(this.children, $);
            this.source = $;
            this.syncTreeView("remove", {
                records: [_],
                parent: A
            });
            this.changed = true
        }
    },
    _doAdd: function($) {
        Edo.data.DataTree.superclass._doAdd.call(this, $);
        this.iterateChildren($, 
        function($) {
            Edo.data.DataTree.superclass._doAdd.call(this, $)
        },
        this)
    },
    _doRemove: function($) {
        Edo.data.DataTree.superclass._doRemove.call(this, $);
        this.iterateChildren($, 
        function($) {
            Edo.data.DataTree.superclass._doRemove.call(this, $)
        },
        this)
    },
    removeAt: function($, A) {
        if (!A) throw new Error("父节点为空");
        var _ = A && A.children ? A.children[$] : null;
        if (_) this.remove(_, A)
    },
    removeRange: function(A, B) {
        if (!A || !(A instanceof Array)) return;
        A = A.clone();
        for (var _ = 0, C = A.length; _ < C; _++) {
            var $ = A[_];
            B = this.findParent($);
            if (B) {
                B.children.remove($);
                this.source.remove($);
                this._doRemove($)
            }
        }
        this.changed = true;
        if (this.canFire) this.syncTreeView("remove", {
            records: A,
            parent: B
        })
    },
    move: function(G, C, _) {
        if (!G) return;
        if (!Edo.isArray(G)) G = [G];
        var E = this.findParent(C);
        if (!E) return;
        this.beginChange();
        for (var K = 0, H = G.length; K < H; K++) {
            var D = G[K],
            $ = E.children.indexOf(C);
            if (Edo.isNumber(_)) {
                E = C;
                $ = _
            } else if (_ == "append") $ += 1;
            else if (_ == "add") {
                E = C;
                if (!E.children) E.children = [];
                $ = E.children.length
            } else if (_ == "preend");
            if (this.isAncestor(D, E) || D == E) return false;
            var B = this.findParent(D);
            if (B == E) {
                var I = B.children.indexOf(D);
                if (I <= $) $ -= 1
            }
            var F = D.__status,
            A = E.__status,
            J = this.findParent(D);
            J.children.remove(D);
            E.children.insert($, D);
            D.__status = F;
            E.__status = A
        }
        this.endChange("move", {
            records: G,
            index: $,
            parentNode: E
        });
        this.changed = true
    },
    endChange: function($, A) {
        var _ = [];
        this._createTable(this.children, _);
        this.source = _;
        this.syncTreeView("action", A);
        Edo.data.DataTree.superclass.endChange.call(this, $, A)
    },
    filter: function(A, _) {
        var $ = [];
        this.filterFn = A;
        this._createTree(this.children, -1, 0, $, A, _);
        this.refresh($, "filter")
    },
    findParent: function($) {
        var _ = this.getById($.__pid);
        if (!_ && this.getById($.__id)) _ = this;
        return _
    },
    findTop: function($) {
        while (1) {
            if ($.__pid == -1) return $;
            $ = this.getById($.__pid)
        }
    },
    getChildAt: function(_, $) {
        if (_.children) return _.children[$]
    },
    indexOfChild: function($, _) {
        if ($.children) return $.children.indexOf(_);
        return - 1
    },
    isFirst: function($) {
        return ! $.__preid
    },
    isLast: function($) {
        return ! $.__nextid
    },
    isLeaf: function($) {
        return ! $.children || $.children.length == 0
    },
    getPrev: function($) {
        return this.getById($.__preid)
    },
    getNext: function($) {
        return this.getById($.__nextid)
    },
    getPath: function($, _) {},
    getDepth: function($) {
        return $.__depth
    },
    eachChildren: function($, B, A) {
        var _ = $.children;
        if (_) _.each(B, A)
    },
    iterateChildren: function(C, E, B) {
        if (!E) return;
        C = C || this;
        var A = C.children;
        if (A) for (var $ = 0, D = A.length; $ < D; $++) {
            var _ = A[$];
            if (E.call(B || this, _, $) === false) return;
            this.iterateChildren(_, E, B)
        }
    },
    contains: function($, _) {
        while (_.__pid != -1) {
            if (_.__pid == $.__id) return true;
            _ = this.getById(_.__pid)
        }
        return false
    },
    hasChildren: function($) {
        return $.children && $.children.length > 0
    },
    _createTable: function(A, _) {
        for (var $ = 0, D = A.length; $ < D; $++) {
            var C = A[$];
            if (!C.__id) C.__id = Edo.data.DataTable.id++;
            var B = C.children;
            _[_.length] = C;
            if (B && B.length > 0) this._createTable(B, _)
        }
    },
    _createTree: function(_, E, A, I, G, J) {
        if (!G) G = this.filterFn;
        var F = false;
        for (var H = 0, D = _.length; H < D; H++) {
            var K = _[H];
            K.__pid = E;
            K.__depth = A;
            K.__hasChildren = K.children && K.children.length > 0;
            if (typeof(K.expanded) === "undefined") K.expanded = true;
            else K.expanded = !!K.expanded;
            K.__preid = K.__nextid = null;
            if (H != 0) K.__preid = _[H - 1].__id;
            if (H != D - 1) K.__nextid = _[H + 1].__id;
            var B = G ? G.call(J, K, H) : true,
            $ = I ? I.length: 0;
            if (B !== false) {
                if (I) I[$] = K;
                F = true
            }
            var C = false;
            if (K.__hasChildren) C = this._createTree(K.children, K.__id, A + 1, K.expanded !== false ? I: null, G);
            if (C && B === false) {
                if (I) I.insert($, K);
                F = true
            }
        }
        return F
    },
    isAncestor: function($, _) {
        if (!$ || !_) return false;
        while (_) {
            _ = this.findParent(_);
            if (_ == $) return true
        }
        return false
    },
    isDisplay: function($) {
        var _ = this.findParent($);
        if (_ == this) return true;
        if (!_.expanded) return false;
        return this.isDisplay(_)
    },
    getChildren: function($, _) {
        if (_) {
            var A = [];
            this.iterateChildren($, 
            function($) {
                A.add($)
            });
            return A
        } else return $.children
    }
});
Edo.data.DataTree.regType("datatree");
Edo.data.DataTree.isAncestor = function(C, D) {
    if (!C || !D) return false;
    var B = C.children;
    if (B) for (var $ = 0, E = B.length; $ < E; $++) {
        var A = B[$];
        if (A == D) return true;
        var _ = Edo.data.DataTree.isAncestor(A, D);
        if (_) return true
    }
    return false
};
//Edo.data.DataTree : END

Edo.data.ArraytoTree = function(B, G, F) {
    var A = [],
    E = {};
    for (var _ = 0, D = B.length; _ < D; _++) {
        var $ = B[_];
        E[$[G]] = $
    }
    for (_ = 0, D = B.length; _ < D; _++) {
        var $ = B[_],
        C = E[$[F]];
        if (!C) {
            A.push($);
            continue
        }
        if (!C.children) C.children = [];
        C.Summary = 1;
        C.children.push($)
    }
    return A
};
Edo.core.Validator = function() {
    Edo.core.Validator.superclass.constructor.call(this)
};
Edo.core.Validator.extend(Edo.core.Component, {
    errorMsg: "错误",
    _setTarget: function($) {
        if (typeof $ == "string") $ = Edo.get($);
        this.target = $;
        this.bindTarget()
    },
    _setProperty: function($) {
        this.property = $;
        this.bindTarget()
    },
    _setValid: function(value) {
        if (typeof value === "string") {
            var fn = Edo.core.Validator[this.validFn.toLowerCase()];
            if (fn) value = fn
        }
        var _ = value;
        if (typeof value !== "function") eval("_ = function(value){" + value + "}");
        this.validFn = _
    },
    bindTarget: function() {
        if (this.target && this.property) this.doBind.defer(100, this)
    },
    doBind: function() {
        this.target = typeof this.target === "string" ? window[this.target] : this.target;
        if (this.target && this.property) {
            var $ = this.target.validPropertyEvent;
            this.target.un($, this.doValid, this);
            this.target.on($, this.doValid, this)
        }
    },
    doValid: function(A) {
        var $ = this.target;
        if (!$.autoValid) return;
        if ($.validPropertyEvent !== "propertychange" || (A.property == this.property)) {
            var _ = $.validPropertyEvent !== "propertychange" ? A[this.property] : A["value"];
            return this.valid(_, A)
        }
    },
    valid: function(C, B) {
        var _ = this.target;
        if (typeof C == "undefined") C = _[this.property];
        if (this.validFn) {
            var A = this.validFn.call(this.target, C, B, _);
            if (A === true || A === undefined) {
                _.fireEvent("valid", {
                    type: "valid",
                    source: _,
                    property: this.property,
                    value: C
                });
                return true
            } else {
                var $ = A === false ? this.errorMsg: A;
                _.fireEvent("invalid", {
                    type: "invalid",
                    source: _,
                    errorMsg: $,
                    property: this.property,
                    value: C
                });
                return false
            }
        }
        return true
    }
});
Edo.core.Validator.regType("validator");
Edo.apply(Edo.core.Validator, {
    required: function(A, _, $) {
        if (A === undefined || A === "") return false;
        return true
    },
    length: function(A) {
        var $ = Edo.isNumber(this.minLength) ? this.minLength: 0,
        _ = Edo.isNumber(this.maxLength) ? this.maxLength: 5;
        if (!Edo.isValue(A)) return false;
        if (A.length > $ && A.length <= _) return true;
        return "不在" + $ + "~" + _ + "长度范围内"
    },
    number: function(C) {
        var _ = C,
        $ = parseInt(_);
        if ($ != _) return "必须输入数字";
        var A = this.minValue || 0,
        B = Edo.isNumber(this.maxValue) ? this.maxValue: 100;
        if ($ < A || $ > B) return "只能输入" + A + "~" + B + "数值范围";
        return true
    }
});
Edo.core.Space = function() {
    Edo.core.Space.superclass.constructor.call(this)
};
Edo.core.Space.extend(Edo.core.UIComponent, {
    defaultWidth: 0,
    defaultHeight: 0,
    minWidth: 0,
    minHeight: 0,
    _setHtml: function() {}
});
Edo.core.Space.regType("space");
Edo.core.Split = function() {
    Edo.core.Split.superclass.constructor.call(this)
};
Edo.core.Split.extend(Edo.core.UIComponent, {
    defaultWidth: 6,
    defaultHeight: 20,
    minWidth: 6,
    elCls: "e-split",
    getInnerHtml: function($) {
        $[$.length] = "<div class=\"e-split-inner\"></div>"
    },
    _setHtml: function() {}
});
Edo.core.Split.regType("split");
Edo.core.HSplit = function() {
    Edo.core.HSplit.superclass.constructor.call(this)
};
Edo.core.HSplit.extend(Edo.core.Split, {
    height: 4,
    width: "100%",
    defaultHeight: 4,
    minHeight: 4,
    elCls: "e-split e-split-v e-div"
});
Edo.core.HSplit.regType("hsplit");

/**
 * 弹出框:alert,confirm,prompt,loading,saving等
 * 
 * Namespace:	Edo
 * ClassName:	MessageBox
 * Single
 */
Edo.MessageBox = {
    OK: ["ok"],
    CANCEL: ["cancel"],
    OKCANCEL: ["ok", "cancel"],
    YESNO: ["yes", "no"],
    YESNOCANCEL: ["yes", "no", "cancel"],
    INFO: "e-messagebox-info",
    WARNING: "e-messagebox-warning",
    QUESTION: "e-messagebox-question",
    ERROR: "e-messagebox-error",
    DOWNLOAD: "e-messagebox-download",
    buttonText: {
        ok: "确定",
        cancel: "取消",
        yes: "是",
        no: "否"
    },
    saveText: "保存中...",
    hide: function(D) {
        var A = this.config,
        C = true;
        if (A && D) {
            var B = Edo.getByName("progress", this.dlg)[0],
            _ = Edo.getByName("text", this.dlg)[0],
            $ = B ? B.getValue() : null;
            if (_) $ = _.getValue();
            C = A.callback.call(A.scope, D ? D.source.action || "cancel": "cancel", $)
        }
        clearInterval(this.timer);
        clearTimeout(this.hideTimer);
        if (this.dlg && C !== false) this.dlg.hide()
    },
    
    /**
     * 
     * @param  config : Object弹出框显示配置对象
     * {
     *     title: "",            //弹出框标题
     *     titleIcon: '',      //弹出框标题图标
     *     icon: '',           //面板左侧图标        
     *     msg: '',            //面板文本内容
     *     
     *     prompt: false,      //是否显示弹出输入框
     *     multiline: false,   //显示输入框模式是否多行
     *     
     *     progress: false,    //是否显示进度条
     *     progressText: '',   //进度条文本
     *     progressValue: 0,   //进度值
     *     
     *     wait: false,        //是否显示为不断加载模式
     *         
     *     enableClose: true,  //是否显示右上角的头部关闭按钮
     *     autoClose: false,   //是否自动关闭面板,如果为是,则按closeTime延迟关闭
     *     closeTime: 3000,
     *     
     *     buttons: [],        //按钮模式,['ok','yes', 'no', 'cancel']
     *     
     *     callback: Edo.emptyFn,  //面板隐藏时的回调函数,会传递按钮的action字符串
     *     scope: null,            //回调函数的scope
     *     
     *     width: 'auto',      //面板宽度
     *     height: 'auto'      //面板高度        
     * }
     */
    show: function(config) {
        var G = config.children;
        delete config.children;
        Edo.applyIf(config, {
            autoClose: false,
            closeTime: 3000,
            enableClose: true,
            title: "",
            titleIcon: "",
            msg: "",
            width: "auto",
            height: "auto",
            callback: Edo.emptyFn
        });
        clearInterval(this.timer);
        this.config = config;
        if (!this.dlg) {
            this.dlg = Edo.create({
                cls: "e-dragtitle",
                type: "window",
                minWidth: 180,
                minHeight: 60,
                verticalGap: 0,
                titlebar: [{
                    cls: "e-titlebar-close",
                    onclick: this.hide.bind(this)
                }],
                children: [{
                    type: "box",
                    width: "100%",
                    border: 0,
                    minHeight: 40,
                    layout: "horizontal"
                },
                {
                    type: "ct",
                    width: "100%",
                    layout: "horizontal",
                    defaultHeight: 28,
                    horizontalAlign: "center",
                    verticalAlign: "bottom",
                    horizontalGap: 10
                }]
            });
            this.body = this.dlg.getChildAt(0);
            this.foot = this.dlg.getChildAt(1)
        }
        var C = this.dlg;
        C.set(config);
        C.titlebar.getChildAt(0).set("visible", config.enableClose !== false);
        var $ = {
            layout: "horizontal",
            children: [{
                type: "div",
                width: 44,
                height: 35,
                cls: config.icon,
                visible: !!config.icon
            },
            {
                type: "label",
                text: config.msg
            }]
        };
        if (config.prompt) $ = {
            layout: "vertical",
            verticalGap: 0,
            children: [{
                type: "label",
                width: "100%",
                text: config.msg
            },
            {
                name: "text",
                type: config.multiline ? "textarea": "text",
                text: config.text,
                width: "100%",
                minHeight: config.multiline ? 80: 22
            }]
        };
        else if (config.progress) $ = {
            layout: "vertical",
            verticalGap: 0,
            children: [{
                type: "label",
                text: config.msg
            },
            {
                name: "progress",
                type: "progress",
                width: "100%",
                text: config.progressText || "",
                progress: config.progressValue || 0
            }]
        };
        if (config.wait) $ = {
            layout: "horizontal",
            children: [{
                type: "div",
                width: 44,
                height: 50,
                cls: config.icon,
                visible: !!config.icon
            },
            {
                type: "ct",
                width: "100%",
                height: "100%",
                children: [{
                    type: "label",
                    text: config.msg
                },
                {
                    type: "progress",
                    showText: false,
                    text: config.progressText || "",
                    progress: config.progressValue || 0,
                    width: "100%"
                }]
            }]
        };
        if (G) $ = {
            children: G
        };
        this.body.set($);
        var F = config.buttons || [],
        E = [];
        F.each(function($) {
            $ = typeof $ == "string" ? {
                type: "button",
                text: this.buttonText[$],
                action: $,
                minWidth: 70,
                defaultHeight: 22,
                onclick: this.hide.bind(this)
            }: $;
            E.add($)
        },
        this);
        this.foot.set({
            visible: E.length > 0,
            children: E
        });
        if (config.wait) {
            var B = this.body.getChildAt(1).getChildAt(1),
            D = 0;
            this.timer = setInterval(function() {
                D += 10;
                B.set({
                    progress: D
                });
                if (D >= 100) D = 0
            },
            config.interval || 200)
        }
        C.show(config.x, config.y, true);
        if (config.autoClose) {
            var _ = config.autoClose === true ? config.closeTime: config.autoClose;
            this.hideTimer = this.hide.defer(_, this)
        }
        return this;
    },
    
    /**
     * Message.alert
     * 
     * @param title : String 标题
     * @param msg : String 内容
     * @param callback : Function 回调函数.
     * @param scope : String 回调函数的scope
     * @return Message.alert
     */
    alert: function(title, msg, callback, scope) {
        this.show({
            title: title,
            msg: msg,
            buttons: this.OK,
            callback: callback,
            scope: scope
        });
        return this;
    },
    
    /**
     * Message.confirm
     * 
     * @param title : String 标题
     * @param msg : String 内容
     * @param callback : Function 回调函数.
     * @param scope : String 回调函数的scope
     * @return Message.confirm
     */
    confirm: function(title, msg, callback, scope) {
        this.show({
            title: title,
            msg: msg,
            buttons: this.YESNO,
            callback: callback,
            scope: scope,
            icon: this.QUESTION
        });
        return this;
    },
    prompt: function(A, B, $, C, D, _) {
        this.show({
            title: A,
            msg: B,
            buttons: this.OKCANCEL,
            callback: $,
            minWidth: 250,
            scope: C,
            prompt: true,
            multiline: D,
            text: Edo.isValue(_) ? _: ""
        });
        return this
    },
    
    /**
     * 更新进度条内容 
     * 
     * @param progressValue : Number 进度值
     * @param progressText : String 进度条文本
     */
    updateProgress: function(progressValue, progressText) {
        var A = this.body.getChildAt(1);
        if (A && A.type == "progress") A.set({
            progress: progressValue,
            text: progressText
        })
    },
    
    /**
     * 加载状态进度显示 
     * 
     * @param title : String 标题
     * @param msg : String 内容
     */
    loading: function(title, msg) {
        Edo.MessageBox.show({
            title: title,
            msg: msg,
            children: [{
                type: "div",
                cls: "e-messagebox-wait",
                width: "100%",
                height: "100%"
            }],
            width: 250
        })
    },
    
    /**
     * 保存状态进度显示
     * 
     * @param title : String 标题
     * @param msg : String 内容
     */
    saveing: function(title, msg) {
        Edo.MessageBox.show({
            title: title,
            msg: msg,
            enableClose: false,
            progressText: this.saveText,
            width: 300,
            wait: true,
            interval: 200,
            icon: "e-messagebox-save"
        })
    }
};
Edo.core.Module = function() {
    Edo.core.Module.superclass.constructor.call(this)
};
Edo.core.Module.extend(Edo.core.UIComponent, {
    elCls: "e-module e-div",
    autoMask: true,
    src: "",
    _setSrc: function($) {
        if (this.src != $) {
            this.src = $;
            this.load($);
            this.changeProperty("src", $)
        }
    },
    _setHtml: function() {},
    createChildren: function() {
        Edo.core.Module.superclass.createChildren.apply(this, arguments);
        if (this.src) this.load(this.src)
    },
    syncSize: function() {
        Edo.core.Module.superclass.syncSize.call(this);
        if (this.iframe) {
            var $ = Edo.util.Dom.getSize(this.el, true);
            this.iframe.style.width = $.width + "px";
            this.iframe.style.height = $.height + "px"
        }
    },
    doLoad: function() {
        if (this.configGet === false) {
            doLoad.defer(50, this);
            return
        }
        this.childWindow = this.iframe.contentWindow;
        if (this.autoMask !== false) this.unmask();
        this.fireEvent("load", {
            type: "load",
            source: this,
            src: this.src,
            window: this.childWindow
        })
    },
    load: function(C, B) {
        this.src = C;
        if (!this.el) return false;
        if (this.unload() === false) return;
        if (this.autoMask !== false) this.mask();
        this.src = C;
        this.isConfig = B;
        var $ = this.iframe = document.createElement("iframe");
        $.frameBorder = 0;
        $.style.width = (this.realWidth || 0) + "px";
        $.style.height = (this.realHeight || 0) + "px";
        this.el.appendChild($);
        if (B) {
            this.configGet = false;
            var A = this;
            Edo.util.Ajax.request({
                url: C,
                type: "get",
                onSuccess: function($) {
                    A.configGet = $
                },
                onFail: function() {
                    throw new Error("没有获得module的配置对象资源")
                }
            })
        } else setTimeout(function() {
            $.src = C
        },
        10);
        function _() {
            var $ = this.iframe.contentWindow;
            try {
                if ($ && $.document && $.document.readyState == "complete") this.doLoad();
                else _.defer(20, this)
            } catch(A) {
                this.doLoad(false)
            }
        }
        if (isGecko && !isChrome) {
            A = this;
            $.onload = this.doLoad.bind(this)
        } else _.defer(20, this)
    },
    unload: function() {
        if (this.src && this.iframe) {
            if (this.fireEvent("beforeunload", {
                type: "beforeunload",
                source: this
            }) === false) return false;
            this.iframe.src = "javascript:false;";
            Edo.util.Dom.remove(this.iframe);
            this.childWindow = this.src = this.iframe = this.isConfig = null;
            this.fireEvent("unload", {
                type: "unload",
                source: this
            })
        }
    }
});
Edo.core.Module.regType("module");
Edo.ns("Edo.rpc");
Edo.rpc.Client = function($) {
    this.url = $;
    this.createInvokes(Edo.rpc.Client.rpcConfig);
    Edo.rpc.Client.superclass.constructor.call(this)
};
Edo.rpc.Client.extend(Edo.core.Component, {
    url: "",
    method: "post",
    timeout: 0,
    abort: function($) {
        Edo.util.Ajax.abort($);
        $ = null
    },
    createInvokes: function(H) {
        for (var I in H) {
            var A = H[I],
            G = A.methods,
            $ = I.split("."),
            B = $[0],
            _ = cls = {}; [].each.call($.slice(1), 
            function($) {
                _ = _[$] = _[$] || {}
            });
            var F = this;
            for (var D = 0, C = G.length; D < C; D++) {
                var J = G[D],
                E = function() {
                    var $ = [].slice.apply(arguments);
                    return this.client.invoke(this.className, this.methodName, $, this.url || this.client.url)
                };
                E.className = I;
                E.methodName = J;
                E.url = A.url;
                E.client = this;
                _[J] = E.bind(E)
            }
            this[B] = cls
        }
    },
    invoke: function(B, G, $, A) {
        if (! ($ instanceof Array)) $ = [$];
        var F = typeof $[$.length - 1] === "function" ? $.pop() : null,
        D = typeof $[$.length - 1] === "function" ? $.pop() : null;
        if (F && !D) {
            D = F;
            F = null
        }
        var E = false;
        if (D) E = true;
        var _ = null,
        C = Edo.util.Ajax.request({
            url: A || this.url,
            async: E,
            type: this.method,
            params: {
                "class": B,
                method: G,
                params: $
            },
            onSuccess: function(A, B) {
                var $ = A;
                try {
                    $ = Edo.util.JSON.decode(A)
                } catch(C) {
                    $ = {
                        error: -1,
                        message: A
                    }
                }
                B.responseObject = $;
                if ($.error == 0) {
                    if (D) D($.result, B)
                } else {
                    if (F) F($.error, $.message, B);
                    if (E == false) throw $
                }
                if (E == false) _ = $.result
            },
            onFail: function($, _) {
                if (F) F($, _.request.responseText, _);
                if (E == false) {
                    var A = {
                        error: $,
                        message: _.request.responseText
                    };
                    throw A
                }
            }
        });
        return _ === null ? C: _
    }
});
Edo.rpc.Client.rpcConfig = {};
Edo.rpc.Client.regService = function(C, A, B) {
    if (! (A instanceof Array)) A = [A];
    var _ = this.rpcConfig[C];
    if (!_) _ = this.rpcConfig[C] = {
        name: C
    };
    _.url = B;
    var $ = _["methods"];
    if (!$) $ = _["methods"] = [];
    $.addRange(A)
};
AJAXRPC_Client = Edo.rpc.Client;

/**
 * 盒容器,实现边框border和内间距padding
 * 
 * TypeName:	box
 * Namespace:	Edo.containers
 * ClassName:	Box
 * Extend:		Edo.containers.Container
 */
Edo.containers.Box = function() {
    Edo.containers.Box.superclass.constructor.call(this);
};
Edo.containers.Box.extend(Edo.containers.Container, {
	/**
	 * 默认的宽度
	 */
    defaultWidth: 60,
    
    /**
	 * 默认的高度
	 */
    defaultHeight: 22,
    
    /**
     * [top, right, bottom, left] 默认值 : [1,1,1,1] 边框线宽度
     */
    border: [1, 1, 1, 1],
    
    /**
     * [top, right, bottom, left] 默认值 : [1,1,1,1] 内边距宽度
     */
    padding: [5, 5, 5, 5],
    
    /**
     * 元素的css样式class名称
     */
    elCls: "e-box",
    
    /**
     * body的style
     * 
     * @var String
     */
    bodyStyle: "",
    
    /**
     * body的cls
     * 
     * @var String
     */
    bodyCls: "",
    
    getInnerHtml: function(A) {
        var $ = this._getBox(),
        _ = this.getLayoutBox($);
        A[A.length] = "<div class=\"e-box-scrollct ";
        A[A.length] = this.bodyCls;
        A[A.length] = "\" style=\"";
        A[A.length] = this.bodyStyle;
        A[A.length] = ";width:";
        A[A.length] = _.width;
        A[A.length] = "px;height:";
        A[A.length] = _.height;
        A[A.length] = "px;margin:0px;padding:0px;border:0px;position:absolute;left:";
        A[A.length] = _.x - $.x - this.border[3];
        A[A.length] = "px;top:";
        A[A.length] = _.y - $.y - this.border[0];
        A[A.length] = "px;";
        A[A.length] = ";" + this.doScrollPolicy();
        A[A.length] = "\"></div>"
    },
    createHtml: function($, _, A) {
        this._getBPStyle();
        return Edo.containers.Box.superclass.createHtml.call(this, $, _, A)
    },
    createChildren: function($) {
        Edo.containers.Box.superclass.createChildren.call(this, $);
        this.scrollEl = this.el.firstChild
    },
    measure: function() {
        Edo.containers.Box.superclass.measure.call(this);
        var _ = this.border,
        $ = this.padding;
        this.realWidth += _[3] + $[3] + _[1] + $[1];
        this.realHeight += _[0] + $[0] + _[2] + $[2];
        this.measureSize()
    },
    getLayoutBox: function($) {
        var _border = this.border,
        _ = this.padding;
        $ = $ || Edo.containers.Box.superclass.getLayoutBox.call(this);
        $.width = $.width - _border[3] - _[3] - _border[1] - _[1];
        $.height = $.height - _border[0] - _[0] - _border[2] - _[2];
        $.x += _border[3] + _[3];
        $.y += _border[0] + _[0];
        $.right = $.x + $.width;
        $.bottom = $.y + $.height;
        return $;
    },
    
    /**
     * 同步组件的size (box)
     */
    syncSize: function() {
        var $ = this.realWidth,
        _ = this.realHeight;
        this.domWidth = $;
        this.domHeight = _;
        Edo.containers.Box.superclass.syncSize.call(this)
    },
    _setBodyCls: function($) {
        if (this.bodyCls != $) {
            this.bodyCls = $;
            if (this.el) Edo.util.Dom.addClass(this.scrollEl, $);
            this.changeProperty("bodyCls", $)
        }
    },
    _setBodyStyle: function($) {
        if (this.bodyStyle != $) {
            this.bodyStyle = $;
            if (this.el) Edo.util.Dom.applyStyles(this.scrollEl, $);
            this.changeProperty("bodyStyle", $)
        }
    },
    _getBPStyle: function() {
        var _ = this.border,
        $ = "border-left-width:" + _[3] + "px;border-top-width:" + _[0] + "px;border-right-width:" + _[1] + "px;border-bottom-width:" + _[2] + "px;";
        this.addStyle($)
    },
    _setBorder: function($) {
        $ = this._toArray($);
        if (!this._checkTheSame(this.border, $)) {
            this.border = $;
            this.addStyle(this._getBPStyle());
            this.relayout("border", $);
            this.changeProperty("border", $)
        }
    },
    _setPadding: function($) {
        $ = this._toArray($);
        if (!this._checkTheSame(this.padding, $)) {
            this.padding = $;
            this.addStyle(this._getBPStyle());
            this.relayout("padding", $);
            this.changeProperty("padding", $)
        }
    }
});
Edo.containers.Box.regType("box");
//Edo.containers.Box : end

Edo.containers.Group = function() {
    Edo.containers.Group.superclass.constructor.call(this)
};
Edo.containers.Group.extend(Edo.containers.Container, {
    defaultWidth: 60,
    defaultHeight: 22,
    elCls: "e-group e-ct e-div",
    padding: [2, 3, 3, 3],
    syncScrollEl: function(B) {
        if (this.scrollEl != this.el) {
            var $ = this._getBox(),
            A = B.x - $.x,
            _ = B.y - $.y;
            if (B.width < 0) B.width = 0;
            if (B.height < 0) B.height = 0;
            this.scrollEl.style.width = B.width + "px";
            this.scrollEl.style.height = B.height + "px"
        }
    },
    getHeaderHtml: function() {
        return ""
    },
    getInnerHtml: function(F) {
        var C = this.padding,
        D = C[3],
        B = C[0],
        _ = C[1],
        E = C[2],
        A = this.realHeight - B - E,
        $ = this.realWidth - D - _,
        G = this.getHeaderHtml(F);
        F[F.length] = "<table cellspacing=\"0\" border=\"0\" cellpadding=\"0\"><tr class=\"e-group-t\"><td class=\"e-group-tl\" style=\"height:" + B + "px;width:" + D + "px;\"></td><td class=\"e-group-tc\" style=\"width:" + $ + "px;\">" + G + "</td><td class=\"e-group-tr\" style=\"width:" + _ + "px;\"></td></tr><tr class=\"e-group-m\"><td class=\"e-group-ml\"></td><td class=\"e-group-mc\"><div class=\"e-group-body\" style=\"width:" + $ + "px;height:" + A + "px;\"></div></td><td class=\"e-group-mr\"></td></tr><tr class=\"e-group-b\"><td class=\"e-group-bl\" style=\"height:" + E + "px;width:" + D + "px;\"></td><td class=\"e-group-bc\"></td><td class=\"e-group-br\" style=\"width:" + _ + "px;\"></td></tr></table>"
    },
    createChildren: function($) {
        Edo.containers.Group.superclass.createChildren.call(this, $);
        this.table = this.el.firstChild;
        this.tc = this.table.rows[0].cells[1];
        this.mc = this.table.rows[1].cells[1];
        this.bc = this.table.rows[2].cells[1];
        this.scrollEl = this.mc.firstChild;
        this.bodyEl = this.mc.firstChild
    },
    measure: function() {
        Edo.containers.Group.superclass.measure.call(this);
        this.realWidth += this.padding[1] + this.padding[3];
        this.realHeight += this.padding[0] + this.padding[2];
        this.measureSize()
    },
    syncSize: function() {
        Edo.containers.Group.superclass.syncSize.call(this);
        var C = this.padding,
        B = C[0],
        _ = C[1],
        E = C[2],
        D = C[3],
        A = this.realHeight - B - E,
        $ = this.realWidth - D - _;
        this.tc.style.width = $ + "px";
        this.bodyEl.style.width = $ + "px";
        this.bodyEl.style.width = $ + "px"
    },
    getLayoutBox: function() {
        var $ = Edo.containers.Group.superclass.getLayoutBox.call(this);
        $.x += this.padding[0];
        $.y += this.padding[1];
        $.width -= (this.padding[1] + this.padding[3]);
        $.height -= (this.padding[0] + this.padding[2]);
        $.right = $.x + $.width;
        $.bottom = $.y + $.height;
        return $
    },
    _setPadding: function($) {
        $ = this._toArray($);
        if (!this._checkTheSame(this.padding, $)) {
            var _ = this.padding = $;
            this.relayout("padding", $);
            this.changeProperty("padding", $)
        }
    }
});
Edo.containers.Group.regType("group");
Edo.containers.FieldSet = function() {
    Edo.containers.FieldSet.superclass.constructor.call(this)
};
Edo.containers.FieldSet.extend(Edo.containers.Container, {
    defaultWidth: 80,
    defaultHeight: 20,
    collapseHeight: 18,
    legend: "",
    padding: [3, 5, 5, 5],
    elCls: "e-fieldset e-div",
    getInnerHtml: function($) {
        $[$.length] = "<fieldset class=\"e-fieldset-fieldset\"><legend class=\"e-fieldset-legend\">";
        $[$.length] = "<span class=\"" + (this.enableCollapse ? "e-fieldset-icon": "") + "\">";
        $[$.length] = this.legend || "&#160;";
        $[$.length] = "</span></legend><div class=\"e-fieldset-body\" style=\"";
        $[$.length] = this.doScrollPolicy();
        $[$.length] = "\"></div></fieldset>"
    },
    createChildren: function($) {
        Edo.containers.FieldSet.superclass.createChildren.call(this, $);
        this.fieldset = this.el.firstChild;
        this.scrollEl = this.fieldset.lastChild;
        this.legendEl = this.fieldset.firstChild;
        this.titleEl = this.legendEl.lastChild
    },
    initEvents: function() {
        Edo.containers.FieldSet.superclass.initEvents.call(this);
        Edo.util.Dom.on(this.legendEl, "click", this._onLegendClick, this)
    },
    _onLegendClick: function($) {
        if (this.enableCollapse) this.toggle()
    },
    syncSize: function() {
        Edo.containers.FieldSet.superclass.syncSize.apply(this, arguments);
        Edo.util.Dom.setSize(this.fieldset, this.realWidth, this.realHeight)
    },
    measure: function() {
        Edo.containers.FieldSet.superclass.measure.call(this);
        this.realWidth += 2;
        this.realHeight += 20;
        var $ = this.padding;
        this.realWidth += $[3] + $[1];
        this.realHeight += $[0] + $[2];
        this.measureSize()
    },
    getLayoutBox: function() {
        var $ = Edo.containers.FieldSet.superclass.getLayoutBox.call(this);
        $.x += 1;
        $.y += 1;
        $.width -= 2;
        $.height -= 20;
        var _ = this.padding;
        $.width = $.width - _[3] - _[1];
        $.height = $.height - _[0] - _[2];
        $.x += _[3];
        $.y += _[0];
        $.right = $.x + $.width;
        $.bottom = $.y + $.height;
        return $
    },
    _setLegend: function($) {
        if (this.legend !== $) {
            this.legend = $;
            if (this.el) this.titleEl.innerText = $;
            this.changeProperty("legend", $)
        }
    },
    _setPadding: function($) {
        $ = this._toArray($);
        if (!this._checkTheSame(this.padding, $)) {
            this.padding = $;
            this.relayout("padding", $);
            this.changeProperty("padding", $)
        }
    },
    destroy: function() {
        Edo.util.Dom.clearEvent(this.legendEl);
        this.legendEl = null;
        Edo.containers.FieldSet.superclass.destroy.call(this)
    }
});
Edo.containers.FieldSet.regType("fieldset");

/**
 * 面板组件
 * 
 * TypeName:	panel
 * Namespace:	Edo.containers
 * ClassName:	Panel
 * Extend:	Edo.containers.Box
 */
Edo.containers.Panel = function() {
    Edo.containers.Panel.superclass.constructor.call(this)
};
Edo.containers.Panel.extend(Edo.containers.Box, {
	/**
	 * 收缩时的高度 
	 * 默认值：26
	 */
    collapseHeight: 26,
    
    /**
	 * 收缩时的宽度
	 * 默认值：26
	 */
    collapseWidth: 26,
    
    /**
	 * 最小高度
	 * 默认值：22
	 */
    minHeight: 22,
    
    /**
	 * 面板头部高度
	 * 默认值：26
	 */
    headerHeight: 25,
    
    /**
	 * 面板标题
	 * 默认值：""
	 */
    title: "",
    
    /**
	 * 面板的icon图标/标题图标 
	 * 默认值：""
	 */
    titleIcon: "",
    
    titleCollapse: false,
    titlebar: null,
    
    /**
     * 元素的CSS样式class名称
     */
    elCls: "e-panel e-box e-div",
    getInnerHtml: function(_) {
        var $ = this.headerHeight;
        if (!isBorderBox) $ -= 1;
        _[_.length] = "<div class=\"e-panel-header\" style=\"height:" + $ + "px;line-height:" + $ + "px;\"><div class=\"e-panel-title\">" + this.doTitle() + "</div><div class=\"e-titlebar\"></div></div>";
        Edo.containers.Panel.superclass.getInnerHtml.call(this, _)
    },
    initEvents: function() {
        Edo.containers.Panel.superclass.initEvents.call(this);
        this.on("click", this._onClick, this)
    },
    createChildren: function($) {
        Edo.containers.Panel.superclass.createChildren.call(this, $);
        this.scrollEl = this.el.lastChild;
        this.headerCt = this.el.firstChild;
        this.titleCt = this.headerCt.firstChild;
        this.titlebarCt = this.headerCt.lastChild;
        if (this.titlebar) this.titlebar.render(this.titlebarCt)
    },
    measure: function() {
        Edo.containers.Panel.superclass.measure.call(this);
        this.realHeight += this.headerHeight;
        this.measureSize()
    },
    getLayoutBox: function() {
        var _ = Edo.containers.Panel.superclass.getLayoutBox.call(this),
        $ = this.headerHeight;
        _.y += $;
        _.height -= $;
        _.right = _.x + _.width;
        _.bottom = _.y + _.height;
        return _
    },
    doTitle: function() {
        var $ = "";
        if (this.titleIcon) $ += "<div style=\"float:left;margin-right:3px;\" class=\"e-panel-titleicon " + this.titleIcon + "\"></div>";
        if (this.title) $ += "<div style=\"float:left;\">" + this.title + "</div>";
        if (this.titleCt) this.titleCt.innerHTML = $;
        return $
    },
    _setTitle: function($) {
        if (this.title != $) {
            this.title = $;
            this.doTitle();
            this.changeProperty("title", $)
        }
    },
    _setTitleIcon: function($) {
        if (this.titleIcon != $) {
            this.titleIcon = $;
            this.doTitle();
            this.changeProperty("titleIcon", $)
        }
    },
    _setHeaderHeight: function($) {
        $ = parseInt($);
        if (isNaN($)) throw new Error("headerHeight must is Number type");
        if (this.headerHeight != $) {
            this.headerHeight = $;
            this.collapseHeight = $ + this.border[0];
            this.relayout("headerHeight", $)
        }
    },
    syncSize: function() {
        var $ = this.headerHeight;
        if (!isBorderBox) $ -= 1;
        if (this.el) {
            this.headerCt.style.height = $ + "px";
            this.headerCt.style.lineHeight = $ + "px"
        }
        Edo.containers.Panel.superclass.syncSize.call(this)
    },
    _setTitlebar: function($) {
        if (! ($ instanceof Array)) $ = [$];
        $.each(function($) {
            var _ = $.cls;
            Edo.apply($, {
                type: "button",
                simpleButton: true,
                height: 15,
                width: 15,
                minHeight: 15,
                minWidth: 15,
                cls: _,
                overCls: $.overCls || _ + "-over",
                focusCls: $.focusCls || _ + "-focus",
                pressedCls: $.pressedCls || _ + "-pressed"
            })
        });
        if (this.titlebar) this.titlebar.destory();
        this.titlebar = Edo.create({
            type: "ct",
            layout: "horizontal",
            horizontalGap: 1,
            height: 15,
            children: $,
            onclick: function($) {
                $.stop()
            }
        });
        this.titlebar.owner = this;
        if (this.titlebarCt) this.titlebar.render(this.titlebarCt)
    },
    _onClick: function($) {
        if ($.within(this.headerCt) && this.titleCollapse) this.toggle()
    }
});
Edo.containers.Panel.regType("panel", "dialog");
Edo.containers.Dialog = Edo.containers.Panel;
//Edo.containers.Panel : END

Edo.containers.FormItem = function() {
    Edo.containers.FormItem.superclass.constructor.call(this)
};
Edo.containers.FormItem.extend(Edo.containers.Box, {
    defaultHeight: 22,
    minHeight: 22,
    border: [0, 0, 0, 0],
    padding: [0, 0, 0, 0],
    labelPosition: "left",
    label: "",
    labelWidth: 60,
    labelHeight: 22,
    labelAlign: "left",
    labelCls: "",
    labelStyle: "",
    elCls: "e-formitem e-box e-div",
    forId: "",
    measure: function() {
        Edo.containers.FormItem.superclass.measure.call(this);
        if (this.labelPosition == "left" || this.labelPosition == "right") this.realWidth += this.labelWidth;
        else this.realHeight += this.labelHeight;
        this.measureSize()
    },
    getLayoutBox: function() {
        var $ = Edo.containers.FormItem.superclass.getLayoutBox.call(this);
        switch (this.labelPosition) {
        case "top":
            $.y += this.labelHeight;
            $.height -= this.labelHeight;
            break;
        case "right":
            $.width -= this.labelWidth;
            break;
        case "bottom":
            $.height -= this.labelHeight;
            break;
        case "left":
            $.x += this.labelWidth;
            $.width -= this.labelWidth;
            break
        }
        $.right = $.x + $.width;
        $.bottom = $.y + $.height;
        return $
    },
    doLabel: function() {
        if (this.el) this.labelCt.innerHTML = "<div style=\"float:" + this.labelAlign + ";\">" + this.label + "</div>"
    },
    _setLabel: function($) {
        if (this.label != $) {
            this.label = $;
            this.doLabel()
        }
    },
    _setLabelAlign: function($) {
        if (this.labelAlign != $) {
            this.labelAlign = $;
            this.doLabel()
        }
    },
    _setLabelPosition: function($) {
        if (this.labelPosition != $) {
            this.labelPosition = $;
            this.relayout("labelPosition", $)
        }
    },
    _setLabelStyle: function($) {
        if (this.labelStyle != $) {
            this.labelStyle = $;
            if (this.labelCt) Edo.util.Dom.applyStyles(this.labelCt, $)
        }
    },
    _setLabelCls: function($) {
        if (this.labelCls != $) {
            this.labelCls = $;
            Edo.util.Dom.addClass(this.labelCt, this.labelCls)
        }
    },
    _setLabelWidth: function($) {
        $ = parseInt($);
        if (isNaN($)) throw new Error("labelWidth must is Number type");
        if (this.labelWidth != $) {
            this.labelWidth = $;
            this.relayout("labelWidth", $)
        }
    },
    _setForId: function($) {
        if (this.forId != $) {
            this.forId = $;
            var _ = Edo.getCmp($);
            if (_);
            else this.labelCt.dom.htmlFor = $
        }
    },
    syncSize: function() {
        Edo.containers.FormItem.superclass.syncSize.call(this);
        var A = this.getLayoutBox(),
        $ = this.labelWidth,
        _ = this.labelHeight,
        B = "top:auto;right:auto;bottom:auto;left:auto;";
        switch (this.labelPosition) {
        case "top":
            $ = A.width;
            B += "left:" + this.padding[3] + "px;top:" + this.padding[0] + "px";
            break;
        case "right":
            _ = A.height;
            B += "right:" + this.padding[1] + "px;top:" + this.padding[0] + "px";
            break;
        case "bottom":
            $ = A.width;
            B += "left:" + this.padding[3] + "px;bottom:" + this.padding[2] + "px";
            break;
        case "left":
            _ = A.height;
            B += "left:" + this.padding[3] + "px;top:" + this.padding[0] + "px";
            break
        }
        Edo.util.Dom.setSize(this.labelCt, $, _);
        Edo.util.Dom.applyStyles(this.labelCt, B)
    },
    getInnerHtml: function($) {
        $[$.length] = "<label for=\"" + this.forId + "\" class=\"e-formitem-label " + this.labelCls + "\" style=\"overflow:hidden;text-align:" + this.labelAlign + ";" + this.labelStyle + ";\">" + this.label + "</label>";
        Edo.containers.Panel.superclass.getInnerHtml.call(this, $)
    },
    createChildren: function($) {
        Edo.containers.FormItem.superclass.createChildren.call(this, $);
        this.scrollEl = this.el.lastChild;
        this.labelCt = this.el.firstChild
    }
});
Edo.containers.FormItem.regType("formitem");

/**
 * 自适应浏览器尺寸的顶级容器
 * 
 * TypeName:	app
 * Namespace:	Edo.containers
 * ClassName:	Application
 * Extend:		Edo.containers.Box
 */
Edo.containers.Application = function() {
    Edo.containers.Application.superclass.constructor.call(this);//继承父类(Edo.containers.Box)属性
};
Edo.containers.Application.extend(Edo.containers.Box, {//继承父类(Edo.containers.Box)原型
    fireTimer: null,
    minWidth: 400,
    minHeight: 200,
    elCls: "e-app e-box e-div",
    notHasParent: "the app module cannot have the father object",
    initEvents: function() {
        if (!this.design) {
            if (this.parent) {
            	throw new Error(this.notHasParent);
            }
            Edo.util.Dom.on(window, "resize", function($) {
                if (this.fireTimer) clearTimeout(this.fireTimer);
                this.fireTimer = this.onWindowResize.defer(100, this, [$])
            },this)
        }
        Edo.containers.Application.superclass.initEvents.call(this)
    },
    measure: function() {
        if (!this.design) {
        	this.syncViewSize();//同步视图大小
        }
        Edo.containers.Application.superclass.measure.call(this)
    },
    syncViewSize: function() {
        var B = Edo.util.Dom,
        $ = document,
        _ = B.getViewWidth($),
        A = B.getViewHeight($);
        this.width = _;
        this.height = A
    },
    onWindowResize: function($) {
        this.syncViewSize();
        this.relayout("size", this);
        this.fireTimer = null
    },
    destroy: function() {
        Edo.containers.Application.superclass.destroy.call(this)
    }
});
Edo.containers.Application.regType("app");
//Edo.containers.Application : end

Edo.containers.Window = function() {
    Edo.containers.Window.superclass.constructor.call(this)
};
Edo.containers.Window.extend(Edo.containers.Panel, {
    renderTo: "#body",
    shadow: true,
    minWidth: 180,
    minHeight: 80,
    initEvents: function() {
        Edo.containers.Window.superclass.initEvents.call(this);
        this.on("mousedown", this.onMouseDown, this)
    },
    onMouseDown: function($) {
        if ($.within(this.headerCt)) Edo.managers.DragManager.startDrag({
            event: $,
            delay: 0,
            capture: false,
            autoDragDrop: true,
            proxy: true,
            proxyCls: "e-dragdrop-proxy",
            dragObject: this
        });
        this.focus()
    },
    show: function(A, $, _) {
        this.render(this.renderTo);
        this.addCls("e-drag-title");
        Edo.managers.PopupManager.createPopup({
            target: this,
            x: A,
            y: $,
            modal: _
        });
        return this
    },
    hide: function() {
        this.set("visible", false);
        Edo.managers.PopupManager.removePopup(this);
        return this
    }
});
Edo.containers.Window.regType("window");

/**
 * 实现导航功能
 * 
 * TypeName:	navigator, nav
 * Namespace:	Edo.navigators
 * ClassName:	Navigator
 * Extend:	Edo.containers.Box
 */
Edo.navigators.Navigator = function() {
    Edo.navigators.Navigator.superclass.constructor.call(this)
};
Edo.navigators.Navigator.extend(Edo.containers.Box, {
	/**
	 * 布局样式 默认值 : horizontal
	 * 
	 * @var {String}
	 */
    layout: "horizontal",
    
    /**
     * 滚动偏移量 默认值 : 30
     * 
     * @var {Number}
     */
    scrollOffset: 30,
    
    /**
     * 是否显示tabbar开始处的的导航按钮，只在item在设定的tabbar宽度范围内显示不全时显示
     * 
     * @var {Boolean}
     */
    startVisible: true,
    
    /**
     * 是否显示tabbar结束处的的导航按钮，只在item在设定的tabbar宽度范围内显示不全时显示
     * 
     * @var {Boolean}
     */
    endVisible: true,
    
    startWidth: 18,
    startHeight: 18,
    endWidth: 18,
    endHeight: 18,
    startCls: "",
    endCls: "",
    
    elCls: "e-nav e-box e-ct e-div",
    horizontalScrollPolicy: "off",
    verticalScrollPolicy: "off",
    
    /**
     * 获取Navigator的布局Box
     * 
     * @return box : {NavLayoutBox}
     */
    getNavLayoutBox: function() {
        var _layout_box = this.getLayoutBox();
        if (this.startVisible){
        	 if (this.layout == "horizontal") {
                 _layout_box.x += this.startWidth;
                 _layout_box.width -= this.startWidth
             } else if (this.layout == "vertical") {
                 _layout_box.y += this.startHeight;
                 _layout_box.height -= this.startHeight
             }
        }
        if (this.endVisible){
        	 if (this.layout == "horizontal"){
             	_layout_box.width -= this.endWidth;
             }else if (this.layout == "vertical"){
             	_layout_box.height -= this.endHeight;
             }
        }
        _layout_box.right = _layout_box.x + _layout_box.width;
        _layout_box.bottom = _layout_box.y + _layout_box.height;
        return _layout_box;
    },
    
    syncSize: function() {
        Edo.navigators.Navigator.superclass.syncSize.call(this);
        var _scroll_ct = this.scrollEl,
        _show_scroll_nav = false;
        if (this.layout == "horizontal" && _scroll_ct.scrollWidth > _scroll_ct.clientWidth){
        	_show_scroll_nav = true;
        }else if (this.layout == "vertical" && _scroll_ct.scrollHeight > _scroll_ct.clientHeight){
        	_show_scroll_nav = true;
        }
        if (_show_scroll_nav) {
            var _navLayoutBox = this.getNavLayoutBox();
            this.syncScrollEl(_navLayoutBox);
            if (this.startVisible) {
                var _scroll_ct_x = _navLayoutBox.x,
                _scroll_ct_y = _navLayoutBox.y,
                _startWidth = this.startWidth,
                _startHeight = this.startHeight;
                if (this.layout == "horizontal") {
                    _scroll_ct_x -= (this.startWidth + this.padding[3]);
                    _startHeight = _navLayoutBox.height
                }
                if (this.layout == "vertical") {
                    _scroll_ct_y -= (this.startHeight + this.padding[0]);
                    _startWidth = _navLayoutBox.width
                }
                this.startButton._setBox({
                    x: _scroll_ct_x,
                    y: _scroll_ct_y,
                    width: _startWidth,
                    height: _startHeight
                })
            }
            if (this.endVisible) {
                _scroll_ct_x = _navLayoutBox.x,
                _scroll_ct_y = _navLayoutBox.y,
                _startWidth = this.endWidth,
                _startHeight = this.endHeight;
                if (this.layout == "horizontal") {
                    _scroll_ct_x += _navLayoutBox.width + this.padding[1];
                    _startHeight = _navLayoutBox.height
                }
                if (this.layout == "vertical") {
                    _scroll_ct_y += _navLayoutBox.height + this.padding[2];
                    _startWidth = _navLayoutBox.width
                }
                this.endButton._setBox({
                    x: _scroll_ct_x,
                    y: _scroll_ct_y,
                    width: _startWidth,
                    height: _startHeight
                })
            }
        } else {
            this.startButton.el.style.left = "-300px";
            this.endButton.el.style.left = "-300px";
            this.startButton.el.style.position = "absolute";
            this.endButton.el.style.position = "absolute";
        }
    },
    
    /**
     * 创建子元素
     * 
     */
    createChildren: function($) {
        Edo.navigators.Navigator.superclass.createChildren.call(this, $);
        this.startButton = Edo.create({
            type: "button",
            icon: "e-nav-start",
            minHeight: 5,
            onclick: this.preScrollView.bind(this),
            render: this.el
        });
        this.endButton = Edo.create({
            icon: "e-nav-end",
            minHeight: 5,
            type: "button",
            onclick: this.nextScrollView.bind(this),
            render: this.el
        })
    },
    _setHorizontalScrollPolicy: function($) {
        this.horizontalScrollPolicy = "off";
    },
    _setVerticalScrollPolicy: function($) {
        this.verticalScrollPolicy = "off";
    },
    preScrollView: function() {
        var $ = this.layout == "horizontal" ? "scrollLeft": "scrollTop";
        this.scrollEl[$] -= this.scrollOffset;
    },
    nextScrollView: function() {
        var $ = this.layout == "horizontal" ? "scrollLeft": "scrollTop";
        this.scrollEl[$] += this.scrollOffset;
    }
});
Edo.navigators.Navigator.regType("navigator", "nav");
//Edo.navigators.Navigator. : END

Edo.navigators.Menu = function() {
    Edo.navigators.Menu.superclass.constructor.call(this)
};
Edo.navigators.Menu.extend(Edo.navigators.Navigator, {
    layout: "vertical",
    minWidth: 40,
    minHeight: 20,
    defaultHeight: 20,
    defaultWidth: 100,
    verticalGap: 0,
    padding: [1, 1, 1, 1],
    startWidth: 8,
    startHeight: 8,
    endWidth: 8,
    endHeight: 8,
    autoHide: false,
    elCls: "e-box e-menu ",
    initEvents: function() {
        this.on("click", this._onClick, this);
        Edo.navigators.Menu.superclass.initEvents.call(this)
    },
    _onClick: function(_) {
        var $ = this.overItem;
        if (!$ && this.layout == "horizontal") return;
        if (this.autoHide) this.hideMenu()
    },
    hideMenu: function() {
        Edo.managers.PopupManager.removePopup(this);
        if (this.owner && this.owner.type == "button") {
            this.owner.hidePopup();
            if (this.owner.parent && this.owner.parent.type == "menu") this.owner.parent.hideMenu()
        }
    },
    _onChildOver: function(A) {
        var $ = A.source,
        _ = this.overItem;
        if (!_ && this.layout == "horizontal") return;
        this.showMenu($)
    },
    _onChildClick: function(A) {
        var $ = A.source,
        _ = this.overItem;
        if (!_ && this.layout == "horizontal") this.showMenu(A.source)
    },
    showMenu: function($) {
        var _ = this.overItem;
        if (_ && _.menu) _.hidePopup();
        this.overItem = $;
        if ($.menu) {
            var A = $._getBox(true);
            if (this.layout == "vertical") $.showPopup(A.x + A.width, A.y, false, null, -$.realWidth, $.realHeight);
            else $.showPopup()
        }
    },
    _onChildPopupHide: function($) {
        this.overItem = null
    },
    addChildAt: function() {
        var $ = arguments[1];
        if (this.layout == "vertical") {
            $.width = "100%";
            $.icon = $.icon || " ";
            if ($.menu) $.arrowMode = "menu";
            else $.arrowMode = null
        }
        $.showMenu = false;
        var _ = Edo.navigators.Menu.superclass.addChildAt.apply(this, arguments);
        _.on("mouseover", this._onChildOver, this);
        _.on("click", this._onChildClick, this);
        _.on("popuphide", this._onChildPopupHide, this);
        return _
    }
});
Edo.navigators.Menu.regType("menu");

/**
 * selectedIndex,overClickable(true时,当鼠标移动到某一按钮上,此按钮被激发fire click事件)
 * 
 * @see http://edojs.com/api/#Edo.navigators.ToggleBar
 * TypeName:	togglebar
 * Namespace:	Edo.navigators
 * ClassName:	ToggleBar
 * Extend:	Edo.navigators.Navigator
 */
Edo.navigators.ToggleBar = function($) {
    Edo.navigators.ToggleBar.superclass.constructor.call(this)
};
Edo.navigators.ToggleBar.extend(Edo.navigators.Navigator, {
    componentMode: "control",
    valueField: "selectedIndex",
    selectedIndex: -1,
    selectedItem: null,
    selectedCls: "e-togglebar-selected",
    elCls: "e-togglebar e-nav e-box e-ct e-div",
    
    /**
     * 添加Tabbar的子项目，并为每个添加的字项目绑定click事件：this._onChildrenClick
     * 
     * @param index : {Number}
     * @param item: {Button/仅以Button为例} 
     * @return item
     */
    addChildAt: function(index, item) {
        var item = Edo.navigators.ToggleBar.superclass.addChildAt.apply(this, arguments);
        item.on("click", this._onChildrenClick, this);
        return item;
    },
    removeChildAt: function(index) {
        var A = Edo.navigators.ToggleBar.superclass.removeChildAt.apply(this, arguments);
        if (index == this.selectedIndex) {
            var $ = this.getChildAt(index);
            if (!$){
            	$ = this.getChildAt(index - 1);
            }
            if ($){
            	this.set("selectedItem", $);
            }else{
            	this._setSelectedIndex( - 1);
            }
        }
        return A;
    },
    _setSelectedItem: function(item) {
        var index = this.children.indexOf(item);
        if (index != -1 && item != this.selectedItem){
        	this.selectedIndex = -1;
        }
        this._setSelectedIndex(index);
    },
    _setSelectedIndex: function(index) {
        if (!this.rendered) {
            this.selectedIndex = index;
            return;
        }
        if (index < 0){
        	index = -1;
        }
        if (index >= this.children.length){
        	index = this.children.length - 1;
        }
        if (this.selectedIndex === index){
        	return;
        }
        if (this.fireEvent("beforeselectionchange", {
            type: "beforeselectionchange",
            source: this,
            selectedIndex: index
        }) !== false) {
            this.selectedIndex = index;
            this.children.each(function(_, A) {
                if (A == index) {
                    _.set("pressed", true);
                    _.addCls(this.selectedCls)
                } else {
                    _.set("pressed", false);
                    _.removeCls(this.selectedCls)
                }
            },this);
            this.selectedItem = this.getDisplayChildren()[index];
            this.fireEvent("selectionchange", {
                type: "selectionchange",
                source: this,
                index: this.selectedIndex,
                selectedIndex: this.selectedIndex
            });
            this.changeProperty("selectedIndex", index);
            this.el.style.visible = "hidden";
            this.relayout("selectedIndex");
        }
    },
    _onChildrenClick: function(event) {
        var _index = this.children.indexOf(event.source);
        if (_index != this.selectedIndex) this._setSelectedIndex(_index);
    },
    
    /**
     * 渲染
     */
    render: function() {
        Edo.navigators.ToggleBar.superclass.render.apply(this, arguments);
        var _index = this.selectedIndex;
        delete this.selectedIndex;
        this._setSelectedIndex(_index);
    }
});
Edo.navigators.ToggleBar.regType("togglebar");
//Edo.navigators.ToggleBar : END

/**
 * Tab切换器
 * 
 * @see http://edojs.com/demo/#tabbar
 * TypeName:	tabbar
 * Namespace:	Edo.navigators
 * ClassName:	TabBar
 * Extend:	Edo.navigators.ToggleBar
 */
Edo.navigators.TabBar = function($) {
    Edo.navigators.TabBar.superclass.constructor.call(this)
};
Edo.navigators.TabBar.extend(Edo.navigators.ToggleBar, {
	/**
	 * 默认的tabbar高度 默认值 : 25
	 * 
	 * @var {Number}
	 */
    defaultHeight: 25,
    border: [1, 1, 1, 1],
    padding: [2, 5, 2, 5],
    width: "100%",
    verticalAlign: "bottom",
    horizontalGap: 3,
    minHeight: 17,
    selectedCls: "e-tabbar-selected",
    itemCls: "e-tabbar-item",
    elCls: "e-tabbar e-togglebar e-nav e-box e-ct e-div",
    position: "top",
    _setPosition: function(position) {
        if (this.position != position) {
            this.position = position;
            switch (position) {
            case "top":
                this.verticalAlign = "bottom";
                break;
            case "bottom":
                this.verticalAlign = "top";
                break;
            case "left":
                this.horizontalAlign = "right";
                break;
            case "right":
                this.horizontalAlign = "left";
                break
            }
            this.changeProperty("position", this.position);
            this.relayout("position", this);
        }
    },
    getInnerHtml: function(_tab_html) {
        this.elCls += " e-tabbar";
        this.elCls += " e-tabbar-" + this.position;
        Edo.navigators.TabBar.superclass.getInnerHtml.call(this, _tab_html);
        _tab_html[_tab_html.length] = "<div class=\"e-tabbar-line\"></div>";
    },
    createChildren: function(tabbar) {
        Edo.navigators.TabBar.superclass.createChildren.call(this, tabbar);
        this.stripEl = Edo.util.Dom.append(this.scrollEl, "<div class=\"e-tabbar-line-strip\"></div>");
        this.lineEl = this.scrollEl.nextSibling;
    },
    
    /**
     * 同步Tabbar的Size
     * 
     */
    syncSize: function() {
        Edo.navigators.TabBar.superclass.syncSize.call(this);
        this.doSyncLine();
    },
    
    /**
     * 用来同步tabbar-line-strip，tabbar-line的Box 并对其进行设置
     */
    doSyncLine: function() {
        var _tab_line_box = this._getBox(true),
        _tab_scrollct_box = Edo.util.Dom.getBox(this.scrollEl),
        _tab_strip_box = this.selectedItem ? this.selectedItem._getBox(true) : {
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            right: 0,
            bottom: 0
        };
        switch (this.position) {
        case "top":
            _tab_strip_box.x += 1;
            _tab_strip_box.y = _tab_strip_box.bottom - 1;
            _tab_strip_box.width -= 2;
            _tab_strip_box.height = 1;
            _tab_line_box.y = _tab_scrollct_box.bottom - 1;
            _tab_line_box.height = 5;
            break;
        case "bottom":
            _tab_strip_box.x += 1;
            _tab_strip_box.width -= 2;
            _tab_strip_box.height = 1;
            _tab_line_box.height = _tab_scrollct_box.y - _tab_line_box.y + 1;
            break;
        case "left":
            _tab_strip_box.x = _tab_strip_box.right - 1;
            _tab_strip_box.width = 1;
            _tab_strip_box.y += 1;
            _tab_strip_box.height -= 2;
            _tab_line_box.x = _tab_scrollct_box.right - 1;
            _tab_line_box.width = 5;
            break;
        case "right":
            _tab_strip_box.y += 1;
            _tab_strip_box.height -= 2;
            _tab_strip_box.width = 1;
            _tab_line_box.width = _tab_scrollct_box.x - _tab_line_box.x + 1
        }
        Edo.util.Dom.setBox(this.stripEl, {
            x: _tab_strip_box.x,
            y: _tab_strip_box.y,
            width: _tab_strip_box.width,
            height: _tab_strip_box.height
        });
        Edo.util.Dom.setBox(this.lineEl, _tab_line_box);
    },
    
    /**
     * 给tabbar对象添加子Item项
     * 
     * @param index : {Number}
     * @param item: {Button} 
     */
    addChildAt: function() {
        var item = arguments[1];
        if (this.position == "top" || this.position == "bottom"){
        	item.height = "100%";
        }else{
        	item.width = "100%";
        }
        var _item = Edo.navigators.TabBar.superclass.addChildAt.apply(this, arguments);
        _item.addCls("e-tabbar-item");
        return _item;
    }
});
Edo.navigators.TabBar.regType("tabbar");
//Edo.navigators.TabBar : END

Edo.navigators.VTabBar = function($) {
    Edo.navigators.VTabBar.superclass.constructor.call(this)
};
Edo.navigators.VTabBar.extend(Edo.navigators.TabBar, {
    width: "auto",
    height: "100%",
    verticalAlign: "top",
    horizontalAlign: "left",
    defaultWidth: 22,
    defaultHeight: 60,
    position: "left",
    layout: "vertical",
    padding: [2, 2, 2, 3],
    verticalGap: 2
});
Edo.navigators.VTabBar.regType("vtabbar");
Edo.navigators.PagingBar = function($) {
    Edo.navigators.PagingBar.superclass.constructor.call(this)
};
Edo.navigators.PagingBar.extend(Edo.containers.Box, {
    componentMode: "control",
    elCls: "e-pagingbar e-box e-ct e-div",
    size: 20,
    index: 0,
    total: -1,
    totalPage: -1,
    loading: false,
    autoPaging: false,
    totalTpl: "第 <input class=\"e-pagingbar-input\" onchange=\"<%=this.id%>.change(parseInt(this.value)-1, <%=this.size%>);\" onkeydown=\"if(event.keyCode==13) <%=this.id%>.change(parseInt(this.value)-1, <%=this.size%>);\" type=\"text\" value=\"<%=this.index+1%>\"/> / <%=this.totalPage%>页, 每页<input onchange=\"<%=this.id%>.change(<%=this.index%>, this.value);\" onkeydown=\"if(event.keyCode==13) <%=this.id%>.change(<%=this.index%>, this.value);\" class=\"e-pagingbar-input\"  type=\"text\" value=\"<%=this.size%>\"/>条, 共<%=this.total%>条",
    layout: "horizontal",
    layout: "horizontal",
    border: [0, 0, 0, 0],
    padding: [0, 0, 0, 0],
    barVisible: true,
    infoVisible: true,
    _setSize: function($) {
        this.size = $
    },
    init: function() {
        var $ = this;
        this.set({
            verticalAlign: "middle",
            "children": [{
                name: "barct",
                type: "ct",
                layout: "horizontal",
                horizontalGap: 0,
                verticalAlign: "middle",
                height: "100%",
                children: [{
                    type: "button",
                    name: "first",
                    defaultHeight: 16,
                    icon: "e-page-first",
                    onclick: this.doFirst.bind(this)
                },
                {
                    type: "button",
                    name: "pre",
                    defaultHeight: 16,
                    icon: "e-page-pre",
                    onclick: this.doPre.bind(this)
                },
                {
                    type: "button",
                    name: "next",
                    defaultHeight: 16,
                    icon: "e-page-next",
                    onclick: this.doNext.bind(this)
                },
                {
                    type: "button",
                    name: "last",
                    defaultHeight: 16,
                    icon: "e-page-last",
                    onclick: this.doLast.bind(this)
                }]
            },
            {
                type: "button",
                name: "refresh",
                defaultHeight: 16,
                icon: "e-icon-refresh",
                onclick: this.doRefresh.bind(this)
            },
            {
                type: "button",
                name: "nowait",
                defaultHeight: 16,
                icon: "e-page-nowait"
            },
            {
                type: "space",
                name: "space",
                width: "100%"
            },
            {
                name: "infoct",
                type: "ct",
                layout: "horizontal",
                verticalAlign: "middle",
                children: [{
                    type: "label",
                    name: "view"
                }]
            }]
        });
        Edo.navigators.PagingBar.superclass.init.apply(this, arguments);
        var _ = this;
        function A($) {
            return Edo.getByName($, _)[0]
        }
        var B = this.children;
        this.firstBtn = A("first");
        this.preBtn = A("pre");
        this.nextBtn = A("next");
        this.lastBtn = A("last");
        this.refreshBtn = A("refresh");
        this.loadBtn = A("nowait");
        this.viewText = A("view");
        this.barCt = A("barct");
        this.infoCt = A("infoct");
        this.space = A("space");
        this.barCt.set("visible", this.barVisible);
        this.infoCt.set("visible", this.infoVisible);
        if (this.autoPaging) this.change.defer(this.padingDelay, this)
    },
    padingDelay: 100,
    doFirst: function($) {
        this.change(0)
    },
    doPre: function($) {
        this.change(this.index - 1)
    },
    doNext: function($) {
        this.change(this.index + 1)
    },
    doLast: function($) {
        this.change(this.totalPage - 1)
    },
    doRefresh: function($) {
        this.change()
    },
    change: function($, A, _) {
        $ = parseInt($);
        A = parseInt(A);
        var B = {
            type: "beforepaging",
            source: this,
            index: Edo.isValue($) ? $: this.index,
            size: Edo.isValue(A) ? A: this.size,
            params: _
        };
        if (this.fireEvent("beforepaging", B) !== false) {
            this.index = B.index;
            this.size = B.size;
            this.compute();
            this.loading = true;
            this.refresh();
            B.type = "paging";
            this.fireEvent("paging", B)
        }
    },
    compute: function($, A, _) {
        if (Edo.isValue($)) this.index = $;
        if (Edo.isValue(A)) this.size = A;
        if (Edo.isValue(_)) this.total = _;
        this.totalPage = parseInt(this.total / this.size) + (this.total % this.size ? 1: 0);
        if (this.index >= this.totalPage - 1) this.index = this.totalPage - 1;
        if (this.index < 0) this.index = 0
    },
    refresh: function($) {
        if (Edo.isValue($)) this.total = $;
        this.compute();
        if (this.inited) {
            this.firstBtn.set("enable", this.index != 0);
            this.preBtn.set("enable", this.index != 0);
            this.nextBtn.set("enable", !(this.totalPage == 0) && this.index != this.totalPage - 1);
            this.lastBtn.set("enable", !(this.totalPage == 0) && this.index != this.totalPage - 1);
            this.viewText.set("text", "");
            this.viewText.set("text", new Edo.util.Template(this.totalTpl).run(this));
            this.loadBtn.set("icon", this.loading ? "e-page-wait": "e-page-nowait");
            this.loading = false
        }
    }
});
Edo.navigators.PagingBar.regType("pagingbar");
Edo.navigators.PagingBar.prototype.refreshView = Edo.navigators.PagingBar.prototype.refresh;

/**
 * 按钮
 * 
 * TypeName:	button
 * Namespace:	Edo.controls
 * ClassName:	Button
 * Extend:	Edo.controls.Control
 */
Edo.controls.Button = function() {
    Edo.controls.Button.superclass.constructor.call(this)
};
Edo.controls.Button.extend(Edo.controls.Control, {
    enableForm: false,
    simpleButton: false,
    autoWidth: true,
    autoHeight: true,
    defaultWidth: 18,
    defaultHeight: 21,
    height: 21,
    minWidth: 20,
    minHeight: 18,
    showMenu: true,
    popupWidth: 110,
    text: "",
    icon: "",
    iconAlign: "left",
    arrowMode: "",
    arrowAlign: "right",
    autoClose: true,
    pressed: false,
    overCls: "e-btn-over",
    pressedCls: "e-btn-click",
    togglCls: "e-btn-pressed",
    enableToggle: false,
    elCls: "e-btn",
    _onMouseEvent: function(_) {
        if (!this.isEnable()) return;
        _.source = this;
        if (!this.design) {
            if (_.type == "click") {
                var $ = _.target.firstChild;
                if ($ && $.nodeType == 3) $ = null;
                if (this.arrowMode && this.arrowMode != "menu" && Edo.util.Dom.hasClass(_.target, "e-btn-arrow")) {
                    _.type = "arrowclick";
                    this.fireEvent("arrowclick", _);
                    return
                }
            }
            this.fireEvent(_.type, _)
        }
    },
    createPopup: function() {
        Edo.controls.Button.superclass.createPopup.apply(this, arguments);
        this.menu = this.popupCt
    },
    showPopup: function() {
        this._setPressed(true);
        Edo.controls.Button.superclass.showPopup.apply(this, arguments)
    },
    hidePopup: function() {
        Edo.controls.Button.superclass.hidePopup.apply(this, arguments);
        this._setPressed(false);
        if (this.menu && this.menu.children) this.menu.children.each(function($) {
            if ($.type == "button" && $.rendered) $.hidePopup()
        })
    },
    getClass: function() {
        var $ = "";
        if (this.icon) if (this.text) {
            $ += " e-btn-icontext";
            $ += " e-btn-icon-align-" + this.iconAlign
        } else $ += " e-btn-icon";
        this.getArrowCls();
        $ += " " + this.arrowCls;
        if (this.pressed) $ += " " + this.togglCls;
        return $
    },
    htmlType: "a",
    getInnerHtml: function(html) {
        if (this.simpleButton) {
        	return this.text || "";
        }
        this.elCls += this.getClass();
        var _ = Edo.isValue(this.realWidth) ? this.realWidth + "px": "auto",
        A = Edo.isValue(this.realHeight) ? this.realHeight + "px": "auto",
        text = this.text || "&nbsp;";
        html[html.length] = "<span class=\"e-btn-text " + this.icon + "\">" + text + "</span>";
        if (this.arrowMode){
        	html[html.length] = "<span class=\"e-btn-arrow\"></span>"
        }
    },
    createChildren: function($) {
        Edo.controls.Button.superclass.createChildren.call(this, $);
        if (!this.design) this.el.href = "javascript:;";
        this.el.hideFocus = true;
        if (this.simpleButton) return "";
        this.field = this.el.firstChild;
        if (this.splitMode == "split") this.splitEl = this.el.lastChild
    },
    initEvents: function() {
        if (!this.design) {
            var $ = this.el;
            Edo.util.Dom.addClassOnClick($, this.pressedCls);
            this.on("click", this._onClick, this, 0);
            this.on("arrowclick", this._onArrowClick, this, 0)
        }
        Edo.controls.Button.superclass.initEvents.call(this)
    },
    _onClick: function(_) {
        if (this.enableToggle) {
            var $ = !this.pressed;
            this._setPressed($)
        }
        if (this.popupDisplayed) this.hidePopup();
        else if (this.showMenu && this.menu) {
            this.showPopup();
            this.menu = this.popupCt
        }
    },
    _onArrowClick: function($) {
        if (this.arrowMode == "close" && this.autoClose) this.destroy();
        if (this.popupDisplayed) this.hidePopup();
        else if (this.arrowMode == "split" && this.showMenu && this.menu) {
            this.showPopup();
            this.menu = this.popupCt;
            this._setPressed(true)
        }
    },
    getArrowCls: function() {
        var $ = this.arrowCls;
        this.arrowCls = "";
        if (this.arrowMode == "menu") this.arrowCls = "e-btn-arrow-" + this.arrowAlign;
        else if (this.arrowMode == "split") this.arrowCls = "e-btn-split-" + this.arrowAlign;
        else if (this.arrowMode == "close") this.arrowCls = "e-btn-close-" + this.arrowAlign;
        return this.arrowCls
    },
    _setArrowMode: function($) {
        if (this.arrowMode != $) {
            this.arrowMode = $;
            this.getArrowCls()
        }
    },
    _setArrowAlign: function($) {
        if (this.arrowAlign != $) {
            this.arrowAlign = $;
            this.getArrowCls()
        }
    },
    _setMenu: function($) {
        if (this.popupCt) this.popupCt.parent.remove(this.popupCt);
        if ($ instanceof Array) $ = {
            type: "menu",
            shadow: this.popupShadow,
            autoHide: true,
            children: $
        };
        this.menu = this.popupCt = $;
        this.createPopup()
    },
    _setOverCls: function($) {
        if (this.overCls != $) {
            var _ = this.overCls;
            this.overCls = $;
            if (this.el) {
                Edo.util.Dom.removeClass(this.el, _);
                this.el.overCls = $
            }
            this.changeProperty("overcls", $)
        }
    },
    _setPressedCls: function($) {
        if (this.pressedCls != $) {
            var _ = this.pressedCls;
            this.pressedCls = $;
            if (this.el) {
                Edo.util.Dom.removeClass(this.el, _);
                this.el.clickCls = $
            }
            this.changeProperty("pressedcls", $)
        }
    },
    _setWidth: function($) {
        if (!Edo.isInt($) && this.width != $) this.widthGeted = false;
        Edo.controls.Button.superclass._setWidth.call(this, $)
    },
    addCls: function($) {
        Edo.controls.Button.superclass.addCls.call(this, $);
        if (!Edo.isInt(this.width)) {
            this.widthGeted = false;
            if (this.el) this.el.style.width = "auto"
        }
    },
    removeCls: function($) {
        Edo.controls.Button.superclass.removeCls.call(this, $);
        if (!Edo.isInt(this.width)) {
            this.widthGeted = false;
            if (this.el) this.el.style.width = "auto"
        }
    },
    _setText: function(text) {
        if (this.text != text) {
            this.text = text;
            if (!this.simpleButton) {
                if (this.el) this.field.innerHTML = text
            }
            if (!Edo.isInt(this.width)) {
                this.widthGeted = false;
                if (this.el) this.el.style.width = "auto"
            }
            this.changeProperty("text", text);
            if (!Edo.isInt(this.width)) this.relayout("text", text)
        }
    },
    _setIcon: function($) {
        if (this.icon != $) {
            if (this.el) {
                Edo.util.Dom.removeClass(this.field, this.icon);
                Edo.util.Dom.addClass(this.field, $)
            }
            this.icon = $
        }
    },
    _setPressed: function($) {
        $ = Edo.toBool($);
        if (this.pressed != $) {
            this.pressed = Edo.toBool($);
            if (this.el) if (this.pressed) Edo.util.Dom.addClass(this.el, this.togglCls);
            else Edo.util.Dom.removeClass(this.el, this.togglCls);
            this.fireEvent("toggle", {
                type: "toggle",
                source: this,
                pressed: $
            })
        }
    },
    syncSize: function() {
        Edo.controls.Button.superclass.syncSize.call(this);
        if (this.field) {
            var $ = Edo.util.Dom.getPadding(this.field, "tb") + 1;
            this.field.style.lineHeight = (this.realHeight - $) + "px"
        }
    },
    destroy: function() {
        Edo.util.Dom.clearEvent(this.field);
        Edo.controls.Button.superclass.destroy.call(this)
    }
});
Edo.controls.Button.regType("button");
//Edo.controls.Button : END

Edo.controls.Error = function() {
    Edo.controls.Error.superclass.constructor.call(this)
};
Edo.controls.Error.extend(Edo.controls.Control, {
    text: "",
    autoWidth: true,
    autoHeight: true,
    elCls: "e-error e-div",
    minHeight: 16,
    visible: false,
    getInnerHtml: function($) {
        $[$.length] = "<div class=\"e-error-inner\">" + this.text + "</div><a class=\"e-error-close\"></a>"
    },
    init: function() {
        Edo.controls.Error.superclass.init.call(this);
        this.on("click", 
        function(A) {
            var _ = "";
            if (Edo.util.Dom.hasClass(A.target, "e-error-link")) _ = A.target.id;
            if (Edo.util.Dom.hasClass(A.target, "e-error-close")) {
                this._onValid();
                _ = this.fields[0] ? this.fields[0].field.id + "-error": ""
            }
            _ = _.substr(0, _.length - 6);
            var $ = Edo.get(_);
            if (!$) return;
            $.focus()
        },
        this)
    },
    _setText: function($) {
        if (this.text !== $) {
            this.text = $;
            if (this.el) this.el.firstChild.innerHTML = $;
            if (!Edo.isInt(this.width)) this.widthGeted = false;
            if (!Edo.isInt(this.height)) this.heightGeted = false;
            this.relayout("text", $)
        }
    },
    bind: function(_) {
        this.unbind(_);
        var $ = Edo.get(_);
        if (!$) return;
        $.on("valid", this._onValid, this);
        $.on("invalid", this._onInValid, this)
    },
    unbind: function(_) {
        var $ = Edo.get(_);
        if (!$) return;
        $.un("valid", this._onValid, this);
        $.un("invalid", this._onInValid, this)
    },
    _onValid: function($) {
        this.set("visible", false);
        this.set("text", "")
    },
    _onInValid: function(_) {
        this.fields = [];
        if (_.fields) this.fields = _.fields;
        else this.fields.add({
            field: _.source,
            errorMsg: _.errorMsg
        });
        var $ = "";
        this.fields.each(function(_) {
            $ += "<a id=\"" + _.field.id + "-error\" class=\"e-error-link\" href=\"#\" onclick=\"return false;\">" + _.errorMsg + "</a>"
        });
        this.set("text", $);
        this.set("visible", true)
    }
});
Edo.controls.Error.regType("error");
Edo.controls.Slider = function() {
    Edo.controls.Slider.superclass.constructor.call(this)
};
Edo.controls.Slider.extend(Edo.controls.Control, {
    valueField: "value",
    defaultValue: 0,
    value: 0,
    minValue: 0,
    maxValue: 100,
    increment: 0,
    defaultWidth: 100,
    defaultHeight: 22,
    minHeight: 22,
    minWidth: 30,
    direction: "horizontal",
    thumbCls: "e-slider-thumb",
    thumbOverCls: "e-slider-thumb-over",
    thumbPressedClass: "e-slider-thumb-pressed",
    elCls: "e-slider",
    getInnerHtml: function($) {
        if (this.direction == "vertical") this.elCls += " e-slider-v";
        $[$.length] = "<div class=\"e-slider-start\"><div class=\"e-slider-end\"><div class=\"e-slider-inner\" style=\"";
        if (this.direction == "vertical") {
            $[$.length] = "height:";
            $[$.length] = this.realHeight - 14;
            $[$.length] = "px;"
        }
        $[$.length] = "\"><div class=\"";
        $[$.length] = this.thumbCls;
        $[$.length] = "\"></div></div></div></div>"
    },
    createChildren: function($) {
        Edo.controls.Slider.superclass.createChildren.call(this, $);
        this.startEl = this.el.firstChild;
        this.endEl = this.startEl.firstChild;
        this.inner = this.endEl.lastChild;
        this.thumb = this.inner.lastChild;
        this.halfThumb = 15 / 2;
        this.thumbDrag = new Edo.util.Drag({
            onMove: this._onThumbDragMove.bind(this),
            onStop: this._onThumbDragComplete.bind(this)
        })
    },
    initEvents: function() {
        if (!this.design) {
            this.on("mousedown", this._onMouseDown);
            Edo.util.Dom.addClassOnClick(this.thumb, this.thumbPressedClass);
            Edo.util.Dom.addClassOnOver(this.thumb, this.thumbOverCls)
        }
        Edo.controls.Slider.superclass.initEvents.call(this)
    },
    syncSize: function() {
        Edo.controls.Slider.superclass.syncSize.call(this);
        if (this.mustSyncSize !== false) if (this.direction == "vertical");
        var $ = this.normalizeValue(this.value);
        if (!isNaN($)) {
            this.value = $;
            this.moveThumb(this.translateValue(this.value))
        }
        if (this.direction == "vertical") this.inner.style.height = (this.realHeight - 14) + "px"
    },
    _onMouseDown: function(B) {
        if (B.button == Edo.util.MouseButton.left) {
            this.ctBox = Edo.util.Dom.getBox(this.inner);
            if (B.within(this.thumb)) {
                this.initXY = Edo.util.Dom.getXY(this.thumb);
                this.xOffset = this.initXY[0] - B.xy[0];
                this.yOffset = this.initXY[1] - B.xy[1];
                this.thumbDrag.start(B);
                this.fireEvent("slidestart", {
                    type: "slidestart",
                    source: this,
                    xy: Edo.util.Dom.getXY(this.thumb)
                })
            } else {
                var $ = this.direction == "horizontal" ? 0: 1,
                A = this.direction == "horizontal" ? this.ctBox.x: this.ctBox.y,
                _ = B.xy[$] - A;
                this.anim = true;
                this._setValue(Math.round(this.reverseValue(_)));
                this.anim = false
            }
        }
    },
    _onThumbDragMove: function(A) {
        var _ = this.initXY,
        $ = this.direction == "horizontal" ? 0: 1,
        D = this.direction == "horizontal" ? this.xOffset: this.yOffset,
        C = this.direction == "horizontal" ? this.ctBox.x: this.ctBox.y,
        B = (A.now[$] + D) - C;
        this._setValue(Math.round(this.reverseValue(B)));
        _ = A.now;
        _[$] = C + this.translateValue(this.value);
        this.fireEvent("slide", {
            type: "slide",
            source: this,
            xy: _
        })
    },
    _onThumbDragComplete: function($) {
        this.fireEvent("slidecomplete", {
            type: "slidecomplete",
            source: this,
            xy: [$.now[0] + this.xOffset, $.now[1] + this.yOffset]
        })
    },
    _setValue: function($) {
        $ = this.normalizeValue($);
        if ($ !== this.value && this.fireEvent("beforevaluechange", {
            type: "beforevaluechange",
            source: this,
            value: $
        }) !== false) {
            this.value = $;
            if (this.el) this.moveThumb(this.translateValue($));
            this.changeProperty("value", this.value)
        }
    },
    translateValue: function(_) {
        var $ = this.getRatio();
        return (_ * $) - (this.minValue * $) - this.halfThumb
    },
    reverseValue: function($) {
        var _ = this.getRatio();
        return ($ + this.halfThumb + (this.minValue * _)) / _
    },
    getRatio: function() {
        var A = this.direction == "horizontal" ? "getWidth": "getHeight",
        $ = Edo.util.Dom[A](this.inner),
        _ = this.maxValue - this.minValue;
        return _ == 0 ? $: ($ / _)
    },
    moveThumb: function(_) {
        if (this.thumb) {
            var A = this.direction == "horizontal" ? "left": "top";
            if (this.anim) {
                var $ = {};
                $[A] = _;
                new Edo.util.Fx.Style({
                    el: this.thumb,
                    duration: 300
                }).start($)
            } else this.thumb.style[A] = _ + "px"
        }
    },
    normalizeValue: function($) {
        if (typeof $ != "number") $ = parseInt($);
        if (isNaN($)) $ = this.minValue;
        $ = Math.round($);
        $ = this.doSnap($);
        $ = $.constrain(this.minValue, this.maxValue);
        return $
    },
    doSnap: function(_) {
        if (!this.increment || this.increment == 1 || !_) return _;
        var $ = _,
        B = this.increment,
        A = _ % B;
        if (A > 0) if (A > (B / 2)) $ = _ + (B - A);
        else $ = _ - A;
        return $.constrain(this.minValue, this.maxValue)
    },
    destroy: function() {
        Edo.util.Dom.clearEvent(this.thumb);
        this.thumb = null;
        Edo.controls.Slider.superclass.destroy.call(this)
    }
});
Edo.controls.Slider.regType("slider");
Edo.controls.VSlider = function() {
    Edo.controls.VSlider.superclass.constructor.call(this)
};
Edo.controls.VSlider.extend(Edo.controls.Slider, {
    direction: "vertical",
    minWidth: 22,
    minHeight: 30,
    defaultHeight: 100,
    defaultWidth: 22
});
Edo.controls.VSlider.regType("vslider");
Edo.controls.ScrollBar = function() {
    Edo.controls.ScrollBar.superclass.constructor.call(this)
};
Edo.controls.ScrollBar.extend(Edo.controls.Control, {
    valueField: "value",
    defaultValue: 0,
    minWidth: 17,
    minHeight: 17,
    defaultWidth: 100,
    defaultHeight: 17,
    upWidth: 17,
    upHeight: 17,
    downWidth: 17,
    downHeight: 17,
    maxValue: 0,
    value: 0,
    minHandleSize: 7,
    incrementValue: 10,
    alternateIncrementValue: 30,
    spinTime: 20,
    scrollTime: 70,
    direction: "horizontal",
    elCls: "e-div e-scrollbar",
    upPressedCls: "e-scrollbar-up-pressed",
    downPressedCls: "e-scrollbar-down-pressed",
    handlePressedCls: "e-scrollbar-handle-pressed",
    set: function($, _) {
        if (!$) return;
        if (typeof $ == "string") {
            var A = $;
            $ = {};
            $[A] = _
        }
        if ($.maxValue) {
            this._setMaxValue($.maxValue);
            delete $.maxValue
        }
        if ($.maxValue) {
            this._setMaxValue($.maxValue);
            delete $.maxValue
        }
        Edo.controls.ScrollBar.superclass.set.call(this, $)
    },
    getInnerHtml: function($) {
        if (this.direction == "horizontal") this.elCls += " e-hscrollbar";
        $[$.length] = "<div class=\"e-scrollbar-handle\"><div class=\"e-scrollbar-handle-outer\"></div><div class=\"e-scrollbar-handle-center\"></div><div class=\"e-scrollbar-handle-inner\"></div></div><div class=\"e-scrollbar-up\"></div><div class=\"e-scrollbar-down\"></div>"
    },
    createChildren: function($) {
        Edo.controls.ScrollBar.superclass.createChildren.call(this, $);
        this.handle = this.el.firstChild;
        this.upBtn = this.el.childNodes[1];
        this.downBtn = this.el.lastChild
    },
    initEvents: function() {
        if (!this.design) {
            this.on("mousedown", this._onMousedown, this);
            Edo.util.Dom.addClassOnClick(this.upBtn, this.upPressedCls);
            Edo.util.Dom.addClassOnClick(this.downBtn, this.downPressedCls);
            Edo.util.Dom.addClassOnClick(this.handle, this.handlePressedCls);
            Edo.util.Dom.addClassOnClick(this.el, "", this._stopSpin.bind(this))
        }
        Edo.controls.ScrollBar.superclass.initEvents.call(this)
    },
    syncSize: function() {
        Edo.controls.ScrollBar.superclass.syncSize.call(this);
        var $ = this.getHandleSize();
        if (this.direction == "vertical") Edo.util.Dom.setHeight(this.handle, $);
        else Edo.util.Dom.setWidth(this.handle, $);
        this.syncScroll()
    },
    getHandleSize: function() {
        var _ = 0,
        B,
        _,
        A,
        $;
        if (this.direction == "vertical") {
            B = this.upHeight + this.downHeight;
            _ = this.realHeight;
            A = this.maxValue
        } else {
            B = this.upWidth + this.downWidth;
            _ = this.realWidth;
            A = this.maxValue
        }
        if (_ == A + _) $ = 0;
        else $ = Math.max(this.minHandleSize, Math.round((_ - B) * _ / (A + _)));
        return $
    },
    getHandleOffset: function(_) {
        var D,
        B,
        C,
        A;
        if (this.direction == "vertical") {
            D = this.upHeight + this.downHeight;
            B = this.realHeight;
            C = this.maxValue;
            A = this.value
        } else {
            D = this.upWidth + this.downWidth;
            B = this.realWidth;
            C = this.maxValue;
            A = this.value
        }
        var $ = B - D - _;
        offset = A / C * $;
        return offset
    },
    createvalue: function(A, _) {
        var $ = A * this.maxValue / _;
        return Math.floor($)
    },
    createvalue: function(A, _) {
        var $ = A * this.maxValue / _;
        return Math.floor($)
    },
    getMoveReginBox: function() {
        var $ = this.getBox(),
        _ = this.getHandleSize();
        if (this.direction == "vertical") {
            $.y += this.upHeight;
            $.height -= (this.upHeight + this.downHeight + _)
        } else {
            $.x += this.upWidth;
            $.width -= (this.upWidth + this.downWidth + _)
        }
        $.right = $.x + $.width;
        $.bottom = $.y + $.height;
        return $
    },
    _onMousedown: function(E) {
        if (E.button != 0) return false;
        var B = E.target,
        D = this.direction == "vertical";
        this._stopSpin();
        if (Edo.util.Dom.contains(this.handle, B)) {
            Edo.managers.DragManager.startDrag({
                event: E,
                capture: true,
                dragObject: this.handle,
                delay: 30,
                alpha: 1,
                enableDrop: false,
                ondragstart: this._onHandleDragStart.bind(this),
                ondragmove: this._onHandleDragMove.bind(this),
                ondragcomplete: this._onHandleDragComplete.bind(this)
            });
            this.dragTimer = new Date()
        } else if (Edo.util.Dom.contains(this.upBtn, B)) {
            this._startSpin("up", this.incrementValue, this.spinTime);
            this.canFireComplete = true
        } else if (Edo.util.Dom.contains(this.downBtn, B)) {
            this._startSpin("down", this.incrementValue, this.spinTime);
            this.canFireComplete = true
        } else {
            var C = this.getMoveReginBox(),
            A = this.getHandleSize();
            if (D) C.height += this.downHeight + A;
            else C.width += this.downWidth + A;
            var _ = this.getMoveReginBox(),
            $ = Edo.util.Dom.getXY(this.handle);
            if (Edo.util.Dom.isInRegin(E.xy, C)) if (D) {
                this.stopOffset = this.createvalue(Math.abs(_.y - E.xy[1]), _.height);
                if (E.xy[1] < $[1]) this._startSpin("up", this.alternateIncrementValue, this.spinTime);
                else this._startSpin("down", this.alternateIncrementValue, this.spinTime)
            } else {
                this.stopOffset = this.createvalue(Math.abs(_.x - E.xy[0]), _.width);
                if (E.xy[0] < $[0]) this._startSpin("up", this.alternateIncrementValue, this.spinTime);
                else this._startSpin("down", this.alternateIncrementValue, this.spinTime)
            }
            this.canFireComplete = true
        }
    },
    doSpin: function($, _) {
        var A = this.direction == "vertical";
        if ($ == "up") {
            if (A) {
                var B = this.value - _;
                if (Edo.isValue(this.stopOffset) && B < this.stopOffset) return;
                this._setValue(B)
            } else {
                B = this.value - _;
                if (Edo.isValue(this.stopOffset) && B < this.stopOffset) return;
                this._setValue(B)
            }
        } else if (A) {
            B = this.value + _;
            if (Edo.isValue(this.stopOffset) && B > this.stopOffset) return;
            this._setValue(B)
        } else {
            B = this.value + _;
            if (Edo.isValue(this.stopOffset) && B > this.stopOffset) return;
            this._setValue(B)
        }
    },
    _startSpin: function($, _, A) {
        this.spinDirection = $;
        this.spinTimer = this.doSpin.time(A, this, [$, _], true)
    },
    _stopSpin: function() {
        clearInterval(this.spinTimer);
        this.spinTimer = null;
        this.stopOffset = null;
        if (this.canFireComplete) {
            this.completeScroll();
            this.canFireComplete = false
        }
    },
    _onHandleDragStart: function(_) {
        this.moveBox = this.getMoveReginBox();
        this.enableSyncScroll = false;
        if (!isIE8) {
            var $ = this;
            this.scrollTimer = setInterval(function() {
                if ($.direction == "vertical") $._setValue($._value);
                else $._setValue($._value)
            },
            this.scrollTime)
        }
        this.fireEvent("scrollstart", {
            type: "scrollstart",
            source: this,
            direction: this.direction,
            value: this.value,
            maxValue: this.maxValue
        })
    },
    _onHandleDragMove: function(C) {
        var A = C.source,
        _ = this.moveBox,
        B = this.direction == "vertical";
        if (B) {
            C.xy[0] = _.x;
            if (C.xy[1] < _.y) C.xy[1] = _.y;
            if (C.xy[1] > _.bottom) C.xy[1] = _.bottom;
            this._value = this.createvalue(C.xy[1] - _.y, _.height)
        } else {
            C.xy[1] = _.y;
            if (C.xy[0] < _.x) C.xy[0] = _.x;
            if (C.xy[0] > _.right) C.xy[0] = _.right;
            this._value = this.createvalue(C.xy[0] - _.x, _.width)
        }
        if (isIE8) if (this.dragTimer) {
            var $ = new Date();
            if ($ - this.dragTimer >= this.scrollTime) {
                this.dragTimer = $;
                this._setValue(this._value)
            }
        }
    },
    _onHandleDragComplete: function($) {
        this.enableSyncScroll = true;
        clearInterval(this.scrollTimer);
        if (Edo.isValue(this._value)) this._setValue(this._value);
        this._value = null;
        this.completeScroll()
    },
    completeScroll: function() {
        this.fireEvent("scrollcomplete", {
            type: "scrollcomplete",
            source: this,
            direction: this.direction,
            value: this.value
        })
    },
    _setValue: function($) {
        if (!Edo.isValue($)) return;
        if ($ < 0) $ = 0;
        if ($ > this.maxValue) $ = this.maxValue;
        if (this.value != $) {
            this.value = $;
            this.syncScroll();
            this.fireEvent("scroll", {
                type: "scroll",
                source: this,
                direction: this.direction,
                value: this.value
            })
        }
    },
    _setMaxValue: function($) {
        if ($ < 0) $ = 0;
        if (this.maxValue != $) {
            this.maxValue = $;
            this.relayout("maxValue")
        }
    },
    syncScroll: function() {
        if (!this.el || this.enableSyncScroll == false) return;
        var $ = this.getHandleSize();
        if ($ != 0) {
            var _ = this.getHandleOffset($),
            A = _ + (this.direction == "vertical" ? this.upHeight: this.upWidth);
            if (this.direction == "vertical") this.handle.style.top = A + "px";
            else this.handle.style.left = A + "px"
        }
    }
});
Edo.controls.ScrollBar.regType("scrollbar");
Edo.controls.VScrollBar = function() {
    Edo.controls.VScrollBar.superclass.constructor.call(this)
};
Edo.controls.VScrollBar.extend(Edo.controls.ScrollBar, {
    defaultWidth: 17,
    defaultHeight: 100,
    direction: "vertical"
});
Edo.controls.VScrollBar.regType("vscrollbar");
Edo.controls.CheckBox = function($) {
    Edo.controls.CheckBox.superclass.constructor.call(this)
};
Edo.controls.CheckBox.extend(Edo.controls.Control, {
    valueField: "checked",
    defaultValue: false,
    autoWidth: true,
    minWidth: 20,
    text: "",
    checked: false,
    trueValue: true,
    falseValue: false,
    _getChecked: function() {
        return this.checked == true ? this.trueValue: this.falseValue
    },
    set: function($, _) {
        if (!$) return;
        if (typeof $ === "string") {
            var B = $;
            $ = {};
            $[B] = _
        }
        var A = $.checked;
        delete $.checked;
        Edo.controls.CheckBox.superclass.set.call(this, $);
        if (A !== undefined) this._setChecked(A);
        return this
    },
    elCls: "e-checkbox",
    checkedCls: "e-checked",
    overcheckedCls: "e-checked-over",
    pressedcheckedCls: "e-checked-pressed",
    getInnerHtml: function($) {
        if (this.checked) this.elCls += " " + this.checkedCls;
        $[$.length] = "<div class=\"e-checked-icon\"><div class=\"e-checked-icon-inner\"></div></div><div class=\"e-checked-text\">";
        $[$.length] = this.text;
        $[$.length] = "</div>"
    },
    createChildren: function($) {
        Edo.controls.CheckBox.superclass.createChildren.call(this, $);
        this.iconEl = this.el.firstChild;
        this.textEl = this.el.lastChild
    },
    initEvents: function() {
        if (!this.design) {
            var $ = this.el;
            Edo.util.Dom.addClassOnOver($, this.overcheckedCls);
            Edo.util.Dom.addClassOnClick($, this.pressedcheckedCls);
            this.on("click", this._onClick, this)
        }
        Edo.controls.CheckBox.superclass.initEvents.call(this)
    },
    _onClick: function(_) {
        if (!this.enable) return;
        var $ = this.checked === this.trueValue ? this.falseValue: this.trueValue;
        this._setChecked($)
    },
    _setText: function($) {
        if (this.text !== $) {
            this.text = $;
            if (this.el) this.textEl.innerHTML = this.text;
            if (!Edo.isInt(this.width)) this.widthGeted = false;
            this.changeProperty("text", $);
            this.relayout("text", $)
        }
    },
    _setChecked: function($) {
        if (this.checked !== $) {
            this.checked = $ === this.trueValue ? this.trueValue: this.falseValue;
            if (this.el) if (this.checked === this.trueValue) Edo.util.Dom.addClass(this.el, this.checkedCls);
            else Edo.util.Dom.removeClass(this.el, this.checkedCls);
            this.fireEvent("checkedchange", {
                type: "checkedchange",
                source: this,
                checked: this.checked
            });
            this.changeProperty("checked", this.checked)
        }
    }
});
Edo.controls.CheckBox.regType("checkbox", "check");
Edo.controls.Radio = function() {
    Edo.controls.Radio.superclass.constructor.call(this)
};
Edo.controls.Radio.extend(Edo.controls.CheckBox, {
    elCls: "e-radiobox",
    _onClick: function(_) {
        if (!this.enable) return;
        if (this.checked === true) return;
        Edo.controls.Radio.superclass._onClick.call(this, _);
        if (this.name) {
            var $ = Edo.managers.SystemManager.getByName(this.name);
            $.each(function($) {
                if ($ != this && $.isType("radio")) $._setChecked(false)
            },
            this)
        }
    }
});
Edo.controls.Radio.regType("radio");
Edo.controls.TextInput = function() {
    Edo.controls.TextInput.superclass.constructor.call(this)
};
Edo.controls.TextInput.extend(Edo.controls.Control, {
    _htmltype: "text",
    _mode: "text",
    maxLength: 1000,
    lineHeight: true,
    defaultWidth: 100,
    minWidth: 20,
    defaultHeight: 21,
    minHeight: 20,
    text: "",
    readOnly: false,
    selectOnFocus: false,
    textStyle: "",
    textCls: "",
    elCls: "e-text",
    emptyText: "",
    emptyCls: "e-text-empty",
    focusClass: "e-text-focus",
    changeAction: "change",
    focus: function() {
        var $ = this.field;
        if (this.blurTimer) {
            clearTimeout(this.blurTimer);
            this.blurTimer = null
        }
        setTimeout(function() {
            Edo.util.Dom.focus($)
        },
        100)
    },
    blur: function() {
        var $ = this;
        this.blurTimer = setTimeout(function() {
            Edo.util.Dom.blur($.field)
        },
        100);
        if (this.field) this.field.blur()
    },
    getInnerHtml: function(B) {
        var _ = this.getFieldWidth() - 8,
        A = lh = this.realHeight - 4;
        if (this.lineHeight && this.lineHeight !== true) lh = this.lineHeight;
        var $ = this.text;
        if (this._mode == "text") B[B.length] = "<input maxlength=\"" + this.maxLength + "\" type=\"" + this._htmltype + "\" ";
        else B[B.length] = "<textarea ";
        B[B.length] = " autocomplete=\"off\" class=\"e-text-field\" style=\"height:";
        B[B.length] = A;
        B[B.length] = "px;line-height:";
        B[B.length] = lh;
        B[B.length] = "px;width:";
        B[B.length] = _;
        B[B.length] = "px;";
        B[B.length] = this.textStyle;
        B[B.length] = "\" ";
        if (this.readOnly) {
            B[B.length] = " readonly=\"true\" ";
            this.elCls += " e-text-readonly "
        }
        if (this._mode == "text") {
            B[B.length] = " value=\"";
            B[B.length] = $;
            B[B.length] = "\" />"
        } else {
            B[B.length] = ">";
            B[B.length] = $;
            B[B.length] = "</textarea>"
        }
    },
    createChildren: function($) {
        Edo.controls.TextInput.superclass.createChildren.call(this, $);
        this.field = this.el.firstChild
    },
    initEvents: function() {
        Edo.controls.TextInput.superclass.initEvents.call(this);
        var $ = Edo.util.Dom,
        _ = this.field;
        $.on(_, "blur", this._onBlur, this);
        $.on(_, "focus", this._onFocus, this);
        $.on(_, this.changeAction, this._onTextChange, this)
    },
    _onBlur: function(_) {
        if (this.within(_)) return;
        var $ = this;
        this.blurTimer = setTimeout(function() {
            Edo.util.Dom.removeClass($.el, $.focusClass)
        },
        10);
        _.type = "textblur";
        _.target = this;
        this.fireEvent("textblur", _);
        _.type = "blur";
        this.fireEvent("blur", _)
    },
    _onFocus: function(A) {
        A.stopDefault();
        if (this.isReadOnly()) {
            if (this.field) Edo.util.Dom.blur(this.field);
            this.blur();
            return
        }
        var $ = this;
        setTimeout(function() {
            Edo.util.Dom.addClass($.el, $.focusClass)
        },
        1);
        function _() {
            if (this.field) this.field.select()
        }
        if (this.selectOnFocus) _.defer(20, this);
        A.type = "textfocus";
        A.target = this;
        this.fireEvent("textfocus", A);
        A.type = "focus";
        this.fireEvent("focus", A)
    },
    _onTextChange: function($) {
        this._setText(this.field.value)
    },
    _setEnable: function($) {
        Edo.controls.TextInput.superclass._setEnable.call(this, $);
        if (this.field) this.field.disabled = !this.isEnable()
    },
    _setText: function($) {
        if (!Edo.isValue($)) $ = "";
        if (this.text !== $) {
            if (this.fireEvent("beforetextchange", {
                type: "beforetextchange",
                source: this,
                text: $
            }) === false) {
                if (this.el) this.field.value = this.text;
                return
            }
            this.text = $;
            if (this.el) this.field.value = $;
            this.changeProperty("text", $);
            this.fireEvent("textchange", {
                type: "textchange",
                source: this,
                text: this.text
            })
        }
    },
    _setReadOnly: function($) {
        if (this.readOnly != $) {
            this.readOnly = $;
            if (this.el) {
                this.field.readOnly = $;
                if ($) Edo.util.Dom.addClass(this.el, "e-text-readonly");
                else Edo.util.Dom.removeClass(this.el, "e-text-readonly")
            }
        }
    },
    getFieldWidth: function() {
        var $ = this.realWidth;
        return $
    },
    syncSize: function() {
        Edo.controls.TextInput.superclass.syncSize.call(this);
        var $ = this.getFieldWidth(),
        _ = this.realHeight,
        A = this.field;
        Edo.util.Dom.setSize(A, $, _ - 2);
        if (this.lineHeight) {
            _ = this.lineHeight === true ? (_ - 4) : this.lineHeight;
            A.style.lineHeight = _ + "px"
        }
    },
    destroy: function() {
        Edo.util.Dom.clearEvent(this.field);
        Edo.util.Dom.remove(this.field);
        this.field = null;
        Edo.controls.TextInput.superclass.destroy.call(this)
    },
    clearInvalid: function() {
        Edo.controls.TextInput.superclass.clearInvalid.call(this);
        if (this.el) Edo.util.Dom.removeClass(this.el, "e-form-invalid")
    },
    showInvalid: function($) {
        Edo.controls.TextInput.superclass.showInvalid.call(this, $);
        if (this.showValid) if (this.el) Edo.util.Dom.addClass(this.el, "e-form-invalid");
        else this.cls += " e-form-invalid"
    }
});
Edo.controls.TextInput.regType("textinput", "text");
Edo.controls.Password = function() {
    Edo.controls.Password.superclass.constructor.call(this)
};
Edo.controls.Password.extend(Edo.controls.TextInput, {
    _htmltype: "password"
});
Edo.controls.Password.regType("password");
Edo.controls.TextArea = function() {
    Edo.controls.TextArea.superclass.constructor.call(this)
};
Edo.controls.TextArea.extend(Edo.controls.TextInput, {
    _mode: "textarea",
    lineHeight: 14,
    defaultHeight: 40
});
Edo.controls.TextArea.regType("textarea");
Edo.controls.Trigger = function() {
    Edo.controls.Trigger.superclass.constructor.call(this);
};
Edo.controls.Trigger.extend(Edo.controls.TextInput, {
    enableResizePopup: true,
    maxHeight: 500,
    triggerPopup: false,
    downShowPopup: true,
    triggerCls: "e-trigger",
    triggerOverCls: "e-trigger-over",
    triggerPressedCls: "e-trigger-pressed",
    triggerVisible: true,
    initEvents: function() {
        Edo.controls.Trigger.superclass.initEvents.call(this);
        if (!this.design) {
            Edo.util.Dom.on(this.el, "mousedown", this._onTriggerMousedown, this);
            var $ = this.trigger;
            Edo.util.Dom.addClassOnClick($, this.triggerPressedCls);
            Edo.util.Dom.addClassOnOver($, this.triggerOverCls);
            this.on("keydown", this.__onKeyDown, this)
        }
    },
    __onKeyDown: function($) {
        switch ($.keyCode) {
        case 40:
            if (!this.popupDisplayed && this.downShowPopup) this.showPopup();
            break
        }
    },
    _onTriggerMousedown: function($) {
        if (this.readOnly || $.within(this.trigger)) this._onTrigger.defer(1, this, [$])
    },
    _onTrigger: function($) {
        $.stopDefault();
        if (!this.isEnable()) return;
        if (this.parent && this.parent.isReadOnly()) return;
        if ($.button != Edo.util.MouseButton.left) return;
        $.type = "beforetrigger";
        $.source = this;
        if (this.fireEvent("beforetrigger", $) === false) return;
        if (this.triggerPopup) if (this.popupDisplayed) this.hidePopup();
        else this.showPopup();
        this.focus.defer(50, this);
        $.type = "trigger";
        this.fireEvent("trigger", {
            type: "trigger",
            source: this
        })
    },
    getTriggerHtml: function() {
        return "<div class=\"e-trigger-icon\"></div>"
    },
    getInnerHtml: function($) {
        Edo.controls.Trigger.superclass.getInnerHtml.call(this, $);
        $[$.length] = "<div class=\"";
        $[$.length] = this.triggerCls;
        $[$.length] = "\" style=\"display:";
        $[$.length] = this.triggerVisible ? "block": "none";
        $[$.length] = ";height:";
        $[$.length] = this.realHeight - 1;
        $[$.length] = "px;\">";
        $[$.length] = this.getTriggerHtml();
        $[$.length] = "</div>"
    },
    createChildren: function($) {
        Edo.controls.Trigger.superclass.createChildren.call(this, $);
        this.trigger = this.field.nextSibling
    },
    syncSize: function() {
        Edo.controls.Trigger.superclass.syncSize.call(this);
        if (this.triggerVisible) {
            this.trigger.style.display = "block";
            Edo.util.Dom.setHeight(this.trigger, this.realHeight - 4)
        } else this.trigger.style.display = "none"
    },
    triggerWidth: 19,
    getFieldWidth: function() {
        return this.realWidth - (this.triggerVisible ? this.triggerWidth: 0)
    },
    destroy: function() {
        Edo.util.Dom.clearEvent(this.trigger);
        Edo.util.Dom.remove(this.trigger);
        this.trigger = null;
        Edo.controls.Trigger.superclass.destroy.call(this)
    }
});
Edo.controls.Trigger.regType("trigger");
Edo.controls.Search = function($) {
    Edo.controls.Search.superclass.constructor.call(this)
};
Edo.controls.Search.extend(Edo.controls.Trigger, {
    clearVisible: false,
    elCls: "e-text e-search",
    clearTriggerCls: "e-trigger e-trigger-clear e-close",
    clearTriggerOverCls: "e-trigger-over",
    getFieldWidth: function() {
        return this.realWidth - (this.clearVisible ? this.triggerWidth * 2: (this.triggerVisible ? this.triggerWidth: 0))
    },
    getInnerHtml: function($) {
        Edo.controls.Search.superclass.getInnerHtml.call(this, $);
        $[$.length] = "<div class=\"";
        $[$.length] = this.clearTriggerCls;
        $[$.length] = "\" style=\"display:" + (this.clearVisible ? "block": "none") + ";right:" + this.triggerWidth + "px;height:";
        $[$.length] = this.realHeight - 1;
        $[$.length] = "px;\">";
        $[$.length] = this.getTriggerHtml();
        $[$.length] = "</div>"
    },
    initEvents: function() {
        Edo.controls.Search.superclass.initEvents.call(this);
        if (!this.design) {
            Edo.util.Dom.on(this.clearTrigger, "mousedown", this._onClearTrigger, this);
            Edo.util.Dom.addClassOnOver(this.clearTrigger, this.clearTriggerOverCls)
        }
    },
    createChildren: function($) {
        Edo.controls.Search.superclass.createChildren.call(this, $);
        this.clearTrigger = this.el.lastChild
    },
    syncSize: function() {
        Edo.controls.Search.superclass.syncSize.call(this);
        this.clearTrigger.style.display = this.clearVisible ? "block": "none";
        this.clearTrigger.style.height = (this.realHeight - 6) + "px";
        var $ = this.getFieldWidth();
        if (this.clearVisible) this.clearTrigger.style.left = $ + "px"
    },
    _setClearVisible: function($) {
        if (this.clearVisible != $) {
            this.clearVisible = $;
            if (this.el) this.syncSize();
            this.changeProperty("clearVisible", $)
        }
    },
    _onClearTrigger: function($) {
        if (!this.enable) return;
        if ($.button != Edo.util.MouseButton.left) return;
        this._setClearVisible(false);
        this.focus.defer(50, this);
        $.type = "cleartrigger";
        $.source = this;
        this.fireEvent("cleartrigger", $)
    }
});
Edo.controls.Search.regType("search");
Edo.controls.ComboBox = function($) {
    Edo.controls.ComboBox.superclass.constructor.call(this);
    this._setData([]);
    this.selecteds = []
};
Edo.controls.ComboBox.extend(Edo.controls.Trigger, {
    triggerPopup: true,
    displayField: "text",
    selectedIndex: -1,
    selectedItem: null,
    popupWidth: "100%",
    autoSelect: true,
    selectHidePopup: true,
    tableConfig: null,
    set: function($, _) {
        if (!$) return;
        if (typeof $ === "string") {
            var B = $;
            $ = {};
            $[B] = _
        }
        var A = $.selectedIndex;
        delete $.selectedIndex;
        Edo.controls.ComboBox.superclass.set.call(this, $);
        if (Edo.isValue(A)) this._setSelectedIndex(A);
        return this
    },
    __onKeyDown: function(A) {
        this.text = this.field.value;
        if (this.popupDisplayed) {
            var $ = this.table.getFocusItem(),
            _ = this.table.data.indexOf($);
            switch (A.keyCode) {
            case 37:
                break;
            case 38:
                _ -= 1;
                if (_ < 0);
                else this.table.focusItem(_);
                break;
            case 39:
                break;
            case 40:
                _ += 1;
                if (_ > this.table.data.getCount());
                else this.table.focusItem(_);
                break;
            case 13:
                $ = this.table.getFocusItem();
                this.hidePopup();
                this.table.select($);
                break;
            case 27:
                this.hidePopup();
                break;
            default:
                this.data.filter(this.filterFn, this);
                if (this.data.getCount() == 0) this.hidePopup();
                else this.showPopup();
                break
            }
        } else switch (A.keyCode) {
        case 13:
        case 27:
        case 37:
        case 38:
        case 39:
            break;
        case 40:
            this.showPopup();
            this.hoverDefaultRow();
            break;
        default:
            this.data.filter(this.filterFn, this);
            if (this.data.getCount() == 0) this.hidePopup();
            else this.showPopup();
            this.hoverDefaultRow();
            break
        }
    },
    filterFn: function($) {
        var _ = String($[this.displayField]);
        if (_.indexOf(this.text) != -1) return true;
        else return false
    },
    _onTrigger: function($) {
        Edo.controls.ComboBox.superclass._onTrigger.call(this, $);
        this.data.clearFilter()
    },
    popupReset: false,
    showPopup: function() {
        if (this.popupReset) this.resetValue();
        Edo.controls.ComboBox.superclass.showPopup.call(this)
    },
    hidePopup: function() {
        Edo.controls.ComboBox.superclass.hidePopup.call(this);
        this.data.clearFilter()
    },
    hoverDefaultRow: function() {
        var $ = this.selectedItem;
        if (!$) $ = this.data.getAt(0);
        if (this.table && $) this.table.focusItem.defer(100, this.table, [$])
    },
    _setSelectedItem: function(_) {
        if (this.selectedItem != _) {
            var $ = this.data.findIndex(_);
            this._setSelectedIndex($);
            this.changeProperty("selectedItem", _, true)
        }
    },
    delimiter: ",",
    _setSelectedIndex: function(_) {
        var $ = this.data;
        if (_ < 0) _ = -1;
        if (_ >= this.data.getCount()) _ = this.data.getCount() - 1;
        if (this.selectedIndex != _) {
            var A = this.data.getAt(_);
            if (this.fireEvent("beforeselectionchange", {
                type: "beforeselectionchange",
                source: this,
                selectedIndex: _,
                selectedItem: A
            }) === false) return false;
            this.selectedIndex = _;
            this.selectedItem = A;
            if (!this.multiSelect) this.selecteds = [];
            if (_ != -1) this.selecteds.add(A);
            var B = [];
            this.selecteds.each(function($) {
                B.add($[this.displayField])
            },
            this);
            this._setText(B.join(this.delimiter));
            this.fireEvent("selectionchange", {
                type: "selectionchange",
                source: this,
                selectedIndex: _,
                selectedItem: this.selectedItem
            });
            this.changeProperty("selectedIndex", _);
            return true
        }
    },
    _setData: function($) {
        if (typeof $ === "string") $ = window[$];
        if (!$) return;
        if ($.componentMode != "data") if (!this.data) $ = new Edo.data.DataTable($);
        else {
            this.data.load($);
            return
        }
        if (this.data) this.data.un("datachange", this._onDataChange);
        this.data = $;
        this.set("selectedIndex", -1);
        this.data.on("datachange", this._onDataChange, this);
        if (this.table) this.table.set("data", $);
        this.changeProperty("data", $)
    },
    _onSelection: function(_) {
        var $ = _.source;
        if (this.canChange === false) return;
        if (this.autoSelect) {
            this.clearSelect();
            this._setSelectedItem($.selected);
            if (this.selectHidePopup) this.hidePopup();
            this.focus()
        }
    },
    clearSelect: function() {
        this.selectedItem = null;
        this.selectedIndex = -1
    },
    createPopup: function() {
        Edo.controls.ComboBox.superclass.createPopup.apply(this, arguments);
        if (!this.table) {
            var $ = this,
            _ = [{
                id: "display",
                width: "100%",
                header: "",
                dataIndex: this.displayField,
                style: "cursor:default;"
            }];
            this.table = Edo.build(Edo.apply({
                type: "table",
                style: "border:0",
                outRemoveFocus: false,
                verticalLine: false,
                horizontalLine: false,
                enableCellSelect: false,
                headerVisible: false,
                enableTrackOver: true,
                width: "100%",
                height: "100%",
                minHeight: 10,
                autoHeight: true,
                rowHeight: 20,
                autoColumns: true,
                selectedCls: "e-table-row-over",
                data: this.data,
                columns: _,
                repeatSelect: true,
                onmousedown: function(_) {
                    $.focus()
                },
                onselectionchange: this._onSelection.bind(this)
            },
            this.tableConfig));
            this.popupCt.addChild(this.table);
            this.table.set("cls", "e-table-hover")
        }
        this.canChange = false;
        this.table.deselect();
        if (this.selectedItem && this.selectedIndex != -1) this.table.select(this.selectedItem);
        else this.table.clearSelect();
        this.canChange = true
    },
    _onDataChange: function($) {},
    valueField: "text",
    defaultValue: "",
    setValue: function(A) {
        var _ = {};
        _[this.valueField] = A;
        var $ = this.data.findIndex(_);
        this._setSelectedIndex($)
    },
    getValue: function() {
        var $ = this.selectedItem;
        if ($) $ = $[this.valueField];
        return $
    }
});
Edo.controls.ComboBox.regType("combo");
Edo.controls.Date = function($) {
    Edo.controls.Date.superclass.constructor.call(this)
};
Edo.controls.Date.extend(Edo.controls.Trigger, {
    useEndDate: false,
    enableResizePopup: false,
    valueField: "date",
    popupWidth: 178,
    popupHeight: "auto",
    popupType: "ct",
    triggerPopup: true,
    format: "Y-m-d",
    inputFormat: "Y-m-dTH:i:s",
    elCls: "e-text e-date",
    enableTime: true,
    datepickerClass: "datepicker",
    valueFormat: false,
    getValue: function() {
        var $ = Edo.controls.DatePicker.superclass.getValue.call(this);
        if ($ && this.valueFormat) $ = $.format(this.format);
        return $;
    },
    convertDate: function($) {
        var _ = $;
        if (!Edo.isDate($)) {
            $ = Date.parseDate(_, this.inputFormat);
            if (!Edo.isDate($)) $ = Date.parseDate(_, this.format)
        }
        return $
    },
    required: true,
    _setRequired: function($) {
        if (this.required != $) {
            this.required = $;
            if (this.datePicker) this.datePicker.set("required", $)
        }
    },
    _setDate: function($) {
        $ = this.convertDate($);
        if (!Edo.isDate($) && this.required) {
            if (this.date) this._setText(this.date.format(this.format));
            return
        }
        if (this.date != $) {
            if (this.fireEvent("beforedatechange", {
                type: "beforedatechange",
                source: this,
                date: $
            }) == false) return;
            if ($) {
                $ = new Date($.getTime());
                if (this.useEndDate) {
                    $.setHours(23);
                    $.setMinutes(23);
                    $.setSeconds(59)
                } else {
                    $.setHours(0);
                    $.setMinutes(0);
                    $.setSeconds(0)
                }
            }
            this.date = $;
            this.changeProperty("date", $);
            this.fireEvent("datechange", {
                type: "datechange",
                target: this,
                date: this.date
            })
        }
        if (Edo.isDate(this.date)) this._setText(this.date.format(this.format));
        else this._setText("")
    },
    _dateChangeHandler: function($) {
        if (this.datePicker && this.datePicker.created) {
            this._setDate($.date);
            this.hidePopup();
            this.focus()
        }
    },
    within: function(_) {
        var $ = false;
        if (this.datePicker) $ = this.datePicker.within(_);
        return Edo.controls.Date.superclass.within.call(this, _) || $
    },
    createPopup: function() {
        Edo.controls.Date.superclass.createPopup.apply(this, arguments);
        if (!this.datePicker) {
            this.datePicker = Edo.build({
                type: this.datepickerClass,
                width: "100%",
                height: "100%",
                date: this.date,
                required: this.required,
                onDatechange: this._dateChangeHandler.bind(this)
            });
            this.popupCt.addChild(this.datePicker)
        } else this.datePicker.set("date", this.date)
    },
    _onTextChange: function($) {
        Edo.controls.Date.superclass._onTextChange.call(this, $);
        this._setDate(this.text)
    }
});
Edo.controls.Date.regType("date");
Edo.controls.DatePicker = function($) {
    Edo.controls.DatePicker.superclass.constructor.call(this);
    this.viewDate = new Date()
};
Edo.controls.DatePicker.extend(Edo.containers.Box, {
    componentMode: "control",
    valueField: "date",
    weekStartDay: 0,
    weeks: ["日", "一", "二", "三", "四", "五", "六"],
    valueField: "date",
    width: 185,
    minWidth: 185,
    defaultWidth: 185,
    minHeight: 160,
    defaultHeight: 190,
    padding: [0, 0, 0, 0],
    verticalGap: 0,
    elCls: "e-box e-datepicker e-div",
    format: "Y-m-d",
    yearFormat: "Y年",
    monthFormat: "m月",
    todayText: "今天",
    clearText: "清除",
    autoSelectDate: true,
    required: true,
    valueFormat: false,
    footerVisible: true,
    headerVisible: true,
    footerHeight: 35,
    headerHeight: 25,
    isWorkingDate: function(_) {
        var $ = _.getDay();
        return ! ($ == 0 || $ == 6)
    },
    dateRenderer: function(F, A, C, _, $, D) {
        var B = D.rowHeight - 3,
        E = (F.viewdate.getMonth() != F.date.getMonth() ? "e-datepicker-outmonthday": "");
        if (!D.owner.isWorkingDate(F.date)) C.cls = " e-datepicker-noworkingday";
        else C.cls = "";
        return "<a style=\"line-height:" + B + "px;100%\" class=\"" + E + "\" href=\"javascript:;\" hidefocus>" + F.date.getDate() + "</a>"
    },
    getValue: function() {
        var $ = Edo.controls.DatePicker.superclass.getValue.call(this);
        if ($ && this.valueFormat) $ = $.format(this.format);
        return $
    },
    within: function(A) {
        var _ = this.monthpop ? A.within(this.monthpop) : false,
        $ = this.yearpop ? A.within(this.yearpop) : false;
        return Edo.controls.DatePicker.superclass.within.call(this, A) || _ || $
    },
    monthClickHandler: function(G) {
        var B = Edo.util.Dom,
        A = document,
        C = A.body;
        if (!this.monthpop) {
            var F = "<div class=\"e-datepicker-pupselect\">";
            for (var _ = 1; _ <= 12; _++) F += "<a href=\"#\" onclick=\"return false\">" + _ + "</a>";
            F += "</div>";
            this.monthpop = Edo.util.Dom.append(C, F)
        }
        this.monthpop.style.display = "block";
        var E = B.getBox(this.monthEl),
        $ = this.headerCt.getBox();
        B.setXY(this.monthpop, [E.x, $.y + E.height]);
        function D(_) {
            if (_.within(this.monthpop)) {
                var $ = this.viewDate.clone();
                $.setMonth(parseInt(_.target.innerHTML) - 1);
                this._setViewDate($)
            }
            this.monthpop.style.display = "none";
            B.un(A, "mousedown", D, this)
        }
        B.on(A, "mousedown", D, this)
    },
    yearClickHandler: function(L) {
        var J = Edo.util.Dom,
        E = document,
        C = E.body,
        B = this.viewDate;
        function A() {
            var _ = B.getFullYear();
            if (!this.yearpop) {
                var E = ["<div class=\"e-datepicker-pupselect\">"];
                E.push("<a class=\"pre\" href=\"#\" onclick=\"return false\" >-</a>");
                for (var $ = _ - 4; $ <= _ + 4; $++) E.push("<a href=\"#\" onclick=\"return false\">", $, "</a>");
                E.push("<a class=\"next\" href=\"#\" onclick=\"return false\" >+</a>");
                this.yearpop = Edo.util.Dom.append(C, E.join(""))
            } else {
                var D = 1,
                A = this.yearpop.childNodes;
                for ($ = _ - 4; $ <= _ + 4; $++) A[D++].innerHTML = $
            }
            this.yearpop.style.display = "block"
        }
        A.call(this);
        var K = J.getBox(this.yearEl),
        F = this.headerCt.getBox();
        J.setXY(this.yearpop, [K.x, F.y + K.height]);
        var $ = 0,
        H = null,
        G = this;
        function _() {
            B = B.add(Date.YEAR, $);
            A.call(G)
        }
        function I($) {
            clearInterval(H);
            J.un(E, "mouseup", I, this)
        }
        function D(G) {
            var F = false;
            if (G.within(this.yearpop)) {
                var B = G.target;
                if (J.hasClass(B, "pre")) {
                    J.on(E, "mouseup", I, this);
                    $ = -1;
                    _();
                    H = setInterval(_, 100)
                } else if (J.hasClass(B, "next")) {
                    J.on(E, "mouseup", I, this);
                    $ = 1;
                    _();
                    H = setInterval(_, 100)
                } else {
                    var A = this.viewDate.clone(),
                    C = parseInt(G.target.innerHTML);
                    if (isNaN(C)) return;
                    A.setFullYear(C);
                    this._setViewDate(A);
                    F = true
                }
            } else F = true;
            if (F) {
                this.yearpop.style.display = "none";
                J.un(E, "mousedown", D, this)
            }
        }
        J.on(E, "mousedown", D, this)
    },
    preMonth: function($) {
        this._setViewDate(this.viewDate.add(Date.MONTH, -1))
    },
    nextMonth: function($) {
        this._setViewDate(this.viewDate.add(Date.MONTH, 1))
    },
    preYear: function($) {
        this._setViewDate(this.viewDate.add(Date.YEAR, -1))
    },
    nextYear: function($) {
        this._setViewDate(this.viewDate.add(Date.YEAR, 1))
    },
    selectToday: function($) {
        this._setDate(new Date());
        this.fireEvent("dateselection", {
            type: "dateselection",
            source: this,
            date: this.date
        })
    },
    clearDate: function() {
        this.set("date", null)
    },
    _onMouseDown: function($) {
        if ($.within(this.leftYearEl)) this.preYear($);
        else if ($.within(this.rightYearEl)) this.nextYear($);
        else if ($.within(this.leftEl)) this.preMonth($);
        else if ($.within(this.rightEl)) this.nextMonth($);
        else if ($.within(this.monthEl)) this.monthClickHandler($);
        else if ($.within(this.yearEl)) this.yearClickHandler($);
        else if ($.within(this.daysCt)) this.daysCtClickHandler($);
        $.stopDefault()
    },
    _onBeforeTableCellSelectionChange: function(A) {
        var _ = A.value;
        if (_) {
            var $ = _.date;
            if (this.autoSelectDate) {
                this._setDate($);
                this.fireEvent("dateselection", {
                    type: "dateselection",
                    source: this,
                    date: this.date
                })
            }
            return false
        }
    },
    init: function() {
        var _ = this.viewDate.format(this.yearFormat),
        $ = this.viewDate.format(this.monthFormat);
        this.setChildren([{
            type: "div",
            width: "100%",
            height: this.headerHeight,
            html: "<table class=\"e-datepicker-header\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" ><tr><td width=\"10%\" style=\"text-align:center;\"><a hidefocus href=\"javascript:;\" class=\"e-datepicker-year-left\"></a></td><td  class=\"e-datepicker-year\">" + _ + "</td><td width=\"10%\" style=\"text-align:center;\"><a hidefocus href=\"javascript:;\" class=\"e-datepicker-year-right\"></a></td><td ></td><td width=\"10%\" style=\"text-align:center;\"><a hidefocus href=\"javascript:;\" class=\"e-datepicker-left\"></a></td><td  class=\"e-datepicker-month\">" + $ + "</td><td width=\"10%\" style=\"text-align:center;\"><a href=\"javascript:;\" hidefocus class=\"e-datepicker-right\"></a></td></tr></table>"
        },
        {
            type: "table",
            enableCellSelect: true,
            enableSelect: false,
            cellPaddingLeft: 0,
            cellPaddingRight: 0,
            enableHoverRow: false,
            cls: "e-datepicker-body",
            style: "border:0",
            width: "100%",
            height: "100%",
            verticalScrollPolicy: "off",
            horizontalScrollPolicy: "off",
            minHeight: 134,
            verticalLine: false,
            horizontalLine: false,
            autoColumns: true,
            enableDragDrop: false,
            repeatSelect: true,
            columns: this.createDateColumns(),
            onbeforecellselectionchange: this._onBeforeTableCellSelectionChange.bind(this)
        },
        {
            layout: "horizontal",
            type: "box",
            cls: "e-datepicker-foot",
            border: [1, 0, 0, 0],
            width: "100%",
            height: this.footerHeight,
            verticalAlign: "middle",
            horizontalAlign: "center",
            padding: 0,
            children: [{
                type: "button",
                width: 50,
                height: 22,
                text: this.todayText,
                onclick: this.selectToday.bind(this)
            },
            {
                type: "space",
                width: "10%",
                visible: !this.required
            },
            {
                type: "button",
                visible: !this.required,
                width: 50,
                height: 22,
                text: this.clearText,
                onclick: this.clearDate.bind(this)
            }]
        }]);
        this.headerCt = this.getChildAt(0);
        this.table = this.getChildAt(1);
        this.footCt = this.getChildAt(2);
        this.headerCt.set("visible", this.headerVisible);
        this.footCt.set("visible", this.footerVisible);
        this.table.owner = this;
        this.on("click", this._onMouseDown, this);
        this.table.set("rowHeight", this.getDateHeight());
        this.table.set("data", this.createViewData());
        Edo.controls.DatePicker.superclass.init.call(this)
    },
    createDateColumns: function() {
        var A = [];
        for (var $ = this.weekStartDay, _ = 0, B = this.weekStartDay + 7; $ < B; $++, _++) {
            var C = $ >= 7 ? $ - 7: $;
            A.add({
                header: this.weeks[C],
                enableMove: false,
                enableSort: false,
                enableResize: false,
                headerAlign: "center",
                dataIndex: _,
                renderer: this.dateRenderer.bind(this)
            })
        }
        return A
    },
    createViewData: function() {
        var D = [],
        G = this.viewDate.add(Date.DAY, -this.viewDate.getDate() + 1);
        G = G.add(Date.DAY, -G.getDay() + this.weekStartDay);
        var C = this.getDateHeight(),
        B = this.getTableBodyHeight(),
        A = B - C * 5;
        for (var E = 0; E < 5; E++) {
            var _ = [];
            for (var $ = this.weekStartDay, F = this.weekStartDay + 7; $ < F; $++) {
                _.add({
                    viewdate: this.viewDate,
                    date: G
                });
                if (E == 0 && _.length == 1) this.startDate = G.clone();
                if (E == 4 && _.length == 7) this.finishDate = G.clone();
                G = G.add(Date.DAY, 1)
            }
            D.add(_)
        }
        return D
    },
    _setWeekStartDay: function($) {
        this.weekStartDay = $
    },
    _setViewDate: function($) {
        if (typeof $ == "string") $ = Date.parseDate($, this.format);
        if (!Edo.isDate($)) return;
        if (this.viewDate != $) {
            this.viewDate = $;
            if (this.inited) this.table.set("data", this.createViewData())
        }
    },
    _setDate: function($) {
        if (typeof $ == "string") $ = Date.parseDate($, this.format);
        if (!Edo.isDate($)) {
            $ = null;
            if (this.required) return false
        }
        if (this.date != $) {
            if (this.fireEvent("beforedatechange", {
                type: "beforedatechange",
                source: this,
                date: this.date
            }) == false) return;
            this.date = $;
            this._setViewDate.defer(100, this, [this.date ? this.date.clone() : new Date()]);
            this.changeProperty("date", $);
            this.fireEvent("datechange", {
                type: "datechange",
                source: this,
                date: $
            })
        }
    },
    refresh: function() {
        var B = this.viewDate.format(this.yearFormat),
        $ = this.viewDate.format(this.monthFormat);
        if (this.el) {
            this.yearEl.innerHTML = B;
            this.monthEl.innerHTML = $
        }
        var C = this.getDateHeight();
        this.table.set("rowHeight", C);
        var A = this.getTableBodyHeight(),
        _ = A - C * 5;
        this.table.data.view[4].__height = C + _;
        this.table.deferRefresh(true);
        this.viewSelectDate(true)
    },
    viewSelectDate: function(G) {
        var A = col = -1,
        $ = this.table.data.view,
        D = this.date ? this.date.format("Y-m-d") : null;
        for (var _ = 0, F = $.length; _ < F; _++) {
            var B = $[_];
            for (var E = 0; E < 7; E++) if (B[E].date.format("Y-m-d") == D) {
                A = _;
                col = E;
                break
            }
        }
        if (A != -1 && col != -1) {
            var C = this.table.data.getAt(A)[col];
            if (G !== false) {
                this.table.fireSelection = false;
                this.table.selectCell(A, col);
                this.table.fireSelection = true
            } else this.table.deselectCell(A, col)
        }
    },
    syncSize: function() {
        Edo.controls.DatePicker.superclass.syncSize.call(this);
        this.refresh()
    },
    getTableBodyHeight: function() {
        return this.realHeight - (this.footerVisible ? this.footerHeight: 0) - (this.headerVisible ? 28: 0) - this.table.getHeaderHeight()
    },
    getDateHeight: function() {
        var $ = this.table ? this.getTableBodyHeight() / 5: 23;
        $ = parseInt($);
        return $
    },
    render: function(A) {
        Edo.controls.DatePicker.superclass.render.call(this, A);
        var $ = this.headerCt.el.firstChild,
        _ = $.rows[0].cells;
        this.leftEl = Edo.util.Dom.getbyClass("e-datepicker-left", $);
        this.rightEl = Edo.util.Dom.getbyClass("e-datepicker-right", $);
        this.monthEl = Edo.util.Dom.getbyClass("e-datepicker-month", $);
        this.yearEl = Edo.util.Dom.getbyClass("e-datepicker-year", $);
        this.leftYearEl = Edo.util.Dom.getbyClass("e-datepicker-year-left", $);
        this.rightYearEl = Edo.util.Dom.getbyClass("e-datepicker-year-right", $)
    }
});
Edo.controls.DatePicker.regType("datepicker");
Edo.controls.Label = function() {
    Edo.controls.Label.superclass.constructor.call(this)
};
Edo.controls.Label.extend(Edo.controls.Control, {
    elCls: "e-label",
    autoWidth: true,
    autoHeight: true,
    minWidth: 20,
    text: "",
    forId: "",
    getInnerHtml: function($) {
        $[$.length] = this.text
    },
    _setText: function($) {
        if (this.text !== $) {
            this.text = $;
            if (this.el) this.el.innerHTML = $;
            if (!Edo.isInt(this.width)) this.widthGeted = false;
            if (!Edo.isInt(this.height)) this.heightGeted = false;
            this.changeProperty("text", $);
            this.relayout("text", $)
        }
    }
});
Edo.controls.Label.regType("label");
Edo.controls.Spinner = function($) {
    Edo.controls.Spinner.superclass.constructor.call(this)
};
Edo.controls.Spinner.extend(Edo.controls.Trigger, {
    valueField: "value",
    downShowPopup: false,
    defaultValue: 0,
    value: 0,
    incrementValue: 1,
    alternateIncrementValue: 5,
    alternateKey: "shiftKey",
    spinTime: 100,
    valueField: "value",
    getTriggerHtml: function() {
        this.elCls += " e-spinner";
        return "<div class=\"e-spinner-up\" unselectable=\"on\"><div class=\"e-trigger-icon\" unselectable=\"on\"></div></div><div class=\"e-spinner-split\"></div><div class=\"e-spinner-down\" unselectable=\"on\"><div class=\"e-trigger-icon\" unselectable=\"on\"></div></div>"
    },
    createChildren: function($) {
        Edo.controls.Spinner.superclass.createChildren.call(this, $);
        this.upEl = this.trigger.firstChild;
        this.downEl = this.trigger.lastChild;
        var _ = this.value;
        this.value = null;
        this._setValue(_)
    },
    initEvents: function() {
        if (!this.design) {
            Edo.util.Dom.addClassOnOver(this.upEl, "e-spinner-up-over");
            Edo.util.Dom.addClassOnClick(this.upEl, "e-spinner-up-pressed");
            Edo.util.Dom.addClassOnOver(this.downEl, "e-spinner-down-over");
            Edo.util.Dom.addClassOnClick(this.downEl, "e-spinner-down-pressed");
            Edo.util.Dom.on(this.field, "keydown", this._onKeyDown, this);
            Edo.util.Dom.on(document.body, "mouseup", this.stopSpin, this);
            this.on("spin", this._onSpin, this)
        }
        Edo.controls.Spinner.superclass.initEvents.call(this)
    },
    _onTrigger: function(_) {
        if (this.isReadOnly()) return;
        Edo.controls.Spinner.superclass._onTrigger.call(this, _);
        var $;
        if (_.within(this.upEl)) $ = "up";
        else if (_.within(this.downEl)) $ = "down";
        if ($) this.startSpin($, _)
    },
    startSpin: function($, _) {
        this.fireSpin($, _);
        this.spinTimer = this.fireSpin.time(this.spinTime, this, [$, _])
    },
    stopSpin: function(_) {
        var $ = this;
        setTimeout(function() {
            clearInterval($.spinTimer);
            $.spinTimer = null
        },
        1)
    },
    _onKeyDown: function($) {
        switch ($.keyCode) {
        case 38:
            this.fireSpin("up", $);
            break;
        case 40:
            this.fireSpin("down", $);
            break
        }
    },
    fireSpin: function($, _) {
        this.fireEvent("spin", {
            type: "spin",
            direction: $,
            source: this,
            event: _
        })
    },
    _onSpin: function($) {
        this.text = this.field.value;
        this.spin(this.field.value, $.direction, $.event[this.alternateKey])
    },
    spin: function(_, B, $) {
        var C = this.normalizeValue(_),
        A = ($ == true) ? this.alternateIncrementValue: this.incrementValue;
        if (Edo.isValue(B))(B == "down") ? C -= A: C += A;
        this._setValue(C)
    },
    normalizeValue: function($) {
        var _ = $,
        _ = parseFloat(_);
        if (isNaN(_)) _ = this.value;
        if (this.minValue != undefined && _ < this.minValue) _ = this.minValue;
        if (this.maxValue != undefined && _ > this.maxValue) _ = this.maxValue;
        return _
    },
    _setValue: function(_) {
        _ = this.normalizeValue(_);
        var $ = {
            type: "beforevaluechange",
            source: this,
            name: this.name,
            value: _,
            text: _
        };
        if (this.fireEvent("beforevaluechange", $) !== false) {
            this.value = $.value;
            this._setText($.text);
            $.type = "valuechange";
            this.changeProperty("value", this.value)
        }
    },
    _onTextChange: function($) {
        this.text = this.field.value;
        this.spin(this.field.value)
    }
});
Edo.controls.Spinner.regType("spinner");
Edo.controls.DateSpinner = function($) {
    Edo.controls.DateSpinner.superclass.constructor.call(this)
};
Edo.controls.DateSpinner.extend(Edo.controls.Spinner, {
    defaultValue: new Date(),
    value: new Date(),
    incrementValue: 1,
    alternateIncrementValue: 1,
    format: "Y-m-d",
    incrementConstant: Date.DAY,
    alternateIncrementConstant: Date.MONTH,
    spin: function(_, B, $) {
        var E = this.normalizeValue(_),
        D = (B == "down") ? -1: 1,
        A = ($ == true) ? this.alternateIncrementValue: this.incrementValue,
        C = ($ == true) ? this.alternateIncrementConstant: this.incrementConstant;
        if (Edo.isValue(B)) E = E.add(C, D * A);
        this._setValue(E)
    },
    _setText: function($) {
        $ = this.value;
        if ($ && $.getFullYear) $ = $.format(this.format);
        Edo.controls.DateSpinner.superclass._setText.call(this, $)
    },
    normalizeValue: function(A) {
        var _ = A;
        _ = Date.parseDate(_, this.format);
        if (!_) _ = this.value;
        var $ = (typeof this.minValue == "string") ? Date.parseDate(this.minValue, this.format) : this.minValue,
        B = (typeof this.maxValue == "string") ? Date.parseDate(this.maxValue, this.format) : this.maxValue;
        if (this.minValue != undefined && _ < $) _ = $;
        if (this.maxValue != undefined && _ > B) _ = B;
        return _
    },
    getValue: function() {
        return this.value.format(this.format)
    }
});
Edo.controls.DateSpinner.regType("datespinner");
Edo.controls.TimeSpinner = function() {
    Edo.controls.TimeSpinner.superclass.constructor.call(this)
};
Edo.controls.TimeSpinner.extend(Edo.controls.DateSpinner, {
    format: "H:i:s",
    incrementValue: 1,
    incrementConstant: Date.HOUR,
    alternateIncrementValue: 1,
    alternateIncrementConstant: Date.HOUR,
    normalizeValue: function(_) {
        if (typeof _ == "string") {
            var E = Date.parseDate(_, "H:i:s");
            if (!E) {
                var A = _.split(":"),
                B = parseInt(A[0]),
                $ = parseInt(A[1]),
                D = parseInt(A[2]),
                C = [];
                if (!isNaN(B)) if (String(B).length == 1) C.add("0" + B);
                else C.add(B);
                if (!isNaN($)) if (String($).length == 1) C.add("0" + $);
                else C.add($);
                if (!isNaN(D)) if (String(D).length == 1) C.add("0" + D);
                else C.add(D);
                E = C.join(":")
            }
            if (E) _ = E
        }
        return Edo.controls.TimeSpinner.superclass.normalizeValue.call(this, _)
    }
});
Edo.controls.TimeSpinner.regType("timespinner");
Edo.controls.HtmlEditor = function() {
    Edo.controls.HtmlEditor.superclass.constructor.call(this)
};
Edo.controls.HtmlEditor.extend(Edo.controls.TextArea, {
    minWidth: 120,
    minHeight: 50,
    elCls: "e-htmleditor e-div  e-text",
    editConfig: null,
    createChildren: function($) {
        Edo.controls.HtmlEditor.superclass.createChildren.call(this, $);
        this.editor = CKEDITOR.replace(this.field, Edo.apply({
            skin: "v2",
            height: this.realHeight - 52,
            toolbar: "Basic",
            toolbarCanCollapse: false,
            resize_enabled: false,
            toolbar_Basic: [["Font", "Bold", "Italic", "Underline", "-", "Subscript", "Superscript", "-", "TextColor", "BGColor", "-", "JustifyLeft", "JustifyCenter", "JustifyRight", "-", "Maximize", "Source"]]
        },
        this.editConfig))
    },
    syncSize: function() {
        Edo.controls.HtmlEditor.superclass.syncSize.apply(this, arguments);
        Edo.util.Dom.setSize(this.el, this.realWidth, this.realHeight)
    },
    _setText: function($) {
        this.text = $;
        if (this.editor) this.editor.setData($)
    },
    _getText: function($) {
        if (this.editor) this.text = this.editor.getData();
        return this.text
    }
});
Edo.controls.HtmlEditor.regType("htmleditor");
Edo.controls.CodeEditor = function() {
    Edo.controls.CodeEditor.superclass.constructor.call(this)
};
Edo.controls.CodeEditor.extend(Edo.controls.TextArea, {
    minWidth: 120,
    minHeight: 50,
    elCls: "e-codeeditor e-div  e-text",
    path: "/",
    createChildren: function(A) {
        Edo.controls.CodeEditor.superclass.createChildren.call(this, A);
        var $ = isNaN(this.realWidth) ? this.defaultWidth: this.realWidth - 1,
        _ = isNaN(this.realHeight) ? this.defaultHeight: this.realHeight - 1;
        this.editor = CodeMirror.fromTextArea(this.field, {
            width: $ + "px",
            height: _ + "px",
            parserfile: ["tokenizejavascript.js", "parsejavascript.js"],
            stylesheet: [this.path + "css/jscolors.css"],
            path: this.path + "js/"
        })
    },
    syncSize: function() {
        Edo.controls.CodeEditor.superclass.syncSize.apply(this, arguments);
        this.editor.wrapping.style.width = (this.realWidth - 1) + "px";
        this.editor.wrapping.style.height = (this.realHeight - 1) + "px";
        Edo.util.Dom.setSize(this.el, this.realWidth, this.realHeight)
    },
    _setText: function($) {
        this.text = $;
        if (this.editor) {
            try {
                this.editor.setCode($)
            } catch(_) {
                this._setText.defer(100, this, [$])
            }
        }
    },
    _getText: function($) {
        if (this.editor) this.text = this.editor.getCode();
        return this.text
    }
});
Edo.controls.CodeEditor.regType("codeeditor");
Edo.controls.Progress = function() {
    Edo.controls.Progress.superclass.constructor.call(this)
};
Edo.controls.Progress.extend(Edo.core.UIComponent, {
    valueField: "progress",
    defaultValue: 0,
    minWidth: 50,
    defaultWidth: 100,
    showText: true,
    progress: 0,
    text: "",
    elCls: "e-progress e-div",
    _setProgress: function($) {
        if ($ < 0) $ = 0;
        if ($ > 100) $ = 100;
        if (this.progress != $) {
            this.progress = $;
            if (this.el) {
                this.textEl.innerHTML = this.getProgressDesc();
                Edo.util.Dom.setWidth(this.progressEl, this.getProgressWidth())
            }
            this.changeProperty("progress");
            this.fireEvent("progresschange", {
                type: "progresschange",
                source: this,
                progress: $,
                text: this.text
            })
        }
    },
    _setText: function($) {
        if (this.text != $) {
            this.text = $;
            if (this.el) this.textEl.innerHTML = this.getProgressDesc();
            this.changeProperty("text")
        }
    },
    getProgressDesc: function() {
        return this.showText ? this.progress + "% " + this.text: "&#160"
    },
    getProgressWidth: function() {
        return parseInt(this.realWidth * this.progress / 100) - 1
    },
    getInnerHtml: function($) {
        $[$.length] = "<div class=\"e-progress-bar\"></div><div class=\"e-progress-text\"></div>"
    },
    createChildren: function($) {
        Edo.controls.Label.superclass.createChildren.call(this, $);
        this.progressEl = this.el.firstChild;
        this.textEl = this.el.lastChild
    }
});
Edo.controls.Progress.regType("progress");
Edo.controls.MultiSelect = function() {
    Edo.controls.MultiSelect.superclass.constructor.call(this)
};
Edo.controls.MultiSelect.extend(Edo.lists.Table, {
    headerVisible: false,
    minWidth: 80,
    minHeight: 50,
    rowSelectMode: "multi",
    enableDragDrop: true,
    dragDropAction: "move",
    displayText: "名称",
    displayField: "text",
    valueField: "text",
    autoExpandColumn: "display",
    defaultValue: "",
    setValue: Edo.controls.DataView.prototype.setValue,
    getValue: Edo.controls.DataView.prototype.getValue,
    init: function() {
        this.set("columns", [Edo.lists.Table.createMultiColumn(), {
            id: "display",
            width: "100%",
            header: this.displayText,
            dataIndex: this.displayField
        }]);
        Edo.controls.MultiSelect.superclass.init.call(this)
    }
});
Edo.controls.MultiSelect.regType("multiselect");
Edo.controls.CheckGroup = function($) {
    Edo.controls.CheckGroup.superclass.constructor.call(this)
};
Edo.controls.CheckGroup.extend(Edo.controls.DataView, {
    autoWidth: true,
    autoHeight: true,
    multiSelect: true,
    repeatSelect: false,
    selectOnly: false,
    elCls: "e-checkgroup",
    itemSelector: "e-checkgroup-item",
    itemCls: "e-checkgroup-item",
    selectedCls: "e-checkgroup-item-checked",
    displayField: "text",
    valueField: "value",
    repeatLayout: "table",
    repeatDirection: "vertical",
    repeatItems: 10000,
    itemWidth: "auto",
    itemHeight: "auto",
    cellPadding: 0,
    cellSpacing: 2,
    tpl: "<%=this.createView();%>",
    itemStyle: "padding-right:3px;",
    itemRenderer: function() {},
    createView: function() {
        var C = this.data;
        if (!C || C.getCount() == 0) return "";
        C = this.data.view;
        if (this.repeatLayout == "table") {
            C = this.createTableData(C);
            var F = ["<table cellpadding=\"" + this.cellPadding + "\" cellspacing=\"" + this.cellSpacing + "\">"];
            for (var _ = 0, E = C.length; _ < E; _++) {
                var B = C[_];
                F[F.length] = "<tr>";
                for (var D = 0, A = B.length; D < A; D++) {
                    var $ = B[D];
                    F[F.length] = "<td style=\"vertical-align:top;\">";
                    F[F.length] = this.getItemHtml($);
                    F[F.length] = "</td>"
                }
                F[F.length] = "</tr>"
            }
            F[F.length] = "</table>";
            return F.join("")
        } else {
            F = [];
            for (_ = 0, E = C.length; _ < E; _++) {
                $ = C[_];
                F[F.length] = this.getItemHtml($, "float:left")
            }
            return F.join("")
        }
    },
    createTableData: function(D) {
        var A = [];
        for (var B = 0, E = D.length; B < E; B++) {
            var _ = D[B],
            $ = parseInt(B / this.repeatItems);
            if (this.repeatDirection == "vertical") $ = B % this.repeatItems;
            var C = A[$];
            if (!C) {
                C = [];
                A.add(C)
            }
            C.add(_)
        }
        return A
    },
    getItemHtml: function($, _) {
        var A = "<div id=" + this.createItemId($) + " class=\"" + this.itemCls + " " + ($.enable === false ? "e-disabled": "") + "\" style=\"float:left;" + _ + ";" + this.itemStyle + ";width:" + this.itemWidth + "\">" + $[this.displayField] + "</div>";
        return A
    }
});
Edo.controls.CheckGroup.regType("checkgroup");
Edo.controls.RadioGroup = function() {
    Edo.controls.RadioGroup.superclass.constructor.call(this)
};
Edo.controls.RadioGroup.extend(Edo.controls.CheckGroup, {
    multiSelect: false,
    mustSelect: true,
    elCls: "e-radiogroup",
    itemCls: "e-checkgroup-item"
});
Edo.controls.RadioGroup.regType("radiogroup");
Edo.controls.SWF = function() {
    Edo.controls.SWF.superclass.constructor.call(this)
};
Edo.controls.SWF.extend(Edo.controls.Control, {
    minWidth: 100,
    minHeight: 50,
    defaultWidth: 100,
    defaultHeight: 50,
    flashVersion: "9.0.45",
    backgroundColor: "#ffffff",
    wmode: "opaque",
    url: undefined,
    swfId: undefined,
    swfWidth: "100%",
    swfHeight: "100%",
    expressInstall: false,
    createChildren: function(_) {
        Edo.controls.SWF.superclass.createChildren.call(this, _);
        var $ = {
            allowScriptAccess: "always",
            bgcolor: this.backgroundColor,
            wmode: this.wmode
        },
        A = {
            allowedDomain: document.location.hostname,
            elementID: this.id
        },
        B = this.id + "swf";
        Edo.util.Dom.append(this.el, "<div id=\"" + B + "\"></div>");
        new swfobject.embedSWF(this.url, B, this.swfWidth, this.swfHeight, this.flashVersion, this.expressInstall ? Edo.controls.SWF.EXPRESS_INSTALL_URL: undefined, A, $);
        this.swf = Edo.getDom(B)
    },
    syncSize: function() {
        Edo.controls.SWF.superclass.syncSize.apply(this, arguments)
    }
});
Edo.controls.SWF.regType("swf");
Edo.controls.SWF.EXPRESS_INSTALL_URL = "http:/" + "/swfobject.googlecode.com/svn/trunk/swfobject/expressInstall.swf";
Edo.controls.FileUpload = function() {
    if (typeof SWFUpload == "undefined") throw new Error("请引入swfupload.js");
    Edo.controls.FileUpload.superclass.constructor.call(this)
};
Edo.controls.FileUpload.extend(Edo.controls.Control, {
    swfUploadConfig: null,
    buttonWidth: 69,
    autoClear: true,
    textVisible: true,
    elCls: "e-fileupload e-div",
    getInnerHtml: function(B) {
        var A = this.id + "$place",
        $ = this.id + "$input",
        _ = this.realWidth - this.buttonWidth;
        B[B.length] = "<input id=\"" + $ + "\" readOnly type=\"text\" class=\"e-fileupload-text\" value=\"\" style=\"width:" + _ + "px;\"> <span id=\"" + A + "\"></span>"
    },
    createChildren: function() {
        Edo.controls.FileUpload.superclass.createChildren.apply(this, arguments);
        var A = this.id + "$place",
        _ = Edo.apply({
            button_window_mode: SWFUpload.WINDOW_MODE.OPAQUE,
            button_image_url: "XPButtonUploadText_61x22.png",
            button_width: 61,
            button_height: 22,
            file_size_limit: "64",
            file_types: "*.jpg;*.gif;*.png;*.bmp",
            file_types_description: "All Files",
            file_upload_limit: "0",
            file_queue_limit: "0",
            file_queued_handler: this._onFileQueued.bind(this),
            file_queue_error_handler: this._onFileQueueError.bind(this),
            upload_start_handler: this._onFileStart.bind(this),
            upload_error_handler: this._onFileError.bind(this),
            upload_success_handler: this._onFileSuccess.bind(this)
        },
        this.swfUploadConfig);
        _.button_placeholder_id = A;
        this.upload = new SWFUpload(_);
        var $ = this.id + "$input";
        this.inputField = document.getElementById($)
    },
    _onFileQueued: function(_) {
        var $ = this.inputField,
        A = $.value;
        if (A && A != _.name);
        $.value = _.name;
        var B = {
            type: "filequeued",
            source: this,
            upload: this.upload,
            filename: _.name,
            file: _
        };
        this.fireEvent("filequeued", B)
    },
    _onFileQueueError: function(_, A, $) {
        var B = {
            type: "filequeueerror",
            source: this,
            upload: this.upload,
            file: _,
            errorCode: A,
            message: $
        };
        this.fireEvent("filequeueerror", B)
    },
    _onFileStart: function() {
        var $ = {
            type: "filestart",
            source: this,
            upload: this.upload
        };
        this.fireEvent("filestart", $)
    },
    _onFileError: function(_, A, $) {
        var B = {
            type: "fileerror",
            source: this,
            upload: this.upload,
            file: _,
            errorCode: A,
            message: $
        };
        this.fireEvent("fileerror", B)
    },
    _onFileSuccess: function(_, $) {
        if (this.autoClear) this.inputField.value = "";
        var A = {
            type: "filesuccess",
            source: this,
            upload: this.upload,
            file: _,
            serverData: $
        };
        this.fireEvent("filesuccess", A)
    },
    syncSize: function() {
        Edo.controls.FileUpload.superclass.syncSize.call(this);
        if (this.textVisible) {
            var $ = this.realWidth - this.buttonWidth;
            Edo.util.Dom.setWidth(this.inputField, $);
            this.inputField.style.display = ""
        } else this.inputField.style.display = "none"
    }
});
Edo.controls.FileUpload.regType("fileupload");
Edo.controls.PercentSpinner = function() {
    Edo.controls.PercentSpinner.superclass.constructor.call(this)
};
Edo.controls.PercentSpinner.extend(Edo.controls.Spinner, {
    minValue: 0,
    maxValue: 100,
    _setText: function($) {
        $ += "%";
        Edo.controls.PercentSpinner.superclass._setText.call(this, $)
    }
});
Edo.controls.PercentSpinner.regType("percentspinner");
Edo.controls.MultiCombo = function() {
    Edo.controls.MultiCombo.superclass.constructor.call(this)
};
Edo.controls.MultiCombo.extend(Edo.controls.Trigger, {
    tableConfig: null,
    data: null,
    valueField: "id",
    displayText: "名称",
    displayField: "text",
    valueField: "text",
    delimiter: ",",
    triggerPopup: true,
    readOnly: true,
    multiSelect: true,
    _setMultiSelect: function($) {
        if ($ != this.multiSelect) {
            this.multiSelect = $;
            if (this.table) this.table.set("multiSelect", $)
        }
    },
    setValue: function($) {
        this.table.setValue($)
    },
    getValue: function() {
        return this.table.getValue()
    },
    viewText: function() {
        var $ = [],
        _ = this.table.getSelecteds();
        _.each(function(_) {
            $.add(_[this.displayField])
        },
        this);
        this._setText($.join(this.delimiter))
    },
    _setData: function($) {
        if (typeof $ === "string") $ = window[$];
        if (!$) return;
        if (!$.dataTable) $ = new Edo.data.DataTable($ || []);
        this.data = $;
        this.set("text", "");
        if (this.table) this.table.set("data", $);
        this.changeProperty("data", $)
    },
    onselectionchange: function($) {
        this.selectionchanged = true;
        this.viewText()
    },
    init: function() {
        Edo.controls.MultiCombo.superclass.init.apply(this, arguments);
        if (!this.table) this.table = Edo.create(Edo.apply({
            type: "multiselect",
            style: "border:0",
            width: "100%",
            height: "100%",
            autoHeight: true,
            multiSelect: this.multiSelect,
            minHeight: 80,
            maxHeight: 250,
            displayText: this.displayText,
            displayField: this.displayField,
            valueField: this.valueField,
            delimiter: this.delimiter,
            onselectionchange: this.onselectionchange.bind(this)
        },
        this.tableConfig));
        this.table.set("data", this.data)
    },
    showPopup: function() {
        Edo.controls.MultiCombo.superclass.showPopup.apply(this, arguments);
        if (!this.table.parent) this.popupCt.addChild(this.table);
        var $ = this.table.getSelecteds().clone();
        this.table.set("data", this.data);
        this.table.selectRange($)
    },
    hidePopup: function() {
        Edo.controls.MultiCombo.superclass.hidePopup.apply(this, arguments);
        if (this.selectionchanged) this.fireEvent("selectionchange", {
            type: "selectionchange",
            source: this
        });
        this.selectionchanged = false
    }
});
Edo.controls.MultiCombo.regType("multicombo");
Edo.controls.TreeSelect = function() {
    Edo.controls.TreeSelect.superclass.constructor.call(this)
};
Edo.controls.TreeSelect.extend(Edo.controls.Trigger, {
    treeConfig: null,
    data: null,
    multiSelect: true,
    popupMinWidth: 150,
    enableResizePopup: true,
    popupHeight: 150,
    valueField: "id",
    displayText: "名称",
    displayField: "text",
    valueField: "text",
    delimiter: ",",
    autoExpandColumn: "display",
    triggerPopup: true,
    readOnly: true,
    setValue: function($) {
        Edo.controls.DataView.prototype.setValue.call(this.tree, $)
    },
    getValue: function() {
        return Edo.controls.DataView.prototype.getValue.call(this.tree)
    },
    viewText: function() {
        var $ = [],
        _ = this.tree.getSelecteds();
        _.each(function(_) {
            $.add(_[this.displayField])
        },
        this);
        this._setText($.join(this.delimiter))
    },
    _setData: function($) {
        if (typeof $ === "string") $ = window[$];
        if (!$) return;
        if (!$.dataTable) $ = new Edo.data.DataTree($ || []);
        this.data = $;
        if (this.tree) this.tree.set("data", $);
        this.changeProperty("data", $)
    },
    onselectionchange: function($) {
        this.selectionchanged = true;
        this.viewText();
        this.changeProperty("value", this.getValue(), true)
    },
    init: function() {
        Edo.controls.TreeSelect.superclass.init.apply(this, arguments);
        if (!this.tree) this.tree = Edo.create(Edo.apply({
            type: "tree",
            style: "border:0",
            width: "100%",
            height: "100%",
            minHeight: 80,
            maxHeight: 250,
            treeColumn: "display",
            multiSelect: this.multiSelect,
            rowSelectMode: this.multiSelect ? "multi": "single",
            autoExpandColumn: this.autoExpandColumn,
            valueField: this.valueField,
            columns: [Edo.lists.Table.createMultiColumn(), {
                id: "display",
                width: "100%",
                header: this.displayText,
                dataIndex: this.displayField
            }],
            delimiter: this.delimiter,
            onselectionchange: this.onselectionchange.bind(this)
        },
        this.treeConfig));
        this.tree.set("data", this.data)
    },
    showPopup: function() {
        Edo.controls.TreeSelect.superclass.showPopup.apply(this, arguments);
        if (!this.tree.parent) this.popupCt.addChild(this.tree);
        var $ = this.tree.getSelecteds().clone();
        this.tree.set("data", this.data);
        this.tree.selectRange($)
    },
    hidePopup: function() {
        Edo.controls.TreeSelect.superclass.hidePopup.apply(this, arguments);
        if (this.selectionchanged) this.fireEvent("selectionchange", {
            type: "selectionchange",
            source: this
        });
        this.selectionchanged = false
    }
});
Edo.controls.TreeSelect.regType("TreeSelect");
Edo.controls.DurationSpinner = function($) {
    Edo.controls.DurationSpinner.superclass.constructor.call(this)
};
Edo.controls.DurationSpinner.extend(Edo.controls.Spinner, {
    value: {
        Duration: 0,
        DurationFormat: 37,
        Estimated: 1
    },
    minValue: 0,
    incrementValue: 1,
    alternateIncrementValue: 8,
    durationFormat: null,
    mustDay: false,
    mustInt: true,
    spin: function(B, E, _) {
        if (!B) B = "0";
        var G = parseFloat(B);
        if (this.mustInt) G = parseInt(G);
        var A = B.indexOf("?") != -1,
        D = B.replace(G, "");
        if (!D) D = "d";
        else if (D == "?") D = "d?";
        if (this.mustDay) if (D != "d" || D != "d?") D = "d";
        var $ = this.durationFormat[D];
        if (!$) {
            this._setValue(this.value);
            return
        }
        var C = (_ == true) ? this.alternateIncrementValue: this.incrementValue;
        if (Edo.isValue(E))(E == "down") ? G -= C: G += C;
        var F = this.durationFormat[$];
        G *= F[0];
        G = {
            Duration: G,
            DurationFormat: $,
            Estimated: A
        };
        this._setValue(G)
    },
    _setText: function(_) {
        if (!this.durationFormat) return;
        var $ = this.durationFormat[_.DurationFormat];
        if (!$) _ = "0d";
        else _ = (_.Duration / $[0]) + $[2] + (_.Estimated ? "?": "");
        Edo.controls.DurationSpinner.superclass._setText.call(this, _)
    },
    normalizeValue: function($) {
        $.Duration = Edo.controls.DurationSpinner.superclass.normalizeValue.call(this, $.Duration);
        return $
    }
});
Edo.controls.DurationSpinner.regType("durationspinner");
Edo.controls.AutoComplete = function() {
    Edo.controls.AutoComplete.superclass.constructor.call(this)
};
Edo.controls.AutoComplete.extend(Edo.controls.ComboBox, {
    changeAction: "keyup",
    popupHeight: 120,
    popupWidth: "100%",
    url: "",
    queryDelay: 500,
    popupShadow: false,
    pageVisible: false,
    autoFill: true,
    maxSize: 10,
    initEvents: function() {
        if (!this.design) {
            this.on("popupshow", this._onpopupshow, this, 0);
            this.on("keyup", this._onkeyup, this, 0);
            this.on("trigger", this._ontrigger, this, 0)
        }
        Edo.controls.AutoComplete.superclass.initEvents.call(this)
    },
    _onpopupshow: function(_) {
        var $ = this;
        if (!this.pager) {
            this.popupCt.set({
                verticalGap: 0
            });
            this.popupCt.addChild({
                visible: this.pageVisible,
                infoVisible: false,
                type: "pagingbar",
                name: "pager",
                cls: "e-toolbar",
                border: [0, 1, 0, 1],
                onpaging: function(_) {
                    $.query($.text, this.index, this.size)
                }
            });
            this.table.set("autoHeight", false);
            this.pager = Edo.getByName("pager", this.popupCt)[0]
        }
    },
    _onkeyup: function(_) {
        if (_.keyCode == 40) {
            this.showPopup();
            if (this.data.getCount() == 0) this.pager.change()
        } else if (_.keyCode == 13) this.hidePopup();
        else {
            var $ = this.field.value;
            this.showPopup();
            this.pager.change()
        }
    },
    _ontrigger: function($) {
        if (this.data.getCount() == 0) this.pager.change()
    },
    query: function(_, $, C) {
        if (this.selectedItem && this.selectedItem[this.displayField] == _) return;
        var B = {
            key: _,
            index: $ || 0,
            size: C || this.maxSize
        },
        D = {
            type: "beforequery",
            source: this,
            queryParams: B
        };
        if (this.fireEvent("beforequery", D) === false) return;
        this.table.loadingMask = true;
        this.table.zeroMask = true;
        this.table.mask();
        if (this.queryTimer) {
            clearTimeout(this.queryTimer);
            this.queryTimer = null
        }
        var A = this;
        this.queryTimer = setTimeout(function() {
            A.doQuery(D.queryParams)
        },
        this.queryDelay)
    },
    doQuery: function(_) {
        var $ = this;
        if (this.queryAjax) Edo.util.Ajax.abort(this.queryAjax);
        this.queryAjax = Edo.util.Ajax.request({
            url: this.url,
            params: _,
            onSuccess: function(_) {
                if ($.autoFill) {
                    var A = Edo.util.JSON.decode(_);
                    $.data.load(A)
                }
                $.fireEvent("query", {
                    type: "query",
                    success: true,
                    data: _
                });
                $.table.unmask()
            },
            onFail: function(_) {
                if ($.autoFill) $.data.clear();
                $.fireEvent("query", {
                    type: "query",
                    success: false,
                    errorCode: _
                });
                $.table.unmask()
            }
        })
    },
    _onTextChange: function($) {
        Edo.controls.AutoComplete.superclass._onTextChange.call(this, $);
        if (this.field.value == "") this.set("selectedIndex", -1)
    },
    setValue: function($) {
        if ($ && this.selectedItem != $) {
            this.selectedItem = $;
            this.set("text", $[this.displayField])
        }
    },
    getValue: function() {
        var $ = this.selectedItem;
        if ($) $ = $[this.valueField];
        return $
    }
});
Edo.controls.AutoComplete.regType("autocomplete");
Edo.controls.Lov = function() {
    Edo.controls.Lov.superclass.constructor.call(this);
    this.windowConfig = {
        width: 500,
        height: 300,
        left: "center",
        top: "middle",
        toolbar: "no",
        scrollbars: "no",
        menubar: "no",
        resizable: "no",
        location: "no",
        status: "no"
    };
    this.pageConfig = {};
    this.data = {}
};
Edo.controls.Lov.extend(Edo.controls.Trigger, {
    valueField: "value",
    displayField: "text",
    url: "",
    params: null,
    pageName: "",
    autoMask: true,
    maskTarget: "#body",
    readOnly: true,
    elCls: "e-text e-search",
    initEvents: function() {
        Edo.controls.Lov.superclass.initEvents.call(this);
        if (!this.design) this.on("trigger", this._onLovTrigger, this, 0)
    },
    _onLovTrigger: function($) {
        this.open(this.pageConfig)
    },
    createPageConfigString: function(_) {
        var E = [],
        C = window.screen.width,
        $ = window.screen.height - 100,
        A = _.width,
        B = _.height;
        for (var D in _) {
            var F = _[D];
            if (D == "left" && F == "center") F = C / 2 - A / 2;
            if (D == "top" && F == "middle") F = $ / 2 - B / 2;
            E.push(D + "=" + F)
        }
        return E.join(",")
    },
    getValue: function() {
        if (this.data) return this.data[this.valueField];
        return null
    },
    setValue: function($) {
        this._setData($)
    },
    _setData: function($) {
        if (!Edo.isValue($)) return;
        if ($ !== this.data) {
            this.data = $;
            this.set("text", $[this.displayField])
        }
    },
    submit: function(_) {
        if (typeof _ != "string") {
            var $ = {
                data: _
            };
            _ = Edo.util.JSON.encode($);
            _ = Edo.util.JSON.decode(_).data
        } else _ = Edo.util.JSON.decode(_);
        this.setValue(_);
        var A = {
            type: "submit",
            source: this,
            data: _
        };
        this.fireEvent("submit", A);
        this.data = _;
        this.close()
    },
    open: function(_) {
        if (this.pager) this.close();
        var D = {
            type: "beforeopen",
            source: this
        };
        if (this.fireEvent("beforeopen", D) === false) return false;
        if (this.autoMask) {
            var $ = (this.maskTarget == "#body" || !this.maskTarget) ? document.body: this.maskTarget;
            if (Edo.type($) == "element") Edo.util.Dom.mask($);
            else $.mask()
        }
        var _ = Edo.applyIf(this.pageConfig, this.windowConfig),
        C = this.createPageConfigString(_),
        B = this.urlEncode(this.params, this.url.indexOf("?") == -1 ? this.url + "?": this.url);
        this.pager = window.open(B, this.pageName, C);
        this.pager.focus();
        var A = this;
        window.submitPagerData = function($) {
            A.submit($)
        };
        setTimeout(function() {
            Edo.util.Dom.on(A.pager, "unload", A.onPageUnload, A)
        },
        this.deferBindUnload);
        this.startFocus();
        D.type = "open";
        D.pager = this.pager;
        this.fireEvent("open", D)
    },
    urlEncode: function(_, D) {
        var A,
        B = [],
        $,
        C = encodeURIComponent;
        for ($ in _) {
            A = typeof _[$] === "undefined"; [].each.call(A ? $: _[$], 
            function(D, _) {
                B.push("&", C($), "=", (D != $ || !A) ? C(D) : "")
            })
        }
        if (!D) {
            B.shift();
            D = ""
        }
        return D + B.join("")
    },
    deferBindUnload: 800,
    close: function() {
        if (this.pager) {
            this.pager.close();
            var $ = this.maskTarget == "#body" ? document.body: this.maskTarget;
            if (Edo.type($) == "element") Edo.util.Dom.unmask($);
            else $.unmask()
        }
        Edo.util.Dom.un(this.pager, "unload", this.onPageUnload, this);
        this.stopFocus();
        this.pager = null;
        this.fireEvent("close", {
            type: "close",
            source: this
        })
    },
    onWindowFocus: function($) {
        try {
            Edo.util.Dom.focus(this.pager)
        } catch($) {}
    },
    onPageUnload: function($) {
        this.close()
    },
    startFocus: function() {
        this.stopFocus();
        Edo.util.Dom.on(window, "focus", this.onWindowFocus, this)
    },
    stopFocus: function() {
        Edo.util.Dom.un(window, "focus", this.onWindowFocus, this)
    },
    destroy: function() {
        this.close();
        Edo.controls.Lov.superclass.destroy.call(this)
    }
});
Edo.controls.Lov.regType("lov");
Edo.controls.SuperSelect = function() {
    Edo.controls.SuperSelect.superclass.constructor.call(this)
};
Edo.controls.SuperSelect.extend(Edo.controls.ComboBox, {
    multiSelect: true,
    autoHeight: true,
    popupReset: false,
    triggerVisible: false,
    elCls: "e-superselect",
    delimiter: ",",
    valueField: "id",
    textField: "text",
    itemRenderer: function($, _) {
        return "<a href=\"javascript:void(0);\" hidefocus id=\"" + this.createItemId($) + "\" class=\"" + this.itemCls + "\">" + $[this.textField] + "<span id=\"" + _ + "\" class=\"e-superselect-item-close\"></span></a>"
    },
    setValue: function($) {
        if (!Edo.isValue($)) $ = [];
        if (typeof $ == "string") $ = $.split(this.delimiter);
        if (! ($ instanceof Array)) $ = [$];
        this.selecteds = [];
        $.each(function(A) {
            var _ = {};
            _[this.valueField] = A;
            var $ = this.data.findIndex(_);
            if ($ != -1) this.selecteds.add(this.data.getAt($))
        },
        this);
        this.view.data.load(this.selecteds);
        this.fixAutoSize();
        this.relayout()
    },
    getValue: function() {
        var $ = [];
        this.selecteds.each(function(_) {
            if (this.valueField == "*") $.add(_);
            else $.add(_[this.valueField])
        },
        this);
        return $.join(this.delimiter)
    },
    initEvents: function() {
        this.on("keydown", this._onkeydown, this);
        this.on("click", this._onclick, this);
        this.on("beforeselectionchange", this._onSuperSelectBeforeSelectionChange, this, 0);
        Edo.controls.SuperSelect.superclass.initEvents.call(this)
    },
    _onclick: function(A) {
        if (Edo.util.Dom.hasClass(A.target, "e-superselect-item-close")) {
            var _ = parseInt(A.target.id),
            $ = this.view.data.getAt(_);
            this.selecteds.remove($);
            this.view.data.load(this.selecteds);
            this.fixAutoSize();
            this.fixInput(this.itemIndex);
            this.relayout("select")
        }
    },
    _onkeydown: function(C) {
        var B = this.field == C.target;
        if (B && this.field.value != "") return;
        if (this.popupDisplayed) {
            if (C.keyCode == 8 && this.field.value == "") this.hidePopup.defer(100, this);
            return
        }
        var A = true;
        switch (C.keyCode) {
        case 8:
            C.stopDefault();
            if (B) this.view.data.removeAt(this.itemIndex);
            else {
                var _ = this.view.getSelecteds();
                this.view.data.removeRange(_)
            }
            this.itemIndex -= 1;
            var $ = this.view.getByIndex(this.itemIndex);
            if (!$) {
                this.itemIndex -= 1;
                $ = this.view.getByIndex(this.itemIndex)
            }
            break;
        case 127:
            if (B) this.view.data.removeAt(this.itemIndex + 1);
            else {
                _ = this.view.getSelecteds();
                this.view.data.removeRange(_)
            }
            break;
        case 37:
        case 38:
            this.itemIndex -= 1;
            this.view.clearSelect();
            break;
        case 39:
            this.itemIndex += 1;
            this.view.clearSelect();
            break;
        case 40:
            return;
            break;
        case 36:
            this.itemIndex = -1;
            this.view.clearSelect();
            break;
        case 35:
            this.itemIndex = this.view.data.getCount() - 1;
            this.view.clearSelect();
            break;
        default:
            return
        }
        if (this.itemIndex < -1) this.itemIndex = -1;
        if (this.itemIndex > this.view.data.getCount() - 1) this.itemIndex = this.view.data.getCount() - 1;
        this.fixInput(this.itemIndex);
        this.fixAutoSize();
        this.relayout()
    },
    _onSuperSelectBeforeSelectionChange: function(_) {
        var $ = _.selectedItem;
        if (!$) return false;
        if (!this.multiSelect) this.selecteds = [];
        this.itemIndex += 1;
        this.selecteds.insert(this.itemIndex, $);
        if (this.itemIndex < -1) this.itemIndex = -1;
        if (this.itemIndex > this.view.data.getCount() - 1) this.itemIndex = this.view.data.getCount() - 1;
        this.view.data.load(this.selecteds);
        this.field.value = "";
        this.fixInput.defer(10, this, [this.itemIndex]);
        this.fixAutoSize();
        this.relayout("select");
        return false
    },
    createChildren: function($) {
        Edo.controls.SuperSelect.superclass.createChildren.call(this, $);
        this.view = Edo.create({
            type: "dataview",
            render: this.el,
            itemSelector: "e-superselect-item",
            itemCls: "e-superselect-item",
            selectedCls: "e-superselect-item-checked",
            cls: "e-superselect-inner",
            width: (this.realWidth || this.defaultWidth) - (this.triggerVisible ? 20: 0),
            autoHeight: true,
            data: this.selecteds,
            emptyText: "请选择",
            tpl: "<%=this.createView()%>",
            valueField: this.valueField,
            textField: this.textField,
            itemRenderer: this.itemRenderer,
            enableDeferRefresh: false,
            createView: function() {
                var B = this.data;
                if (!B || B.getCount() == 0) return "";
                B = this.data.view;
                var A = "<input id=\"" + this.id + "text" + "\" type=\"text\" class=\"e-superselect-text\" autocomplete=\"off\" size=\"24\" />",
                D = [""];
                for (var _ = 0, C = B.length; _ < C; _++) {
                    var $ = B[_];
                    D[D.length] = this.itemRenderer($, _)
                }
                D[D.length] = "<div class=\"e-clear\"></div>";
                return D.join("")
            },
            onmousedown: this._onViewMouseDown.bind(this)
        });
        Edo.util.Dom.addClass(this.field, "e-superselect-text");
        var _ = this.view.el;
        Edo.util.Dom.append(_, this.field);
        this.initInput();
        Edo.util.Dom.on(document, "mousedown", 
        function($) {
            if (this.within($)) Edo.util.Dom.addClass(this.el, this.focusClass);
            else {
                this.view.clearSelect();
                Edo.util.Dom.removeClass(this.el, this.focusClass)
            }
        },
        this)
    },
    createPopup: function() {
        Edo.controls.SuperSelect.superclass.createPopup.apply(this, arguments)
    },
    showPopup: function($) {
        Edo.controls.SuperSelect.superclass.showPopup.call(this, $);
        this.data.filter(this.filterFn, this)
    },
    filterFn: function($) {
        var A = this.selecteds;
        if (A.indexOf($) != -1) return false;
        var _ = String($[this.displayField]);
        if (_.indexOf(this.text) != -1) return true;
        else return false
    },
    syncSize: function() {
        Edo.controls.SuperSelect.superclass.syncSize.call(this);
        this.autoInput()
    },
    initInput: function() {
        if (!this.input) {
            this.input = this.field;
            Edo.util.Dom.on(this.input, "keydown", 
            function($) {
                this.autoInput()
            },
            this);
            Edo.util.Dom.on(this.input, "keyup", 
            function($) {
                this.autoInput()
            },
            this)
        }
    },
    autoInput: function() {
        var $ = this.field.value;
        if ($ != "") {
            Edo.util.Dom.addClass(this.field, "e-supserselect-text-inputed");
            var _ = Edo.util.TextMetrics.measure(this.field, $);
            Edo.util.Dom.setWidth(this.field, _.width + 21)
        } else {
            Edo.util.Dom.removeClass(this.field, "e-supserselect-text-inputed");
            this.field.style.width = "15px"
        }
        this.field.style.height = "20px";
        this.field.style.lineHeight = "20px"
    },
    fixInput: function($) {
        var A = this.view.getItems(),
        _ = A[$],
        B = this.view.el;
        if (_) Edo.util.Dom.after(_, this.field);
        else Edo.util.Dom.preend(B, this.field);
        this.focus.defer(50, this)
    },
    _onViewMouseDown: function(_) {
        var $ = this.view.getItemEl(_.target);
        if ($) {
            this.itemIndex = this.view.getItemIndex($);
            return
        }
        this.view.clearSelect();
        this.itemIndex = this.findTargetItem(_.xy);
        this.fixInput(this.itemIndex)
    },
    findTargetItem: function(B) {
        var C = [],
        E = this.view.getItems();
        for (var A = 0, G = E.length; A < G; A++) {
            var $ = E[A],
            D = Edo.util.Dom.getBox($);
            C.push(D);
            D.el = $
        }
        var _ = this.getBox();
        for (A = 0, G = C.length; A < G; A++) {
            var D = C[A],
            F = C[A + 1];
            if (F && D.y == F.y) D.right = F.x;
            else D.right = _.right;
            D.width = D.right - D.x
        }
        for (A = 0, G = C.length; A < G; A++) {
            D = C[A];
            if (Edo.util.Dom.isInRegin(B, D)) return A;
            if (A == 0) {
                D.right = D.x;
                D.x = _.x;
                D.width = D.right - D.x;
                if (Edo.util.Dom.isInRegin(B, D)) return - 1
            }
        }
        return E.length - 1
    },
    destroy: function() {
        Edo.controls.SuperSelect.superclass.destroy.call(this)
    }
});
Edo.controls.SuperSelect.regType("SuperSelect")
