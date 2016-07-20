/*
 * AUI JAVASCRIPT PLUGIN
 * 滑动 aui-range
 * Copyright (c) 2015 auicss.com @流浪男  QQ：343757327  群：344869952
 */
 (function( window, undefined ) {
    "use strict";
    var auiRange = function(params,callback) {
        this._init(params,callback);
    };
    var time=null;
    var distance,offsetLeft,tooltipWidth;
    auiRange.prototype = {
        _init: function(params,callback) {
            var self = this;
            distance = Math.abs(params.element.max - params.element.min);
            offsetLeft = params.element.offsetLeft;
            tooltipWidth = params.element.offsetWidth - 28;
            params.element.insertAdjacentHTML('afterend','<div class="aui-range-tip aui-hide">'+params.element.value+'</div>');
            var scaleWidth = (tooltipWidth / distance) * Math.abs(params.element.value - params.element.min);
            params.element.nextSibling.style.left = (offsetLeft + scaleWidth - 11)+'px';
            params.element.addEventListener("input",function(){
                self._showTip(params.element,callback);
            });
            params.element.addEventListener("touchmove",function(){
                self._showTip(params.element,callback);
            });
            params.element.addEventListener("touchend",function(){
                self._hideTip(params.element);
            });
        },
        _showTip: function(el,callback){
            el.nextSibling.classList.remove("aui-hide");
            var scaleWidth = (tooltipWidth / distance) * Math.abs(el.value - el.min);
            el.nextSibling.style.left = (offsetLeft + scaleWidth - 11)+'px';
            el.nextSibling.innerText = el.value;
            callback({
                value:el.value
            });
        },
        _hideTip : function(el){
            if (time) {
                clearTimeout(time);
            }
            time = setTimeout(function() {
                el.nextSibling.classList.add("aui-hide");
            }, 1500);
        }
    }
    window.auiRange = auiRange;
})(window);


