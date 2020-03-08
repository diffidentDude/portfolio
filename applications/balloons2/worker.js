import { 
    vectorFn, 
    multiply, 
    add, 
    minus, 
    divide, 
    lessThan, 
    greaterThan, 
    collisionLoop4,  
    cirleOverlaps,
    objectCollisions
 } from './stuff.js';

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
	constructor(position, velocity, accelaration, mass, radius, colour, id) {
		this.A = Math.PI * radius.x * radius.x / 10000;
		this.position = position;
		this.velocity = velocity;
		this.accelaration = accelaration;
		this.mass = mass;
        this.radius = radius;
        this.colour = colour;
        this.id = id;
	}
}

function singleVectorFn(fn ,v) {
    return new Vector(fn.x(v.x), fn.x(v.y));
}

function force(mass, accelaration) {
	return vectorFn(multiply, mass, accelaration);
}

function fluidResistance(density, objectDrag, area, velocity) {
	return new Vector(-1 * 0.5 * density * objectDrag * area * velocity.x * velocity.x, 
		-1 * 0.5 * density * objectDrag * area * velocity.y * velocity.y);
}

function wallCollisions(ball, ZERO, dimensions, bounciness) {
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
    const collisionVelocity = vectorFn(multiply, vectorFn(multiply, ball.velocity, bounceLeftTop), bounceRightBottom); 
    /* Move the ball back a little bit so it's not still "stuck" in the wall. */
    //ball.position = vectorFn(direction, dimensions, ball.radius);   
    
    const positionTopLeft = vectorFn(multiply, vectorFn(minus, edgeLeftTop, ZERO), outsideTopLeft);
    const positionRightBottom = vectorFn(multiply, vectorFn(minus, edgeRightBottom, dimensions), outsideRightBottom);

    const collisionPosition = vectorFn(minus, vectorFn(minus, ball.position, positionRightBottom), positionTopLeft);

    return new Ball(collisionPosition, collisionVelocity, ball.accelaration, ball.mass, ball.radius, ball.colour, ball.id);
}

function loop(universe, balls, ballPairs) {
    const start = (new Date()).getTime();
    const { GRAVITY, DENSITY_AIR, BALL_DRAG, POINT_5, dt, ONE_HUNDRED, ZERO, bounciness, dimensions } = universe;
    const updatedBalls = balls.map((ball, index, array) => {
        let calculatedForce = new Vector(0, 0);
        
        /* Weight force, which only affects the y-direction (because that's the direction gravity points). */
        calculatedForce = vectorFn(add, calculatedForce, force(ball.mass, GRAVITY));
        
        /* Air resistance force; this would affect both x- and y-directions, but we're only looking at the y-axis in this example. */
        calculatedForce = vectorFn(add, calculatedForce, fluidResistance(DENSITY_AIR, BALL_DRAG, ball.A, ball.velocity));
        
        /* Verlet integration for the y-direction */
        const distanceY = vectorFn(add, vectorFn(multiply, ball.velocity, dt), vectorFn(multiply, vectorFn(multiply, vectorFn(multiply, POINT_5, ball.accelaration), dt), dt));
        // const distanceY = ball.velocity.y * dt + (0.5 * ball.accelaration.y * dt * dt);
        /* The following line is because the math assumes meters but we're assuming 1 cm per pixel, so we need to scale the results */
        const newPosition = vectorFn(add, ball.position, vectorFn(multiply, distanceY, ONE_HUNDRED));
        const new_ay = vectorFn(divide, calculatedForce, ball.mass);
        const avg_ay = vectorFn(multiply, POINT_5, vectorFn(add, new_ay, ball.accelaration));
        const newVelocity = vectorFn(add, ball.velocity, vectorFn(multiply, avg_ay, dt));

        return new Ball(newPosition, newVelocity, ball.accelaration, ball.mass, ball.radius, ball.colour, ball.id);
    });

    const collidedBalls = collisionLoop4(cirleOverlaps, objectCollisions, updatedBalls, ballPairs);
    handleCalculated(collidedBalls, ballPairs, universe);
}

self.onmessage = ({ data }) => {
    if (data.type === 'dimensions') {
        const universe = {
            dimensions: new Vector(data.dimensions.x, data.dimensions.y),
            dt: new Vector(0.02),  // Time step.
            bounciness: new Vector(-0.5),   // Coefficient of restitution ("bounciness")
            DENSITY_AIR: 1.2,  // Density of air. Try 1000 for water.
            BALL_DRAG: 0.47, // Coeffecient of drag for a ball
            GRAVITY: new Vector(0, 9.81),
            ZERO: new Vector(0),
            POINT_5: new Vector(0.5),
            ONE_HUNDRED: new Vector(100)
        }

        let i = 0;

        const balls = [
            // new Ball(new Vector(51, 51), new Vector(1, 0), new Vector(0,0), new Vector(0.1), new Vector(20), 'red', i++),
            // new Ball(new Vector(152, 51), new Vector(-1, 0), new Vector(0,0), new Vector(0.1), new Vector(20), 'blue', i++),
            // new Ball(new Vector(50, 100), new Vector(0.5, -1), new Vector(0,0), new Vector(0.1), new Vector(20), 'green', i++)
        ];

        for (let i = 15; i < (data.dimensions.x - 10); i += 150) {
            for (let j = 15; j < (data.dimensions.y - 10); j += 150) {
                const colour = 'rgba(' + (Math.round(Math.random() * 255)) + ', '+(Math.round(Math.random() * 255))+', '+ (Math.round(Math.random() * 255)) +', 1)';
                const xvel = -5 + (Math.round(Math.random() * 10));
                const yvel = -5 + (Math.round(Math.random() * 10));
                const radius = (Math.round(Math.random() * 50));
                balls.push(new Ball(new Vector(i, j), new Vector(xvel,yvel), new Vector(0,0), new Vector(radius * 0.1), new Vector(radius), colour, `${i}-${j}`));
            }
        }

        const ballPairs = balls.reduce((accumulator, nextBall, index1) => {
            balls.forEach((_, index2) => {
                if (index1 !== index2 && !accumulator.find((ballPair) => {
                    const contains1 = ballPair.includes(index1);
                    const contains2 = ballPair.includes(index2);
                    return contains1 && contains2;
                })) {
                    accumulator.push([index1, index2]);
                }
            });
            return accumulator;
        }, []);

        // const collisionsWorker = new Worker('collisions.js');

        // collisionsWorker.onmessage = ({ data }) => {
        //     if (data.type === 'calculated') {
        //         const { balls: collidedBalls } = data;
        //         handleCalculated(collidedBalls, ballPairs, universe, collisionsWorker);
        //     }
        // }

        loop(universe, balls, ballPairs);
    }
}

function handleCalculated(collidedBalls, ballPairs, universe) {
    const allBalls = collidedBalls.map((ball) => {
        return wallCollisions(ball, universe.ZERO, universe.dimensions, universe.bounciness);
    });

    const ballsMessage = {
        type: 'balls',
        balls: allBalls
    };

    // const now = (new Date()).getTime();
    // const renderTime = now - start;
    // self.postMessage({ type: 'renderTime', time: renderTime });
    self.postMessage(ballsMessage);
    setTimeout(loop.bind(self, universe, allBalls, ballPairs), universe.dt.x * 1000);
}
