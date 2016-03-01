function loadCalendar() {
    var Cal;

    if (window.Calendar) {
        Cal = window.Calendar;
    } else if (typeof module == 'object' && typeof module.exports == 'object') {
        Cal = require("./calendar");
    } else {
        throw new Error("cant't found Calendar");
    }
    return Cal;
}

var Calendar = loadCalendar();

function mobileSelectDate(config, options) {
    if (!config) {
        config = {};
    }

    if (!options) {
        options = {};
    }

    config.dayClass = "day";
    var PromiseLib = options.PromiseLib || window.Promise;

    if (!PromiseLib) {
        throw new Error("can't find PromiseLib support!");
    }

    var cal = new Calendar(config);
    cal.renderMonth(options.month, options.year, options.displayMonthNum);

    var dayNodes = document.getElementsByClassName("day");
    return new PromiseLib(function(resolve) {
        for(var i= 0, ii=dayNodes.length; i<ii; i++) {
            dayNodes[i].onclick = function() {
                var e = event;
                if (e.srcElement && e.srcElement.attributes["data"] && e.srcElement.attributes["data"].value) {
                    resolve(e.srcElement.attributes["data"].value);
                }
            }
        }
    });
}