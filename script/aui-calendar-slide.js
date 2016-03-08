/*
 * AUI JAVASCRIPT PLUGIN
 * 日历组件-上下滚动 aui-calendar
 * v 0.0.1
 * Copyright (c) 2015 auicss.com @流浪男  QQ：343757327  群：344869952
 */
(function(window){
    var aui = {};
    aui.calendar = function(element,opts,callback){
        var todayDate = new Date();
        var _startDate = '',
            _endDate = '',
            beforeStartDateClick = false;
        var _weekArr = "日,一,二,三,四,五,六",
            _monthArr = new Array ('1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月');
        var calendarData = new Array(100);
        var madd = new Array(12);
        var numString = "一二三四五六七八九十";
        var monString = "正二三四五六七八九十冬腊";
        var cYear,cMonth,cDay,TheDate;
        calendarData = new Array(0xA4B,0x5164B,0x6A5,0x6D4,0x415B5,0x2B6,0x957,0x2092F,0x497,0x60C96,0xD4A,0xEA5,0x50DA9,0x5AD,0x2B6,0x3126E, 0x92E,0x7192D,0xC95,0xD4A,0x61B4A,0xB55,0x56A,0x4155B, 0x25D,0x92D,0x2192B,0xA95,0x71695,0x6CA,0xB55,0x50AB5,0x4DA,0xA5B,0x30A57,0x52B,0x8152A,0xE95,0x6AA,0x615AA,0xAB5,0x4B6,0x414AE,0xA57,0x526,0x31D26,0xD95,0x70B55,0x56A,0x96D,0x5095D,0x4AD,0xA4D,0x41A4D,0xD25,0x81AA5,0xB54,0xB6A,0x612DA,0x95B,0x49B,0x41497,0xA4B,0xA164B, 0x6A5,0x6D4,0x615B4,0xAB6,0x957,0x5092F,0x497,0x64B, 0x30D4A,0xEA5,0x80D65,0x5AC,0xAB6,0x5126D,0x92E,0xC96,0x41A95,0xD4A,0xDA5,0x20B55,0x56A,0x7155B,0x25D,0x92D,0x5192B,0xA95,0xB4A,0x416AA,0xAD5,0x90AB5,0x4BA,0xA5B, 0x60A57,0x52B,0xA93,0x40E95);
        madd[0] = 0;
        madd[1] = 31;
        madd[2] = 59;
        madd[3] = 90;
        madd[4] = 120;
        madd[5] = 151;
        madd[6] = 181;
        madd[7] = 212;
        madd[8] = 243;
        madd[9] = 273;
        madd[10] = 304;
        madd[11] = 334;
        if(!opts.startDate || opts.startDate == ''){
            _startDate = todayDate.getFullYear()+'-'+(todayDate.getMonth()+1);
        }else{
            _startDate = opts.startDate;
        }
        if(!opts.endDate || opts.endDate == ''){
            _endDate = _startDate;
        }else{
            _endDate = opts.endDate;
        }
        beforeStartDateClick = opts.beforeStartDateClick?opts.beforeStartDateClick:beforeStartDateClick;
        var _init = function(){
            var tableHtml = '';
            var startDate = _startDate.split('-');
            var startYear = parseFloat(startDate[0]);
            var startMonth = parseFloat(startDate[1]);

            var endDate = _endDate.split('-');
            var endYear = parseFloat(endDate[0]);
            var endMonth = parseFloat(endDate[1]);
            // 判断年开始、结束
            if(startYear == endYear){
                if(startMonth > endMonth){// 当为同一年时，如果开始月大于结束月返回错误
                    return false;
                }else{
                    var yearLen = startYear;
                }
            }else if(endYear > startYear){
                var yearLen = startYear + (endYear - startYear);
            }else{
                return false;
            }
            // 生成日历
            for (var i = startYear; i <= yearLen; i++) {
                if(startYear != i){
                    startMonth = 0;
                }else {
                    startMonth = startMonth-1;
                }
                for (var ii = startMonth; ii < 12; ii++) {
                    if(endYear == i && ii >= endMonth){
                        tableHtml += '';
                    }else{
                        tableHtml += '<table>';
                            tableHtml += '<thead class="aui-calendar-header">';
                            tableHtml += '<tr>';
                                tableHtml += '<th class="aui-calendar-title aui-text-primary" colspan="7">'+i+'年'+_monthArr[ii]+'</th>';
                            tableHtml += '</tr>';
                            tableHtml += '<tr class="aui-text-primary" data-year="'+i+'" data-month="'+ii+'">'+_createWeek()+'</tr>';
                            tableHtml += '</thead>';
                            tableHtml += '<tbody class="aui-calendar-body">';
                            tableHtml += _createDay(i,''+(ii+1)+'');
                            tableHtml += '</tbody>';
                        tableHtml += '</table>';
                    }
                }
            }
            if(element.innerHTML = tableHtml){
                _callBack();
                aui.sliderUp(element);
            }
        }
        // 返回处理
        var _callBack = function(){
            var ret = {};
            var tdList = document.querySelectorAll("tbody td");
            for (var i = 0; i < tdList.length; i++) {
                if(tdList[i].getAttribute('date')){
                    tdList[i].addEventListener('tap',function(e){
                        var clickStatus = this.getAttribute("click-status");
                        if(clickStatus == 'false'){
                            return;
                        }
                        if(document.querySelector("td .active")){
                            var activeDom = document.querySelector("td .active");
                            activeDom.parentNode.removeChild(activeDom);
                        }
                        this.insertAdjacentHTML('beforeend', '<div class="active"></div>');
                        ret['status'] = 'success';
                        ret['date'] = this.getAttribute('date');
                        callback(ret);
                    })
                }
            }
        }
        // 月份为一位时自动补全0
        var _foo = function(str){
            str ='0'+str;
            return str.substring(str.length-2,str.length);
        }
        // 创建顶部星期
        var _createWeek = function(){
            var html = '';
            var week = _weekArr.split(',');
            for (var i = 0; i < week.length; i++) {
                if(i == 0 || i == 6){
                    html += '<th class="aui-text-danger">';
                }else{
                    html += '<th class="aui-text-primary">';
                }
                html += week[i];
                html += '</th>';
            }
            return html;
        }
        // 创建日历天
        var _createDay = function(year,month){
            var html = '',
                s = 0,
                d = 1,
                _d = 1;
            // 开始日期有传入天时计算
            if(_startDate.split('-').length > 2 && year == parseFloat(_startDate.split('-')[0]) && month == parseFloat(_startDate.split('-')[1])){
                _d = parseFloat(_startDate.split('-')[2]);
            }
            var firstDay = _getFirstDay(year,month);
            // 当结束日期有传入天时计算
            if(_endDate.split('-').length > 2 && year == parseFloat(_endDate.split('-')[0]) && month == parseFloat(_endDate.split('-')[1])){
                var monthLen = parseFloat(_endDate.split('-')[2]);
                if(_getMonthLen(year,month) < monthLen){
                    monthLen = _getMonthLen(year,month);
                }
            }else{
                var monthLen = _getMonthLen(year,month);
            }
            for (var row = 0; row < 6; row++){
                html += '<tr>';
                    for (var col = 0; col < 7; col++) {
                        if(s >= firstDay && d <= monthLen){
                            if(_d > d & beforeStartDateClick == false){
                                html += '<td date="'+year+'-'+_foo(month)+'-'+_foo(d)+'" class="before-day" click-status="'+beforeStartDateClick+'">';
                            }else{
                                if(col==0 || col==6){
                                    html += '<td date="'+year+'-'+_foo(month)+'-'+_foo(d)+'" class="aui-text-danger">';
                                }else{
                                    html += '<td date="'+year+'-'+_foo(month)+'-'+_foo(d)+'" class="aui-text-primary">';
                                }
                            }
                            // 判断是否为今天
                            if(_getToday(year,month,d)){
                                html += '<div class="today"></div>' + d;
                            }else{
                                html += d;
                            }
                            // 农历
                            html += '<p>'+_getLunarDay(''+year+'-'+_foo(month)+'-'+_foo(d)+'')+'</p>';
                            d++;
                        }else{
                            html += '<td>';
                        }
                        html += '</td>';
                        s++;
                    }
                html += '</tr>';
                firstDay = firstDay+row;
            }
            return html;
        }
        // 获取当月天数
        var _getMonthLen = function (year,month){
            month = parseInt(month, 10);
            var monthLen = new Date(year, month, 0);
            return monthLen.getDate();
        }
        // 获取今天日期
        var _getToday = function(year,month,date){
            if(year == todayDate.getFullYear() && month == todayDate.getMonth()+1 && date == todayDate.getDate()){
                return true;
            }else {
                return false;
            }
        }
        // 获取月第一天
        var _getFirstDay = function(year,month){ //获取每个月第一天再星期几，月份减一
            month = parseInt(month, 10)-1;
            var firstDay = new Date(year,month,1);
            return firstDay.getDay();
        }
        // 农历的组装
        var _getBit = function(m,n){
            return (m>>n)&1;
        }
        var _e2c = function(){
            TheDate = (arguments.length!=3) ? new Date() : new Date(arguments[0],arguments[1],arguments[2]);
            var total,m,n,k;
            var isEnd = false;
            var tmp = TheDate.getYear();
            if(tmp < 1900){
                tmp += 1900;
            }
            total = (tmp-1921)*365+Math.floor((tmp-1921)/4)+madd[TheDate.getMonth()]+TheDate.getDate()-38;

            if(TheDate.getYear()%4 == 0 && TheDate.getMonth() > 1) {
                total++;
            }
            for(m = 0;;m++){
                k = (calendarData[m]<0xfff)?11:12;
                for(n=k;n>=0;n--){
                    if(total<=29 + _getBit(calendarData[m],n)){
                        isEnd = true; break;
                    }
                    total = total-29-_getBit(calendarData[m],n);
                }
                if(isEnd) break;
            }
            cYear = 1921 + m;
            cMonth = k-n+1;
            cDay = total;
            if(k == 12){
                if(cMonth == Math.floor(calendarData[m]/0x10000)+1){
                    cMonth = 1-cMonth;
                }
                if(cMonth > Math.floor(calendarData[m]/0x10000)+1){
                    cMonth--;
                }
            }
        }

        var _getcDateString = function (){
            var tmp = "";
            if(cDay == 1){
                if(cMonth < 1){
                    tmp += "闰";
                    tmp += monString.charAt(-cMonth-1)
                }else{
                    tmp += monString.charAt(cMonth-1);
                }
                 tmp+="月";
            }else{
                // tmp += monString.charAt(-cMonth-1);
                tmp += (cDay == 20) ? "二十" : ((cDay < 11) ? "初" : ((cDay < 20) ? "十" : ((cDay < 30) ? "廿" : "三十")));
                if (cDay%10 != 0||cDay == 10){
                    tmp += numString.charAt((cDay-1)%10);
                }
            }
            return tmp;
        }
        var _getLunarDay = function (data){
            var d = data.split('-');
            var solarYear = d[0];
            var solarMonth = d[1];
            var solarDay = d[2];
            if (solarYear < 100) solarYear = "19" + solarYear;
            if(solarYear < 1921 || solarYear > 2020){
                return "";
            }else{
                solarMonth = (parseInt(solarMonth) > 0) ? (solarMonth - 1) : 11;
                _e2c(solarYear,solarMonth,solarDay);
                return _getcDateString();
            }
        }
        _init();
    }
    // 动画组件
    aui.sliderUp = function(element,callback){
        var wrap = element;
        var outer = element;
        var lis = $api.domAll('table');
        var len = $api.domAll('table').length;
        console.log(window.innerWidth);
        var _init = function(){
            this.winW = window.innerWidth;
            this.winH = window.innerHeight;
            this.initIndex = 0;
            var header = this.header;
            for(var i = 0; i < len; i++){
                lis[i].style.webkitTransform = 'translate3d(0, '+i*this.winH+'px, 0)';
                lis[i].style.zIndex = len - i;
                lis[i].style.width = (window.innerWidth-30) + 'px';
            }
            outer.style.cssText = 'width:' + this.winW +'px';
            wrap.style.height = this.winH + 'px';
        }
        var _bindDom = function(){
            var self = this,
                winH = self.winH;
            //手指按下的处理事件
            var startHandler = function(e){
                e.preventDefault();
                self.startTime = new Date() * 1;
                self.startY = e.touches[0].pageY;
                self.offsetY = 0;
                var target = e.target;
                //如果点击的不是li也不是body
                while(target.nodeName != 'table' && target.nodeName != 'BODY'){
                    target = target.parentNode;
                }
                self.target = target;
            };

            //手指移动的处理事件
            var moveHandler = function(e){
                e.preventDefault();
                self.offsetY = e.targetTouches[0].pageY - self.startY;
                var i = self.initIndex - 1;
                var m = i + 3;
                if (self.offsetY > 0) {//down
                    for(i; i < m; i++){
                        //当前移动时不要动画
                        lis[i] && (lis[i].style.webkitTransition = '-webkit-transform 0s ease-out');
                        if (i == self.initIndex + 1) {
                            lis[i] && (lis[i].style.zIndex = 887);
                            lis[i] && (lis[i].style.webkitTransform = 'translate3d(0, '+((i-self.initIndex)*self.winH + self.offsetY)+'px, 0)');
                        }
                        if (i == self.initIndex) {
                            lis[i] && (lis[i].style.zIndex = 888);
                            lis[i] && (lis[i].style.webkitTransform = 'translate3d(0, '+((i-self.initIndex)*self.winH + self.offsetY*0.3)+'px, 0) scale('+ (1-(self.offsetY/(self.winH*3.5))) +')');
                        }
                        if (i == self.initIndex - 1) {
                            lis[i] && (lis[i].style.zIndex = 889);
                            lis[i] && (lis[i].style.webkitTransition = '-webkit-transform 0.1s ease-out');
                            lis[i] && (lis[i].style.webkitTransform = 'translate3d(0, '+((i-self.initIndex)*self.winH + self.offsetY + 50)+'px, 0)');
                        }
                    }
                } else {//up
                    //当前移动时不要动画
                    for(i; i < m; i++){
                        //当前移动时不要动画
                        lis[i] && (lis[i].style.webkitTransition = '-webkit-transform 0s ease-out');
                        if (i == self.initIndex + 1) {
                            lis[i] && (lis[i].style.zIndex = 889);
                            lis[i] && (lis[i].style.webkitTransition = '-webkit-transform 0.1s ease-out');
                            lis[i] && (lis[i].style.webkitTransform = 'translate3d(0, '+((i-self.initIndex)*self.winH + self.offsetY - 50)+'px, 0)');
                        }
                        if (i == self.initIndex) {
                            lis[i] && (lis[i].style.zIndex = 888);
                            lis[i] && (lis[i].style.webkitTransform = 'translate3d(0, '+((i-self.initIndex)*self.winH + self.offsetY*0.3)+'px, 0) scale('+ (1+(self.offsetY/(self.winH*3.5))) +')');
                        }
                        if (i == self.initIndex - 1) {
                            lis[i] && (lis[i].style.zIndex = 887);
                            lis[i] && (lis[i].style.webkitTransform = 'translate3d(0, '+((i-self.initIndex)*self.winH + self.offsetY)+'px, 0)');
                        }
                    }
                }
            };

            //手指抬起的处理事件
            var endHandler = function(e){
                e.preventDefault();
                var boundary = winH/5;
                var endTime = new Date() * 1;
                if(endTime - self.startTime > 300){
                    if(self.offsetY >= boundary){
                        _goIndex('-1');
                    }else if(self.offsetY < 0 && self.offsetY < -boundary){
                        _goIndex('+1');
                    }else{
                        _goIndex('0');
                    }
                }else{
                    //快速滑动翻页
                    if(self.offsetY > 50){
                        _goIndex('-1');
                    }else if(self.offsetY < -50){
                        _goIndex('+1');
                    }else{
                        _goIndex('0');
                    }
                }
            };

            //绑定事件
            outer.addEventListener('touchstart', startHandler);
            outer.addEventListener('touchmove', moveHandler);
            outer.addEventListener('touchend', endHandler);
        }
        var _goIndex = function(n){
            var initIndex = this.initIndex,
                currIndex;
            if(typeof n == 'number'){
                currIndex = initIndex;
            }else if(typeof n == 'string'){
                currIndex = initIndex + n*1;
            }
            if(currIndex > len-1){
                currIndex = len - 1;
            }else if(currIndex < 0){
                currIndex = 0;
            }

            //保留当前索引值
            this.initIndex = currIndex;
            //改变过渡的方式，从无动画变为有动画
            lis[currIndex].style.webkitTransition = '-webkit-transform 0.2s ease-out';
            lis[currIndex-1] && (lis[currIndex-1].style.webkitTransition = '-webkit-transform 0.2s ease-out');
            lis[currIndex+1] && (lis[currIndex+1].style.webkitTransition = '-webkit-transform 0.2s ease-out');

            //改变动画后所应该的位移值
            lis[currIndex].style.webkitTransform = 'translate3d(0, 0, 0)';
            lis[currIndex-1] && (lis[currIndex-1].style.webkitTransform = 'translate3d(0, '+-this.winH+'px, 0)');
            lis[currIndex+1] && (lis[currIndex+1].style.webkitTransform = 'translate3d(0, '+this.winH+'px, 0)');
        }
        _init();
        _bindDom();
    }
    window.$aui = aui;
})(window);


