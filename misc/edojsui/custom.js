/**
 * 
 * @author junlong.yang at 2011/11/22 build.
 * @version $Id: custom.js 35 2013-01-21 05:37:52Z yangjunlong $
 */
var test = 100;
Edo.util.Dom.on(window, "resize", function(event) {
	var width = Edo.util.Dom.getViewWidth(document);
	width = width-350;
	jl_top_tabbar.set('width',width);
});

Edo.build({
    type: 'tabbar',
	id:'jl_top_tabbar',
	width:Edo.util.Dom.getViewWidth(document)-350,
	height:25,
    render: document.body,
	horizontalGap: 0,
    selectedIndex: 0,
	style:'left: 190px;position: absolute;top: 45px;z-index:11',
	padding:[0,0,0,0],
    children: [
        {
            type: 'button',text: '主页',id: 'index',padding:[0,0,0,0],width:50,
        }
    ]
});	


function addATab(id,title,text){
	var bar = Edo.get(id);
	if(!bar){
		bar = jl_top_tabbar.addChild({
			id: id,
			title: title,
			type: 'button',
			arrowMode: 'close',
			text: text,
			width:100,
			onarrowclick: function(e){}
		});
	}
	jl_top_tabbar.set('selectedItem', bar);
}


var dataTree = new Edo.data.DataTree(UIComponents);
Edo.build({
    type: 'tree',
	id:'jl_nav_tree',
	width:191,
	cls:'js-tree-navi',
    render: Edo.getDom('jl_sidebar'),
    headerVisible:false,
    autoColumns: true,
    horizontalLine: false,
    enableCellEdit:false,
    verticalScrollPolicy:'off',
    columns: [
        {
            header: '',
            dataIndex: 'name',
            children: [
                 {
                	 type:'button',
                	 text:'test'
                 }      
            ]
        }
    ],
    data: dataTree
}).set('height',jl_nav_tree.getRowAllHeight());

jl_nav_tree.on('selectionchange', function(e){
	var selected = e.selected;
	var __id = selected.__id;
	var _title = selected.name;
	
	var _jl_tab_item_id = '_jl_tab_item$'+__id;
	
	var barItem = Edo.get(_jl_tab_item_id);

	addATab(_jl_tab_item_id,_title,_title);
})

jl_top_tabbar.on('selectionchange', function(e){
	var index = e.source.selectedIndex;
    var item = e.source.getChildAt(index);
    var id = item.id.split('$')[1];
    jl_nav_tree.select(id);
})

jl_nav_tree.select('1002');