/**
 * aui-sharebox.js
 * @author 流浪男
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 */
(function( window, undefined ) {
    "use strict";
    var auiSharebox = function() {
    };
    var isShow = false;
    auiSharebox.prototype = {
        init: function(params,callback){
            this.frameBounces = params.frameBounces;
            this.col = params.col;
            this.buttons = params.buttons;
            this.cancelTitle = params.cancelTitle;
            this.maskDiv;
            this.shareBoxDiv;
            var self = this;
            self.open(params,callback);
        },
        open: function(params,callback) {
            var shareboxHtml='',buttonsHtml = '';
        	var self = this;
            if(self.shareBoxDiv || !self.buttons)return;
            if(!self.maskDiv){
                self.maskDiv = document.createElement("div");
                self.maskDiv.className = "aui-mask";
                document.body.appendChild(self.maskDiv);
            }
            if(!self.col)self.col = 5;
            self.shareBoxDiv = document.createElement("div");
            self.shareBoxDiv.className = "aui-sharebox aui-grid";
            document.body.appendChild(self.shareBoxDiv);
            if(self.buttons && self.buttons.length){
                buttonsHtml = '<div class="aui-row aui-row-padded">';
                for(var i = 0; i < self.buttons.length;i++){
                    if(self.col == 5){
                        buttonsHtml += '<div class="aui-col-5 aui-sharebox-btn">';
                    }else{
                        buttonsHtml += '<div class="aui-col-xs-'+(12/self.col)+' aui-sharebox-btn">';
                    }
                    if(self.buttons[i].image)buttonsHtml += '<img src="'+self.buttons[i].image+'">';
                    if(self.buttons[i].text)buttonsHtml += '<div class="aui-grid-label">'+self.buttons[i].text+'</div>';
                    buttonsHtml += '</div>';
                }
                buttonsHtml += '</div>';
            }
            if(self.cancelTitle){
                buttonsHtml += '<div class="aui-sharebox-close-btn aui-border-t">'+this.cancelTitle+'</div>';
            }
            self.shareBoxDiv.innerHTML = buttonsHtml;
            var actionsheetHeight = self.shareBoxDiv.offsetHeight;
            self.maskDiv.classList.add("aui-mask-in");
            self.shareBoxDiv.style.webkitTransform = self.shareBoxDiv.style.transform = "translate3d(0,0,0)";
            self.shareBoxDiv.style.opacity = 1;
            self.shareBoxDiv.addEventListener("touchmove", function(event){
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
            var shareboxButtons = document.querySelectorAll(".aui-sharebox-btn");
            if(shareboxButtons && shareboxButtons.length > 0){
                setTimeout(function(){
                    self.maskDiv.onclick = function(){self.close();return;};
                    for(var ii = 0; ii < shareboxButtons.length; ii++){
                        (function(e){
                            shareboxButtons[e].onclick = function(){
                                if(self.buttons[e].value){
                                    var _value = self.buttons[e].value;
                                }else{
                                    var _value = null;
                                }
                                if(callback){
                                    callback({
                                        buttonIndex: e+1,
                                        buttonValue:_value
                                    });
                                };
                                self.close();
                                return;
                            }
                        })(ii)
                    }
                }, 350)

            }
            document.querySelector(".aui-sharebox-close-btn").onclick = function(){self.close();return;};
        },
        close: function(){
            var self = this;
            if(typeof(api) != 'undefined' && typeof(api) == 'object' && self.frameBounces){
                api.setFrameAttr({
                    bounces:true
                });
            }
            if(self.shareBoxDiv){
                var actionsheetHeight = self.shareBoxDiv.offsetHeight;
                self.shareBoxDiv.style.webkitTransform = self.shareBoxDiv.style.transform = "translate3d(0,"+actionsheetHeight+"px,0)";
                self.maskDiv.style.opacity = 0;
                setTimeout(function(){
                    if(self.maskDiv){
                        self.maskDiv.parentNode.removeChild(self.maskDiv);
                    }
                    self.shareBoxDiv.parentNode.removeChild(self.shareBoxDiv);
                    self.maskDiv = self.shareBoxDiv = false;
                }, 300)
            }
        }
    };
	window.auiSharebox = auiSharebox;
})(window);