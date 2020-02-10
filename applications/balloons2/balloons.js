const canvas = document.createElement('canvas');
	canvas.height = window.innerHeight
	canvas.width = window.innerWidth;
	document.querySelector('body').appendChild(canvas);


class Vector {
	constructor(x, y) {
		this.x = x;
		if (typeof y !== 'undefined') {
			this.y = y;
		} else {
			this.y = x;
		}
	}
}

class Ball {
	position = new Vector(0, 0);
    velocity= new Vector(0, 0);
    mass = 0.1;
	radius = 10;
	constructor(position, velocity, accelaration, mass, radius) {
		this.A = Math.PI * radius.x * radius.x / 10000;
		this.position = position;
		this.velocity = velocity;
		this.accelaration = accelaration;
		this.mass = mass;
		this.radius = radius;
	}
}


var ctx = canvas.getContext('2d'),
	dimensions = new Vector(canvas.width, canvas.height);
    dt = new Vector(0.02, 0.02),  // Time step.
    bounciness = new Vector(-0.5, -0.5),   // Coefficient of restitution ("bounciness")
    DENSITY_AIR = 1.2,  // Density of air. Try 1000 for water.
	BALL_DRAG = 0.47, // Coeffecient of drag for a ball
	ball = new Ball(new Vector(50, 50), new Vector(5,0), new Vector(0,0), new Vector(0.1, 0.1), new Vector(10, 10));

const GRAVITY = new Vector(0, 9.81);
const ZERO = new Vector(0, 0);
const POINT_5 = new Vector(0.5, 0.5);
const ONE_HUNDRED = new Vector(100, 100);

ctx.fillStyle = 'red';

function vectorFn(fn, v1, v2) {
	return new Vector(fn.x(v1.x, v2.x), fn.y(v1.y, v2.y));
}

function multiplyS(x, y) {
	return x * y;
}

function addS(x, y) {
	return x + y;
}

function divideS(x, y) {
	return x / y;
}

function minusS(x, y) {
	return x - y;
}

function lessThanS(x, y) {
	return x < y;
}

function greaterThanS(x, y) {
	return x > y;
}

function scaleS(x, s) {
	return x > y;
}

const minus = new Vector(minusS);
const add = new Vector(addS);
const multiply = new Vector(multiplyS);
const divide = new Vector(divideS);
const lessThan = new Vector(lessThanS);
const greaterThan = new Vector(greaterThanS);
const direction = new Vector(addS, minusS);

function force(mass, accelaration) {
	return vectorFn(multiply, mass, accelaration);
}

function fluidResistance(density, objectDrag, area, velocity) {
	return new Vector(-1 * 0.5 * density * objectDrag * area * velocity.x * velocity.x, 
		-1 * 0.5 * density * objectDrag * area * velocity.y * velocity.y);
}

function satTest(a, b) {
    var testVectors = [
        a.topRight.subtract(a.topLeft),
        a.bottomRight.subtract(a.topRight),
        b.topRight.subtract(b.topLeft),
        b.bottomRight.subtract(b.topRight),
    ];
    var ainvolvedVertices = [];
    var binvolvedVertices = [];

/*
         * Look at each test vector (shadows)
         */
    for (var i = 0; i < 4; i++) {
        ainvolvedVertices[i] = []; // Our container for involved vertces
        binvolvedVertices[i] = []; // Our container for involved vertces
        var myProjections = [];
        var foreignProjections = [];

        for (var j = 0; j < 4; j++) {
            myProjections.push(testVectors[i].dot(a.vertex(j)));
            foreignProjections.push(testVectors[i].dot(b.vertex(j)));
        }

        // Loop through foreignProjections, and test if each point is x lt my.min AND x gt m.max
        // If it's in the range, add this vertex to a list
        for (var j in foreignProjections) {
            if (foreignProjections[j] > myProjections.min() && foreignProjections[j] < myProjections.max()) {
                binvolvedVertices[i].push(b.vertex(j));
            }
        }

        // Loop through myProjections and test if each point is x gt foreign.min and x lt foreign.max
        // If it's in the range, add the vertex to the list
        for (var j in myProjections) {
            if (myProjections[j] > foreignProjections.min() && myProjections[j] < foreignProjections.max()) {
                ainvolvedVertices[i].push(a.vertex(j));
            }
        }
    }

    // console.log( intersect_safe ( intersect_safe( involvedVertices[0], involvedVertices[1] ), intersect_safe( involvedVertices[2], involvedVertices[3] ) ) );
    ainvolvedVertices = intersect_safe(intersect_safe(ainvolvedVertices[0], ainvolvedVertices[1]), intersect_safe(ainvolvedVertices[2], ainvolvedVertices[3]));
    binvolvedVertices = intersect_safe(intersect_safe(binvolvedVertices[0], binvolvedVertices[1]), intersect_safe(binvolvedVertices[2], binvolvedVertices[3]));
/*
        If we have two vertices from one rect and one vertex from the other, probably the single vertex is penetrating the segment
        return involvedVertices;
        */
    
    if (ainvolvedVertices.length === 1 && binvolvedVertices.length === 2) {
        return ainvolvedVertices[0];
    } else if (binvolvedVertices.length === 1 && ainvolvedVertices.length === 2) {
        return binvolvedVertices[0];
    } else if (ainvolvedVertices.length === 1 && binvolvedVertices.length === 1) {
        return ainvolvedVertices[0];
    } else if (ainvolvedVertices.length === 1 && binvolvedVertices.length === 0) {
        return ainvolvedVertices[0];
    } else if (ainvolvedVertices.length === 0 && binvolvedVertices.length === 1) {
        return binvolvedVertices[0];
    } else if (ainvolvedVertices.length === 0 && binvolvedVertices.length === 0) {
        return false;
    } else {
        console.log("Unknown collision profile");
        console.log(ainvolvedVertices);
        console.log(binvolvedVertices);
        clearInterval(timer);
    }
    return true;
}

