/**
 * Created by wlh on 16/2/26.
 */

var Calendar = require("../lib/calendar");

var cal = new Calendar({
    show: function(data) {
        console.info(data);
    }
});

cal.renderMonth(2, 2016, 2);