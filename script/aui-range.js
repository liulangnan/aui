/*
 * AUI JAVASCRIPT PLUGIN
 * 滑动 aui-range
 * v 0.0.1
 * Copyright (c) 2015 auicss.com @流浪男  QQ：343757327  群：344869952
 */
(function(window){
    var aui = {};
    aui.range = function(element,callback){
        var time=null;
        var distince,offsetLeft,tooltipWidth;
        var _init = function(){
            distance = Math.abs(element.max - element.min);
            offsetLeft = element.offsetLeft;
            tooltipWidth = element.offsetWidth - 28;
            element.insertAdjacentHTML('afterend','<div class="aui-range-tip aui-hide">'+element.value+'</div>');
            var scaleWidth = (tooltipWidth / distance) * Math.abs(element.value - element.min);
            element.nextSibling.style.left = (offsetLeft + scaleWidth - 11)+'px';
            element.addEventListener("input",function(){
                _showTip();
            });
            element.addEventListener("touchmove",function(){
                _showTip();
            });
            element.addEventListener("touchend",function(){
                _hideTip();
            });
        }
        var _showTip = function(){
            element.nextSibling.classList.remove("aui-hide");
            var scaleWidth = (tooltipWidth / distance) * Math.abs(element.value - element.min);
            element.nextSibling.style.left = (offsetLeft + scaleWidth - 11)+'px';
            element.nextSibling.innerText = element.value;
            callback(element.value);
        }
        var _hideTip = function(){
            if (time) {
                clearTimeout(time);
            }
            time = setTimeout(function() {
                element.nextSibling.classList.add("aui-hide");
            }, 1500);
        }
        _init();
    }
    window.$aui = aui;

})(window);


