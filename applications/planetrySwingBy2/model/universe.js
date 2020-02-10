import { Body } from './body';

function determineAcceleration(body1, body2) {
	var dX = body2.position.x - body1.position.x,
		dY = body2.position.y - body1.position.y,
		aX = componentA(body2.mass, dY, dX),
		aY = componentA(body2.mass, dX, dY);	
	return {x:aX, y:aY};
}

/**
 * g Function
 * private
 *
 * @arg mass The mass of the object with the acceleration being calculated
 * @arg h The distance between the two objects
 *
 * @return The gravitational force from a mass at distance h
 */
function g(mass, h) {
	if (h == 0) {
		return 0;
	} else {
		return (G() * mass / Math.pow(h, 2));
	}
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
function hypotenuse(o, a) {
	return Math.sqrt(Math.pow(o, 2) + Math.pow(a, 2));
}

/**
 * componentA Function
 * private
 * 
 * @param mass: The mass of the object whose gravity is being determined
 * @param o: The length of the opposite side of the triangle
 * @param a: The length of the adjacent side of the triangle
 *
 * @return: The positive or negative adjacent component of the acceleration
 */
function componentA(mass, o, a) {
	return (sign(a) * Math.cos(theta(o, a)) * g(mass, hypotenuse(o, a))) || 0;
}

function sign(a) {
	return (Math.abs(a)/a);
}

/**
 * determineVelocity Function
 * private
 * 
 * @arg body the body whose new velocity is being calculated
 * @arg time the time over which the velocity changes
 *
 * @return the new x and y velocity that the body achieves after the specified time
 */
function determineVelocity(acceleration, time) {
	return{
		x: acceleration.x * time || 0,
		y: acceleration.y * time || 0
	};
}

/**
 * determineDistance Function
 *
 * @arg body the body whose travel is being calculated
 * @arg time the amount of time that the body is traveling for
 *
 * @return the x and y distance travelled by the body in the time
 */
function determineDistance(velocity, acceleration, time) {
	return {x: velocity.x + 1/2 * acceleration.x * Math.pow(time, 2) || 0,
		y: velocity.y + 1/2 * acceleration.y * Math.pow(time, 2) || 0};
}

function clone(thing) {
	return JSON.parse(JSON.stringify(thing));
}

function buildRelationships(items) {
	const relationships = [];
	items.forEach((item) => {
		const itemsClone = clone(items);
		itemsClone.shift();
		itemsClone.forEach((item2) => {
			relationships.push({ body1: item, body2: item2 })
		})
	});
	return relationships;
}

function addVectors(vector1, vector2) {
	return {
		x: vector1.x + vector2.x,
		y: vector1.y + vector2.y
	}
}

function updateBody(body, acceleration, time) {
	return new Body(
		body.name, 
		body.type,
		body.radius, 
		body.mass, 
		addVectors(body.position, determineDistance(body.velocity, acceleration, time)), 
		addVectors(body.velocity, determineVelocity(body.velocity, acceleration, time)), 
		body.fixed);

}

function accumulateBodies(accumulator, body1) {
	const index = accumulator.findIndex(body1.original);
	if (index) {				
		accumulator[index].acceleration = addVectors(accumulator[index].acceleration, body1.acceleration);
	} else {
		accumulator.push(body1)
	}
	return accumulator;
}

class Universe {
	relationships = []
	time = 1/60
	timeMod = 1

	constructor(bodies) {
		this.relationships = buildRelationships(bodies);
		setInterval(() => {
			this.bodies = updatePositions(this.relationships);
		}, this.time);
	}

	gravity() {
		return 1/*6.67 * Math.pow(10, -11)*/
	}

	addBody(body) {

	}

	updatePositions(relationships, time) {
		const updatedRelationships = relationships.map(({ body1, body2 }) => {
			return {
				body1: {
					acceleration: determineAcceleration(body1, body2),
					original: body1
				},
				body2: {
					acceleration: determineAcceleration(body2, body1),
					original: body2
				}
			}
		});

		const bodies = updatedRelationships.reduce((accumulator, { body1, body2 }) => {
			accumulator = accumulateBodies(accumulator, body1);
			accumulator = accumulateBodies(accumulator, body2);
			return accumulator;
		}, []);
	}
}

Universe = function () {	
	/**
	 * findAndUpdatePosition Function
	 * public
	 *
	 * Function to loop through the bodies in the universe and calculate their acceleration towards each other is their position is not fixed
	 */	
	this.findAndUpdatePosition = function() {
		for(var i in bodies) {
			bodies[i].acceleration.x = 0, bodies[i].acceleration.y = 0;
			if (!bodies[i].fixed) { 
				for(var j in bodies) {
					bodies[i].addAcceleration(determineAcceleration(bodies[i], bodies[j]))
				}
				updatePosition(bodies[i]);
			}
		}
	};
	
	/**
	 * findPathPositions Function
	 * public
	 *
	 * Function to find the path positions for a given body
	 */	
	this.findPathPositions = function(body, iterations) {
		var positions = [], position;
		while (iterations) {
			body.acceleration.x = 0, body.acceleration.y = 0;
			for(var j in bodies) {
				body.addAcceleration(determineAcceleration(body, bodies[j]));
			}
			position = determineDistance(body, time);
			body.position.x = body.position.x + position.x
			body.position.y = body.position.y + position.y
			body.velocity = determineVelocity(body, time);
			positions.push({x: body.position.x, y: body.position.y});
			iterations--;
		}
		return positions;
	};
	
	/**
	 * releasePlayer Function
	 * public
	 *
	 * Function to set the player in motion
	 */
	this.releasePlayer = function() {
		bodies[0].fixed = false;
	};
	
	/**
	 * setPlayerVelocity Function
	 * public
	 *
	 * @arg arg the velocity to add
	 *
	 * Function to increase the players velocity by the specified amount
	 */
	this.setPlayerVelocity = function(arg) {
		bodies[0].addVelocity(arg);
	}
	
	/**
	 * updatePosition Function
	 * private
	 *
	 * @arg body the body whose position will be updated
	 */
	function updatePosition(body) {
		body.move(determineDistance(body, time));
		body.velocity = determineVelocity(body, time);
	}
	
	/**
	 * determineVelocity Function
	 * private
	 * 
	 * @arg body the body whose new velocity is being calculated
	 * @arg time the time over which the velocity changes
	 *
	 * @return the new x and y velocity that the body achieves after the specified time
	 */
	function determineVelocity(body, time) {
		return{x: body.velocity.x + body.acceleration.x * time || 0,
			y: body.velocity.y + body.acceleration.y * time || 0};
	}
	
	/**
	 * determineDistance Function
	 *
	 * @arg body the body whose travel is being calculated
	 * @arg time the amount of time that the body is traveling for
	 *
	 * @return the x and y distance travelled by the body in the time
	 */
	function determineDistance(body, time) {
		return {x: body.velocity.x + 1/2 * body.acceleration.x * Math.pow(time, 2) || 0,
			y: body.velocity.y + 1/2 * body.acceleration.y * Math.pow(time, 2) || 0};
	}
	
	/**
	 * determineAcceleration Function
	 * private
	 *
	 * @arg body1 the body in the gravitational field for which acceleration is being calculated
	 * @arg body2 the mass from whom gravity is being calculated
	 *
	 * @return object with x and y component acceleration
	 */
	function determineAcceleration(body1, body2) {
		var dX = body2.position.x - body1.position.x,
			dY = body2.position.y - body1.position.y,
			aX = componentA(body2.mass, dY, dX),
			aY = componentA(body2.mass, dX, dY);	
		return {x:aX, y:aY};
	}
	

	
	/**
	 * theta Function
	 * private
	 *
	 * @arg o triangle side length opposite to the angle being calculated
	 * @arg a triangle side length adjacent to the angle being calculated
	 *
	 * @return radians of the angle
	 */
	function theta(o, a) {
		if (a == 0) {
			return 0;
		} else {
			return Math.atan(Math.abs(o/a));
		}
	}
	
	/**
	 * g Function
	 * private
	 *
	 * @arg mass The mass of the object with the acceleration being calculated
	 * @arg h The distance between the two objects
	 *
	 * @return The gravitational force from a mass at distance h
	 */
	function g(mass, h) {
		if (h == 0) {
			return 0;
		} else {
			return (G() * mass / Math.pow(h, 2));
		}
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
	function hypotenuse(o, a) {
		return Math.sqrt(Math.pow(o, 2) + Math.pow(a, 2));
	}
	
	/** 
	 * Getters and Setters
	 */
	this.__defineGetter__("bodies", function () {
		return bodies;
	});
	
	this.__defineSetter__("bodies", function (arg) {
		bodies = arg;
	});
	
	this.__defineGetter__("timeMod", function () {
		return timeMod;
	});
	
	this.__defineSetter__("timeMod", function (arg) {
		timeMod = arg;
	});
};
