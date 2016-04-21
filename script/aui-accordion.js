/**
 * aui-accordion.js 手风琴
 * verson 0.0.1
 * @author 流浪男 && Beck
 * http://www.auicss.com
 * @todo more things to abstract, e.g. Loading css etc.
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 */
(function(window) {
	// "use strict";
	// CLASS 组装
	var	CLASS_FOLD_WRAP = "aui-fold",
		CLASS_FOLD_ACTIVE = "aui-fold-active",
		CLASS_FOLD_CONTENT = "aui-fold-content";

	var __FOLD_WRAP= "."+CLASS_FOLD_WRAP,
		__FOLD_ACTIVE = "."+CLASS_FOLD_ACTIVE,
		__FOLD_CONTENT = "."+CLASS_FOLD_CONTENT;

	Accordion.prototype.options = {
		callback:false
	};
	Accordion.prototype._init = function(options) {
		extend(this.options, options);
		// var self = this;
		var foldWraps = document.querySelectorAll(__FOLD_WRAP);
		if(!foldWraps){
			return;
		}
		for (var i = 0; i < foldWraps.length; i++) {
			foldWraps[i].addEventListener('tap',this.demo.bind(this));
		}
	};
	Accordion.prototype.demo = function(event){
		// console.log(event.currentTarget);
		if(event.target.nextElementSibling && event.target.nextElementSibling.classList.contains(CLASS_FOLD_CONTENT)){
			if(event.target.parentNode.classList.contains(CLASS_FOLD_ACTIVE)){
				event.target.parentNode.classList.remove(CLASS_FOLD_ACTIVE);
			}else{
				if(document.querySelector(__FOLD_WRAP+__FOLD_ACTIVE)){
					document.querySelector(__FOLD_WRAP+__FOLD_ACTIVE).classList.remove(CLASS_FOLD_ACTIVE);
				}
				event.target.parentNode.classList.add(CLASS_FOLD_ACTIVE);
				this.handleEvent(event);
			}
		}else{
			return;
		}
	};
	Accordion.prototype.handleEvent = function(event){
		var self = this;
		this.options.callback(event);
	}
	function Accordion (options) {
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
	window.auiAccordion = Accordion;
})(window);