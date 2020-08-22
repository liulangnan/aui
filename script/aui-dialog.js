/**
 * aui-dialog.js
 * @author 流浪男
 * @todo more things to abstract, e.g. Loading css etc.
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 */
(function( window, undefined ) {
    "use strict";
    var auiDialog = function() {
    };
    var isShow = false;
    auiDialog.prototype = {
        params: {
            title:'',
            msg:'',
            buttons: ['取消','确定'],
            input:false,
            endtxt:'', // 提示文本
            id : '',
            autoclose: true,
            text:'', // 输入框的placehoder
            value:'', // 输入框的默认值
            msgObj: '', // 弹出框中直接显示指定对象
            type: 'text' // input type值
        },
        create: function(params,callback) {
            var self = this;
            var dialogHtml = '';
            var buttonsHtml = '';
            params.autoclose = typeof(params.autoclose) == 'undefined' ? self.params.autoclose : params.autoclose;
            var headerHtml = '<div class="aui-dialog-header">' + (params.title || self.params.title) + '</div>';
            //var headerHtml = params.title ? '<div class="aui-dialog-header">' + params.title + '</div>' : '<div class="aui-dialog-header">' + self.params.title + '</div>';
            if(params.input){
                var msgHtml = '<div class="aui-dialog-body"><input type="' + (params.type || self.params.type) + '" value="' + (params.value || self.params.value) + '" placeholder="' + (params.text || '') + '">' + (params.endtxt || '') + '</div>';
            }else{
                var msgHtml = '<div class="aui-dialog-body">' + (params.msg || self.params.msg) + (params.endtxt || '') + '</div>';
            }

            var buttons = params.buttons || self.params.buttons;
            if (buttons && buttons.length > 0) {
                for (var i = 0; i < buttons.length; i++) {
                    buttonsHtml += '<div class="aui-dialog-btn" tapmode button-index="'+i+'">'+buttons[i]+'</div>';
                }
            }
            var id = params.id || self.params.id;
            var footerHtml = '<div class="aui-dialog-footer">'+buttonsHtml+'</div>';
            dialogHtml = '<div class="aui-dialog" ' + (id ? ' id="' + id + '"' : '') + '>'+headerHtml+msgHtml+footerHtml+'</div>';
            document.body.insertAdjacentHTML('beforeend', dialogHtml);

            // 支持弹出框中直接显示指定对象
            if(typeof(params.msgObj) == 'object')
            {
                document.querySelector(".aui-dialog-body").appendChild(params.msgObj);
            }

            // listen buttons click
            var dialogButtons = document.querySelectorAll(".aui-dialog-btn");
            if(dialogButtons && dialogButtons.length > 0){
                for(var ii = 0; ii < dialogButtons.length; ii++){
                    dialogButtons[ii].onclick = function(){
                        if(callback){
                            if(params.input){
                                callback({
                                    buttonIndex: parseInt(this.getAttribute("button-index"))+1,
                                    text: document.querySelector(".aui-dialog-body").querySelector("input").value,
                                    params: self.params
                                });
                            }else{
                                callback({
                                    buttonIndex: parseInt(this.getAttribute("button-index"))+1,
                                    params: self.params
                                });
                            }
                        };
                        params.autoclose && self.close();
                        return;
                    }
                }
            }
            self.open(params);
        },

        open: function(params){
            //open: function(params){
            if(!document.querySelector(".aui-dialog"))return;
            var self = this;
            // 用css3实现了居中
            if(!document.querySelector(".aui-mask")){
                var maskHtml = '<div class="aui-mask"></div>';
                document.body.insertAdjacentHTML('beforeend', maskHtml);
            }
            setTimeout(function(){
                document.querySelector(".aui-dialog").classList.add("aui-dialog-in");
                document.querySelector(".aui-mask").classList.add("aui-mask-in");
                document.querySelector(".aui-dialog").classList.add("aui-dialog-in");
            }, 10)
            // 阻止滚动事件
            document.querySelector(".aui-mask").addEventListener("touchmove", function(e){
                e.preventDefault();
            })
            document.querySelector(".aui-dialog-header").addEventListener("touchmove", function(e){
                e.preventDefault();
            })
            document.querySelector(".aui-dialog-footer").addEventListener("touchmove", function(e){
                e.preventDefault();
            })

            // 可通过点击遮盖层来关闭弹出框
            // 此处可能造成多次执行
            //document.querySelector(".aui-mask").addEventListener("click", function(e){
            document.querySelector(".aui-mask").onclick = function(e){
                // 支持弹出框中直接显示指定对象
                if(typeof(params.msgObj) == 'object')
                {
                    (params.msgPobj || document.body).appendChild(params.msgObj);
                }

                self.close();
            };

            return;
        },
        close: function(){
            var self = this;
            if (document.querySelector(".aui-mask")) {
                document.querySelector(".aui-mask").classList.remove("aui-mask-in");
            }
            document.querySelector(".aui-dialog").classList.remove("aui-dialog-in");
            document.querySelector(".aui-dialog").classList.add("aui-dialog-out");
            if (document.querySelector(".aui-dialog:not(.aui-dialog-out)")) {
                setTimeout(function(){
                    if(document.querySelector(".aui-dialog"))document.querySelector(".aui-dialog").parentNode.removeChild(document.querySelector(".aui-dialog"));
                    self.open();
                    return true;
                },200)
            }else{
                if (document.querySelector(".aui-mask")) {
                    document.querySelector(".aui-mask").classList.add("aui-mask-out");
                }
                document.querySelector(".aui-dialog").addEventListener("webkitTransitionEnd", function(){
                    self.remove();
                })
                document.querySelector(".aui-dialog").addEventListener("transitionend", function(){
                    self.remove();
                })
            }
        },
        remove: function(){
            if(document.querySelector(".aui-dialog"))document.querySelector(".aui-dialog").parentNode.removeChild(document.querySelector(".aui-dialog"));
            if(document.querySelector(".aui-mask")){
                document.querySelector(".aui-mask").classList.remove("aui-mask-out");
            }
            return true;
        },
        alert: function(params,callback){
            var self = this;
            return self.create(params,callback);
        },
        prompt:function(params,callback){
            var self = this;
            params.input = true;
            return self.create(params,callback);
        }
    };
    window.auiDialog = auiDialog;
})(window);