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
	constructor(position, velocity, accelaration, mass, radius, colour) {
		this.A = Math.PI * radius.x * radius.x / 10000;
		this.position = position;
		this.velocity = velocity;
		this.accelaration = accelaration;
		this.mass = mass;
        this.radius = radius;
        this.colour = colour;
	}
}

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

function loop(universe, balls) {
    const { GRAVITY, DENSITY_AIR, BALL_DRAG, POINT_5, dt, ONE_HUNDRED, ZERO, bounciness, dimensions } = universe;
    balls.map(ball => {
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
        

        // Collisions
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
        ball.position = vectorFn(minus, ball.position, positionRightBottom);

        return ball;
    });
    const ballsMessage = {
        type: 'balls',
        balls
    };

	self.postMessage(ballsMessage);
	
	setTimeout(loop.bind(null, universe, balls), dt.x * 1000);
}

self.onmessage = ({ data }) => {
    if (data.type === 'dimensions') {
        const universe = {
            dimensions: new Vector(data.dimensions.x, data.dimensions.y),
            dt: new Vector(0.02, 0.02),  // Time step.
            bounciness: new Vector(-0.5, -0.5),   // Coefficient of restitution ("bounciness")
            DENSITY_AIR: 1.2,  // Density of air. Try 1000 for water.
            BALL_DRAG: 0.47, // Coeffecient of drag for a ball
            GRAVITY: new Vector(0, 9.81),
            ZERO: new Vector(0, 0),
            POINT_5: new Vector(0.5, 0.5),
            ONE_HUNDRED: new Vector(100, 100)
        }

        const balls = [];

        for (let i = 15; i < (data.dimensions.x - 10); i += 20) {
            for (let j = 15; j < (data.dimensions.y - 10); j += 20) {
                const colour = 'rgba(' + (Math.round(Math.random() * 255)) + ', '+(Math.round(Math.random() * 255))+', '+ (Math.round(Math.random() * 255)) +', 1)';
                const xvel = -5 + (Math.round(Math.random() * 10));
                const yvel = -5 + (Math.round(Math.random() * 10));
                const radius = (Math.round(Math.random() * 10));
                balls.push(new Ball(new Vector(i, j), new Vector(xvel,yvel), new Vector(0,0), new Vector(radius * 0.1), new Vector(radius), colour))
            }
        }

        loop(universe, balls);
    }
}
