/*
 * AUI JAVASCRIPT PLUGIN
 * 瀑布流
 * v 0.0.1
 * Copyright (c) 2015 auicss.com @流浪男  QQ：343757327  群：344869952
 */
(function(window){
    var aui = {};
    aui.isElement = function(obj){
        return !!(obj && obj.nodeType == 1);
    };
    aui.waterfall = function(el,opts){
        var col=2,
            padding=15,
            space=15;
    	if(!aui.isElement(el)){
            console.warn('$api.prev Function need el param, el param must be DOM Element');
            return;
        }
        var _setting = function(){
            col = opts.col?opts.col:col;
            padding = opts.padding?opts.padding:padding;
            space = opts.space?opts.space:space;
        }
        var _init = function(){
            var el_w = $api.offset(el).w;
            var list_w = (el_w/col)-padding-space;

            $api.css(el,'-webkit-column-width:'+list_w+'px;-webkit-column-count: '+col+';padding:'+padding+'px;-webkit-column-gap:'+space+'px;');
            
        }
        _setting();
        _init();
        
    }
    window.$aui = aui;

})(window);


