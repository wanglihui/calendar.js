/**
 * Created by wlh on 16/2/26.
 */

;(function(){
    function getMonthDays(month, year) {
        if (!year) {
            year = new Date().getFullYear();
        }

        if (!month) {
            month = new Date().getMonth() + 1;
        }

        if (month > 12) {
            month = month - 12;
        }

        if (month == 2 && (year % 4 == 0 && (year % 100 != 0 || year % 400 == 0))) {
            return 29;
        }

        if (month == 2) {
            return 28;
        }

        if ([1, 3, 5, 7, 8, 10, 12].indexOf(month) >=0 ) {
            return 31;
        }

        if ([4, 6, 9, 11].indexOf(month) >= 0 ) {
            return 30;
        }
    }

    function Calendar(options) {
        if (!options) {
            options = {};
        }

        if (!(this instanceof Calendar)) {
            return new Calendar(options);
        }

        this.weekEl = options.weekEl || 'tr';
        this.monthEl = options.monthEl || 'table';
        this.dayEl = options.dayEl || 'td';
        this.dayClass = options.dayClass || 'day';
        this.weekClass = options.weekClass || 'week'
        this.monthClass = options.monthClass || 'month'
        this.weekDayName = options.weekDayName || ["日", "一", "二", "三", "四", "五", "六"];
        this.holiday = options.holiday || {};
        this.isShowMonth = options.isShowMonth || false;
        //this.containerId = options.containerId || 'cal';
        this.PromiseLib = options.PromiseLib || Promise;
        this.show = options.show;
        if (!this.show) {
            var self = this;
            this.show = function(data) {
                var calObj = document.getElementById("cal");
                if (!calObj) {
                    document.getElementsByName("body")[0].appendChild('<div id="cal"></div>');
                }
                document.getElementById("cal").innerHTML = data;
                return new self.PromiseLib(function(resolve) {
                    resolve([]);
                });
            };
        }

    }

    Calendar.prototype.renderDayFn = function(day, month, year) {
        var self = this;
        var data = {};

        if (!day) {
            day = "&nbsp;";
        }

        var key = year + "-" + month + '-' + day;
        if (/\d/.test(day)) {
            data = {data: year + "-" + month + "-" + day};
            var holidayName = self.holiday[key];
            if (holidayName){
                data.isholiday = true;
                day = holidayName;
            }
        }

        return wrapEl(self.dayEl, day, self.dayClass, data);
    }


    Calendar.prototype.oneMonth = function(month, year) {
        var self = this;
        if (!year) {
            year = new Date().getFullYear();
        }

        if (!month) {
            month = new Date().getMonth() + 1;
        }

        var days = getMonthDays(month, year);
        //当月第一天是星期几
        var day = new Date(year, month-1, 1).getDay();
        var lastDay = new Date(days, month-1, year).getDay();

        var idx = 1;
        var container = [];
        if (self.isShowMonth) {
            container.push(wrapEl("h6", year + "年" + month + '月', "monthTitle"))
        }

        container.push(wrapEl2(self.monthEl, false, self.monthClass));

        var week = ["日", "一", "二", "三", "四", "五", "六"].map(function(weekday) {
            return wrapEl(self.dayEl, weekday, 'weekday');
        });

        week = wrapEl(self.weekEl, week.join(""), 'week');
        container.push(week);

        var oneWeek = [];

        for(var i=1; i<=days; i++) {
            if (idx % 7 == 1) {
                oneWeek = [];
                oneWeek.push(wrapEl2(self.weekEl, false, self.weekClass));
            }

            if (i == 1) {
                //渲染空格先
                for(var j=0; j< day; j++) {
                    oneWeek.push(self.renderDay(0, month, year));
                    idx = idx + 1;
                }
            }

            oneWeek.push(self.renderDay(i, month, year));
            idx = idx + 1;

            //补最后空格
            if (i == days) {
                for(var j=0; j<=(7-lastDay+1); j++) {
                    oneWeek.push(self.renderDay(0, month, year));
                    idx = idx + 1;
                }

                oneWeek.push(wrapEl2(self.weekEl, true));
                container.push(oneWeek.join(""));
                break;
            }

            if (idx % 7 == 1) {
                oneWeek.push(wrapEl2(self.weekEl, true));
                container.push(oneWeek.join(""));
            }
        }

        container.push(wrapEl2(self.monthEl, true));
        return container.join("");
    }

    function wrapEl(el, content, cls, options) {
        var openTag = wrapEl2(el, false, cls, options);
        var closeTag = wrapEl2(el, true);
        return openTag + content + closeTag;
    }

    function wrapEl2(el, isClose, cls, options) {
        if (isClose) {
            return '</' + el + '>';
        }

        var ret = '<' + el;
        if (cls) {
            ret += ' class="' + cls + '"'
        }

        if (options) {
            var keys = Object.keys(options);
            for(var i=0, ii=keys.length; i<ii; i++) {
                ret += ' ' + keys[i] + '="' + options[keys[i]] + '" ';
            }
        }

        ret += '>';
        return ret;
    }

    Calendar.prototype.renderDay = function(day, month, year) {
        var self = this;
        var fn = self.renderDayFn;
        var result;
        if (fn && typeof fn == 'function') {
            result = fn.apply(self, [day, month, year]);
        } else {
            throw new Error("can't fond renderDayFn!");
        }
        return result;
    }

    Calendar.prototype.selectDate = function() {
        var self = this;
        var daysList = document.getElementsByClassName(self.dayClass);
        return new self.PromiseLib(function(resolve, reject) {
            for(var i= 0, ii = daysList.length; i<ii; i++) {
                daysList[i].onclick = function() {
                    var e = event;
                    if (e.srcElement && e.srcElement.attributes["data"] && e.srcElement.attributes["data"].value) {
                        resolve(e.srcElement.attributes["data"].value);
                    }
                }
            }
        });
    }

    Calendar.prototype.renderMonth = function(month, year, max) {
        var self = this;
        if (!month) {
            month = new Date().getMonth() + 1;
        }

        if (!year) {
            year = new Date().getFullYear();
        }

        if (!max) {
            max = 1;
        }

        if (typeof year != 'number') {
            year = Number(year);
        }

        if (typeof month != 'number') {
            month = Number(month);
        }

        var ret = [];
        for(var i = 0; i< max; i++) {
            if (month > 12) {
                month = month - 12;
                year = year + 1;
            }
            ret.push(self.oneMonth(month, year));
            month = month + 1;
        }

        if (self.show && typeof self.show == 'function') {
            return self.show(ret.join(""));
        } else {
            return new self.PromiseLib(function(resolve) {
                resolve(ret.join(""));
            });
        }
    }

    var moduleName = Calendar;
    if (typeof module !== 'undefined' && typeof exports === 'object') {
        module.exports = moduleName;
    } else if (typeof define === 'function' && (define.amd || define.cmd)) {
        define(function() { return moduleName; });
    } else {
        this.Calendar = moduleName;
    }
}).call((function() {
    return this || (typeof window !== 'undefined' ? window : global);
})());


