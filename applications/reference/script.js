window.requestAnimFrame = (function() {
    return  window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

window.onload = function() {
    var canvas = document.getElementById('canvas'), ctx = canvas.getContext('2d'), height = window.innerHeight, width = window.innerWidth, world = {}, INITIAL_GROUND_HEIGHT = 80;

    canvas.height = height;
    canvas.width = width;

    world = generateWorld();

    (function animloop() {
        requestAnimFrame(animloop);
        drawWorld(world);
    })();

    (function modelLoop() {
        requestAnimFrame(modelLoop);
        moveClouds(world);
        rotateSun(world);
    })();


    function drawWorld(world) {
        ctx.clearRect(0, 0, width, height);
        ctx.beginPath();
        ctx.fillStyle = world.sky.colour;
        ctx.fillRect(0, 0, width, height);
        ctx.closePath();

        ctx.beginPath();
        ctx.arc(scale(world.sky.sun.position.x), scale(world.sky.sun.position.y), scale(world.sky.sun.size) / 2, 0, 360, true)
        ctx.fillStyle = world.sky.sun.colour;
        ctx.fill();

        ctx.save();
        ctx.translate(scale(world.sky.sun.position.x), scale(world.sky.sun.position.y));
        ctx.rotate(world.sky.sun.rotation / 100);
        for (var i = 0; i < 10; i++) {
            ctx.beginPath();
            ctx.fillRect(-scale(3), scale(world.sky.sun.size) / 2 + scale(5), scale(6), scale(12));
            ctx.fill();
            ctx.closePath();
            ctx.rotate(Math.PI * 2 / (10));
        }
        ctx.restore();

        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        for (i = 0; i < world.sky.clouds.length; i++) {
            var left = world.sky.clouds[i].position.x - world.sky.clouds[i].length / 2;

            for (var j = 0; j < world.sky.clouds[i].circles.length; j++) {
                var circleWidth = world.sky.clouds[i].circles[j];
                ctx.beginPath();
                ctx.arc(scale(left), scale(world.sky.clouds[i].position.y), scale(circleWidth) / 2, 0, Math.PI, true);
                ctx.fill();
                ctx.closePath();
                left = left + circleWidth / 2;
            }
        }
        drawGround(world.ground);
    }

    function drawGround(ground) {
        ctx.beginPath();
        ctx.moveTo(0, ground.points[0]);
        mapLine(ground.points, 0);
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.lineTo(0, ground.points[0]);
        ctx.fillStyle = ground.colour;
        ctx.fill();
        ctx.closePath();
    }

    function mapLine(ground, i) {
        if (i <= width) {
            ctx.lineTo(i, scale(ground[i]));
            mapLine(ground, ++i);
        }
    }

    function scale(i) {
        return Math.round(height * i / 100);
    }

    function generateWorld() {
        var world = {ground:{}};
        world.ground.points = generateGround([INITIAL_GROUND_HEIGHT], width);
        world.ground.colour = (function() {
            var lingrad = ctx.createLinearGradient(0, scale(INITIAL_GROUND_HEIGHT), 0, height);
            lingrad.addColorStop(0, '#66CC00');
            lingrad.addColorStop(1, 'green');
            return lingrad;
        }());
        world.sky = {
            colour:(function() {
                var lingrad = ctx.createLinearGradient(0, 0, 0, height);
                lingrad.addColorStop(0, '#00ABEB');
                lingrad.addColorStop(1, '#fff');
                return lingrad;
            }()),
            sun:{
                size: 30,
                colour: 'yellow',
                position: {
                    x:50,
                    y:30
                },
                rotation: 0
            },
            clouds:[]
        };
        world.sky.clouds.push(generateCloud());
        world.sky.clouds.push(generateCloud());
        world.sky.clouds.push(generateCloud());
        world.sky.clouds.push(generateCloud());
        world.sky.clouds.push(generateCloud());
        return world;
    }

    function generateCloud() {
        var cloud = {};
        cloud.length = Math.round(Math.random() * 100);
        cloud.position = {
            x : Math.round(Math.random() * width / height * 100),
            y : Math.round(Math.random() * 100) - 20
        };
        cloud.speed = cloud.length / 50;
        cloud.circles = []
        var left = cloud.position.x - cloud.length / 2;
        while (left < cloud.position.x + cloud.length / 2) {
            var circleWidth = Math.round(Math.random() * cloud.length / 3);
            cloud.circles.push(circleWidth);
            left = left + circleWidth / 2;
        }
        return cloud;
    }

    function generateGround(grounds, width) {
        if (width > 0) {
            grounds.push(grounds[grounds.length - 1]);
            generateGround(grounds, --width);
        }
        return grounds;
    }

    function moveClouds(world) {
        for (i = 0; i < world.sky.clouds.length; i++) {
            world.sky.clouds[i].position.x = world.sky.clouds[i].position.x + world.sky.clouds[i].speed * 1 / 60;
        }
    }

    function rotateSun(world) {
        world.sky.sun.rotation = world.sky.sun.rotation + 1 < 63 ? world.sky.sun.rotation + 1 : 0;
    }
};