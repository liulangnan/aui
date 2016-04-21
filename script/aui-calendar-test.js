/*
 * AUI JAVASCRIPT PLUGIN
 * 日历组件 aui-calendar
 * v 0.0.1
 * Copyright (c) 2015 auicss.com @流浪男  QQ：343757327  群：344869952
 */
(function(window){
    "use strict";
    var todayDate = new Date();
    var  beforeStartDateClick = false;
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
    calendar.prototype.options = {
        container:'',
        width:'',
        height:'',
        startDate: todayDate.getFullYear()+'-'+(todayDate.getMonth()+1)+'-'+todayDate.getDate(),
        endDate: (todayDate.getFullYear())+'-'+(todayDate.getMonth()+5),
        lunarShow:true
    };
    calendar.prototype._init = function(options) {
        extend(this.options, options);
        if(!this.options.container || this.options.container == ''){
            return;
        }
        if(!this.options.startDate || this.options.startDate == ''){
            this._startDate = todayDate.getFullYear()+'-'+(todayDate.getMonth()+1);
        }else{
            this._startDate = this.options.startDate;
        }
        if(!this.options.endDate || this.options.endDate == ''){
            this._endDate = this._startDate;
        }else{
            this._endDate = this.options.endDate;
        }
        var tableContainer = this.options.container;

        var tableHtml = '';
        var startDate = this._startDate.split('-');
        var startYear = parseFloat(startDate[0]);
        var startMonth = parseFloat(startDate[1]);

        var endDate = this._endDate.split('-');
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
                        tableHtml += '<tr class="aui-text-primary" data-year="'+i+'" data-month="'+ii+'">'+this._createWeek()+'</tr>';
                        tableHtml += '</thead>';
                        tableHtml += '<tbody class="aui-calendar-body">';
                        tableHtml += this._createDay(i,''+(ii+1)+'');
                        tableHtml += '</tbody>';
                    tableHtml += '</table>';
                }
            }
        }
        tableContainer.innerHTML = tableHtml;
    }
    // 月份为一位时自动补全0
    calendar.prototype._foo = function(str){
        str ='0'+str;
        return str.substring(str.length-2,str.length);
    }
    // 创建顶部星期
    calendar.prototype._createWeek = function(){
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
    calendar.prototype._createDay = function(year,month){
        var self = this;
        console.log(self._startDate);
        var html = '',
            s = 0,
            d = 1,
            _d = 1;
        // 开始日期有传入天时计算
        if(this._startDate.split('-').length > 2 && year == parseFloat(this._startDate.split('-')[0]) && month == parseFloat(this._startDate.split('-')[1])){
            _d = parseFloat(this._startDate.split('-')[2]);
        }
        var firstDay = this._getFirstDay(year,month);
        // 当结束日期有传入天时计算
        if(this._endDate.split('-').length > 2 && year == parseFloat(this._endDate.split('-')[0]) && month == parseFloat(this._endDate.split('-')[1])){
            var monthLen = parseFloat(this._endDate.split('-')[2]);
            if(this._getMonthLen(year,month) < monthLen){
                monthLen =this._getMonthLen(year,month);
            }
        }else{
            var monthLen = this._getMonthLen(year,month);
        }
        for (var row = 0; row < 6; row++){
            html += '<tr>';
                for (var col = 0; col < 7; col++) {
                    if(s >= firstDay && d <= monthLen){
                        if(_d > d & beforeStartDateClick == false){
                            html += '<td date="'+year+'-'+this._foo(month)+'-'+this._foo(d)+'" class="before-day" click-status="'+beforeStartDateClick+'">';
                        }else{
                            if(col==0 || col==6){
                                html += '<td date="'+year+'-'+this._foo(month)+'-'+this._foo(d)+'" class="aui-text-danger">';
                            }else{
                                html += '<td date="'+year+'-'+this._foo(month)+'-'+this._foo(d)+'" class="aui-text-primary">';
                            }
                        }
                        // 判断是否为今天
                        if(this._getToday(year,month,d)){
                            html += '<div class="today"></div>' + d;
                        }else{
                            html += d;
                        }
                        // 农历
                        if(this.options.lunarShow){
                            html += '<p>'+this._getLunarDay(''+year+'-'+this._foo(month)+'-'+this._foo(d)+'')+'</p>';
                        }
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
    calendar.prototype._getMonthLen = function (year,month){
        month = parseInt(month, 10);
        var monthLen = new Date(year, month, 0);
        return monthLen.getDate();
    }
    // 获取今天日期
    calendar.prototype._getToday = function(year,month,date){
        if(year == todayDate.getFullYear() && month == todayDate.getMonth()+1 && date == todayDate.getDate()){
            return true;
        }else {
            return false;
        }
    }
    // 获取月第一天
    calendar.prototype._getFirstDay = function(year,month){ //获取每个月第一天再星期几，月份减一
        month = parseInt(month, 10)-1;
        var firstDay = new Date(year,month,1);
        return firstDay.getDay();
    }
    // 农历的组装
    calendar.prototype._getBit = function(m,n){
        return (m>>n)&1;
    }
    calendar.prototype._e2c = function(){
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
                if(total<=29 + this._getBit(calendarData[m],n)){
                    isEnd = true; break;
                }
                total = total-29-this._getBit(calendarData[m],n);
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
    //农历组装
    calendar.prototype._getcDateString = function (){
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
    calendar.prototype._getLunarDay = function (data){
        var d = data.split('-');
        var solarYear = d[0];
        var solarMonth = d[1];
        var solarDay = d[2];
        if (solarYear < 100) solarYear = "19" + solarYear;
        if(solarYear < 1921 || solarYear > 2020){
            return "";
        }else{
            solarMonth = (parseInt(solarMonth) > 0) ? (solarMonth - 1) : 11;
            this._e2c(solarYear,solarMonth,solarDay);
            return this._getcDateString();
        }
    }
    function calendar (options) {
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
    window.auiCalendar = calendar;
})(window);


