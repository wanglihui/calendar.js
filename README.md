# calendar.js

可以追加节假日的日历，任意月份显示，任意显示多个月份


### usage

```
    var options = {};
    var cal = new Calendar(options);
    var showMonthNum = 12;  //显示12个月
    var month = 2;
    var year = 2016;
    cal.renderMonth(month, year, showMonthNum);


    options可选项:
        weekEl 周标签 //默认 'tr';
        monthEl 月标签 //默认 'table';
        dayEl 日标签 //默认 'td';
        dayClass 每日样式 //默认 'day';
        weekClass 每周样式 //默认 'week'
        monthClass 月份样式 //默认 'month'
        weekDayName 通过此参数个性化月份头部, //默认 ["日", "一", "二", "三", "四", "五", "六"];
        holiday  通过此参数注入节假日数据:如{"2016-2-7": "除夕", "2016-2-8": "春节"} //默认 {};
        isShowMonth 是否显示当前年月,如"2016年2月"//默认 false;
```

### [example](./src/example.html)

### 版本说明
---

```
    1.0.0 仅显示月份
    2.0.0 注入了如何渲染页面以及支持了promise操作

    2.0.0使用如下:
    var cal = new Calender().renderMonth(2, 2016, 12)
        .then(function() {
            return selectDate();
        })
        .then(function(date) {
            console.info("选择的日期是:", date);
        });
```
