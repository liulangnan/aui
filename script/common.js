window.apiready = function() {
	//===========================================================
	//页面加载完成后遍历全部的a标签，给所有的a标签都加上点击事件
	//并且获取a标签的自定义属性‘data-path’---页面的相对路径
	//===========================================================
	var arrDom = $api.domAll('a');
	for (var i = 0, len = arrDom.length; i < len; i++) {
	$api.addEvt(arrDom[i], 'click', function() {
			var path = this.getAttribute("data-path");
			api.openWin({
				name : path,
				url : path,
			})
		});
	}
}
