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

function vectorFn(fn, v1, v2) {
	return new Vector(fn.x(v1.x, v2.x), fn.y(v1.y, v2.y));
}

function singleVectorFn(fn ,v) {
    return new Vector(fn.x(v.x), fn.x(v.y));
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

function r(v) {
    return [v.x, v.y];
}

function dot(v1, v2) {
    return v1.x * v2.x + v1.y * v2.y; 
}

const ceil = new Vector(x => Math.ceil(x * 100) / 100);
const abs = new Vector(x => Math.abs(x));
const sign = new Vector(x => Math.sign(x));
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

/**
 * hypotenuse Function
 * private
 *
 * @arg o opposite side length
 * @arg a adjacent side length
 *
 * @return the hypotenuse of a right angled triangle given the opposite o and adjacent a lengths
 */
function hypotenuse(v) {
    return Math.sqrt(Math.pow(v.x, 2) + Math.pow(v.y, 2));
}

function theta({x:o, y:a}) {
    if (a == 0) {
        return 0;
    } else {
        return Math.atan(Math.abs(o/a));
    }
}

function thetaz({x:o, y:a}) {
    if (a == 0) {
        return 0;
    } else {
        return Math.atan(Math.abs(a/o));
    }
}

function component(hypotenuse, angle) {
    return new Vector(Math.sin(angle) * hypotenuse, Math.cos(angle) * hypotenuse);
}

function cirleOverlaps(c1, c2) {
    const distance = vectorFn(minus, c1.position, c2.position);
    return Math.abs(hypotenuse(distance)) - (c1.radius.x + c2.radius.x) < 0;
}

function additiveAngle(v) {
    const x = Math.abs(v.x);
    const y = Math.abs(x.y);
}

function objectCollisions(balls) {

    const [ball1, ball2] = balls;

    const TWO = new Vector(2);

    //  m1, m2 = p1.radius**2, p2.radius**2
    const m1 = vectorFn(multiply, ball1.radius, TWO);
    const m2 = vectorFn(multiply, ball2.radius, TWO);

    // M = m1 + m2
    const M = vectorFn(add, m1, m2);

    // r1, r2 = p1.r, p2.r
    const r1 = ball1.position;
    const r2 = ball2.position;

    // d = np.linalg.norm(r1 - r2)**2
    const dist = vectorFn(minus, r1, r2);
    const dist2 = vectorFn(minus, r2, r1);
    const hyp = new Vector(hypotenuse(dist));
    const d = vectorFn(multiply, hyp, hyp);

    // v1, v2 = p1.v, p2.v
    const v1 = ball1.velocity;
    const v2 = ball2.velocity;

    const angle2 = theta(dist2);

    const bounciness = new Vector(0.95);

    // u1 = v1 - 2*m2 / M * np.dot(v1-v2, r1-r2) / d * (r1 - r2)
    const u1 = vectorFn(minus, v1, vectorFn(multiply, bounciness, velocity(v1, v2, m2, M, r1, r2, d)));
    // const u1 = vectorFn(minus, v1, component(hypotenuse(velocity(v1, v2, m2, M, r1, r2, d)), angle2));

    // u2 = v2 - 2*m1 / M * np.dot(v2-v1, r2-r1) / d * (r2 - r1)
    const u2 = vectorFn(minus, v2, vectorFn(multiply, bounciness, velocity(v2, v1, m1, M, r2, r1, d)));
    // const u2 = vectorFn(minus, v2, component(hypotenuse(velocity(v2, v1, m1, M, r2, r1, d)), angle));

    const edgeDist2 = Math.abs(hypotenuse(dist2)) - (ball1.radius.x + ball2.radius.x);

    const working = component(-edgeDist2 / 2, angle2);
    const workingSign = singleVectorFn(sign, working);
    const components = vectorFn(multiply, workingSign, singleVectorFn(ceil, singleVectorFn(abs, working)));
    const d1 = vectorFn(add, ball1.position, vectorFn(multiply, singleVectorFn(sign, dist), components));
    const d2 = vectorFn(add, ball2.position, vectorFn(multiply, singleVectorFn(sign, dist2), components));

    return [Object.assign(ball1, { velocity: u1, position: d1 }), Object.assign(ball2, { velocity: u2, position: d2 })];
}

function velocity(v1, v2, m2, M, r1, r2, d) {
    // return v1 - 2*m2 / M * np.dot(v1-v2, r1-r2) / d * (r1 - r2)
    const TWO = new Vector(2);
    const V = vectorFn(minus, v1, v2);
    const R = vectorFn(minus, r1, r2);
    const dotProduct = new Vector(dot(V, R));
    const TWO_M2 = vectorFn(multiply, TWO, m2);
    const TWO_M2_DIVIDE_M = vectorFn(divide, TWO_M2, M);
    const TWO_M2_DIVIDE_M_MULT_DOT_PRODUCT = vectorFn(multiply, TWO_M2_DIVIDE_M, dotProduct);
    const TWO_M2_DIVIDE_M_MULT_DOT_PRODUCT_DIVIDE_D = vectorFn(divide, TWO_M2_DIVIDE_M_MULT_DOT_PRODUCT, d);
    const TWO_M2_DIVIDE_M_MULT_DOT_PRODUCT_DIVIDE_D_MULT_R = vectorFn(multiply, TWO_M2_DIVIDE_M_MULT_DOT_PRODUCT_DIVIDE_D, R);
    return TWO_M2_DIVIDE_M_MULT_DOT_PRODUCT_DIVIDE_D_MULT_R;
}

function collisionLoop(tester, worker, updatedBalls) {
    let iterations = 0;
    for(var i = 0; i < updatedBalls.length; i++) {
        iterations++;
        for(var j = 0; j < updatedBalls.length; j++) {
            var ball1 = updatedBalls[i];
            var ball2 = updatedBalls[j];
            iterations++;
            if (ball1.id !== ball2.id && tester(ball1, ball2)) {
                const [updatedBall1, updatedBall2] = worker([ball1, ball2]);
                updatedBalls[i] = updatedBall1;
                updatedBalls[j] = updatedBall2;
                i = 0;
                j = 0;
            }
        }
    }
    console.log('collisionLoop', iterations);
    return updatedBalls;
}

function collisionLoop2(tester, worker, updatedBalls) {
    let iterations = 0;
    for(let i = 0; i < updatedBalls.length; i++) {
        let ball1 = updatedBalls[i];
        let j = updatedBalls.findIndex((ball2) => {
            iterations++;
            return ball1.id !== ball2.id && tester(ball1, ball2)
        });
        let ball2 = updatedBalls[j];
        iterations++;
        if (typeof ball2 !== 'undefined') {
            let [updatedBall1, updatedBall2] = worker([ball1, ball2]);
            updatedBalls[i] = updatedBall1;
            updatedBalls[j] = updatedBall2;
            i = 0;
        }
    }

    console.log('collisionLoop2', iterations);

    return updatedBalls;
}

function collisionLoop3(tester, worker, balls, ballPairs) {
    let iterations = 0;
    for(let i = 0; i < ballPairs.length; i++) {
        let [ ball1Index, ball2Index ] = ballPairs[i];
        let ball1 = balls[ball1Index];
        let ball2 = balls[ball2Index];
        iterations++;
        if (tester(ball1, ball2)) {
            let [updatedBall1, updatedBall2] = worker([ball1, ball2]);
            balls[ball1Index] = updatedBall1;
            balls[ball2Index] = updatedBall2;
            i = 0;
        }
    }

    console.log('collisionLoop3', iterations);

    return balls;
}

function loop(universe, balls, ballPairs, collisionsWorker) {
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


    // const collidingBalls = [];
    
    // updatedBalls.forEach((ball1, _, array) => {
	// 	array.forEach((ball2) => {
	// 		if (ball1.id !== ball2.id && cirleOverlaps(ball1, ball2)) {
	// 			const existingCollision = collidingBalls.find((collidingBall) => collidingBall.find((ball) => ball.id === ball1.id) && collidingBall.find((ball) => ball.id === ball2.id));
	// 			if (existingCollision) {
	// 				// if (!existingCollision.find((ball) => ball.id === ball1.id)) {
	// 				// 	existingCollision.push(ball1);
	// 				// }
	// 				// if (!existingCollision.find((ball) => ball.id === ball2.id)) {
	// 				// 	existingCollision.push(ball2);
	// 				// }
	// 			} else {
	// 				collidingBalls.push([ball1, ball2]);
	// 			}
	// 		}
	// 	});
	// });

    // const collidedBalls = collidingBalls.reduce((accumulator, balls) => {
    //     return accumulator.concat(objectCollisions(balls));
    // }, []);

    // collisionsWorker.postMessage({ type: 'calculate', balls: { balls:updatedBalls, ballPairs } });

    const collidedBalls = collisionLoop3(cirleOverlaps, objectCollisions, updatedBalls, ballPairs);
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

        const collisionsWorker = new Worker('collisions.js');

        // collisionsWorker.onmessage = ({ data }) => {
        //     if (data.type === 'calculated') {
        //         const { balls: collidedBalls } = data;
        //         handleCalculated(collidedBalls, ballPairs, universe, collisionsWorker);
        //     }
        // }

        loop(universe, balls, ballPairs, collisionsWorker);
    }
}

function handleCalculated(collidedBalls, ballPairs, universe, collisionsWorker) {
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
    setTimeout(loop.bind(self, universe, allBalls, ballPairs, collisionsWorker), universe.dt.x * 1000);
}
