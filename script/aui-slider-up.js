/*
 * AUI JAVASCRIPT PLUGIN
 * 全屏上下滑动组件 aui-calendar
 * v 0.0.1
 * Copyright (c) 2015 auicss.com @流浪男  QQ：343757327  群：344869952
 */
(function(window){
    var aui = {};
    aui.sliderUp = function(element,callback){
        var wrap = element;
        var outer = element.getElementsByTagName('ul')[0];
        var lis = outer.getElementsByTagName('li');
        var len = lis.length;
        var _init = function(){
            this.winW = window.innerWidth;
            this.winH = window.innerHeight;
            this.initIndex = 0;
            var header = this.header;
            for(var i = 0; i < len; i++){
                lis[i].style.webkitTransform = 'translate3d(0, '+i*this.winH+'px, 0)';
                lis[i].style.zIndex = len - i;
            }
            outer.style.cssText = 'width:' + this.winW +'px';
            wrap.style.height = this.winH + 'px';
        }
        var _bindDom = function(){
            var self = this,
                winH = self.winH;
            //手指按下的处理事件
            var startHandler = function(e){
                e.preventDefault();
                self.startTime = new Date() * 1;
                self.startY = e.touches[0].pageY;
                self.offsetY = 0;
                var target = e.target;
                //如果点击的不是li也不是body
                while(target.nodeName != 'LI' && target.nodeName != 'BODY'){
                    target = target.parentNode;
                }
                self.target = target;
            };

            //手指移动的处理事件
            var moveHandler = function(e){
                e.preventDefault();
                self.offsetY = e.targetTouches[0].pageY - self.startY;
                var i = self.initIndex - 1;
                var m = i + 3;
                if (self.offsetY > 0) {//down
                    for(i; i < m; i++){
                        //当前移动时不要动画
                        lis[i] && (lis[i].style.webkitTransition = '-webkit-transform 0s ease-out');
                        if (i == self.initIndex + 1) {
                            lis[i] && (lis[i].style.zIndex = 887);
                            lis[i] && (lis[i].style.webkitTransform = 'translate3d(0, '+((i-self.initIndex)*self.winH + self.offsetY)+'px, 0)');
                        }
                        if (i == self.initIndex) {
                            lis[i] && (lis[i].style.zIndex = 888);
                            lis[i] && (lis[i].style.webkitTransform = 'translate3d(0, '+((i-self.initIndex)*self.winH + self.offsetY*0.3)+'px, 0) scale('+ (1-(self.offsetY/(self.winH*3.5))) +')');
                        }
                        if (i == self.initIndex - 1) {
                            lis[i] && (lis[i].style.zIndex = 889);
                            lis[i] && (lis[i].style.webkitTransition = '-webkit-transform 0.1s ease-out');
                            lis[i] && (lis[i].style.webkitTransform = 'translate3d(0, '+((i-self.initIndex)*self.winH + self.offsetY + 50)+'px, 0)');
                        }
                    }
                } else {//up
                    //当前移动时不要动画
                    for(i; i < m; i++){
                        //当前移动时不要动画
                        lis[i] && (lis[i].style.webkitTransition = '-webkit-transform 0s ease-out');
                        if (i == self.initIndex + 1) {
                            lis[i] && (lis[i].style.zIndex = 889);
                            lis[i] && (lis[i].style.webkitTransition = '-webkit-transform 0.1s ease-out');
                            lis[i] && (lis[i].style.webkitTransform = 'translate3d(0, '+((i-self.initIndex)*self.winH + self.offsetY - 50)+'px, 0)');
                        }
                        if (i == self.initIndex) {
                            lis[i] && (lis[i].style.zIndex = 888);
                            lis[i] && (lis[i].style.webkitTransform = 'translate3d(0, '+((i-self.initIndex)*self.winH + self.offsetY*0.3)+'px, 0) scale('+ (1+(self.offsetY/(self.winH*3.5))) +')');
                        }
                        if (i == self.initIndex - 1) {
                            lis[i] && (lis[i].style.zIndex = 887);
                            lis[i] && (lis[i].style.webkitTransform = 'translate3d(0, '+((i-self.initIndex)*self.winH + self.offsetY)+'px, 0)');
                        }
                    }
                }
            };

            //手指抬起的处理事件
            var endHandler = function(e){
                e.preventDefault();
                var boundary = winH/5;
                var endTime = new Date() * 1;
                if(endTime - self.startTime > 300){
                    if(self.offsetY >= boundary){
                        _goIndex('-1');
                    }else if(self.offsetY < 0 && self.offsetY < -boundary){
                        _goIndex('+1');
                    }else{
                        _goIndex('0');
                    }
                }else{
                    //快速滑动翻页
                    if(self.offsetY > 50){
                        _goIndex('-1');
                    }else if(self.offsetY < -50){
                        _goIndex('+1');
                    }else{
                        _goIndex('0');
                    }
                }
            };

            //绑定事件
            outer.addEventListener('touchstart', startHandler);
            outer.addEventListener('touchmove', moveHandler);
            outer.addEventListener('touchend', endHandler);
        }
        var _goIndex = function(n){
            var initIndex = this.initIndex,
                currIndex;
            if(typeof n == 'number'){
                currIndex = initIndex;
            }else if(typeof n == 'string'){
                currIndex = initIndex + n*1;
            }
            if(currIndex > len-1){
                currIndex = len - 1;
            }else if(currIndex < 0){
                currIndex = 0;
            }

            //保留当前索引值
            this.initIndex = currIndex;
            //改变过渡的方式，从无动画变为有动画
            lis[currIndex].style.webkitTransition = '-webkit-transform 0.2s ease-out';
            lis[currIndex-1] && (lis[currIndex-1].style.webkitTransition = '-webkit-transform 0.2s ease-out');
            lis[currIndex+1] && (lis[currIndex+1].style.webkitTransition = '-webkit-transform 0.2s ease-out');

            //改变动画后所应该的位移值
            lis[currIndex].style.webkitTransform = 'translate3d(0, 0, 0)';
            lis[currIndex-1] && (lis[currIndex-1].style.webkitTransform = 'translate3d(0, '+-this.winH+'px, 0)');
            lis[currIndex+1] && (lis[currIndex+1].style.webkitTransform = 'translate3d(0, '+this.winH+'px, 0)');
        }
        _init();
        _bindDom();
    }

    window.$aui = aui;
})(window);


