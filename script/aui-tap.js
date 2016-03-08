/**
* aui-tap.js
* 通过监听tap事件替代click，消除300ms延迟
*/
(function (element, factory) {
    'use strict';
    element.auiTap = factory(element, element.document);
}(typeof window !== 'undefined' ? window : this, function (window, document) {
    'use strict';
    var auiTap = function(){
        this.el = window.document;
        this.moved = false;
        this.startX = 0;
        this.startY = 0;
        this.hasTouchEventOccured = false;
        this.el.addEventListener('touchstart', this, false);
    }
    auiTap.prototype.start = function(e) {
        if (e.type === 'touchstart') {
            this.hasTouchEventOccured = true;
            this.el.addEventListener('touchmove', this, false);
            this.el.addEventListener('touchend', this, false);
            this.el.addEventListener('touchcancel', this, false);
        }
        this.moved = false;
        this.startX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
        this.startY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
    };

    auiTap.prototype.move = function(e) {
        var x = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        var y = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
        if (Math.abs(x - this.startX) > 10 || Math.abs(y - this.startY) > 10) {
            this.moved = true;
        }
    };

    auiTap.prototype.end = function(e) {
        var evt;
        this.el.removeEventListener('touchmove', this, false);
        this.el.removeEventListener('touchend', this, false);
        this.el.removeEventListener('touchcancel', this, false);
        if (!this.moved) {
            // 创建自定义事件
            try {
                evt = new window.CustomEvent('tap', {
                    bubbles: true,
                    cancelable: true
                });
            } catch (e) {
                evt = document.createEvent('Event');
                evt.initEvent('tap', true, true);
            }
            e.stopPropagation();
            if (!e.target.dispatchEvent(evt)) {
                e.preventDefault();
            }
        }
    };
    auiTap.prototype.cancel = function() {
        this.hasTouchEventOccured = false;
        this.moved = false;
        this.startX = 0;
        this.startY = 0;
    };
    auiTap.prototype.destroy = function() {
        this.el.removeEventListener('touchstart', this, false);
        this.el.removeEventListener('touchmove', this, false);
        this.el.removeEventListener('touchend', this, false);
        this.el.removeEventListener('touchcancel', this, false);
    };
    auiTap.prototype.handleEvent = function(e) {
        switch (e.type) {
            case 'touchstart': this.start(e); break;
            case 'touchmove': this.move(e); break;
            case 'touchend': this.end(e); break;
            case 'touchcancel': this.cancel(e); break;
        }
    };
    return auiTap;
}));
new auiTap();