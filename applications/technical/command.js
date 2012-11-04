
$(document).ready(function() {
    var languages = {
        "JavaScript" : {
            proficiency: '75%',
            firstContact: new Date("08/01/2010"),
            experience: new Date("02/21/2011"),
            color: 'rgb(27,161,226)',
            detail: 'native js, jQuery and a tiny bit of node.js'
        },
        "HTML" : {
            proficiency: '90%',
            firstContact: new Date("03/06/2009"),
            experience: new Date("02/21/2011"),
            color: 'rgb(160,80,0)',
            detail: 'HTML4 and HTML5'
        },
        "CSS" : {
            proficiency: '85%',
            firstContact: new Date("03/06/2009"),
            experience: new Date("02/21/2011"),
            color: 'rgb(51,153,51)',
            detail: 'CSS2 and CSS3'
        },
        "Java" : {
            proficiency: '70%',
            firstContact: new Date("03/03/2009"),
            experience: new Date("02/21/2011"),
            color: 'rgb(229, 20, 0)',
            detail: 'Spring, Hibernate, JSTL, JSP'
        },
        "SQL" : {
            proficiency: '60%',
            firstContact: new Date("03/03/2009"),
            experience: new Date("02/21/2011"),
            color: 'rgb(162,193,57)',
            detail: 'Oracle and experience with PLSQL'
        },
        "IDE" : {
            proficiency: '80%',
            firstContact: new Date("03/06/2009"),
            experience: new Date("02/21/2011"),
            color: 'rgb(216,0,115)',
            detail: 'Primary is IntelliJ, use SublimeText for personal stuff.'
        },
        "VersionControl" : {
            proficiency: '70%',
            firstContact: new Date("02/21/2011"),
            experience: new Date("02/21/2011"),
            color: 'rgb(240,150,9)',
            detail: 'Subverison and a small amount of GIT.'
        }
    }, MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];


    var colours = '';
    for (var key in languages) {
        $('#languageList').append('<li class="list-item ' + key + '"><p>' + key + '</p></li>');
        $('.languages').append(' <div class="sub-group ' + key + '"><h1>' + key + '</h1>' +
            '<div class="progress">' +
            '<div class="meter">' +
            '<span class="bar" style="background-color: '+languages[key].color+'; width: ' + languages[key].proficiency + '"></span>' +
            '<span class="text" style="width: 100%">' + languages[key].proficiency + '</span>' +
            '</div>' +
            '<p class="subtitle">Proficiency</p>' +
            '</div>' +
            '<div class="clear">' +
            '<div class="left experience">' +
            '<h2>' + Math.round((new Date() - languages[key].experience) / 3153600000) / 10 +
            '<span class="measure">years</span>' +
            '</h2>' +
            '<p class="subtitle">Experience</p>' +
            '</div>' +
            '<div class="right start">' +
            '<h2>' + languages[key].firstContact.getDate() + ' ' +
            MONTHS[languages[key].firstContact.getMonth()] + '</h2>' +
            '<h2>' + languages[key].firstContact.getFullYear() + '</h2>' +
            '<p class="subtitle">First Contact</p>' +
            '</div>' +
            '</div>' +
            '<p>'+languages[key].detail+'</p>' +
            '</div>');
        colours = colours + 'li.' + key + ' ' + '{background-color:' + languages[key].color + '}';
    }
    $('body').append('<style>' + colours + '</style>');

    $('.list-item').click(function() {
        var language = $(this).text();
        $('#languageList li').each(function() {
            $(this).removeClass('selected');
        });
        $(this).addClass('selected');
        $('.sub-group').each(function() {
            $(this).removeClass('selected');
        });
        $('.' + language).addClass('selected');
    });

    $('.JavaScript').trigger('click');

});


