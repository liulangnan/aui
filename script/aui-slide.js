/**
 * aui-slide.js 轮播组件
 * @author 流浪男 && Beck
 * http://www.auicss.com
 * @todo more things to abstract, e.g. Loading css etc.
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 */
(function(window) {
	"use strict";

	var translateVal,
		firstTouchX,
		firstTouchY,
		touchXDelta,
		handleTranslateVal;
	var touchStartTime; //开始触摸事件
	var offsetX,
		offsetY,
		isScrolling;
	// CLASS 组装
	var	CLASS_SLIDER_NODE = "aui-slide-node",
		CLASS_SLIDE_PAGE_WRAP = "aui-slide-page-wrap",
		CLASS_SLIDE_PAGE = "aui-slide-page",
		CLASS_SLIDE_PAGE_ACTIVE = "aui-slide-page-active",
		CLASS_SLIDE_PAGE_DOT = "aui-slide-page-dot",
		CLASS_SLIDE_PAGE_LINE = "aui-slide-page-line";

	var __SLIDER_NODE = "."+CLASS_SLIDER_NODE,
		__SLIDE_PAGE_WRAP = "."+CLASS_SLIDE_PAGE_WRAP,
		__SLIDE_PAGE = "."+CLASS_SLIDE_PAGE,
		__SLIDE_PAGE_ACTIVE = "."+CLASS_SLIDE_PAGE_ACTIVE;

	auiSlide.prototype.options = {
		container:'',
		width:'auto',
		height:'auto',
		speed: 300, //滑动速速
		autoPlay: 0, //自动播放
		pageShow: true, //是否显示分页器
		pageStyle: 'dot',
		dotPosition: 'center',
		friction:1, //阻力
		loop:true,
		currentPage:false,
		PageCount:false
	};
	auiSlide.prototype._init = function(options) {
		extend(this.options, options);
		if(!this.options.container){
			return;
		}
		this.index = 0; //索引值
		this.continuous = true;//用于判断长度为2时的特殊处理
		this.container = this.options.container;
		// console.log(this.options.loop);
		this.loop = this.options.loop;
		this.speed = this.options.speed;
		this.container.style.position = "relative";
		this.container.style.width = this.options.width+"px";
		this.container.style.height = this.options.height+"px";

		var element = this.container.children[0];
		this.slideWrap = element;
		this.slideNodeList = this.slideWrap.querySelectorAll(__SLIDER_NODE);
		if(!element || !this.slideNodeList){
			return;
		}
		// this.options.pageCount(this.slideNodeList.length);
		this.slideWrapWidth = this.slideWrap.offsetWidth;
		this.slideNodeListLength = this.slideNodeList.length;

		if (this.slideNodeListLength == 2) { //当长度为2时作特殊处理
			element.appendChild(this.slideWrap.children[0].cloneNode(true));
			element.appendChild(this.slideWrap.children[1].cloneNode(true));
			this.slideWrap = element;
			this.slideNodeList = this.slideWrap.querySelectorAll(__SLIDER_NODE);
	    	this.slideNodeListLength = this.slideNodeList.length;
	    	this.continuous = false;
	    }
		for (var i = 0; i < this.slideNodeListLength; i++) {
			this.slideNodeList[i] && (this.slideNodeList[i].style.webkitTransform = this.slideNodeList[i].style.transform = "translate3d("+(this.slideWrapWidth*i)+"px,0,0)");
		}

		if(this.slideNodeListLength > 1) {
			if(this.options.pageShow){
				this.createPagination(0);
				this.setPageDotPosition();
			}
			if(this.options.autoPlay > 500 && this.loop){
				this.autoPlay(0);
			}
			this.slideWrap.addEventListener('touchstart', this.touchStart.bind(this), false);
			this.slideWrap.addEventListener('touchmove', this.touchMove.bind(this), false);
			this.slideWrap.addEventListener('touchend', this.touchEnd.bind(this), false);
		}
	};
	// 当分页器为圆点时位置设置
	auiSlide.prototype.setPageDotPosition = function(){
		var self = this;
		var pageDotPosition = self.options.dotPosition;
		this.container.querySelector(__SLIDE_PAGE_WRAP).style.textAlign = pageDotPosition;
	};
	// 自动播放
	auiSlide.prototype.autoPlay = function (index) {
		var self = this;
		setInterval(function(){
			self.slideTo(self.getCircle(self.index-1), -self.slideWrapWidth, 0);
	        self.slideTo(self.getCircle(self.index+2), self.slideWrapWidth, 0);
	        self.slideTo(self.index, -self.slideWrapWidth, self.options.speed);
	        self.slideTo(self.getCircle(self.index+1), 0, self.options.speed);
	        self.index = self.getCircle(self.index+1);
	        self.setPaginationActive(self.index);
		}, self.options.autoPlay)
	};
	// 设置当前分页
	auiSlide.prototype.setPaginationActive = function(index){
		var self = this;
		if(self.options.currentPage){
			self.options.currentPage(index);
		}
		if(!this.container.querySelector(__SLIDE_PAGE_WRAP)){
			return;
		}
		var pageList = this.container.querySelectorAll(__SLIDE_PAGE);
		if(this.container.querySelector(__SLIDE_PAGE+__SLIDE_PAGE_ACTIVE)){
			this.container.querySelector(__SLIDE_PAGE+__SLIDE_PAGE_ACTIVE).classList.remove(CLASS_SLIDE_PAGE_ACTIVE);
		}
		if(!this.continuous){
			if(this.index == 3){
				pageList[1].classList.add(CLASS_SLIDE_PAGE_ACTIVE);
			}else if(this.index==2){
				pageList[0].classList.add(CLASS_SLIDE_PAGE_ACTIVE);
			}else{
				pageList[this.index].classList.add(CLASS_SLIDE_PAGE_ACTIVE);
			}
		}else{
			pageList[this.index].classList.add(CLASS_SLIDE_PAGE_ACTIVE);
		}

	};
	// 创建分页器
	auiSlide.prototype.createPagination = function(index){
		var self = this;
		var pageWrap = this.container.querySelector(__SLIDE_PAGE_WRAP);
		if(!pageWrap){
			return;
		}
		pageWrap.innerHTML = '';
		var pageShowHtml = '';
		switch (self.options.pageStyle) {
			case "dot":// 原点
						if (!this.continuous) {
							for (var i = 0; i < 2; i++) {
								pageShowHtml += '<span class="'+CLASS_SLIDE_PAGE+' '+CLASS_SLIDE_PAGE_DOT+'"></span>';
							}
						}else{
							for (var i = 0; i < this.slideNodeListLength; i++) {
								pageShowHtml += '<span class="'+CLASS_SLIDE_PAGE+' '+CLASS_SLIDE_PAGE_DOT+'"></span>';
							}
						}
						pageWrap.innerHTML = pageShowHtml;
						self.setPaginationActive(0);
				break;
			case "line":// 线条
						if (!this.continuous) {
							for (var i = 0; i < 2; i++) {
								pageShowHtml += '<span class="'+CLASS_SLIDE_PAGE+' '+CLASS_SLIDE_PAGE_LINE+'" style="width:50%"></span>';
							}
						}else{
							for (var i = 0; i < this.slideNodeListLength; i++) {
								pageShowHtml += '<span class="'+CLASS_SLIDE_PAGE+' '+CLASS_SLIDE_PAGE_LINE+'" style="width:'+(100/this.slideNodeListLength)+'%"></span>';
							}
						}
						pageWrap.innerHTML = pageShowHtml;
						self.setPaginationActive(0);
				break;
		}
	};
	// 总页数
	auiSlide.prototype.pageCount = function() {
		var self = this;
		return self.slideNodeList.length;
	};
	auiSlide.prototype.touchStart = function(event) {
		touchStartTime = new Date() * 1;
		firstTouchX = parseInt(event.changedTouches[0].pageX);
		firstTouchY = parseInt(event.changedTouches[0].pageY);
		isScrolling = undefined;
	};
	auiSlide.prototype.touchMove = function(event) {
		var touchMoveObj = event.changedTouches[0],
				touchX = parseInt(touchMoveObj.pageX);
			touchXDelta = touchX - firstTouchX;
			handleTranslateVal = touchXDelta/this.options.friction;
		//  滑动位移
		offsetX = parseInt(touchMoveObj.pageX) - firstTouchX;
        offsetY = parseInt(touchMoveObj.pageY) - firstTouchY;
        var direction = this.getDirection(offsetX,offsetY);
        if ( typeof isScrolling == 'undefined') {
			isScrolling = !!( isScrolling || Math.abs(offsetX) < Math.abs(offsetY) );
		}
		if(!isScrolling){
			event.preventDefault();
			if(!this.loop){ //不循环
				if(!this.continuous && this.index==1 && direction=='left'){
					return;
				}
				if(!this.continuous && this.index==0 && direction=='right'){
					return;
				}
				if(this.index == this.slideNodeList.length-1){
					if(handleTranslateVal <= 0){
						return;
					}
					this.setTranslate(this.getCircle(this.index-1), handleTranslateVal - this.slideWrapWidth, 0);
				}else if(this.index == 0){
					if(handleTranslateVal >= 0){
						return;
					}
					this.setTranslate(this.getCircle(this.index+1), this.slideWrapWidth, 0);
				}
			}

			this.setTranslate(this.getCircle(this.index-1), handleTranslateVal - this.slideWrapWidth, 0);
			this.setTranslate(this.index, handleTranslateVal , 0);
			this.setTranslate(this.getCircle(this.index+1), handleTranslateVal + this.slideWrapWidth, 0);

		}
	};
	auiSlide.prototype.touchEnd = function(event) {
		var touchEndObj = event.changedTouches[0];
		var touchEndX = parseInt(touchEndObj.pageX) - firstTouchX;
        var touchEndY = parseInt(touchEndObj.pageY) - firstTouchY;
		var touchEndxy = {
				x: touchEndObj.pageX || 0,
				y: touchEndObj.pageY || 0
			};
		var moveDirection = this.getDirection(touchEndX,touchEndY); //滑动方向
		var boundary = this.slideWrapWidth/4;
		var duration = (new Date() * 1) - touchStartTime;
		var isValid = Number(duration) < 250 && Math.abs(offsetX) > 20 || Math.abs(offsetX) > boundary;
		if (isScrolling) {
			return;
		}
        if(isValid){
			if(offsetX < 0){
				if(!this.loop && this.index == this.slideNodeList.length-1){
					return;
				}

				if(!this.loop && !this.continuous && this.index==1){
					return;
				}

	        	if(offsetX < -boundary && moveDirection == 'left'){
	        		// left
					this.slideTo(this.getCircle(this.index-1), -this.slideWrapWidth, 0);
		            this.slideTo(this.getCircle(this.index+2), this.slideWrapWidth, 0);
		            this.slideTo(this.index, -this.slideWrapWidth, this.speed);
		            this.slideTo(this.getCircle(this.index+1), 0, this.speed);
		            this.index = this.getCircle(this.index+1);
				}else{
					// this.slideTo(this.getCircle(this.index-1), -this.slideWrapWidth, this.speed);
		            this.slideTo(this.index, 0, this.speed);
		            this.slideTo(this.getCircle(this.index+1), this.slideWrapWidth, this.speed);
				}
	        }else if(offsetX > 0){
	        	if(!this.loop && this.index == 0){
					return;
				}
				if(!this.loop && !this.continuous && this.index==0){
					return;
				}
	        	if(offsetX > boundary && moveDirection == 'right'){
	        		// right
		        	this.slideTo(this.getCircle(this.index+1), this.slideWrapWidth, 0);
		            this.slideTo(this.getCircle(this.index-2), -this.slideWrapWidth, 0);
		            this.slideTo(this.index, this.slideWrapWidth, this.speed);
		            this.slideTo(this.getCircle(this.index-1), 0, this.speed);
		            this.index = this.getCircle(this.index-1);
	        	}else{
	        		// this.slideTo(this.getCircle(this.index-1), -this.slideWrapWidth, this.speed);
		            this.slideTo(this.index, 0, this.speed);
		            this.slideTo(this.getCircle(this.index+1), this.slideWrapWidth, this.speed);
	        	}
	        }
        }else{
        	if(offsetX){
        		this.slideTo(this.getCircle(this.index-1), -this.slideWrapWidth, this.speed);
	            this.slideTo(this.index, 0, this.speed);
	            this.slideTo(this.getCircle(this.index+1), this.slideWrapWidth, this.speed);
        	}

        }
        this.setPaginationActive(this.index);
	};
	auiSlide.prototype.setTranslate = function (index,dist,speed){
		if(this.slideNodeList[index]){
			this.slideNodeList[index].style.webkitTransitionDuration =
	    	this.slideNodeList[index].style.transitionDuration = speed + 'ms';
	    	this.slideNodeList[index].style.webkitTransform =
	    	this.slideNodeList[index].style.transform = "translate3d("+dist+"px,0,0)";
		}
	};
	auiSlide.prototype.slideTo = function (index, dist, speed) {
		this.setTranslate(index, dist, speed);
		// index = dist;
	};
	auiSlide.prototype.getCircle = function (index) {
	    return (this.slideNodeListLength + (index % this.slideNodeListLength)) % this.slideNodeListLength;
	};
	auiSlide.prototype.getDirection = function(x, y) {
		if (x === y) { return '';}
		if (Math.abs(x) >= Math.abs(y)) {
            return x > 0 ? 'right' : 'left';
        } else {
           	return y > 0 ? 'down' : 'up';
        }
	}
	function extend (a, b) {
		for (var key in b) {
		  	if (b.hasOwnProperty(key)) {
		  		a[key] = b[key];
		  	}
	  	}
	  	return a;
	}
	function auiSlide (options) {
		this._init(options);
	}
	window.auiSlide = auiSlide;
})(window);