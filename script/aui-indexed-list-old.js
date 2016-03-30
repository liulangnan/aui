/**
* AUI JAVASCRIPT PLUGIN
* aui-indexid-list.js 索引列表
* version 0.0.1
* Copyright (c) 2015 auicss.com @流浪男  QQ：343757327  群：344869952
*/
(function(window){
	var  aui = {};
	var listArr = document.querySelectorAll(".aui-indexed-list li");
	var indexedWrap = document.querySelector(".aui-indexed-list");
	// 搜索类
	var searchWrap = document.querySelector(".aui-searchbar-wrap");
	var searchBar = document.querySelector(".aui-searchbar");
	var clearBtn = document.getElementById("aui-searchbar-clear");
	var searchInput = document.getElementById("aui-searchbar-input");
	var searchCancel = document.getElementById("aui-searchbar-cancel");
	// 右侧bar
	var bar = document.querySelector(".aui-indexed-list-bar");
	// 重置bar高度
	var barList = document.querySelectorAll(".aui-indexed-list-bar a");
	var barH = bar.offsetHeight;
	var newBarH = barList.length*15;
	var _init = function(){

		indexedWrap.style.height = (window.innerHeight-searchWrap.offsetHeight)+"px";
		searchBar.addEventListener("tap",function(){
			searchWrap.classList.add("focus");
			searchInput.focus();
		}, false)
		clearBtn.addEventListener("tap",function(){
			searchInput.value = '';
		}, false)
		searchCancel.addEventListener("tap",function(){
			searchWrap.classList.remove("focus");
			searchInput.value = '';
			searchInput.blur();
		}, false)
		searchInput.addEventListener("input",function(){
			var keyword = searchInput.value;
			keyword = (keyword || '').toUpperCase();
			setTimeout(function(){
				var groupElement = indexedWrap.querySelector('[data-group="' + keyword + '"]');
				if (groupElement) {
					console.log(groupElement.offsetTop);
					indexedWrap.scrollTop = groupElement.offsetTop;
				}
			},100)
		},false)


		bar.style.height = newBarH+"px";
		bar.style.top = "50%";
		bar.style.marginTop = "-"+((newBarH-searchWrap.offsetHeight)/2)+"px";

		bar.addEventListener('touchstart', function(event) {
			bar.style.opacity = "1";
			scrollTop(event);
		}, false);
		// 监听bar滑动
		bar.addEventListener('touchmove', function(event) {
			scrollTop(event);
		}, false);
		document.body.addEventListener('touchend', function(event) {
			removeToast(event);
		}, false);
		document.body.addEventListener('touchcancel', function(event) {
			removeToast(event);
		}, false);
	}
	var scrollTop = function (event){
		event.preventDefault();
		var clientX = event.changedTouches[0].clientX;
		var clientY = event.changedTouches[0].clientY;
		var _thisBar = document.elementFromPoint(clientX, clientY);
		if(clientX < window.innerWidth & clientY < window.innerHeight & clientY > 0){
			var thisValue = _thisBar.getAttribute("data-value");
			if(thisValue){
				var groupElement = indexedWrap.querySelector('[data-group="' + thisValue + '"]');
				if(thisValue != 'search' & thisValue != '*'){
					document.querySelector(".aui-indexed-list-toast").textContent = thisValue;
					document.querySelector(".aui-indexed-list-toast").classList.add("active");
					document.querySelector(".aui-indexed-list-toast").style.top = clientY+'px';
				}
				if (groupElement) {
					indexedWrap.scrollTop = groupElement.offsetTop;
				}
			}else{
				document.querySelector(".aui-indexed-list-toast").textContent = '';
				document.querySelector(".aui-indexed-list-toast").classList.remove("active");
			}
		}
	}
	var removeToast = function(event){
		bar.style.opacity = "0.6";
		document.querySelector(".aui-indexed-list-toast").classList.remove("active");
		bar.classList.remove('active');
	}
	_init();
	window.$aui = aui;
})(window);
