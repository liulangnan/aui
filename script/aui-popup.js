/**
 * aui-popup.js
 * @author 流浪男
 * @todo more things to abstract, e.g. Loading css etc.
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 */
(function( window, undefined ) {
    "use strict";
    var auiPopup = function() {
        this._init();
    };
    var	CLASS_MASK = "aui-mask",
    	CLASS_MASK_IN = 'aui-mask-in',
    	CLASS_MASK_OUT = 'aui-mask-out',
        CLASS_POPUP = 'aui-popup',
    	CLASS_POPUP_IN = 'aui-popup-in',
    	CLASS_POPUP_OUT = 'aui-popup-out',
    	CLASS_POPUP_FOR = 'aui-popup-for';
    var	__MASK = '.'+CLASS_MASK,
    	__MASK_IN = '.'+CLASS_MASK_IN,
    	__MASK_OUT = '.'+CLASS_MASK_OUT,
        __POPUP = '.'+CLASS_POPUP,
    	__POPUP_IN = '.'+CLASS_POPUP_IN,
    	__POPUP_OUT = '.'+CLASS_POPUP_OUT;
    var popupStatus = false;
    auiPopup.prototype = {
        _init: function() {
        	var self = this;
        	var _btn = document.querySelectorAll("["+CLASS_POPUP_FOR+"]");
        	if(_btn){
        		for(var i=0;i<_btn.length;i++){
        			_btn[i].setAttribute("tapmode", "");
        			_btn[i].onclick = function(e){
        				var popupId = this.getAttribute(CLASS_POPUP_FOR);
        				var popupDom = document.getElementById(popupId);
        				if(popupDom){
							if(popupDom.className.indexOf(CLASS_POPUP_IN) > -1 || document.querySelector(__POPUP_IN)){
					            self.hide(popupDom);
					        }else{
					        	self.show(popupDom);
					        }
        				}else{
        					return;
        				}
					}
        		}
        	}
        },
        show: function(el){
        	var self = this;
        	if(el.className.indexOf(CLASS_POPUP_IN) > -1 || document.querySelector(__POPUP_IN)){
	            self.hide(el);
	            return;
	        }
            if(popupStatus) return;
        	if(!document.querySelector(__MASK)){
				var maskHtml = '<div class="aui-mask"></div>';
				document.body.insertAdjacentHTML('beforeend', maskHtml);
			}
        	el.style.display = "block";
        	setTimeout(function(){
        		document.querySelector(__MASK).classList.add(CLASS_MASK_IN);
	            el.classList.add(CLASS_POPUP_IN);
                popupStatus = true;
	        }, 10)
	        document.querySelector(__MASK).addEventListener("touchstart", function(event){
	        	event.preventDefault();
	        	self.hide(el);
	        })
            el.addEventListener("touchmove", function(event){
                event.preventDefault();
            },false)
        },
        hide: function(el){
            if(!popupStatus) return;
        	document.querySelector(__MASK).classList.remove(CLASS_MASK_IN);
        	document.querySelector(__MASK).classList.add(CLASS_MASK_OUT);
        	if(!document.querySelector(__POPUP_IN))return;
            document.querySelector(__POPUP_IN).classList.add(CLASS_POPUP_OUT);
            document.querySelector(__POPUP_IN).classList.remove(CLASS_POPUP_IN);
	        setTimeout(function(){
                if(!document.querySelector(__POPUP_OUT))return;
	        	document.querySelector(__POPUP_OUT).style.display = "none";
	            document.querySelector(__POPUP_OUT).classList.remove(CLASS_POPUP_OUT);
	            if(document.querySelector(__MASK)){
					document.querySelector(__MASK).parentNode.removeChild(document.querySelector(__MASK));
				}
                popupStatus = false;
	        }, 300)
        }
    };
	window.auiPopup = auiPopup;
})(window);