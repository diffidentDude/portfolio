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


function collisionLoop3(balls, ballPairs) {
    let iterations = 0;
    for(let i = 0; i < ballPairs.length; i++) {
        let [ ball1Index, ball2Index ] = ballPairs[i];
        let ball1 = balls[ball1Index];
        let ball2 = balls[ball2Index];
        if (cirleOverlaps(ball1, ball2)) {
            let [updatedBall1, updatedBall2] = objectCollisions([ball1, ball2]);
            balls[ball1Index] = updatedBall1;
            balls[ball2Index] = updatedBall2;
            iterations += i;
            i = 0;
        }
    }

    console.log(iterations);

    return balls;
}

self.onmessage = ({ data }) => {
    if (data.type === 'calculate') {
        const { balls, ballPairs } = data.balls;
        const collidedBalls = collisionLoop3(balls, ballPairs);
        self.postMessage({ type: 'calculated', balls: collidedBalls });
    }
}