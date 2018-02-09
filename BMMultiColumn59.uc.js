// ==UserScript==
// @name           BMMutiColumn.uc.js
// @description    书签菜单自动分列显示
// @author         ding
// @include        main
// @version        2017.11.25.1
// @startup        window.BMMutiColumn.init();
// @shutdown       window.BMMutiColumn.destroy();
// ==/UserScript==

location == "chrome://browser/content/browser.xul" && (function () {
  if (window.BMMutiColumn) {
    window.BMMutiColumn.destroy();
    delete window.BMMutiColumn;
  }
  
  var BMMutiColumn = {
    cachedMenus: [],
    init: function () {    
      $('PlacesToolbarItems').addEventListener('popupshowing', this, false);
      var pop = $('BMB_bookmarksPopup');
      if(pop){
      	pop.addEventListener('popupshowing', this, false);
        pop.addEventListener('click', this, false);
      }
    },
    destroy: function () {
      $('PlacesToolbarItems').removeEventListener('popupshowing', this, false);
      var pop = $('BMB_bookmarksPopup');
      if(pop){
      	pop.removeEventListener('popupshowing', this, false);
        pop.removeEventListener('click', this, false);
      }
     
      var i = 0;
      for (i = 0; i < this.cachedMenus.length; i++) {
        var menu = this.cachedMenus[i];
        if (menu && menu._x_inited) {
          menu._x_scrollbox.width = '';
          delete menu._x_scrollbox;
          delete menu._x_inited;
          delete menu._x_box;
        }
      }
      this.cachedMenus = [];
    },
    handleEvent: function (event) {
    	var menupopup;
      if (event.target.tagName == 'menu') {
         menupopup = event.target.menupopup;
      }else if (event.target.tagName == 'menupopup'){
      	menupopup = event.target;
      }else return;
      if(!menupopup)return;
      //没有初始化或换过位置，重新设置属性
      if(!menupopup.firstChild)return;
      
      if (!menupopup._x_inited || !menupopup._x_scrollbox.scrollWidth ) {
        var scrollbox = menupopup._scrollBox._scrollbox;
    
        var firstMenu = menupopup.firstChild;
        while(firstMenu){
        	if(firstMenu.tagName=="menuitem")break;
	        firstMenu = firstMenu.nextSibling;
	      }
        
        var box = firstMenu.boxObject.parentBox;
        
        if (box) {
          menupopup._x_box =box;
          menupopup._x_scrollbox = scrollbox;
          if(!menupopup._x_inited){
	          menupopup._x_inited = true;
	          this.cachedMenus.push(menupopup);
	        }
        }
        var container = menupopup._x_box;
				container.style.minHeight = "21px";
				container.style.height= "auto";
				container.style.display= "inline-flex";
				container.style.flexFlow= "column wrap";
				container.style.overflow= "-moz-hidden-unscrollable";
				menupopup._scrollBox.style.maxHeight = "calc(100vh - 129px)";
				
				menupopup.style.maxWidth = "calc(100vw - 20px)";
      }
      if (menupopup._x_inited) {
      	
        if(!(menupopup._x_scrollbox.width==menupopup._x_box.scrollWidth))menupopup._x_scrollbox.width = menupopup._x_box.scrollWidth;
        //弹出菜单点击bug，要计算两次
        if (event.type=="click") {
        	if(!(menupopup._x_scrollbox.width==menupopup._x_box.scrollWidth))menupopup._x_scrollbox.width = menupopup._x_box.scrollWidth;
        }
        //如果菜单数量或者文字宽度发生变化，可能会多出空区域，重新计算下
       		var menuitem = menupopup.lastChild;
       		while(menuitem){
       			if(!menuitem.style.maxWidth){
       				menuitem.style.maxWidth = "300px";
	        		menuitem.style.minWidth = "100px";
       			}
	        	menuitem = menuitem.previousSibling;
	        }
	        
	        var lastmenu = menupopup.lastChild;
	        while(lastmenu){
	        	if(lastmenu.scrollWidth>=90)break;
	        	lastmenu = lastmenu.previousSibling;
	        }
	         
	        if(lastmenu && lastmenu.scrollWidth>=90){
	        	var pos1 = lastmenu.boxObject.x-0+lastmenu.boxObject.width;
	        	var pos2 = menupopup._x_box.boxObject.x-0+menupopup._x_box.boxObject.width;
	        	if(pos2-pos1>30){
	        		menupopup._x_scrollbox.width = "";
	        		menupopup._x_scrollbox.width = menupopup._x_box.scrollWidth;
	        	}
	        }
      }
    }
  }
  BMMutiColumn.init();
  window.BMMutiColumn = BMMutiColumn;
  function $(id) {
    return document.getElementById(id);
  }
})();
