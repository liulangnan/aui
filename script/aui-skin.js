/**
 * aui-skin.js
 * @author 流浪男
 * @todo more things to abstract, e.g. Loading css etc.
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 */
(function( window, undefined ) {
    "use strict";
    var auiSkin = function(params) {
    	this.extend(this.params, params);
        this._init();
    };
    var fileRef;
    auiSkin.prototype = {
        params: {
            name: "", //主题名字
            skinPath:  "",//主题路径
            default:   false, //默认是否立即使用
            beginTime: "",//开始时间
            endTime:   ""//结束时间
        },
        _init: function() {
        	var self = this;
            if(!self.params.name)return;
        	if(!self.params.skinPath)return;
            fileRef = document.createElement('link');
            fileRef.setAttribute("rel","stylesheet");
            fileRef.setAttribute("type","text/css");
            fileRef.setAttribute("aui-skin-name",self.params.name);
            fileRef.setAttribute("href",self.params.skinPath);
            if(self.params.default){
                document.getElementsByTagName("head")[0].appendChild(fileRef);
            }else{
                if(!self.params.beginTime || !self.params.endTime)return;
                if(!self.check(self.params.beginTime,self.params.endTime))return;
                var _date = new Date();
                if(_date.getMinutes() < 10){
                    var nowM = "0"+_date.getMinutes();
                }else{
                    var nowM = _date.getMinutes();
                }
                var nowTime = _date.getHours()+":"+nowM;
                var b = parseInt(self.params.beginTime.replace(":", ''));
                var e = parseInt(self.params.endTime.replace(":", ''));
                var n = parseInt(nowTime.replace(":", ''));
                if(b > e){
                    if(n >= b || n <= e)self.setSkin();
                }else if(b < e){
                    if(n >= b && n <= e)self.setSkin();
                }else{
                    self.removeSkin();
                }
            }
        },
        setSkin:function(){
            document.getElementsByTagName("head")[0].appendChild(fileRef);
        },
        removeSkin:function(){
            var self = this;
            if(document.querySelector("link[aui-skin-name='"+self.params.name+"']"))
            document.querySelector("link[aui-skin-name='"+self.params.name+"']").parentNode.removeChild(document.querySelector("link[aui-skin-name='"+self.params.name+"']"));
        },
        check:function(beginTime,endTime){
            var strb = beginTime.split (":");
            if (strb.length != 2)return false;
            var stre = endTime.split (":");
            if (stre.length != 2)return false;
            var b = new Date ();
            var e = new Date ();
            b.setHours (strb[0]);
            b.setMinutes (strb[1]);
            e.setHours (stre[0]);
            e.setMinutes (stre[1]);
            if(strb[0] > 24 || strb[0] < 0 || stre[0] > 24 || stre[0] < 0)return false;
            if(strb[1] > 59 || strb[1] < 0 || stre[1] > 59 || stre[1] < 0)return false;
            return true;
        },
        extend: function(a, b) {
			for (var key in b) {
			  	if (b.hasOwnProperty(key)) {
			  		a[key] = b[key];
			  	}
		  	}
		  	return a;
		}
    };
	window.auiSkin = auiSkin;
})(window);