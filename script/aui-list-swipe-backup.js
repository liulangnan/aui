/**
 * aui-list-swipe.js 列表页滑动菜单
 * verson 0.0.3
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
		handleTranslateVal;
	var TranslateZero = "translate3d(0,0,0)",
		TranslateCent = "translate3d(100%,0,0)";
	var swipeHandle = false,
		btnWidth = false,
		swipeBtnsRight = false;
	var isMoved = false,isOpened=false;
	var d = false;
	var auiListSwipe = function (callback) {
		this._init(callback);
	}
	auiListSwipe.prototype = {
		// var self = this;
		_init: function(callback){
			var self = this;
			// var d = document.querySelectorAll("selectors")
			window.addEventListener('touchstart', function(event){
				if(isOpened){
					console.log(1)
					// return;
					isOpened = false;
					return;
				}
				if(swipeHandle){
					event.preventDefault();
					self.setTranslate(swipeHandle,"0px");
					swipeHandle.classList.remove("aui-swipe-opened");
					swipeHandle = false;
					return;
				}
				isMoved = false;
				swipeHandle = false;
				var target = event.target;
				// 过滤点击
				for(; target && target !== document; target = target.parentNode){
					// console.log(target.classList)
					if (target.classList){
						if (target.classList.contains("aui-swipe-handle")) {
							swipeHandle = target;
							firstTouch = event.changedTouches[0];
							firstTouchX = firstTouch.clientX;
							firstTouchY = firstTouch.clientY;
							firstTouchTime = event.timeStamp;
							if(swipeHandle.className.indexOf("aui-swipe-opened") > -1){
							// 	console.log(1)
								// self.setTranslate(swipeHandle,"0px");
								// swipeHandle.classList.remove("aui-swipe-opened");
								event.preventDefault();
								return;
							}else{
								// setTimeout(function(){
									self.toggleEvents(swipeHandle,callback);
								// }, 100)

							}

						}
					}
				}


			})
			// window.addEventListener('touchmove', function(event){
			// 	if(swipeHandle){
			// 		// event.preventDefault();
			// 		// self.setTranslate(swipeHandle,"0px");
			// 		// swipeHandle.classList.remove("aui-swipe-opened");
			// 		// swipeHandle = false;
			// 		// return;
			// 	}
			// 	if(document.querySelector(".aui-swipe-opened")){
			// 		event.preventDefault();
			// 		if(swipeHandle != document.querySelector(".aui-swipe-opened")){
			// 			self.setTranslate(document.querySelector(".aui-swipe-opened"),"0px");
			//         	document.querySelector(".aui-swipe-opened").classList.remove("aui-swipe-opened");
			//         	isOpened = false;

			//         	event.stopPropagation()
			//         	return;
			// 		}
			// 	}
			// })
			window.addEventListener("touchmove", function(){

			})
		},
		toggleEvents:function(element,callback){
			if(!swipeHandle){
				return;
			}
			var self = this;
			self.setTransform(element,300);
			element.addEventListener('touchstart', function(event){
				// if(element.className.indexOf("aui-swipe-opened") > -1){
				// 	self.setTranslate(element,"0px");
				// 	element.classList.remove("aui-swipe-opened");
				// 	return;
				// }
				//:active样式引起列表背景色冲突

				element.parentNode.style.backgroundColor = "#ffffff";
				if(!element.nextSibling)return;
			},false)
			element.addEventListener('touchmove', function(event){
				if(document.querySelector(".aui-swipe-opened")){
					event.preventDefault();
					if(swipeHandle != document.querySelector(".aui-swipe-opened")){
						self.setTranslate(document.querySelector(".aui-swipe-opened"),"0px");
			        	document.querySelector(".aui-swipe-opened").classList.remove("aui-swipe-opened");
			        	isOpened = false;
			        	event.stopPropagation()
			        	return;
					}
				}
				// self.getAngle(event)
				self.setTransform(element,0);
				// if(element.className.indexOf("aui-swipe-opened") > -1)return;

				if(element.parentNode.querySelector(".aui-swipe-btn")){
					btnWidth = element.parentNode.querySelector(".aui-swipe-btn").offsetWidth;
				}
				// 列表触摸滑动时如果有已经显示的将其关闭，并退出。
				var touchMoveObj = event.changedTouches[0],
					touchX = touchMoveObj.clientX;
				touchXDelta = -Math.pow(firstTouchX-touchX, 0.85);
				handleTranslateVal = touchXDelta/friction;
				// touchXDelta = touchX - firstTouchX;
				// handleTranslateVal = touchXDelta/0.15;
				// console.log(handleTranslateVal)
		        var moveX = touchMoveObj.clientX - firstTouchX;
		        var moveY = touchMoveObj.clientY - firstTouchY;
		        var direction = self.getDirection(moveX,moveY);
		        var angle = self.getAngle(Math.abs(moveX),Math.abs(moveY));
		        // console.log(isMoved);

		        // // 解决滑动屏幕返回时事件冲突，主要针对部分特殊机型
		        // if(touchMoveObj.screenX < 0){
		        // 	firstTouchxy = '';
		        // }
		        if(direction == "right"){
		        	isMoved = false;
		        	event.preventDefault();
		        }
		        if(direction == "top" || direction == "down"){
		        	isMoved = false;
		        	return;
		        }
		        if(angle <= 15 && direction === 'left'){
		        	event.preventDefault()
		        	isMoved = true;
		        }
		        // console.log(handleTranslateVal)
		        // if(isMoved)self.setTranslate(element,""+(handleTranslateVal+10)+"px");
		        if((event.timeStamp - firstTouchTime) >= 100 && touchXDelta < 0 && touchMoveObj.screenX > 0 && isMoved){
		        	// event.stopPropagation();
		        	// element.classList.add("aui-swipe-moving");
		        	// event.preventDefault();
		        	if(element.className.indexOf("aui-swipe-opened") <= -1){
						if((handleTranslateVal+10) > -btnWidth){
				        	self.setTranslate(element,""+(handleTranslateVal+10)+"px");
				        }
					}else{
						return
					}

			    }
			},false)
			element.addEventListener('touchend', function(event){
				self.setTransform(element,300);
				var touchEndObj = event.changedTouches[0];
				var touchEndxy = {
						x: touchEndObj.clientX || 0,
						y: touchEndObj.clientY || 0
					};
				var toucheEndX = touchEndObj.clientX - firstTouchX;
		        var toucheEndY = touchEndObj.clientY - firstTouchY;
		        var direction = self.getDirection(toucheEndX,toucheEndY);
		        // element.classList.remove("aui-swipe-moving");
	        	if(direction=='left' && handleTranslateVal < (-btnWidth/3) && isMoved){
		        	self.setTranslate(element,""+-btnWidth+"px");
		        	element.classList.add("aui-swipe-opened");
		        	callback({
		        		'status':true,
		        		'dom':element
		        	})
		        	isOpened = true;
				}else{
					element.classList.remove("aui-swipe-opened");
		        	self.setTranslate(element,"0px");
		        	isOpened = false;
				}
				// isMoved = false;
				console.log(isOpened)
			},true)
		},
		setTransform : function (el,value){
			el.style.webkitTransitionDuration = el.style.transitionDuration = value+'ms';
		},
		setTranslate : function (el,value){
			if(el)el.style.webkitTransform = el.style.transform = "translate3d("+value+",0,0)";
		},
		getDistance : function(p1, p2, props) {
			if (!props) { props = ['x', 'y'];}
			var x = p2[props[0]] - p1[props[0]];
			var y = p2[props[1]] - p1[props[1]];
			return Math.sqrt((x * x) + (y * y));
		},
		getAngle:function(moveX, moveY){
		       // var x = Math.abs(x1 - x2);
		       // var y = Math.abs(y1 - y2);
		       var z = Math.sqrt(moveX*moveX + moveY*moveY);
		       return  Math.round((Math.asin(moveY / z) / Math.PI*180));
		},
		getDirection : function(x, y) {
			if (x === y) { return '';}
			if (Math.abs(x) >= Math.abs(y)) {
	            return x > 0 ? 'right' : 'left';
	        } else {
	           	return y > 0 ? 'down' : 'up';
	        }
		}
	}
	window.auiListSwipe = auiListSwipe;
})(window);