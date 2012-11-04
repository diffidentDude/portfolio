(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = 
          window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame        || 
		window.webkitRequestAnimationFrame 		|| 
		window.mozRequestAnimationFrame    		|| 
		window.oRequestAnimationFrame      		|| 
		window.msRequestAnimationFrame     		|| 
		function( callback ){
        	window.setTimeout(callback, 1000 / 60);
        };
})();

function setup() {
	var canvas = document.createElement('canvas');
	canvas.height = $(window).height();
	canvas.width = $(window).width();
	$('body').append(canvas);
	$(canvas).css({'position':'absolute', 'top':'0', 'left': '0'});
	return canvas;
}

function calculateBalloonPosition(newPosition) {

	for (var i = 0; i < balloons.length; i++) {
		
	}
}

function drawBalloons(context, balloons) {	
	for (var i = 0; i < balloons.length; i++) {
		context.beginPath();
		context.arc(balloons[i].position.x, balloons[i].position.y, balloons[i].size, 0, 360);
		context.fillStyle = balloons[i].colour;
		context.fill();
		context.closePath();
	}
}

function environment(balloons) {
	setInterval(function() {
		for (var i = 0; i < balloons.length; i++) {
			var acceleration = {x:0, y:0}, velocity = {x:0, y:0}, position = {x:0, y:0}, distance = {x:0,y:0,hypotenuse:0,min:0};;

			//
 			acceleration = gravity;

			// velocity
			velocity.x = balloons[i].velocity.x + acceleration.x * FPS;
			velocity.y = balloons[i].velocity.y + acceleration.y * FPS;

			// distance
			position.x = acceleration.x? balloons[i].position.x + (Math.pow(velocity.x, 2) - Math.pow(balloons[i].velocity.x, 2)) / 2 * acceleration.x: balloons[i].position.x + velocity.x * FPS;
			position.y = acceleration.y? balloons[i].position.y + (Math.pow(velocity.y, 2) - Math.pow(balloons[i].velocity.y, 2)) / 2 * acceleration.y: balloons[i].position.y + velocity.y * FPS;

			// collisions with other balloons
			for (var j = i + 1; j < balloons.length; j++) {
				distance.x = position.x - balloons[j].position.x;
				distance.y = position.y - balloons[j].position.y;
				distance.hypotenuse = Math.sqrt(Math.pow(distance.x, 2) + Math.pow(distance.y, 2));
				distance.min = balloons[i].size + balloons[j].size;
				if (distance.hypotenuse <= distance.min) {
					// collision on the x plane on the right side of i
					var temp = velocity.x;
					velocity.x = balloons[j].velocity.x;
					balloons[j].velocity.x = temp;
					temp = velocity.y;
					velocity.y = balloons[j].velocity.y;
					balloons[j].velocity.y = temp;
				}
			}

			// check wall collisions
			if (position.x - balloons[i].size <= 0) {
				velocity.x = -(velocity.x * BOUNCE_FACTOR);
				position.x = 0 + balloons[i].size;
			} else if (position.x + balloons[i].size >= canvas.width) {
				velocity.x = -(velocity.x * BOUNCE_FACTOR);
				position.x = canvas.width - balloons[i].size;
			}
			if (position.y - balloons[i].size <= 0) {
				velocity.y = -(velocity.y * BOUNCE_FACTOR);
				position.y = 0 + balloons[i].size;
			} else if (position.y + balloons[i].size >= canvas.height) {
				velocity.y = -(velocity.y * BOUNCE_FACTOR);
				position.y = canvas.height - balloons[i].size;
			}

			// Friction with the air.
			balloons[i].velocity.x = balloons[i].velocity.x * 0.5;
			balloons[i].velocity.y = balloons[i].velocity.y * 0.5;

     		balloons[i].position = position;
      		balloons[i].velocity = velocity;
		}
  }, FPMS);
}

function animate() {
	requestAnimFrame(animate);
	context.clearRect(0, 0, canvas.width, canvas.height);
	drawBalloons(context, balloons);
}

var canvas = setup();
var FPMS = 500/60;
var FPS = FPMS/1000;
var context = canvas.getContext('2d');
var AIR_MASS = 1.25;
var HELIUM_MASS = 0.1785;
var BOUNCE_FACTOR = 0.75;
var gravity = {x:0, y:9.8};
var position = {x:0, y:0};
var balloons = [
	{position:{x:100, y:100}, size: 20, colour:'yellow', mass:50, velocity:{x:0, y:0}}, 
	{position:{x:200, y:200}, size: 20, colour:'red', mass:50, velocity:{x:100, y:0}},
	{position:{x:300, y:300}, size: 30, colour:'green', mass:50, velocity:{x:100, y:0}},
    {position:{x:400, y:300}, size: 24, colour:'blue', mass:50, velocity:{x:-50, y:0}},
    {position:{x:500, y:300}, size: 15, colour:'pink', mass:50, velocity:{x:200, y:0}},
    {position:{x:600, y:300}, size: 40, colour:'brown', mass:50, velocity:{x:-200, y:0}}
]


$(document).mousemove(function(e) {
	calculateBalloonPosition({x: e.pageX, y: e.pageY});
});

environment(balloons);

animate();

/**
 * Calculating balloon position.
 * ^ force due to helium lift
 * v force due to weight of the balloon and string
 * <> force due to force from string
 * <> force due to momentum
 * 
 *
 */



    
