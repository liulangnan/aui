/**
 * aui-collapse.js
 * @author 流浪男
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 */
(function( window, undefined ) {
    "use strict";
    var auiCollapse = function(params) {
        this.init(params);
    };
    auiCollapse.prototype = {
        init: function(params,callback){
            var collapseHeader = document.querySelectorAll(".aui-collapse-header");
            if(collapseHeader.length){
                for(var i=0;i<collapseHeader.length;i++){
                    (function(e){
                        collapseHeader[e].onclick = function(){
                            if(collapseHeader[e].nextSibling.nextElementSibling.className.indexOf("aui-collapse-content") > -1){
                                if(collapseHeader[e].nextSibling.nextElementSibling.className.indexOf("aui-show") > -1){
                                    collapseHeader[e].nextSibling.nextElementSibling.classList.remove("aui-show");
                                    collapseHeader[e].classList.remove("aui-active");
                                }else{
                                    if(params.autoHide){
                                        if(document.querySelector(".aui-collapse-header.aui-active")){
                                            document.querySelector(".aui-collapse-header.aui-active").classList.remove("aui-active");
                                        }
                                        if(document.querySelector(".aui-collapse-content.aui-show")){
                                            document.querySelector(".aui-collapse-content.aui-show").classList.remove("aui-show");
                                        }
                                    }

                                    collapseHeader[e].nextSibling.nextElementSibling.classList.toggle("aui-show");
                                    collapseHeader[e].classList.toggle("aui-active");
                                }
                            }
                        }
                    })(i)
                }
            }
        }
    };
	window.auiCollapse = auiCollapse;
})(window);