    function pixelHover() {
        var j = $(this).attr('id').split('-')[2];
        var i = $(this).attr('id').split('-')[1];
        $($('#pixel-' + (i - 1) + '-' + j).children()[0]).css({'opacity':($($('#pixel-' + (i - 1) + '-' + j).children()[0]).css('opacity') - 0.5)});
        $($('#pixel-' + (i*1 + 1) + '-' + j).children()[0]).css({'opacity':($($('#pixel-' + (i*1 + 1) + '-' + j).children()[0]).css('opacity') - 0.5)});
        $($('#pixel-' + (i) + '-' + (j*1 + 1)).children()[0]).css({'opacity':($($('#pixel-' + (i) + '-' + (j*1 + 1)).children()[0]).css('opacity') - 0.5)});
        $($('#pixel-' + (i) + '-' + (j - 1)).children()[0]).css({'opacity':($($('#pixel-' + (i) + '-' + (j - 1)).children()[0]).css('opacity') - 0.5)});
        $($('#pixel-' + (i - 2) + '-' + j).children()[0]).css({'opacity':($($('#pixel-' + (i - 2) + '-' + j).children()[0]).css('opacity') - 0.1)});
        $($('#pixel-' + (i*1 + 2) + '-' + j).children()[0]).css({'opacity':($($('#pixel-' + (i*1 + 2) + '-' + j).children()[0]).css('opacity') - 0.1)});
        $($('#pixel-' + (i) + '-' + (j*1 + 2)).children()[0]).css({'opacity':($($('#pixel-' + (i) + '-' + (j*1 + 2)).children()[0]).css('opacity') - 0.1)});
        $($('#pixel-' + (i) + '-' + (j - 2)).children()[0]).css({'opacity':($($('#pixel-' + (i) + '-' + (j - 2)).children()[0]).css('opacity') - 0.1)});
        $($(this).children()[0]).fadeOut();
    }

$(document).ready(function() {
    var height = $(window).height(), width = $(window).width();
    
    $('#message').css({'margin-top':height/3, 'display':'none'});
    $('#frame').css({'width': width, 'height': height});

    var html = '', columns = width/20 - 1, rows = height/20;
    // for (var i = 0; i < rows; i++) {
    //     html += '<div id="row-' + i + '" style="height: 20px; width: ' + width +'px">';
    //     for (var j = 0; j < columns; j++) {
    //         html += '<div onmouseover="pixelHover.call(this);" id="pixel-' + i + '-' + j + '" style="height:20px; width: 20px; float:left;"><div style="height:20px; width: 20px;border-radius: '+Math.round(Math.random() * 10)+'px;background-color:rgb(' + (Math.round(Math.random() * 255)) + ', '+(Math.round(Math.random() * 255))+', '+ (Math.round(Math.random() * 255)) +')"></div></div>';
    //     }
    //     html += '</div>';
    // }


    var i = 0;
        
    var interval = setInterval(function() {
        if (i < rows) {
            html += '<div id="row-' + i + '" style="height: 20px; width: ' + width +'px">';
            for (var j = 0; j < columns; j++) {
                html += '<div onmouseover="pixelHover.call(this);" id="pixel-' + i + '-' + j + '" style="height:20px; width: 20px; float:left;"><div style="height:20px; width: 20px;border-radius: '+Math.round(Math.random() * 10)+'px;background-color:rgb(' + (Math.round(Math.random() * 255)) + ', '+(Math.round(Math.random() * 255))+', '+ (Math.round(Math.random() * 255)) +')"></div></div>';
            }
            html += '</div>';
            i++;
        } else {
            $('#frame').append(html);
            $('#message').css({'display':'block'});
            clearInterval(interval);
        }
    }, 20);
});