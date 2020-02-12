(function () {
    'use strict';

    function ClockController(dateTimeDao, timeElement) {

        var format = 12, interval, intervalLength = 1000, ampm = false;

        function update(element, value) {
            if (element) {
                element.innerHTML = value;
                // TODO: throw exception if no target element.
            }
        }

        function start() {
            update(timeElement, dateTimeDao.getTime(format, ampm));
            interval = setInterval(function () {
                update(timeElement, dateTimeDao.getTime(format, ampm));
            }, intervalLength);
        }

        function stop() {
            clearInterval(interval);
        }

        update(timeElement, dateTimeDao.getTime(format, ampm));

        return {
            format: format,
            ampm: ampm,
            start: start,
            stop: stop
        };
    }

    function DateController(dateTimeDao, dateElement) {

        var interval, intervalLength = 1000;

        function update(element, value) {
            if (element) {
                element.innerHTML = value;
                // TODO: throw exception if no target element.
            }
        }

        function start() {
            update(dateElement, dateTimeDao.getDate());
            interval = setInterval(function () {
                update(dateElement, dateTimeDao.getDate());
            }, intervalLength);
        }

        function stop() {
            clearInterval(interval);
        }

        update(dateElement, dateTimeDao.getDate());

        return {
            start: start,
            stop: stop
        };
    }

    function ApplicationIcon(name, iconPath) {
        var view = window.document.createElement('div'), icon = window.document.createElement('div'), label = window.document.createElement('div'), image = window.document.createElement('image');
        view.className = 'applicationIcon';
        icon.className = 'icon';
        icon.style.background = 'url(' + iconPath + ')';
        icon.innerHTML = '<svg class="iconReflection" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><circle cx="35" cy="-40" r="70" style="fill:url(#iconReflectionGradient);"/></svg>';
        label.className = 'label';
        label.innerHTML = '<span>' + name + '</span>';
        view.appendChild(icon);
        view.appendChild(label);

        $(view).click(function () {
            var event = $.Event('Launch');
            event.application = name;
            $(this).trigger(event);
        });

        return {
            view: view
        };
    }

    function Gradients() {

        var storedGradients = [], iterator = 0;

        function add(gradient) {
            storedGradients.push(gradient);
        }

        function getPrevious() {
            if (iterator <= 0) {
                iterator = storedGradients.length - 1;
            }
            return storedGradients[iterator--];
        }

        function reset() {
            iterator = storedGradients.length - 1;
        }

        return {
            add: add,
            getPrevious: getPrevious,
            reset: reset
        };
    }

    var application = {
        className : 'application maximised',
        init: function () {
            this.view.id = this.name;
            this.view.className = this.className;
            this.view.src = this.src;
        }
    }

    var iPad = {
        service : {
            home : {
                view : window.document.createElement('div'),
                init : function (applications, canvasUtil) {
                    this.view.id = "home";
                    var desktop = window.document.createElement('div'), pinnedApps = window.document.createElement('div'), application, appIcon, welcomeMessage = window.document.createElement('div');
                    desktop.id = 'desktop';
                    pinnedApps.id = 'pinnedApps';
                    welcomeMessage.id = 'welcomeMessage';
                    welcomeMessage.className = 'hide';
                    welcomeMessage.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><circle cx="250" cy="-950" r="1000" style="fill:url(#iconReflectionGradient);"/></svg><div><h1>Welcome!</h1><p>This is my resume, also a living breathing example of my work. Feel free to look around, click things and have fun.</p><p>The apps on the dock are those that contain my personal information, references and information about past work an education.</p><p>The other apps are little snippets of things that I have worked on in the past and wanted to share.</p><p>I hope you have a nice time, and I look forward to hearing from you,</p><p>Nate</p><button id="closeWelcome">Close</button></div>';

                    for (application in applications) {
                        if (applications.hasOwnProperty(application)) {
                            appIcon = ApplicationIcon(applications[application].name, applications[application].iconPath);
                            if (applications[application].pinned) {
                                pinnedApps.appendChild(appIcon.view);
                            } else {
                                desktop.appendChild(appIcon.view);
                            }
                        }
                    }

                    this.view.innerHTML = '<svg id="dock" xmlns="http://www.w3.org/2000/svg"xmlns:xlink="http://www.w3.org/1999/xlink"><path id="docklowerfill" d="M 17 37 C 256,55 512,32 512,30 C 512,30 768,5 1006,35 L 1024,64 1,64 17,37 "></path><path id="dockupperfill" style="fill:url(#dockHighlight);" d="M 17 37 C 256,55 512,32 512,30 C 512,30 768,5 1006,35 L 985,1 39,1 17,37"></path><path id="dockfrontreflection" d="M 1,66 L 1024,66 1024,64 1,64"></path><path id="dockoutlineleft" d="M 2,64 L 40,2"></path><path id="dockoutlinetop" d="M 40,1 L 984,1"></path><path id="dockoutlinetop" d="M 984,2 L 1023,64"></path></svg>';
                    this.view.appendChild(welcomeMessage);
                    this.view.appendChild(desktop);
                    this.view.appendChild(pinnedApps);
                },
                viginLaunch: true
            },
            dateTimeDao : {
                days : ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                months : ["January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],

                parseLessThanTen : function (integer) {
                    return integer < 10 ? "0" + integer : integer.toString();
                },

                parse12HourHours : function (hours) {
                    return hours < 13 ? hours : hours - 12;
                },

                getNow24HourTime : function () {
                    var date = new Date();
                    return this.parseLessThanTen(date.getHours()) + ":" + this.parseLessThanTen(date.getMinutes());
                },

                getNow12HourTime : function (ampm) {
                    var date = new Date();
                    return this.parse12HourHours(date.getHours()) + ":" + this.parseLessThanTen(date.getMinutes()) + (ampm ? ((date.getHours() - 12) < 0 ? "AM" : "PM") : "");
                },

                getTime : function (format, ampm) {
                    if (format === 12) {
                        return this.getNow12HourTime(ampm);
                    } else if (format === 24) {
                        return this.getNow24HourTime();
                    } else {
                        return this.getNow24HourTime();
                    }
                },

                getDate : function () {
                    var date = new Date();
                    return (this.days[date.getDay()] + ", " + this.months[date.getMonth()] + " " + date.getDate());
                }
            },
            lockScreen : {
                view : document.createElement('div'),
                lock : {
                    view : document.createElement('div'),
                    slider : window.document.createElement('div'),
                    button : window.document.createElement('div'),
                    slideToUnlock : window.document.createElement('div'),
                    text : 'slide to unlock',
                    render : function (slideToUnlock, gradient, text) {
                        var slideToUnlockContext = slideToUnlock.getContext('2d');
                        slideToUnlockContext.clearRect(0, 0, slideToUnlock.width, slideToUnlock.height);
                        slideToUnlockContext.save();
                        slideToUnlockContext.fillStyle = gradient;
                        slideToUnlockContext.fillText(text, '85', '30');
                        slideToUnlockContext.restore();
                    },
                    getPosition : function (actualPosition, leftLimit, rightLimit) {
                        if (actualPosition <= leftLimit) {
                            return leftLimit;
                        } else if (actualPosition >= rightLimit) {
                            return rightLimit;
                        } else {
                            return actualPosition;
                        }
                    },
                    slide : function () {
                        $('#slider').removeClass('active');
                        $('#slider .button').removeAttr('style');
                        $('#slideToUnlock').removeAttr('style');
                    },
                    unlock : function() {
                        $(this.view).trigger('unlock');
                        $(window.document).unbind('mousemove').unbind('mouseup');
                    },
                    lock : function() {
                        this.slide();
                        var thiz = this;
                        $(window.document).bind('mousemove', function (e) {
                            if ($('#slider').hasClass('active')) {
                                var leftLimit = 2, 
                                    sliderWidth = $(thiz.slider).width(), 
                                    buttonWidth = $(thiz.button).width(), 
                                    rightLimit = sliderWidth - (buttonWidth - leftLimit), 
                                    position = thiz.getPosition((-buttonWidth / 2 + leftLimit + e.pageX - $(thiz.slider).offset().left), leftLimit, rightLimit), 
                                    transparency = Math.round((1 - position * 4 / sliderWidth) * 100) / 100;

                                $(thiz.slider).attr('value', Math.round((position / rightLimit) * 100));
                                $(thiz.button).css({'left': position + 'px'});
                                $(thiz.slideToUnlock).css({'opacity': transparency});

                                if ($(thiz.slider).attr('value') === 100) {
                                    thiz.unlock();
                                }
                            }
                        }).bind('mouseup', function() {
                            if ($('#slider').hasClass('active')) {
                                thiz.slide();
                            }
                        });
                        this.slider.addEventListener('touchmove', function(e) {
                            if (document.querySelector('#slider').classList.contains('active')) {
                                console.log(e);
                                var touches = e.changedTouches;
                                var touch = touches.item(0);
                                var leftLimit = 2, 
                                    sliderWidth = $(thiz.slider).width(), 
                                    buttonWidth = $(thiz.button).width(), 
                                    rightLimit = sliderWidth - (buttonWidth - leftLimit), 
                                    position = thiz.getPosition((-buttonWidth / 2 + leftLimit + touch.pageX - $(thiz.slider).offset().left), leftLimit, rightLimit), 
                                    transparency = Math.round((1 - position * 4 / sliderWidth) * 100) / 100;

                                $(thiz.slider).attr('value', Math.round((position / rightLimit) * 100));
                                $(thiz.button).css({'left': position + 'px'});
                                $(thiz.slideToUnlock).css({'opacity': transparency});

                                if ($(thiz.slider).attr('value') === 100) {
                                    thiz.unlock();
                                }
                            }
                        });

                        this.slider.addEventListener('touchend', function() {
                            if ($('#slider').hasClass('active')) {
                                thiz.slide();
                            }
                        });
                    },
                    start : function () {
     
                    },
                    stop : function () {

                    },
                    init : function (canvasUtil) {

                        var leftLimit, rightLimit, sliderWidth, buttonWidth;

                        this.view.id = 'lock';
                        this.view.className = 'bigBar';

                        this.slider.id = 'slider';
                        this.slider.className = 'locked';
                        this.button.className = 'button';

                        this.slideToUnlock.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><text y="31" x="90">slide to unlock</text></svg>';
                        this.slideToUnlock.id = 'slideToUnlock';
                        this.slider.appendChild(this.slideToUnlock);
                        this.slider.appendChild(this.button);
                        this.view.appendChild(this.slider);

                        $(this.button).bind('mousedown', function (e) {
                            $('#slider').addClass('active');
                        }).bind('touchstart', function() {
                            $('#slider').addClass('active');
                        });

                        this.lock();
                    }
                },
                slideLock : function () {
                    this.lock.lock();
                },

                start : function () {
                    this.clock.start();
                    this.date.start();
                    this.lock.start();
                },

                stop : function () {
                    this.clock.stop();
                    this.date.stop();
                    this.lock.stop();
                },

                init : function (dateTimeDao, canvasUtil) {
                    var clockElement = window.document.createElement('div'), timeElement = window.document.createElement('div'), dateElement = window.document.createElement('div');
                    this.view.id = 'lockScreen';
                    clockElement.id = 'information';
                    clockElement.className = 'bigBar';
                    timeElement.id = "time";
                    timeElement.className = "title";
                    dateElement.id = "date";
                    dateElement.className = "subtitle";

                    this.clock = ClockController(dateTimeDao, timeElement);
                    this.date = DateController(dateTimeDao, dateElement)
                    this.lock.init(canvasUtil);

                    clockElement.appendChild(timeElement);
                    clockElement.appendChild(dateElement);
                    this.view.appendChild(clockElement);
                    this.view.appendChild(this.lock.view);
                }
            }
        },
        application : undefined,
        utility : {
            statusBar: {
                view: window.document.createElement('div'),
                unlock : function () {
                    this.view.className = "";
                    this.clock.start();
                },
                lock : function () {
                    this.view.className = "locked";
                    this.clock.stop();
                },
                addClass : function (a) {
                    this.view.className = a;
                },
                transparent : function () {
                    this.view.className = "";
                },
                init : function (dateTimeDao, canvasUtil) {
                    var network = window.document.createElement('div'), middle = window.document.createElement('div'), status = window.document.createElement('div'), battery = window.document.createElement('div'), clockElement = window.document.createElement('div');
                    clockElement.className = 'clock';
                    this.clock = ClockController(dateTimeDao, clockElement);
                    this.view.id = 'statusBar';
                    network.id = 'network';
                    network.innerHTML = '<span>iPad beta</span>';
                    middle.className = 'middle';
                    status.id = 'status';
                    status.width = '10';
                    status.height = '14';
                    status.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M 2,7 L 2,3 C 4,1 6,1 8,3 L 8,7"/><polygon points="0,13  10,13  10,7 0,7"></polygon></svg>';

                    battery.id = 'battery';
                    battery.innerHTML = '<span>EED</span>';
                    middle.appendChild(status);
                    middle.appendChild(clockElement);
                    this.view.appendChild(network);
                    this.view.appendChild(middle);
                    this.view.appendChild(battery);
                }
            },
            canvas : {
                drawLock : function (status) {
                    var ctx = status.getContext('2d');
                    ctx.fillStyle = 'rgba(255,255,255,0.6)';
                    ctx.strokeStyle = 'rgba(255,255,255,0.7)';
                    ctx.lineWidth = '1';
                    ctx.beginPath();
                    ctx.moveTo(165, 13);
                    ctx.lineTo(175, 13);
                    ctx.lineTo(175, 6);
                    ctx.lineTo(165, 6);
                    ctx.closePath();
                    ctx.fill();

                    ctx.beginPath();
                    ctx.moveTo(167, 6);
                    ctx.lineTo(167, 4);
                    ctx.moveTo(173, 6);
                    ctx.lineTo(173, 4);
                    ctx.arc(170, 4, 3, 0, Math.PI, true);
                    ctx.stroke();
                }
            }
        },
        applications : {
            Personal :  {
                __proto__: application,
                src : 'applications/personal/index.html',
                start : function () {

                },
                stop : function () {

                },
                view : window.document.createElement('iframe'),
                name : 'Personal',
                pinned : true,
                iconPath : 'applications/personal/icon.png',
                statusClass : "grey"
            },
            Technical :  {
                __proto__: application,
                src : "applications/technical/index.html",
                start : function () {

                },
                stop : function () {

                },
                view : window.document.createElement('iframe'),
                name : 'Technical',
                pinned : true,
                iconPath : 'applications/technical/icon.png',
                statusClass : 'black'
            },
            Reference :  {
                __proto__: application,
                src : "applications/reference/index.html",
                start : function () {

                },
                stop : function () {

                },
                view : window.document.createElement('iframe'),
                name : 'Reference',
                pinned : true,
                iconPath : 'applications/reference/icon.png',
                statusClass : 'black'
            },
            BirthdayCard :  {
                __proto__: application,
                src : "applications/birthdaycard/index.html",
                start : function () {

                },
                stop : function () {

                },
                view : window.document.createElement('iframe'),
                name : 'BirthdayCard',
                pinned : false,
                iconPath : 'applications/birthdaycard/icon.png'
            },
            Timeline :  {
                __proto__: application,
                src : "applications/timeline/index.html",
                start : function () {

                },
                stop : function () {

                },
                view : window.document.createElement('iframe'),
                name : 'Timeline',
                pinned : true,
                iconPath : 'applications/timeline/icon.png'
            },
            Balloons :  {
                __proto__: application,
                src : "applications/balloons/index.html",
                start : function () {

                },
                stop : function () {

                },
                view : window.document.createElement('iframe'),
                name : 'Balloons',
                pinned : false,
                iconPath : 'applications/balloons/icon.png'
            },
            Notes :  {
                __proto__: application,
                src : "applications/notes/index.html",
                start : function () {

                },
                stop : function () {

                },
                view : window.document.createElement('iframe'),
                name : 'Notes',
                pinned : false,
                iconPath : 'applications/notes/icon.png',
                statusClass : 'grey'
            },
            DemoDeck :  {
                __proto__: application,
                src : "applications/demodeck/index.html",
                start : function () {

                },
                stop : function () {

                },
                view : window.document.createElement('iframe'),
                name : 'DemoDeck',
                pinned : false,
                iconPath : 'applications/demodeck/icon.png',
                statusClass : 'grey'
            },
            SlingShot :  {
                __proto__: application,
                src : "applications/planetrySwingBy/index.html",
                start : function () {

                },
                stop : function () {

                },
                view : window.document.createElement('iframe'),
                name : 'SlingShot',
                pinned : false,
                iconPath : 'applications/planetrySwingBy/icon.png'
            },
            SlingShot2 :  {
                __proto__: application,
                src : "applications/planetrySwingBy2/index.html",
                start : function () {

                },
                stop : function () {

                },
                view : window.document.createElement('iframe'),
                name : 'SlingShot2',
                pinned : false,
                iconPath : 'applications/planetrySwingBy2/icon.png'
            },
            BirthdayCard2 :  {
                __proto__: application,
                src : "applications/birthdaycard2/birthday.html",
                start : function () {

                },
                stop : function () {

                },
                view : window.document.createElement('iframe'),
                name : 'BirthdayCard2',
                pinned : false,
                iconPath : 'applications/birthdaycard2/icon.png'
            },
            Balls :  {
                __proto__: application,
                src : "applications/balloons2/index.html",
                start : function () {

                },
                stop : function () {

                },
                view : window.document.createElement('iframe'),
                name : 'Balls',
                pinned : false,
                iconPath : 'applications/balloons2/icon.png'
            }
        },
        start : function () {
            var apps = window.document.createElement('div'), applicationContainer = window.document.createElement('div');
            window.document.getElementById("screen").appendChild(this.utility.statusBar.view);
            apps.id = 'apps';
            applicationContainer.id = 'applicationContainer';
            apps.appendChild(this.service.lockScreen.view);
            apps.appendChild(this.service.home.view);
            apps.appendChild(applicationContainer);
            window.document.getElementById("screen").appendChild(apps);
            this.lock();
        },

        lock : function () {
            if (!this.locked) {
                this.service.lockScreen.start();
                this.service.lockScreen.slideLock();
                this.utility.statusBar.lock();
                $(this.service.home.view).removeClass('maximised');
                $('#applicationContainer').removeClass('maximised');
                $(this.service.lockScreen.view).removeClass('unlocked');
                if (iPad.service.home.viginLaunch) {
                    $('#welcomeMessage').addClass('hide');
                }
                this.locked = true;
            }
        },


        home : function () {
            if (!this.locked) {
                $('#applicationContainer').removeClass('maximised');
                $(this.service.home.view).addClass('maximised');
                this.utility.statusBar.transparent();
                this.application = undefined;
            }
        },

        unlock : function () {
            if (this.locked) {
                $(this.service.lockScreen.view).addClass('unlocked');
                this.service.lockScreen.stop();
                this.utility.statusBar.unlock();
                $(this.service.home.view).addClass('maximised');
                if (this.application !== undefined) {
                    $('#applicationContainer').addClass('maximised');
                    this.utility.statusBar.addClass(this.application.statusClass || "black");
                }
                this.locked = false;
                if (iPad.service.home.viginLaunch) {
                    $('#welcomeMessage').removeClass('hide');
                }
            }
        },
        launch : function (applicationName) {
            this.application = this.applications[applicationName];
            $('#applicationContainer')[0].innerHTML = '';
            $('#applicationContainer').append(this.application.view);
            this.application.init();
            $('#applicationContainer').addClass('maximised');
            this.application.start();
            this.utility.statusBar.addClass(this.application.statusClass || "black");
        }
    };

    iPad.utility.statusBar.init(iPad.service.dateTimeDao, iPad.utility.canvas);
    iPad.service.lockScreen.init(iPad.service.dateTimeDao, iPad.utility.canvas);
    iPad.service.home.init(iPad.applications, iPad.utility.canvas);

    $(document).bind('unlock',
        function () {
            iPad.unlock();
        }).bind('Launch', function (e) {
            iPad.launch(e.application);
        });

    $('#lockButton').bind('click', function () {
        iPad.lock();
    });

    $('#homeButton').bind('click', function () {
        iPad.home();
    });

    $(document).delegate('#closeWelcome', 'click', function () {
        $('#welcomeMessage').addClass('hide');
        iPad.service.home.viginLaunch = false;
    });

    iPad.start();
}());



