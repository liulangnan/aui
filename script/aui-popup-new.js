/**
 * aui-popup.js
 * @author 流浪男
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 */
(function( window, undefined ) {
    "use strict";
    var auiPopup = function() {
    };
    var isShow = false;
    auiPopup.prototype = {
        init: function(params,callback){
            this.frameBounces = params.frameBounces;
            this.location = params.location;
            this.buttons = params.buttons;
            this.maskDiv;
            this.popupDiv;
            var self = this;
            self.open(params,callback);
        },
        open: function(params,callback) {
            var buttonsHtml='',locationClass = 'aui-popup-top';
        	var self = this;
            if(self.popupDiv){
                self.close();
                return;
            }
            if(!self.maskDiv){
                self.maskDiv = document.createElement("div");
                self.maskDiv.className = "aui-mask";
                document.body.appendChild(self.maskDiv);
            }
            switch (self.location) {
                case "top":
                    locationClass = 'aui-popup-top';
                    break;
                case "top-left":
                    locationClass = 'aui-popup-top-left';
                    break;
                case "top-right":
                    locationClass = 'aui-popup-top-right';
                    break;
                case "bottom":
                    locationClass = 'aui-popup-bottom';
                    break;
                case "bottom-left":
                    locationClass = 'aui-popup-bottom-left';
                    break;
                case "bottom-right":
                    locationClass = 'aui-popup-bottom-right';
                    break;
                default:
                    locationClass = 'aui-popup-top';
                    break;
            }
            self.popupDiv = document.createElement("div");
            self.popupDiv.className = "aui-popup "+locationClass;
            self.popupDiv.innerHTML = '<div class="aui-popup-arrow"></div><div class="aui-popup-content"></div>';
            document.body.appendChild(self.popupDiv);
            if(self.buttons && self.buttons.length){
                buttonsHtml += '<ul class="aui-list aui-list-noborder">';
                for(var i = 0; i < self.buttons.length;i++){
                    buttonsHtml += '<li class="aui-list-item aui-list-item-middle">';
                    buttonsHtml += '<div class="aui-list-item-label-icon"><img src="'+self.buttons[i].image+'"></div>';
                    buttonsHtml += '<div class="aui-list-item-inner">'+self.buttons[i].text+'</div>';
                    buttonsHtml += '</li>';
                }
                buttonsHtml += '</ul>';
            }
            document.querySelector(".aui-popup .aui-popup-content").insertAdjacentHTML('beforeend', buttonsHtml);
            var actionsheetHeight = document.querySelector(".aui-popup").offsetHeight;
            self.maskDiv.classList.add("aui-mask-in");
            self.popupDiv.classList.add("aui-popup-in");
            self.popupDiv.addEventListener("touchmove", function(event){
                event.preventDefault();
            })
            self.maskDiv.addEventListener("touchmove", function(event){
                event.preventDefault();
            })
            if(typeof(api) != 'undefined' && typeof(api) == 'object' && self.frameBounces){
                api.setFrameAttr({
                    bounces:false
                });
            }
            var popupButtons = document.querySelectorAll(".aui-popup .aui-list-item");
            if(popupButtons && popupButtons.length > 0){
                setTimeout(function(){
                    self.maskDiv.onclick = function(){self.close();return;};
                    for(var ii = 0; ii < popupButtons.length; ii++){
                        (function(e){
                            popupButtons[e].onclick = function(){
                                if(self.buttons[e].value){
                                    var _value = self.buttons[e].value;
                                }else{
                                    var _value = null;
                                }
                                if(callback){
                                    callback({
                                        buttonIndex: e+1,
                                        buttonTitle: this.textContent,
                                        buttonValue: _value
                                    });
                                };
                                self.close();
                                return;
                            }
                        })(ii)
                    }
                }, 350)
            }
        },
        close: function(){
            var self = this;
            if(typeof(api) != 'undefined' && typeof(api) == 'object' && self.frameBounces){
                api.setFrameAttr({
                    bounces:true
                });
            }
            if(self.popupDiv){
                var actionsheetHeight = self.popupDiv.offsetHeight;
                self.popupDiv.classList.add("aui-popup-out");
                self.maskDiv.style.opacity = 0;
                setTimeout(function(){
                    if(self.maskDiv){
                        self.maskDiv.parentNode.removeChild(self.maskDiv);
                    }
                    self.popupDiv.parentNode.removeChild(self.popupDiv);
                    self.maskDiv = self.popupDiv = false;
                }, 300)
            }
        }
    };
	window.auiPopup = auiPopup;
})(window);