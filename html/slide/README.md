[招聘] 与我一起工作
=========
> ［北京地区］国内最大美股券商 － [老虎证券](https://www.tigerbrokers.com)   
［地点］东三环亮马桥  
［职位］web前端开发工程师  
［要求］无。实习全职都可以。只求和我面基，看对眼  
［联系］我的github主页上邮箱 [qiqiboy](https://github.com/qiqiboy)

TouchSlider
===========
> **与 [pageSwitch.js](https://github.com/qiqiboy/pageSwitch) 的区别**  
pageSwitch.js适用场景为全屏切换，即一切一屏，并且在此基础上实现了超过一百种切换效果。而TouchSlider.js则侧重于在滑动效果下，不仅支持全屏切换，还支持不固定尺寸的幻灯切换。  
具体使用请参看各组件所提供的示例。

Tips: v2版为重构版，提高了代码质量，也优化了性能。参数格式有所调整，如果是由旧版本更新，则注意修改调用的参数。

## 如何使用
```javascript
// 首先在页面中引入touchslider.js
// 调用 TouchSlider 方法

var ts=new TouchSlider('container id',{
	duration:600,			//int 页面过渡时间
	direction:1,			//int 页面切换方向，0横向，1纵向
    start:0,				//int 默认显示页面
	align:'center',			//string 对齐方式，left(top) center(middle) right(bottom)
	mouse:true,				//bool 是否启用鼠标拖拽
    mousewheel:false,		//bool 是否启用鼠标滚轮切换
	arrowkey:false,			//bool 是否启用键盘方向切换
	fullsize:true,			//bool 是否全屏幻灯（false为自由尺寸幻灯）
    autoplay:true,	    	//bool 是否自动播放幻灯
	interval:int			//bool 幻灯播放时间间隔
});

//调用方法
ts.prev(); 					//上一张
ts.next();					//下一张
ts.slide(n);				//第n张

ts.play();			    	//播放幻灯
ts.pause();		        	//暂停幻灯

ts.prepend(DOM_NODE);		//前增页面
ts.append(DOM_NODE);		//后增页面
ts.insertBefore(DOM_NODE,index);	//在index前添加
ts.insertAfter(DOM_NODE,index);		//在index后添加
ts.remove(index);			//删除第index页面
ts.isStatic();				//是否静止状态

ts.destroy();				//销毁TouchSlider效果对象

/* 事件绑定
 * event可选值:
 * 
 * before 页面切换前
 * after 页面切换后
 * dragStart 开始拖拽
 * dragMove 拖拽中
 * dragEnd 结束拖拽
 */
ts.on(event,callback);
````

## 兼容性
兼容全平台，包括IE6+

## demo地址
请点击http://u.boy.im/touchslider/
