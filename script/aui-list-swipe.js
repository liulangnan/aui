/**
 * aui-list-swipe.js 列表页滑动菜单
 * verson 0.0.2
 * @author 流浪男 && Beck
 * http://www.auicss.com
 * @todo more things to abstract, e.g. Loading css etc.
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 */
 (function(window) {
	"use strict";
	var translateVal,
		friction = 1,
		firstTouchX,
		firstTouchxy,
		firstTouchY,
		firstTouch,
		firstTouchTime,
		touchXDelta,
		btnTranslateVal,
		handleTranslateVal,
		isOpened = false,
		isMoveing = false;
	var TranslateZero = "translate3d(0,0,0)",
		TranslateCent = "translate3d(100%,0,0)",
		CLASS_SWIPE_ACTIVE = "aui-swipe-active",
		CLASS_SWIPE_RIGHT_BTN = "aui-swipe-right-btn",
		CLASS_SWIPE_HANDLE = "aui-swipe-handle",
		CLASS_SWIPE_TRANSITION = "aui-swipe-transition",
		CLASS_SWIPE_SELECTED = "aui-swipe-selected";

	var __SWIPE_ACTIVE = "."+CLASS_SWIPE_ACTIVE,
		__SWIPE_RIGHT_BTN = "."+CLASS_SWIPE_RIGHT_BTN,
		__SWIPE_HANDLE = "."+CLASS_SWIPE_HANDLE,
		__SWIPE_SELECTED = "."+CLASS_SWIPE_SELECTED,
		__SWIPE_TRANSITION = "."+CLASS_SWIPE_TRANSITION;
	var swipeHandle = false,
		btnWidth = false,
		swipeBtnsRight = false;
	var ListSwipe = function () {
		var self = this;
		self.init();
	}
	ListSwipe.prototype.init = function() {
		var self = this;
		window.addEventListener('touchstart', function(event){
			if(isOpened){
				self.resetSwipe();
				swipeHandle = false;
				swipeBtnsRight = false;
				isOpened = false;
				event.stopPropagation();
				return;
			}
			var target = event.target;
			// 过滤点击
			for(; target && target !== document; target = target.parentNode){
				if (target.classList){
					if (target.classList.contains(CLASS_SWIPE_HANDLE)) {
						swipeHandle = target;
						if(target.parentNode.querySelectorAll(__SWIPE_RIGHT_BTN)){
							swipeBtnsRight = target.parentNode.querySelectorAll(__SWIPE_RIGHT_BTN);
							btnWidth =  swipeBtnsRight[0].offsetWidth;
						}
						self.toggleEvents(target);
						firstTouch = event.changedTouches[0];
						firstTouchX = firstTouch.clientX;
						firstTouchY = firstTouch.clientY;
						firstTouchTime = event.timeStamp;
						firstTouchxy = {
							x: event.targetTouches[0].clientX || 0,
							y: event.targetTouches[0].clientY || 0
						};
					}
				}
			}

		})
		window.addEventListener('touchmove', function(event){
			if(!isOpened){
				self.toggleActive(swipeHandle,true);
			}
		})
		window.addEventListener('touchcancel', function(event){
			self.toggleActive(swipeHandle,false);
		})
	};
	ListSwipe.prototype.toggleEvents = function (element){
		if(!swipeHandle){
			return;
		}
		var self = this;
		var handleWidth = element.offsetWidth;
		element.addEventListener('touchmove', function(event){
			self.toggleActive(element,true);
			// console.log(event.timeStamp);
			// 列表触摸滑动时如果有已经显示的将其关闭，并退出。
			var touchMoveObj = event.changedTouches[0],
				touchX = touchMoveObj.clientX;
			touchXDelta = touchX - firstTouchX;

			handleTranslateVal = touchXDelta/friction;
	        var moveX = touchMoveObj.clientX - firstTouchX;
	        var moveY = touchMoveObj.clientY - firstTouchY;
	        var direction = self.getDirection(moveX,moveY);
	        if(Math.abs(moveX) > 5){
	        	isMoveing = true;
	        }
	        // 解决滑动屏幕返回时事件冲突，主要针对部分特殊机型
	        if(touchMoveObj.screenX < 0){
	        	firstTouchxy = '';
	        }
	        // 加了屏幕坐标判断，防止在右滑关闭窗口时影响
	        if(!isOpened && (event.timeStamp - firstTouchTime) >= 100 && touchXDelta > -250 && isMoveing){
	        	if(touchMoveObj.screenX > 0 ){
	        		event.preventDefault();
		        	// 按钮类处理
		        	if(swipeBtnsRight && swipeBtnsRight.length==1){
		        		if(swipeBtnsRight){
							btnTranslateVal = swipeBtnsRight[0].offsetWidth + touchXDelta/friction;
						}
		        		if(touchXDelta < 10){
		        			self.setTransform(element,0);
		        			self.setTranslate(element,""+handleTranslateVal+"px");
		        		}
		        		// 当按钮为一个时，滑动速度处理
		        		swipeBtnsRight[0].style.zIndex = 999;
		        		self.setTransform(swipeBtnsRight[0],0);
		        		self.setTranslate(swipeBtnsRight[0],""+btnTranslateVal+"px");
		        	}else{
		        		handleTranslateVal = touchXDelta/swipeBtnsRight.length;
		        		if(touchXDelta < 10 && handleTranslateVal > -(btnWidth+30)){
		        			self.setTransform(element,0);
		        			self.setTranslate(element,""+touchXDelta+"px");
		        			// 多个按钮
			        		for (var i = 0; i < swipeBtnsRight.length; i++) {
				        		swipeBtnsRight[i].style.zIndex = 999-i;
			        			self.setTransform(swipeBtnsRight[i],0);
			        			self.setTranslate(swipeBtnsRight[i],''+((handleTranslateVal*(i+1))+btnWidth + 10)+'px');
				        	}
		        		}

		        	}
		        }else{
		        	isMoveing = false;
		        }
	        }
		})
		element.addEventListener('touchend', function(event){

			var touchEndObj = event.changedTouches[0];
			var touchEndxy = {
					x: touchEndObj.clientX || 0,
					y: touchEndObj.clientY || 0
				};
			var toucheEndX = touchEndObj.clientX - firstTouchX;
	        var toucheEndY = touchEndObj.clientY - firstTouchY;
	        var direction = self.getDirection(toucheEndX,toucheEndY);
        	if(direction=='left' && self.getDistance(firstTouchxy,touchEndxy) > (btnWidth*swipeBtnsRight.length)/2){
        		self.swipeOpen(element);
			}else{
				self.swipeClosed(element);
			}
		})
	}
	// swipe打开
	ListSwipe.prototype.swipeOpen= function (el){
		var self = this;
		self.setTransform(el,300);
		self.setTranslate(el,''+-(btnWidth*swipeBtnsRight.length)+'px');
		for (var i = 0; i < swipeBtnsRight.length; i++) {
			self.setTransform(swipeBtnsRight[i],300);
			self.setTranslate(swipeBtnsRight[i],''+-(btnWidth*i)+'px');
		}
		// 菜单显示后在element父级元素增加aui-swipe-enable，用户可以判断当前class是否存在来判断onclick事件的触发
		el.parentNode.classList.add(CLASS_SWIPE_SELECTED);
		isOpened = true;
		isMoveing = false;
	}
	// swipe关闭
	ListSwipe.prototype.swipeClosed= function (el){
		var self = this;
		self.setTransform(el,300);
		self.setTranslate(el,'0px');
		for (var i = 0; i < swipeBtnsRight.length; i++) {
			self.setTransform(swipeBtnsRight[i],300);
			self.setTranslate(swipeBtnsRight[i],'100%');
		}
		if(el.querySelector(__SWIPE_ACTIVE)){
			el.querySelector(__SWIPE_ACTIVE).classList.remove(CLASS_SWIPE_ACTIVE);
		}
		swipeHandle = false;
		isOpened = false;
		isMoveing = false;
	}
	// 当前正在滑动的list
	ListSwipe.prototype.toggleActive= function (el,isActive){
		var self = this;
		if(!el){
			return;
		}
		if(isActive){
			el.classList.add(CLASS_SWIPE_ACTIVE);
		}else{
			el.classList.remove(CLASS_SWIPE_ACTIVE);
			self.swipeClosed(el);
		}
	}
	ListSwipe.prototype.setTransform= function (el,value){
		el.style.webkitTransitionDuration = el.style.transitionDuration = value+'ms';
	}
	ListSwipe.prototype.setTranslate = function (el,value){
		el.style.webkitTransform = el.style.transform = "translate3d("+value+",0,0)";
	}
	ListSwipe.prototype.resetSwipe = function (){
		var self = this;
		if(document.querySelector(__SWIPE_SELECTED)){
			var selectDom = document.querySelector(__SWIPE_SELECTED);
			selectDom.querySelector(__SWIPE_HANDLE).style.webkitTransform = selectDom.querySelector(__SWIPE_HANDLE).style.transform = TranslateZero;
			var selectBtns = selectDom.querySelectorAll(__SWIPE_RIGHT_BTN);
			for (var i = 0; i < selectBtns.length; i++) {
				selectBtns[i].style.webkitTransform = selectBtns[i].style.transform = TranslateCent;
			}
			setTimeout(function(){
				document.querySelector(__SWIPE_SELECTED).classList.remove(CLASS_SWIPE_SELECTED);
			}, 300)
			self.toggleActive(selectDom.querySelector(__SWIPE_HANDLE),false);
		}
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