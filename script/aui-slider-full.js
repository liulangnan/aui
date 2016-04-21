/*
 * AUI JAVASCRIPT PLUGIN
 * 全屏上下左右滑动组件 aui-slider-full
 * v 0.0.1
 * Copyright (c) 2015 auicss.com @流浪男  QQ：343757327  群：344869952
 */
(function(window){
    "use strict";
    var firstTouchX,firstTouchY;
    sliderFull.prototype.options = {
        container:document.querySelector(".aui-slider-full"),
        direction:"y",
        friction:1
    };
    sliderFull.prototype._init = function(options) {
        extend(this.options, options);
        if(!this.options.container){
            return;
        }
        var element = this.options.container;
        this.lis = element.querySelectorAll(".aui-slider-list");
        this.len = this.lis.length;
        this.winW = window.innerWidth;
        this.winH = window.innerHeight;
        this.index = 0;
        this.offsetX = 0;
        this.offsetY = 0;
        var header = this.header;
        if(this.options.direction == 'y'){
            for(var i = 0; i < this.len; i++){
                this.lis[i].style.webkitTransform = 'translate3d(0, '+i*this.winH+'px, 0)';
                this.lis[i].style.zIndex = this.len - i;
            }
            element.style.cssText = 'width:' + this.winW +'px';
            element.style.height = this.winH + 'px';
        }else{
            for(var i = 0; i < this.len; i++){
                this.lis[i].style.webkitTransform = 'translate3d('+i*this.winW+'px,0,0)';
                this.lis[i].style.zIndex = this.len - i;
            }
            element.style.cssText = 'width:' + this.winW +'px';
            element.style.height = this.winH + 'px';
        }

        element.addEventListener('touchstart', this.touchStart.bind(this), false);
        element.addEventListener('touchmove', this.touchMove.bind(this), false);
        element.addEventListener('touchend', this.touchEnd.bind(this), false);
    }
    sliderFull.prototype.touchStart = function(event) {
        // touchStartTime = new Date() * 1;
        firstTouchX = parseInt(event.changedTouches[0].pageX);
        firstTouchY = parseInt(event.changedTouches[0].pageY);
        // isScrolling = undefined;
    };
    sliderFull.prototype.touchMove = function(event) {
        var self = this;
        event.preventDefault();
        this.offsetX = event.targetTouches[0].pageX - firstTouchX;
        this.offsetY = event.targetTouches[0].pageY - firstTouchY;

        if(this.options.direction == 'y'){
            var handleTranslateVal = this.offsetY/this.options.friction;
            if(this.offsetY > 0){//down
                if(this.index==0){
                    self.setTransform(this.index,"0");
                    self.setScale(this.index,this.offsetY*0.3+"px",1-(this.offsetY/(this.winH*3.5)));
                    return;
                }
                self.setZindex(this.index,"887");
                self.setZindex(this.index-1,"888");
                self.setScale(this.index,this.offsetY*0.3+"px",1-(this.offsetY/(this.winH*3.5)));
                self.setTransform(this.index,"0");
                self.setTransform(this.index-1,"0");

                self.setTranslate(this.index-1,handleTranslateVal-this.winH+"px");
            }else{//up
                if(this.index==this.lis.length-1){
                    self.setTransform(this.index,"0");
                    self.setScale(this.index,this.offsetY*0.3+"px",1+(self.offsetY/(self.winH*3.5)));
                    return;
                }
                self.setZindex(this.index,"887");
                self.setZindex(this.index+1,"888");
                self.setScale(this.index,this.offsetY*0.3+"px",1+(self.offsetY/(self.winH*3.5)));
                self.setTransform(this.index,"0");
                self.setTransform(this.index+1,"0");

                self.setTranslate(this.index+1,handleTranslateVal+this.winH+"px");
            }
        }else{ //左右滑动
            var handleTranslateVal = this.offsetX/this.options.friction;
            if(this.offsetX > 0){//right
                // console.log(1);
                if(this.index==0){
                    self.setTransform(this.index,"0");
                    self.setScale(this.index,this.offsetX*0.3+"px",1-(this.offsetX/(this.winW*3.5)));
                    return;
                }
                self.setZindex(this.index,"887");
                self.setZindex(this.index-1,"888");
                self.setScale(this.index,this.offsetX*0.3+"px",1-(this.offsetX/(this.winW*3.5)));
                self.setTransform(this.index,"0");
                self.setTransform(this.index-1,"0");

                self.setTranslate(this.index-1,handleTranslateVal-this.winW+"px");
            }else{//left
                // console.log(2);
                if(this.index==this.lis.length-1){
                    self.setTransform(this.index,"0");
                    self.setScale(this.index,this.offsetX*0.3+"px",1+(self.offsetX/(self.winW*3.5)));
                    return;
                }
                self.setZindex(this.index,"887");
                self.setZindex(this.index+1,"888");
                self.setScale(this.index,this.offsetX*0.3+"px",1+(self.offsetX/(self.winW*3.5)));
                self.setTransform(this.index,"0");
                self.setTransform(this.index+1,"0");

                self.setTranslate(this.index+1,handleTranslateVal+this.winW+"px");
            }
        }
    };
    sliderFull.prototype.touchEnd = function(event) {
        var self = this;
        if(this.options.direction == 'y'){
            if(this.offsetY > 0){//down
                if(this.index==0){
                    self.setTransform(this.index,"300");
                    self.setTranslate(this.index,"0px");
                    return;
                }
                if(this.offsetY > this.winH/3.5){
                    // 成功滑动
                    self.setTransform(this.index,"300");
                    self.setTransform(this.index-1,"300");
                    self.setTranslate(this.index,"100%");
                    self.setTranslate(this.index-1,"0px");
                    this.index = this.index-1;
                }else{
                    self.setTransform(this.index,"300");
                    self.setTransform(this.index-1,"300");

                    self.setTranslate(this.index-1,"-100%");
                    self.setTranslate(this.index,"0px");
                }
            }else{//up
                if(this.index==this.lis.length-1){
                    self.setTransform(this.index,"300");
                    self.setTranslate(this.index,"0px");
                    return;
                }
                if(this.offsetY > -this.winH/3.5){
                    self.setTransform(this.index,"300");
                    self.setTransform(this.index+1,"300");
                    self.setTranslate(this.index,"0px");
                    self.setTranslate(this.index+1,"100%");
                }else{
                    // 成功滑动
                    self.setTransform(this.index,"300");
                    self.setTransform(this.index+1,"300");
                    self.setTranslate(this.index,"-100%");
                    self.setTranslate(this.index+1,"0px");
                    this.index = this.index+1;
                }
            }
        }else{
            if(this.offsetX > 0){//RIGHT
                if(this.index==0){
                    self.setTransform(this.index,"300");
                    self.setTranslate(this.index,"0px");
                    return;
                }
                if(this.offsetX > this.winW/3.5){
                    // 成功滑动
                    self.setTransform(this.index,"300");
                    self.setTransform(this.index-1,"300");
                    self.setTranslate(this.index,"100%");
                    self.setTranslate(this.index-1,"0px");
                    this.index = this.index-1;
                }else{
                    self.setTransform(this.index,"300");
                    self.setTransform(this.index-1,"300");

                    self.setTranslate(this.index-1,"-100%");
                    self.setTranslate(this.index,"0px");
                }
            }else{//left
                if(this.index==this.lis.length-1){
                    self.setTransform(this.index,"300");
                    self.setTranslate(this.index,"0px");
                    return;
                }
                if(this.offsetX > -this.winW/3.5){
                    self.setTransform(this.index,"300");
                    self.setTransform(this.index+1,"300");
                    self.setTranslate(this.index,"0px");
                    self.setTranslate(this.index+1,"100%");
                }else{
                    // 成功滑动
                    self.setTransform(this.index,"300");
                    self.setTransform(this.index+1,"300");
                    self.setTranslate(this.index,"-100%");
                    self.setTranslate(this.index+1,"0px");
                    this.index = this.index+1;
                }
            }
        }

    };
    sliderFull.prototype.setZindex = function (index,value){
        if(this.lis[index]){
            this.lis[index].style.zIndex = value;
        }
    }
    sliderFull.prototype.setTransform = function (index,value){
        if(this.lis[index]){
            this.lis[index].style.webkitTransitionDuration = this.lis[index].style.transitionDuration = value+'ms';
        }
    }
    sliderFull.prototype.setTranslate= function (index,value){
        var self = this;
        if(this.lis[index]){
            if(this.options.direction == 'y'){
                this.lis[index].style.webkitTransform = this.lis[index].style.transform = "translate3d(0,"+value+",0)";
            }else{
                this.lis[index].style.webkitTransform = this.lis[index].style.transform = "translate3d("+value+",0,0)";
            }
        }
    }
    sliderFull.prototype.setScale= function (index,value,scale){
        var self = this;
        if(this.lis[index]){
            if(this.options.direction == 'y'){
                this.lis[index].style.webkitTransform = this.lis[index].style.transform = "translate3d(0,"+value+",0) scale("+scale+")";
            }else{
                this.lis[index].style.webkitTransform = this.lis[index].style.transform = "translate3d("+value+",0,0) scale("+scale+")";
            }
        }
    }

    function sliderFull (options) {
        this._init(options);
    }
    function extend (a, b) {
        for (var key in b) {
            if (b.hasOwnProperty(key)) {
                a[key] = b[key];
            }
        }
        return a;
    }
    window.auiSliderFull = sliderFull;
})(window);


