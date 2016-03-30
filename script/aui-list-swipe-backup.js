/**
 * aui-list-swipe.js 列表页滑动菜单
 * verson 0.0.1
 * @author 流浪男 && Beck
 * http://www.auicss.com
 * @todo more things to abstract, e.g. Loading css etc.
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 */
 (function(window) {
	"use strict";
	var translateVal,
		friction = 2.5,
		firstTouchX,
		firstTouchxy,
		firstTouchY,
		firstTouch,
		touchXDelta,
		btnTranslateVal,
		handleTranslateVal,
		isMoved = false;
	var TranslateZero = "translate3d(0,0,0)",
		TranslateCent = "translate3d(100%,0,0)",
		CLASS_SWIPE_ENABLE = "aui-swipe-enable",
		CLASS_SWIPE_RIGHT_BTN = "aui-swipe-right-btn",
		CLASS_SWIPE_HANDLE = "aui-swipe-handle",
		CLASS_SWIPE_TRANSITION = "aui-swipe-transition";

	var __SWIPE_ENABLE = "."+CLASS_SWIPE_ENABLE,
		__SWIPE_RIGHT_BTN = "."+CLASS_SWIPE_RIGHT_BTN,
		__SWIPE_HANDLE = "."+CLASS_SWIPE_HANDLE,
		__SWIPE_TRANSITION = "."+CLASS_SWIPE_TRANSITION;
	var ListSwipe = function () {
		var self = this;
		self.init();
	}
	ListSwipe.prototype.init = function() {
		var self = this;
		window.addEventListener('touchstart', function(event){
			if(isMoved){
				// self.resetSwipe();
				event.stopPropagation();
			}
			var target = event.target;
			for(; target && target !== document; target = target.parentNode){
				if (target.classList){
					if (target.classList.contains(CLASS_SWIPE_HANDLE)) {
						// var handle = target.parentNode.querySelector(__SWIPE_HANDLE);
						self.toggleEvents(target);
						firstTouch = event.changedTouches[0];
						firstTouchX = parseInt(firstTouch.clientX);
						firstTouchY = parseInt(firstTouch.clientY);
						firstTouchxy = {
							x: event.targetTouches[0].clientX || 0,
							y: event.targetTouches[0].clientY || 0
						};
					}
				}
			}
		})
		// 阻止window左右滑动，防止上下滑动时造成意外滑动
		window.addEventListener('touchmove', function(event){
			var windTouchMoveObj = event.changedTouches[0];
			var winMoveX = parseInt(windTouchMoveObj.clientX) - firstTouchX;
	        var winMoveY = parseInt(windTouchMoveObj.clientY) - firstTouchY;
	        if(self.getDirection(winMoveX,winMoveY) == 'left'){
	        	event.preventDefault();
	        }
	        if(self.getDirection(winMoveX,winMoveY) == 'right'){
	        	if(isMoved){
	        		event.preventDefault();
	        	}
	        }
		})
	};

	ListSwipe.prototype.toggleEvents = function (element){
		var self = this;
		var handleWidth = element.offsetWidth;
		var swipeBtnsRight = element.parentNode.querySelectorAll(__SWIPE_RIGHT_BTN);
		var btnWidth =  swipeBtnsRight[0].offsetWidth ;
		for (var i = 0; i < swipeBtnsRight.length; i++) {
			if(swipeBtnsRight[i].classList.contains(CLASS_SWIPE_TRANSITION)){
				swipeBtnsRight[i].classList.remove(CLASS_SWIPE_TRANSITION);
			}
		}
		if(element.classList.contains(CLASS_SWIPE_TRANSITION)){
			element.classList.remove(CLASS_SWIPE_TRANSITION);
		}
		element.addEventListener('touchmove', function(event){
			if(element.parentNode.classList.contains(CLASS_SWIPE_ENABLE)){
				element.parentNode.classList.remove(CLASS_SWIPE_ENABLE);
				return;
			}
			if(document.querySelector(__SWIPE_ENABLE)){
				document.querySelector(__SWIPE_ENABLE).classList.remove(CLASS_SWIPE_ENABLE);
				self.resetSwipe();
			}
			if(isMoved){
				return;
			}
			var touchMoveObj = event.changedTouches[0],
				touchX = parseInt(touchMoveObj.clientX);
			touchXDelta = touchX - firstTouchX;
			btnTranslateVal = swipeBtnsRight[0].offsetWidth + touchXDelta/friction;
			handleTranslateVal = touchXDelta/friction;

	        var moveX = parseInt(touchMoveObj.clientX) - firstTouchX;
	        var moveY = parseInt(touchMoveObj.clientY) - firstTouchY;

	        // 解决滑动屏幕返回时事件冲突，主要针对部分特殊机型
	        if(touchMoveObj.screenX < 0){
	        	firstTouchxy = '';
	        	event.preventDefault();
	        }
	        // 加了屏幕坐标判断，防止在右滑关闭窗口时影响
	        if( handleTranslateVal < 10 && touchMoveObj.screenX > 0 && (self.getDirection(moveX,moveY) == 'left' || self.getDirection(moveX,moveY) == 'right')){
	        	self.setTranslate(element,handleTranslateVal);
	        	if(swipeBtnsRight && swipeBtnsRight.length==1){
	        		// 当按钮为一个时，滑动速度处理
	        		swipeBtnsRight[0].style.zIndex = 999999;
	        		self.setTranslate(swipeBtnsRight[0],btnTranslateVal);
	        	}else{
	        		// 多个按钮
	        		for (var i = 0; i < swipeBtnsRight.length; i++) {
		        		swipeBtnsRight[i].style.zIndex = 999999-i;
		        		if(handleTranslateVal > -(btnWidth+30)){
		        			self.setTranslate(swipeBtnsRight[i],''+((handleTranslateVal*(i+1))+btnWidth)+'');
		        		}
		        	}
	        	}

	        }
		})
		element.addEventListener('touchend', function(event){
			// 当滑动超出当前el时处理
			if(!isMoved){
				self.removeTranslate(element);
			}
			var touchEndObj = event.changedTouches[0];
			var touchEndxy = {
					x: touchEndObj.clientX || 0,
					y: touchEndObj.clientY || 0
				};
			var toucheEndX = parseInt(touchEndObj.clientX) - firstTouchX;
	        var toucheEndY = parseInt(touchEndObj.clientY) - firstTouchY;
	        if(self.getDirection(toucheEndX,toucheEndY)=='left' && self.getDistance(firstTouchxy,touchEndxy) > btnWidth*1.5){
	        	// 按钮显示
				isMoved = true;
				for (var i = 0; i < swipeBtnsRight.length; i++) {
					self.setTranslate(swipeBtnsRight[i],''+-(btnWidth*i)+'');
					swipeBtnsRight[i].classList.add(CLASS_SWIPE_TRANSITION);
				}
				self.setTranslate(element,''+-btnWidth+'');
				element.classList.add(CLASS_SWIPE_TRANSITION);
				// 菜单显示后在element父级元素增加aui-swipe-enable，用户可以判断当前class是否存在来判断onclick事件的触发
				element.parentNode.classList.add(CLASS_SWIPE_ENABLE);
			}else{
				isMoved = false;
				self.removeTranslate(element);
				setTimeout(function(){
					element.parentNode.classList.remove(CLASS_SWIPE_ENABLE);
				}, 300)
			}
		})
	}
	ListSwipe.prototype.resetSwipe = function (){
		isMoved = false;
		if(document.querySelectorAll(__SWIPE_RIGHT_BTN+__SWIPE_TRANSITION)){
			var swipeBtnsRight = document.querySelectorAll(__SWIPE_RIGHT_BTN+__SWIPE_TRANSITION);
			for (var i = 0; i < swipeBtnsRight.length; i++) {
				swipeBtnsRight[i].style.webkitTransform = swipeBtnsRight[i].style.transform = TranslateCent;
			}
		}
		if(document.querySelectorAll(__SWIPE_HANDLE+__SWIPE_TRANSITION)){
			var handle = document.querySelectorAll(__SWIPE_HANDLE+__SWIPE_TRANSITION);
			for (var i = 0; i < handle.length; i++) {
				handle[i].style.webkitTransform = handle[i].style.transform = TranslateZero;
			}
		}
	}
	ListSwipe.prototype.setTranslate = function (el,value){
		el.style.webkitTransform = el.style.transform = "translate3d("+value+"px,0,0)";
	}
	ListSwipe.prototype.removeTranslate = function(element){
		var swipeBtnsRight = element.parentNode.querySelectorAll(__SWIPE_RIGHT_BTN);
		for (var i = 0; i < swipeBtnsRight.length; i++) {
			swipeBtnsRight[i].classList.add(CLASS_SWIPE_TRANSITION);
			swipeBtnsRight[i].style.webkitTransform = swipeBtnsRight[i].style.transform = TranslateCent;
		}
		element.classList.add(CLASS_SWIPE_TRANSITION);
		element.style.webkitTransform = element.style.transform = TranslateZero;
    	return;
	}
	ListSwipe.prototype.getDistance = function(p1, p2, props) {
		if (!props) { props = ['x', 'y'];}
		var x = p2[props[0]] - p1[props[0]];
		var y = p2[props[1]] - p1[props[1]];
		return Math.sqrt((x * x) + (y * y));
	}
	ListSwipe.prototype.getDirection = function(x, y) {
		if (x === y) { return '';}
		if (Math.abs(x) >= Math.abs(y)) {
            return x > 0 ? 'right' : 'left';
        } else {
           	return y > 0 ? 'down' : 'up';
        }
	}
	window.ListSwipe = ListSwipe;
})(window);