function intersect_safe(a, b) {
    var result = new Array();

    var as = a.map(function(x) { return x.toString(); });
    var bs = b.map(function(x) { return x.toString(); });

    for (var i in as)
    {
        if (bs.indexOf(as[i]) !== -1)
        {
            result.push(a[i]);
        }
    }

    return result;
}

function loop(ball) { 
	console.log(ball.position.x, ball.position.y);
    let calculatedForce = new Vector(0, 0);
    
    /* Weight force, which only affects the y-direction (because that's the direction gravity points). */
    calculatedForce = vectorFn(add, calculatedForce, force(ball.mass, GRAVITY));
    
    /* Air resistance force; this would affect both x- and y-directions, but we're only looking at the y-axis in this example. */
    calculatedForce = vectorFn(add, calculatedForce, fluidResistance(DENSITY_AIR, BALL_DRAG, ball.A, ball.velocity));
    
	/* Verlet integration for the y-direction */
	const distanceY = vectorFn(add, vectorFn(multiply, ball.velocity, dt), vectorFn(multiply, vectorFn(multiply, vectorFn(multiply, POINT_5, ball.accelaration), dt), dt));
    // const distanceY = ball.velocity.y * dt + (0.5 * ball.accelaration.y * dt * dt);
    /* The following line is because the math assumes meters but we're assuming 1 cm per pixel, so we need to scale the results */
    ball.position = vectorFn(add, ball.position, vectorFn(multiply, distanceY, ONE_HUNDRED));
    const new_ay = vectorFn(divide, calculatedForce, ball.mass);
    const avg_ay = vectorFn(multiply, POINT_5, vectorFn(add, new_ay, ball.accelaration));
    ball.velocity = vectorFn(add, ball.velocity, vectorFn(multiply, avg_ay, dt));
    
	/* Let's do very simple collision detection */
    // if (y + r > height && vy > 0)
    // {
    //     /* This is a simplification of impulse-momentum collision response. e should be a negative number, which will change the velocity's direction. */
    //     vy *= e; 
    //     /* Move the ball back a little bit so it's not still "stuck" in the wall. */
    //     y = height - r;                        
	// }
	
   // 1 = 1
   // 0 = -0.5


	const edgeLeftTop = vectorFn(minus, ball.position, ball.radius);
	const edgeRightBottom = vectorFn(add, ball.position, ball.radius);

	const insideTopLeft = vectorFn(greaterThan, edgeLeftTop, ZERO);
	const insideRightBottom = vectorFn(lessThan, edgeRightBottom, dimensions);
	const outsideTopLeft = vectorFn(lessThan, edgeLeftTop, ZERO);
	const outsideRightBottom = vectorFn(greaterThan, edgeRightBottom, dimensions);

	const bounceLeftTop = vectorFn(add, vectorFn(multiply, insideTopLeft, new Vector(1.5)), bounciness);
	const bounceRightBottom = vectorFn(add, vectorFn(multiply, insideRightBottom, new Vector(1.5)), bounciness);
	/* This is a simplification of impulse-momentum collision response. e should be a negative number, which will change the velocity's direction. */
	ball.velocity = vectorFn(multiply, vectorFn(multiply, ball.velocity, bounceLeftTop), bounceRightBottom); 
	/* Move the ball back a little bit so it's not still "stuck" in the wall. */
	//ball.position = vectorFn(direction, dimensions, ball.radius);   
	
	const positionTopLeft = vectorFn(multiply, vectorFn(minus, edgeLeftTop, ZERO), outsideTopLeft);
	const positionRightBottom = vectorFn(multiply, vectorFn(minus, edgeRightBottom, dimensions), outsideRightBottom);

	ball.position = vectorFn(minus, ball.position, positionTopLeft);
	ball.position = vectorFn(minus, ball.position, positionRightBottom)
    
	draw(ball);
	
	requestAnimationFrame(loop.bind(this, ball));
}

function draw(ball)
{
    ctx.clearRect(0, 0, dimensions.x, dimensions.y);
    ctx.beginPath();
    ctx.arc(ball.position.x, ball.position.y, ball.radius.x, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.closePath();
}
   
/* A real project should use requestAnimationFrame, and you should time the frame rate and pass a variable "dt" to your physics function. This is just a simple brute force method of getting it done. */
// setInterval(loop, dt * 1000);

requestAnimationFrame(loop.bind(this, ball));