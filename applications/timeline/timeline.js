(function() {
    var timeline = {
        "MLC Online" : {
            range : {
                start : new Date("02/01/2011"),
                finish : new Date()
            },
            type : "work",
            color: 'rgb(149,16,34)',
            description: 'position: Analyst Programmer'
        },
        "Solitary Restaurant" : {
            range : {
                start : new Date("03/01/2009"),
                finish : new Date("03/01/2011")
            },
            type : "work",
            color: 'rgb(85,157,229)',
            description: 'position: Food and Beverage Attendent'
        },
        "Fairmont Resort Leura" : {
            range : {
                start : new Date("12/01/2005"),
                finish : new Date("01/01/2009")
            },
            type : "work",
            color: 'rgb(116,94,139)',
            description: 'position: Food and Beverage Attendent'
        },
        "B.Sci IT" : {
            range : {
                start : new Date("03/01/2009"),
                finish : new Date()
            },
            type : "education",
            color: 'rgb(227,167,31)',
            description: 'major: Enterprise Systems Development'
        },
        "Dip Professional Practice" : {
            range : {
                start : new Date("03/01/2011"),
                finish : new Date("12/01/2011")
            },
            type : "education",
            color: 'rgb(166,0,251)',
            description: 'N/A'
        },
        "B.Science" : {
            range : {
                start : new Date("03/01/2006"),
                finish : new Date("12/01/2008")
            },
            type : "education",
            color: 'rgb(70,170,169)',
            description:'major: Medical Science'
        },
        "Team Treehouse" : {
            range : {
                start : new Date("11/24/2011"),
                finish : new Date()
            },
            type : "education",
            color : 'rgb(107,170,32)',
            description:'<a href="https://teamtreehouse.com/nathanaelmowbray">https://teamtreehouse.com/nathanaelmowbray</a>'
        }
    };

    var ROW_HEIGHT = 35;
    var SCALE = 140;
    var currentRow = 0;
    var today = new Date();
    var todayEnum = factor(today);
    var lastMountain;
    var root = $('#timeline');

    var thisYear = new Date("01/01/" + (new Date().getFullYear() + 1));
    for (var i = 12; i > 6; i--) {
        thisYear = new Date("01/01/" + (thisYear.getFullYear() - 1));
        root.append('<div class="timejump" style="left:' + (todayEnum - factor(thisYear)) + 'px;"><h1>' + thisYear.getFullYear() + '</h1></div>');
    }

    for (var item in timeline) {
        lastMountain = root.last('div');
        var left = lastMountain.css('left');
        left = left ? left.match(/[0-9]*/)[0] : 0;
        if (left + lastMountain.width() > todayEnum - factor(timeline[item].range.finish)) {
            currentRow = currentRow + ROW_HEIGHT;
        }
        root.append('<div class="range" style="background-color: '+timeline[item].color+';width: '+ (factor(timeline[item].range.finish) - factor(timeline[item].range.start)) +'px; top: '+currentRow+'px;left:'+ (todayEnum - factor(timeline[item].range.finish)) +'px;"><h1>'+item+'</h1><p>'+timeline[item].description+'</p></div>');
    }

    function factor(date) {
        return Math.round((date.getYear() + date.getMonth() / 12) * SCALE);
    }
}());