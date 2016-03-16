/*
 * TouchSlider
 * @author qiqiboy
 * @github https://github.com/qiqiboy/touchslider
 */
;
(function(ROOT, struct, undefined){

    "use strict";

    var VERSION='2.0.1';
    var lastTime=0,
        nextFrame=ROOT.requestAnimationFrame            ||
                ROOT.webkitRequestAnimationFrame        ||
                ROOT.mozRequestAnimationFrame           ||
                ROOT.msRequestAnimationFrame            ||
                function(callback){
                    var currTime=+new Date,
                        delay=Math.max(1000/60,1000/60-(currTime-lastTime));
                    lastTime=currTime+delay;
                    return setTimeout(callback,delay);
                },
        cancelFrame=ROOT.cancelAnimationFrame           ||
                ROOT.webkitCancelAnimationFrame         ||
                ROOT.webkitCancelRequestAnimationFrame  ||
                ROOT.mozCancelRequestAnimationFrame     ||
                ROOT.msCancelRequestAnimationFrame      ||
                clearTimeout,
        DOC=ROOT.document,
        divstyle=DOC.createElement('div').style,
        cssVendor=function(){
            var tests="-webkit- -moz- -o- -ms-".split(" "),
                prop;
            while(prop=tests.shift()){
                if(camelCase(prop+'transform') in divstyle){
                    return prop;
                }
            }
            return '';
        }(),
        transition=cssTest('transition'),
        toString=Object.prototype.toString,
        slice=[].slice,
        class2type={},
        event2type={},
        event2code={
            click:4,
            mousewheel:5,
            dommousescroll:5,
            keydown:6,
            resize:7
        },
        POINTERTYPES={
            2:'touch',
            3:'pen',
            4:'mouse',
            pen:'pen'
        },
        STARTEVENT=[],
        MOVEEVENT=[],
        EVENT=function(){
            var ret={},
                states={
                    start:1,
                    down:1,
                    move:2,
                    end:3,
                    up:3,
                    cancel:3
                };
            each("mouse touch pointer MSPointer-".split(" "),function(prefix){
                var _prefix=/pointer/i.test(prefix)?'pointer':prefix;
                ret[_prefix]=ret[_prefix]||{};
                POINTERTYPES[_prefix]=_prefix;
                each(states,function(endfix,code){
                    var ev=camelCase(prefix+endfix);
                    ret[_prefix][ev]=code;
                    event2type[ev.toLowerCase()]=_prefix;
                    event2code[ev.toLowerCase()]=code;
                    if(code==1){
                        STARTEVENT.push(ev);
                    }else{
                        MOVEEVENT.push(ev);
                    }
                });
            });
            each("otransitionend oTransitionEnd webkitTransitionEnd mozTransitionEnd MSTransitionEnd transitionend".split(" "),function(ev){
                STARTEVENT.push(ev);
                event2code[ev.toLowerCase()]=8;
            });
            return ret;
        }(),
        POINTERS={
            touch:{},
            pointer:{},
            mouse:{}
        };

    each("Boolean Number String Function Array Date RegExp Object Error".split(" "),function(name){
        class2type["[object "+name+"]"]=name.toLowerCase();
    });

    function type(obj){
        if(obj==null){
            return obj+"";
        }
        
        return typeof obj=='object'||typeof obj=='function' ? class2type[toString.call(obj)]||"object" :
            typeof obj;
    }
	
    function isArrayLike(elem){
        var tp=type(elem);
        return !!elem && tp!='function' && tp!='string' && (elem.length===0 || elem.length && (elem.nodeType==1 || (elem.length-1) in elem));
    }

    function camelCase(str){
        return (str+'').replace(/^-ms-/, 'ms-').replace(/-([a-z]|[0-9])/ig, function(all, letter){
            return (letter+'').toUpperCase();
        });
    }

    function cssTest(name){
        var prop=camelCase(name),
            _prop=camelCase(cssVendor+prop);
        return (prop in divstyle) && prop || (_prop in divstyle) && _prop || '';
    }

    function isFunction(func){
        return type(func)=='function';
    }

    function pointerLength(obj){
        var len=0,key;
        if(type(obj.length)=='number'){
            len=obj.length;
        }else if('keys' in Object){
            len=Object.keys(obj).length;
        }else{
            for(key in obj){
                if(obj.hasOwnProperty(key)){
                    len++;
                }
            }
        }
        return len;
    }

    function pointerItem(obj,n){
        return 'item' in obj?obj.item(n):function(){
            var i=0,key;
            for(key in this){
                if(i++==n){
                    return this[key];
                }
            }
        }.call(obj,n);
    }
    
    function each(arr, iterate){
        if(isArrayLike(arr)){
            if(type(arr.forEach)=='function'){
                return arr.forEach(iterate);
            }
            var i=0,len=arr.length,item;
            for(;i<len;i++){
                item=arr[i];
                if(type(item)!='undefined'){
                    iterate(item,i,arr);
                }
            }
        }else{
            var key;
            for(key in arr){
                iterate(key,arr[key],arr);
            }
        }
    }

    function children(elem){
        var ret=[];
        each(elem.children||elem.childNodes,function(elem){
            if(elem.nodeType==1){
                ret.push(elem);
            }
        });
        return ret;
    }

    function getStyle(elem,prop){
        var style=ROOT.getComputedStyle&&ROOT.getComputedStyle(elem,null)||elem.currentStyle||elem.style;
        return style[prop];
    }

    function setStyle(elem,props){
        each(props,function(name,value){
            var prop;
            switch(name){
                case 'float':
                    prop=cssTest('cssFloat')?'cssFloat':'styleFloat';
                    break;
                default:
                    prop=camelCase(name);
            }
            try{
                elem.style[prop]=value;
            }catch(e){}
        });
    }

    function addListener(elem,evstr,handler){
        if(type(evstr)=='object'){
            return each(evstr,function(evstr,handler){
                addListener(elem,evstr,handler);
            });
        }
        each(evstr.split(" "),function(ev){
            if(elem.addEventListener){
                elem.addEventListener(ev,handler,false);
            }else if(elem.attachEvent){
                elem.attachEvent('on'+ev,handler);
            }else elem['on'+ev]=handler;
        });
    }

    function offListener(elem,evstr,handler){
        if(type(evstr)=='object'){
            return each(evstr,function(evstr,handler){
                offListener(elem,evstr,handler);
            });
        }
        each(evstr.split(" "),function(ev){
            if(elem.removeEventListener){
                elem.removeEventListener(ev,handler,false);
            }else if(elem.detachEvent){
                elem.detachEvent('on'+ev,handler);
            }else elem['on'+ev]=null;
        });
    }

    function removeRange(){
        var range;
        if(ROOT.getSelection){
            range=getSelection();
            if('empty' in range)range.empty();
            else if('removeAllRanges' in range)range.removeAllRanges();
        }else{
            DOC.selection.empty();
        }
    }

    function EASE(t,b,c,d){
        return -c * ((t=t/d-1)*t*t*t - 1) + b;
    }

    function filterEvent(oldEvent){
        var ev={},
            which=oldEvent.which,
            button=oldEvent.button,
            pointers,pointer;

        each("wheelDelta detail which keyCode".split(" "),function(prop){
            ev[prop]=oldEvent[prop];
        });

        ev.oldEvent=oldEvent;
        
        ev.type=oldEvent.type.toLowerCase();
        ev.eventType=event2type[ev.type]||ev.type;
        ev.eventCode=event2code[ev.type]||0;
        ev.pointerType=POINTERTYPES[oldEvent.pointerType]||oldEvent.pointerType||ev.eventType;

        ev.target=oldEvent.target||oldEvent.srcElement||DOC.documentElement;
        if(ev.target.nodeType===3){
            ev.target=ev.target.parentNode;
        }

        ev.preventDefault=function(){
            oldEvent.preventDefault && oldEvent.preventDefault();
            ev.returnValue=oldEvent.returnValue=false;
        }

        if(pointers=POINTERS[ev.eventType]){
            switch(ev.eventType){
                case 'mouse':
                case 'pointer':
                    var id=oldEvent.pointerId||0;
                    ev.eventCode==3?delete pointers[id]:pointers[id]=oldEvent;
                    break;
                case 'touch':
                    POINTERS[ev.eventType]=pointers=oldEvent.touches;
                    break;
            }

            if(pointer=pointerItem(pointers,0)){
                ev.clientX=pointer.clientX;
                ev.clientY=pointer.clientY;
            }
            
            ev.button=which<4?Math.max(0,which-1):button&4&&1||button&2; // left:0 middle:1 right:2
            ev.length=pointerLength(pointers);
        }

        return ev;
    }

    struct.prototype={
        version:VERSION,
        constructor:struct,
        latestTime:0,
        init:function(config){
            var self=this,
                handler=this.handler=function(ev){
                    self.handleEvent(ev);
                }

            this.events={};
            this.duration=isNaN(parseInt(config.duration))?600:parseInt(config.duration);
            this.direction=parseInt(config.direction)==0?0:1;
            this.current=parseInt(config.start)||0;
            this.mouse=config.mouse==null?true:!!config.mouse;
            this.mousewheel=!!config.mousewheel;
            this.interval=parseInt(config.interval)||5000;
            this.playing=config.autoplay==null?true:!!config.autoplay;
            this.arrowkey=!!config.arrowkey;
            this.fullsize=config.fullsize==null?true:!!config.fullsize;
            this.align=config.align||'center';
            this.pages=children(this.container);
            this.length=this.pages.length;

            this.pageData=[];

            addListener(this.container,STARTEVENT.join(" ")+" click"+(this.mousewheel?" mousewheel DOMMouseScroll":""),handler);
            addListener(DOC,MOVEEVENT.join(" ")+(this.arrowkey?" keydown":""),handler);
            addListener(ROOT,'resize',handler);
            
            each(this.pages,function(page){
                self.pageData.push({
                    cssText:page.style.cssText||''
                });
            });
            this.pageData.container=this.container.style.cssText||'';

            this.on({
                before:function(){clearTimeout(this.playTimer);},
                dragStart:function(){clearTimeout(this.playTimer);removeRange();},
                after:this.firePlay
            }).firePlay();

            this.comment=document.createComment(' Powered by TouchSlider v'+this.version+'  https://github.com/qiqiboy/touchslider ');
            this.container.appendChild(this.comment);

            this.resize();
        },
        resize:function(){
            var self=this,
                type=this.direction?'height':'width',
                pst=getStyle(this.container,'position'),
                css;

            this.size=this.getSize(this.offsetParent=this.container[pst=='absolute'||pst=='fixed'?'offsetParent':'parentNode']||DOC.body);

            css={
                float:'left',
                display:'inline'
            }
            each(this.pages,function(page){
                if(self.fullsize){
                    css[type]=self.size-self.getMarginSize(page)-self.getPaddingSize(page)-self.getBorderSize(page)+'px';
                }
                if(type=='height'){
                    css['clear']='both';
                }
                setStyle(page,css);
            });

            this.total=this.getSum(0,this.length);
            
            css={};
            if(pst=='static'){
                css={position:'relative'};
            }
            css[transition]='none';
            css[type]=this.total+'px';
            css[this.direction?'top':'left']=this.getPos(this.current)+'px';
            cancelFrame(this.timer);
            setStyle(this.container,css);

            clearTimeout(this.playTimer);

            return this.firePlay();
        },
        on:function(ev,callback){
            var self=this;
            if(type(ev)=='object'){
                each(ev,function(ev,callback){
                    self.on(ev,callback);
                });
            }else{
                if(!this.events[ev]){
                    this.events[ev]=[];
                }
                this.events[ev].push(callback);
            }
            return this;
        },
        fire:function(ev){
            var self=this,
                args=slice.call(arguments,1);
            each(this.events[ev]||[],function(func){
                if(isFunction(func)){
                    func.apply(self,args);
                }
            });
            return this;
        },
        isStatic:function(){
            return !this.timer && !this.drag;
        },
        prev:function(){
            return this.slide((this.current-1+this.length)%this.length);
        },
        next:function(){
            return this.slide((this.current+1)%this.length);
        },
        play:function(){
            this.playing=true;
            return this.firePlay();
        },
        firePlay:function(){
            var self=this;
            if(this.playing){
                this.playTimer=setTimeout(function(){
                    self.next();
                },this.interval);
            }
            return this;
        },
        pause:function(){
            this.playing=false;
            clearTimeout(this.playTimer);
            return this;
        },
        slide:function(_index){
            var self=this,
                dir=this.direction,
                stime=+new Date,
                duration=this.duration,
                current=this.current,
                index=Math.min(Math.max(0,_index),this.length-1),
                curSize=this.getSum(index,index+1),
                curPos=parseFloat(getStyle(this.container,dir?'top':'left'))||0,
                type=dir?'top':'left',
                css={},tarPos;
        
            tarPos=this.getPos(index);
            duration*=Math.min(1,Math.abs(tarPos-curPos)/curSize)||10;
            this.current=index;
            this.latestTime=stime+duration;
            this.fire('before',current,index);
            this.end=function(){
                delete self.timer;
                self.fire('after',index,current);
            }
            if(transition){
                this.timer=1;
                css[transition]=type+' '+duration+'ms ease';
                css[type]=tarPos+'px';
                setStyle(this.container,css);
            }else{
                cancelFrame(this.timer);
                ani();
            }

            function ani(){
                var offset=Math.min(duration,+new Date-stime),
                    s=EASE(offset,0,1,duration)
                    cp=(tarPos-curPos)*s+curPos;
                self.container.style[type]=cp+'px';
                if(offset==duration){
                    self.end();
                }else{
                    self.timer=nextFrame(ani);
                }
            }
        },
        handleEvent:function(oldEvent){
            var ev=filterEvent(oldEvent),
                canDrag=ev.button<1&&ev.length<2&&(!this.pointerType||this.pointerType==ev.eventType)&&(this.mouse||ev.pointerType!='mouse');

            switch(ev.eventCode){
                case 2:
                    if(canDrag&&this.rect){
                        var index=this.current,
                            dir=this.direction,
                            rect=[ev.clientX,ev.clientY],
                            _rect=this.rect,
                            offset=rect[dir]-_rect[dir];
                        if(this.drag==null && _rect.toString()!=rect.toString()){
                            this.drag=Math.abs(offset)>=Math.abs(rect[1-dir]-_rect[1-dir]);
                            this.drag && this.fire('dragStart',ev);
                        }
                        if(this.drag){
                            if(!this.pages[index+(offset>0?-1:1)]){
                                offset/=Math.abs(offset)/this.size+2;
                            }
                            this.container.style[dir?'top':'left']=this.startPos+offset+'px';
                            this.fire('dragMove',ev);
                            this._offset=offset;
                            ev.preventDefault();
                        }
                    }
                    break;

                case 1:
                case 3:
                    if(canDrag){
                        var self=this,
                            index=this.current,
                            type=this.direction?'top':'left',
                            isDrag,offset,tm,nn,sub,curPos,tarPos,myWidth;
                        if(ev.length&&(ev.eventCode==1||this.drag)){
                            nn=ev.target.nodeName.toLowerCase();
                            clearTimeout(this.eventTimer);
                            if(!this.pointerType){
                                this.pointerType=ev.eventType;
                            }
                            this.startPos=parseFloat(getStyle(this.container,type))||0;
                            if(transition){
                                this.container.style[transition]='none';
                            }else if(this.timer){
                                cancelFrame(this.timer);
                                delete this.timer;
                            }
                            this.rect=[ev.clientX,ev.clientY];
                            this.time=+new Date;
                            this.container.style[type]=this.startPos+'px';
                            if(ev.eventType!='touch' && (nn=='a' || nn=='img')){
                                ev.preventDefault();
                            }
                        }else if(tm=this.time){
                            offset=this._offset||0;
                            isDrag=this.drag;
                            curPos=this.startPos+offset;
                            tarPos=this.getPos(index);

                            each("rect drag time startPos _offset".split(" "),function(prop){
                                delete self[prop];
                            });

                            if(isDrag){
                                sub=offset>0?1:-1;
                                while(sub*(curPos-tarPos)>this.getOuterSize(this.pages[index])/2&&this.pages[index-sub]){
                                    tarPos=this.getPos(index-=sub);
                                }

                                if(Math.abs(offset)>20&&+new Date-tm<500){
                                    index-=sub;
                                }
                                
                                this.fire('dragEnd',ev);
                                ev.preventDefault();
                            }

                            if(curPos!=tarPos){
                                this.slide(index);
                            }else if(isDrag){
                                this.firePlay();
                            }

                            this.eventTimer=setTimeout(function(){
                                delete self.pointerType;
                            },400);
                        }
                    }
                    break;

                case 4:
                    if(this.timer){
                        ev.preventDefault();
                    }
                    break;

                case 5:
                    ev.preventDefault();
                    if(this.isStatic() && +new Date-this.latestTime>Math.max(1000-this.duration,0)){
                        var wd=ev.wheelDelta||-ev.detail;
                        Math.abs(wd)>=3 && this[wd>0?'prev':'next']();
                    }
                    break;

                case 6:
                    var nn=ev.target.nodeName.toLowerCase();
                    if(this.isStatic() && nn!='input' && nn!='textarea' && nn!='select'){
                        switch(ev.keyCode||ev.which){
                            case 33:
                            case 37:
                            case 38:
                                this.prev();
                                break;
                            case 32:
                            case 34:
                            case 39:
                            case 40:
                                this.next();
                                break;
                            case 35:
                                this.slide(this.length-1);
                                break;
                            case 36:
                                this.slide(0);
                                break;
                        }
                    }
                    break;

                case 7:
                    this.resize();
                    break;

                case 8:
                    if(oldEvent.propertyName==(this.direction?'top':'left')){
                        this.container.style[transition]='none';
                        this.end();
                    }
                    break;
            }
        },
        getSum:function(from,to){
            var sum=0;
            while(from<to){
                sum+=this.getOuterSize(this.pages[from++],true);
            }
            return sum;   
        },
        getPos:function(index){
            var type=this.direction?'Top':'Left',
                myWidth=this.getOuterSize(this.pages[index],true),
                sum=this.getSum(0,index)+this['getMargin'+type+'Size'](this.container)+this['getBorder'+type+'Size'](this.container);

            switch(this.align){
                case 'top':
                case 'left':
                    return -sum;
                case 'bottom':
                case 'right':
                    return this.size-myWidth-sum;
                default:
                    return (this.size-myWidth)/2-sum;
            }
        },
        getOuterSize:function(elem,withMargin){
            return elem[this.direction?'offsetHeight':'offsetWidth']+(withMargin?this.getMarginSize(elem):0);
        },
        getInnerSize:function(elem){
            return this.getOuterSize(elem)-this.getBorderSize(elem);
        },
        getSize:function(elem){
            return elem[this.direction?'offsetHeight':'offsetWidth']-this.getPaddingSize(elem)-this.getBorderSize(elem);
        },
        destroy:function(){
            var pageData=this.pageData;

            offListener(this.container,STARTEVENT.join(" ")+" click"+(this.mousewheel?" mousewheel DOMMouseScroll":""),this.handler);
            offListener(DOC,MOVEEVENT.join(" ")+(this.arrowkey?" keydown":""),this.handler);
            offListener(ROOT,'resize',this.handler);

            each(this.pages,function(page,index){
                page.style.cssText=pageData[index].cssText;
            });

            this.container.style.cssText=pageData.container;
            this.container.removeChild(this.comment);
            this.length=0;
            
            return this.pause();
        },
        refresh:function(){
            this.pages=children(this.container);
            this.length=this.pages.length;
            this.current=Math.max(Math.min(this.length-1,this.current),0);
            return this.resize();
        },
        append:function(elem,index){
            if(null==index){
                index=this.pages.length;
            }
            this.pageData.splice(index,0,{
                cssText:elem.style.cssText||''
            });
            this.container.insertBefore(elem,this.pages[index]||null);

            return this.refresh();
        },
        prepend:function(elem){
            return this.append(elem,0);
        },
        insertBefore:function(elem,index){
            return this.append(elem,index-1);
        },
        insertAfter:function(elem,index){
            return this.append(elem,index+1);
        },
        remove:function(index){
            this.container.removeChild(this.pages[index]);
            this.pageData.splice(index,1);

            return this.refresh();
        }
    }


    each("margin padding border".split(" "),function(type){
        each("Top Left Right Bottom".split(" "),function(dir){
            var prop=type+dir;
            struct.prototype[camelCase('get-'+prop)+'Size']=function(elem){
                return parseFloat(getStyle(elem,prop+(type=='border'?'Width':'')))||0;
            }
        });
        struct.prototype[camelCase('get-'+type)+'Size']=function(elem){
            return this[camelCase('get-'+type)+(this.direction?'Top':'Left')+'Size'](elem)+this[camelCase('get-'+type)+(this.direction?'Bottom':'Right')+'Size'](elem);
        }
    });

    if(typeof define=='function' && define.amd){
        define('TouchSlider',function(){
            return struct;
        });
    }else ROOT.TouchSlider=struct;

})(window, function(wrap,config){
    if(!(this instanceof arguments.callee)){
        return new arguments.callee(wrap,config);
    }

    this.container=typeof wrap=='string'?document.getElementById(wrap):wrap;
    this.init(config||{});
});
