/**
 * aui-actionsheet.js
 * @author 流浪男
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 */
(function( window, undefined ) {
    "use strict";
    var auiActionsheet = function() {
    };
    var isShow = false;
    auiActionsheet.prototype = {
        init: function(params,callback){
            this.frameBounces = params.frameBounces;
            this.title = params.title;
            this.buttons = params.buttons;
            this.cancelTitle = params.cancelTitle;
            this.destructiveTitle = params.destructiveTitle;
            this.maskDiv;
            this.actionsheetDiv;
            var self = this;
            self.open(params,callback);
        },
        open: function(params,callback) {
            var titleHtml='',buttonsHtml='',destructiveHtml='',cancelHtml='',btnHtml='';
        	var self = this;
            if(self.actionsheetDiv || (!self.title && !self.buttons && !self.cancelTitle && !self.destructiveTitle))return;
            if(!self.maskDiv){
                self.maskDiv = document.createElement("div");
                self.maskDiv.className = "aui-mask";
                document.body.appendChild(self.maskDiv);
            }
            self.actionsheetDiv = document.createElement("div");
            self.actionsheetDiv.className = "aui-actionsheet";
            document.body.appendChild(self.actionsheetDiv);
            if(self.title){
                titleHtml = '<div class="aui-actionsheet-title aui-border-b aui-font-size-12">'+self.title+'</div>';
            }
            if(self.buttons && self.buttons.length){
                for(var i = 0; i < self.buttons.length;i++){
                    if(i == self.buttons.length-1){
                        buttonsHtml += '<div class="aui-actionsheet-btn-item">'+self.buttons[i]+'</div>';
                    }else{
                        buttonsHtml += '<div class="aui-actionsheet-btn-item aui-border-b">'+self.buttons[i]+'</div>';
                    }
                }
            }
            if(self.destructiveTitle){
                destructiveHtml = '<div class="aui-actionsheet-btn-item aui-border-t aui-text-danger">'+self.destructiveTitle+'</div>';
            }else{
                var destructiveHtml = '';
            }
            if(self.title || (self.buttons && self.buttons.length)){
                btnHtml = '<div class="aui-actionsheet-btn">'+titleHtml+''+buttonsHtml+''+destructiveHtml+'</div>';
            }
            if(self.cancelTitle){
                cancelHtml = '<div class="aui-actionsheet-btn"><div class="aui-actionsheet-btn-item">'+self.cancelTitle+'</div></div>';
            }
            self.actionsheetDiv.insertAdjacentHTML('beforeend', btnHtml+cancelHtml);
            var actionsheetHeight = document.querySelector(".aui-actionsheet").offsetHeight;
            self.maskDiv.classList.add("aui-mask-in");
            self.actionsheetDiv.style.webkitTransform = self.actionsheetDiv.style.transform = "translate3d(0,0,0)";
            self.actionsheetDiv.style.opacity = 1;
            self.actionsheetDiv.addEventListener("touchmove", function(event){
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
            var actionsheetButtons = document.querySelectorAll(".aui-actionsheet-btn-item");
            if(actionsheetButtons && actionsheetButtons.length > 0){
                setTimeout(function(){
                    self.maskDiv.onclick = function(){self.close();return;};
                    for(var ii = 0; ii < actionsheetButtons.length; ii++){
                        (function(e){
                            actionsheetButtons[e].onclick = function(){
                                if(callback){
                                    callback({
                                        buttonIndex: e+1,
                                        buttonTitle: this.textContent
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
            if(self.actionsheetDiv){
                var actionsheetHeight = self.actionsheetDiv.offsetHeight;
                self.actionsheetDiv.style.webkitTransform = self.actionsheetDiv.style.transform = "translate3d(0,"+actionsheetHeight+"px,0)";
                self.maskDiv.style.opacity = 0;
                setTimeout(function(){
                    if(self.maskDiv){
                        self.maskDiv.parentNode.removeChild(self.maskDiv);
                    }
                    self.actionsheetDiv.parentNode.removeChild(self.actionsheetDiv);
                    self.actionsheetDiv = self.maskDiv = false;
                }, 300)
            }
        }
    };
	window.auiActionsheet = auiActionsheet;
})(window);