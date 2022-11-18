/**
 * Edojs 自定义扩展
 * 这样做的原因是：不修改Edojs源码的情况下对Edojs框架进行友好的扩展
 * 
 * @author junlong.yang at 2011/11/22 build.
 * @version $Id: edo.ext.js 35 2013-01-21 05:37:52Z yangjunlong $
 */

//创建命名空间
Edo.ns('Extend.navigators');
Edo.ns('Extend.controls');
Edo.ns('Extend.lists');


Extend.navigators.TabBar = function($) {
	Extend.navigators.TabBar.superclass.constructor.call(this)
};
Extend.navigators.TabBar.extend(Edo.navigators.TabBar, {
	/**
	 * 
	 */
	border:[1,1,1,0],
	
	getInnerHtml: function(_tab_html) {
        this.elCls += " e-tabbar";
        this.elCls += " e-tabbar-" + this.position;
        Edo.navigators.TabBar.superclass.getInnerHtml.call(this, _tab_html);
        _tab_html[_tab_html.length] = "<div class=\"e-tabbar-line\"></div>";
    },
    
    /**
     * 创建子元素
     * 
     */
    createChildren: function($) {
    	Extend.navigators.TabBar.superclass.createChildren.call(this, $);
    	this.startButton.set('style','padding:0;');
    	this.endButton.set('style','padding:0;');
    }
});
Extend.navigators.TabBar.regType("tabbar");
//Extend.navigators.TabBar : END

/**
 * 按钮组件 方法复写
 * 
 * Extend.controls.Button
 */
Extend.controls.Button = function() {
    Edo.controls.Button.superclass.constructor.call(this);
};
Extend.controls.Button.extend(Edo.controls.Button, {
	getInnerHtml: function(html) {
        if (this.simpleButton) {
        	return this.text || "";
        }
        this.elCls += this.getClass();
        var _ = Edo.isValue(this.realWidth) ? this.realWidth + "px": "auto",
        A = Edo.isValue(this.realHeight) ? this.realHeight + "px": "auto",
        text = this.text || "&nbsp;";
        html[html.length] = '<b class="mp-tabs-rc mp-tabs-rc-l"></b><b class="mp-tabs-rc mp-tabs-rc-r"></b>';
        html[html.length] = "<span class=\"e-btn-text " + this.icon + "\">" + text + "</span>";
        if (this.arrowMode){
        	html[html.length] = "<span class=\"e-btn-arrow\"></span>"
        }
    }
})
Extend.controls.Button.regType("button");
//Extend.controls.Button : END

/**
 * 树状组件
 * 
 * Extend.lists.Tree
 */
Extend.lists.Tree = function() {
	Extend.lists.Tree.superclass.constructor.call(this)
};
Extend.lists.Tree.extend(Edo.lists.Tree,{
	rowHeight:27,
	/**
	 * 是否要给单元格添加Id
	 * 
	 * @var {Boolean}
	 */
	viewCellId:false,
	
	enableTrackOver:true,

	focus:emptyFn,
	
	_onMouseDown: function(event) {
        this.fireItemEvent(event, "mousedown");
        if (!Edo.util.Dom.findParent(event.target, "e-table-filter-row")){
        	var el = event.target;
        	var attr = el.getAttributeNode && el.getAttributeNode('tabindex');
            var isHav = attr ? attr.specified : false;
            if(!isHav){
            	el.tabIndex = -1;
            }
            el.focus();
            el.blur();
            el.hideFocus = true; // ie
            el.style.outline = 'none'; //Mozilla
        }else {
        	setTimeout(function() {
                event.target.focus()
            },150);
        }
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
        	_cell_innerHtml += "<a href=\"javascript:;\" hidefocus class=\"e-tree-nodeicon\" style=\"left:" + (_left+20) + "px;\"></a>";
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
            	D = parseInt(D - 3) + "px"
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
});
Extend.lists.Tree.regType("tree");
//Extend.lists.Tree : END
