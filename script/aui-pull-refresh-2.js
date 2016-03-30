/**
 * aui-pull-refresh-2.js 下拉组件2
 * verson 0.0.1
 * @author 流浪男 && Beck
 * http://www.auicss.com
 * @todo more things to abstract, e.g. Loading css etc.
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 */
(function(window) {
	'use strict';
	var touchYDelta;
	var docElement = window.document.documentElement,
		win = {width: window.innerWidth, height: window.innerHeight},
		translateVal,
		friction = 2.5,
		firstTouchY, initialScroll,
		ifLoading = false;
	function PullToRefresh (options) {
		this._init(options);
	}
	PullToRefresh.prototype.options = {
		//滑动容器
		container:document.querySelector('.aui-load-container'),
		pullImage:"../image/pull_refresh.png", //下拉时图片
		loadingImage:"../image/pull_refresh.png", //加载中图片
		triggerDistance:200,
		callback:false
	};
	PullToRefresh.prototype._init = function(options) {
		extend(this.options, options);
		if(!this.options.container){
			return;
		}
		this.container = this.options.container;

		this.container .addEventListener('touchstart', this.touchStart.bind(this));
		this.container .addEventListener('touchmove', this.touchMove.bind(this));
		this.container .addEventListener('touchend', this.touchEnd.bind(this));
		this.createLoadWrap();
	};
	PullToRefresh.prototype.createLoadWrap = function(){
		var self = this;
		// 创建load区域
		self.loadWrap = document.createElement("div");
		self.loadWrap.className = "aui-load-wrap";
		self.container.appendChild(self.loadWrap);
		// 获取load高度
		self.loadWrapH = self.loadWrap.offsetHeight;
		// load图片
		self.pullImage = self.options.pullImage;

		var _loadImage = document.createElement('img');
		_loadImage.src = self.pullImage;
		self.loadWrap.appendChild(_loadImage);
	};
	PullToRefresh.prototype.touchStart = function(event) {
		touchYDelta = '';
		if(ifLoading){
			return;
		}
		this.loadWrap.style.webkitTransform =
		this.loadWrap.style.transform = 'translate3d(0,-100%,0)';
		this.loadWrap.style.webkitTransitionDuration =
	    this.loadWrap.style.transitionDuration = '0ms';
	    this.loadWrap.querySelector("img").setAttribute("src",this.pullImage);
		var touchobj = event.changedTouches[0];
		// 注册触摸开始Y
		firstTouchY = parseInt(touchobj.clientY);
		initialScroll = this.scrollY();
	}
	PullToRefresh.prototype.touchMove = function (event) {
		if(ifLoading){
			event.preventDefault();
			return;
		}
		this.moving(event);
		this.throttle(this.moving(event), 20);
	}
	PullToRefresh.prototype.moving = function(event) {
		var touchobj = event.changedTouches[0],
			touchY = parseInt(touchobj.clientY);
			touchYDelta = touchY - firstTouchY;
		if ( this.scrollY() === 0 && touchYDelta > 0  ) {
			event.preventDefault();
		}
		if ( initialScroll > 0 || this.scrollY() > 0 || this.scrollY() === 0 && touchYDelta < 0 ) {
			firstTouchY = touchY;
			return;
		}
		translateVal = -this.loadWrapH + touchYDelta/friction;
		this.loadWrap.style.webkitTransform =
		this.loadWrap.style.transform = 'translate3d(0,'+translateVal+'px,0)';
		this.setContentTransform();

	}
	PullToRefresh.prototype.touchEnd = function (event) {
		if(ifLoading){
			return;
		}
		this.loadWrap.style.webkitTransitionDuration =
	    this.loadWrap.style.transitionDuration = '300ms';
		// 根据下拉高度判断是否加载
		if( touchYDelta > this.options.triggerDistance) {
			ifLoading = true;
			this.options.callback('success');
			if(!this.options.loadingImage){ //当没有jia'z
				this.loadingImage = this.options.pullImage;
			}else{
				this.loadingImage = this.options.loadingImage;
			}
			this.loadWrap.querySelector("img").setAttribute("src",this.loadingImage);
			this.loadWrap.querySelector("img").style.webkitTransform =
			this.loadWrap.querySelector("img").style.transform = '';
			this.loadWrap.querySelector("img").style.webkitAnimation =
	    	this.loadWrap.querySelector("img").style.animation = 'rotate 1s infinite linear';
			this.loadWrap.style.webkitTransform =
			this.loadWrap.style.transform = 'translate3d(0,80px,0)';
		}else{
			this.loadWrap.style.webkitTransform =
			this.loadWrap.style.transform = 'translate3d(0,-100%,0)';
		}
	}
	PullToRefresh.prototype.setContentTransform = function () {
		this.loadWrap.querySelector("img").style.webkitTransform =
		this.loadWrap.querySelector("img").style.transform = 'rotate('+ (translateVal*friction) +'deg)';
	}
	PullToRefresh.prototype.cancelLoading = function () {
		var self = this;
		this.loadWrap.style.webkitTransform =
		this.loadWrap.style.transform = 'translate3d(0,-100%,0)';
		this.loadWrap.querySelector("img").style.webkitTransform =
		this.loadWrap.querySelector("img").style.transform = 'rotate(0deg)';
		this.loadWrap.querySelector("img").classList.remove("loading");
		this.loadWrap.querySelector("img").style.webkitAnimation =
	    this.loadWrap.querySelector("img").style.animation = '';

		ifLoading = false;
	}
	PullToRefresh.prototype.scrollY = function () {
		return window.pageYOffset || docElement.scrollTop;
	}
	PullToRefresh.prototype.throttle = function (fn, delay) {
		var allowSample = true;
		return function(e) {
			if (allowSample) {
				allowSample = false;
				setTimeout(function() { allowSample = true; }, delay);
				fn(e);
			}
		}
	}
	PullToRefresh.prototype.winresize = function () {
		var resize = function() {
			win = {width: window.innerWidth, height: window.innerHeight};
		};
		this.throttle(resize(), 10);
	}
	function extend (a, b) {
		for (var key in b) {
		  	if (b.hasOwnProperty(key)) {
		  		a[key] = b[key];
		  	}
	  	}
	  	return a;
	}
	window.auiPullToRefresh = PullToRefresh;
})(window);