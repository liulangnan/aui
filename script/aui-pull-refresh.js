/**
 * aui-pull-refresh.js
 * @author Beck && 流浪男
 * @todo more things to abstract, e.g. Loading css etc.
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 */
(function(window) {
	'use strict';
	/**
	 * Extend obj function
	 *
	 * This is an object extender function. It allows us to extend an object
	 * by passing in additional variables and overwriting the defaults.
	 */
	var PullToRefresh = function (params) {
		this._init(params);
	}
	PullToRefresh.prototype.options = {
		//滑动容器
		container: document.querySelector('.aui-load-container'),
		loadingWrap: document.querySelector('.aui-load-container .aui-load-wrap'),
		titleEl: document.querySelector(".aui-loading-title"),
		textDown : '下拉刷新',
		textUp : '松开刷新',
		textRefresh : '刷新中',
		loadingDotEl: document.querySelector(".aui-loading-dot"),
		loadingCircleEl: document.querySelector(".aui-loading-circle"),
		callback: false,
		friction: 2.5,
		triggerDistance: 200
	};

	/**
	 * Pan event parameters
	 * @type {Object}
	 */
	PullToRefresh.prototype.touch = {
		loading: false
	};

	var touchYDelta;
	var docElem = window.document.documentElement,
		loadWrapH,
		win = {width: window.innerWidth, height: window.innerHeight},
		winfactor= 0.2,
		translateVal,
		firstTouchY, initialScroll;

	PullToRefresh.prototype._init = function(params) {
		extend(this.options, params);
		this.options.container.addEventListener('touchstart', this.touchStart.bind(this));
		this.options.container.addEventListener('touchmove', this.touchMove.bind(this));
		this.options.container.addEventListener('touchend', this.touchEnd.bind(this));
	};
	PullToRefresh.prototype.touchStart = function(ev) {
		if (this.touch.loading) {
			return;
		}
		touchYDelta = '';
		this.options.container.style.webkitTransitionDuration =
	    this.options.container.style.transitionDuration = '0ms';
		if(this.options.loadingCircleEl.classList.contains('loading')){
			this.options.loadingCircleEl.classList.remove('loading');
		}
		this.options.loadingCircleEl.style.webkitTransform =
		this.options.loadingCircleEl.style.transform = 'translate3d(0,-100%,0)';
		var touchobj = ev.changedTouches[0];
		// register first touch "y"
		firstTouchY = parseInt(touchobj.clientY);
		initialScroll = this.scrollY();
		// get load wrap height
		loadWrapH = this.options.loadingWrap.offsetHeight;
	};

	PullToRefresh.prototype.touchMove = function (ev) {
		if (this.touch.loading) {
			ev.preventDefault();
			return;
		}
		var self = this;
		if (this.options.title!=undefined) {
			this.options.titleEl.textContent = this.options.textDown;
		}
		var moving = function() {
			var touchobj = ev.changedTouches[0], // reference first touch point for this event
				touchY = parseInt(touchobj.clientY);
				touchYDelta = touchY - firstTouchY;
			if ( self.scrollY() === 0 && touchYDelta > 0  ) {
				ev.preventDefault();
			}

			if ( initialScroll > 0 || self.scrollY() > 0 || self.scrollY() === 0 && touchYDelta < 0 ) {
				firstTouchY = touchY;
				return;
			}
			translateVal = -loadWrapH + touchYDelta/self.options.friction;
			self.setContentTransform();
			if(translateVal < 8){
				self.options.loadingCircleEl.style.webkitTransform =
				self.options.loadingCircleEl.style.transform = 'translate3d(0,'+translateVal+'px,0)';
			}else{
				self.options.loadingCircleEl.style.webkitTransform =
				self.options.loadingCircleEl.style.transform = 'translate3d(0,8px,0)';
			}
			self.setContentTransform();
			if( touchYDelta > (self.options.triggerDistance-8) ) {
				self.options.titleEl.textContent = self.options.textUp;
			}else{
				self.options.titleEl.textContent = self.options.textDown;
			}
		};
		this.throttle(moving(), 20);
	};
	PullToRefresh.prototype.touchEnd = function (ev) {
		var self =this;
		if (self.touch.loading) {
			return;
		}
		// 根据下拉高度判断是否加载
		if( touchYDelta >= this.options.triggerDistance-8) {
			this.touch.loading = true; //正在加载中
			this.options.titleEl.textContent = this.options.textRefresh;
			this.options.loadingCircleEl.classList.add('loading');
			ev.preventDefault();
			this.options.container.style.webkitTransform =
			this.options.container.style.transform = 'translateY(0)';
			this.options.callback('success');

		}else{
			this.options.container.style.webkitTransform =
			this.options.container.style.transform = 'translateY(-70px)';
			this.options.callback('cancel');
		}
		if( translateVal !== -loadWrapH ) {
			this.options.container.style.webkitTransitionDuration =
	    	this.options.container.style.transitionDuration = '500ms';
		}

		return;
	};

	PullToRefresh.prototype.setContentTransform = function () {
		this.options.container.style.webkitTransform =
		this.options.container.style.transform = 'translate3d(0, ' + translateVal + 'px, 0)';
	};

	PullToRefresh.prototype.cancelLoading = function () {
		var self =this;

		self.touch.loading = false;
		self.options.container.style.webkitTransform =
		self.options.container.style.transform = 'translateY(-70px)';
		return;
	};
	PullToRefresh.prototype.scrollY = function() {
		return window.pageYOffset || docElem.scrollTop;
	};
	PullToRefresh.prototype.throttle = function(fn, delay) {
		var allowSample = true;
		return function(e) {
			if (allowSample) {
				allowSample = false;
				setTimeout(function() { allowSample = true; }, delay);
				fn(e);
			}
		};
	};
	PullToRefresh.prototype.winresize = function () {
		var resize = function() {
			win = {width: window.innerWidth, height: window.innerHeight};
		};
		throttle(resize(), 10);
	};
	var extend = function (a, b) {
		for (var key in b) {
		  	if (b.hasOwnProperty(key)) {
		  		a[key] = b[key];
		  	}
	  	}
	  	return a;
	}
	window.auiPullToRefresh = PullToRefresh;

})(window);