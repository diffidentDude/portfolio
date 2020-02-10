/**
 * Body, the fundamental object of the universe. Every physical thing within the world is a body object
 * @author nate
 */

 class Body {
	radius = 0;
	mass = 0;
	velocity = { x:0, y:0 };
	position = { x:0, y:0 };
	name;
	type;
	fixed = false;

	constructor(name, type, radius, mass, velocity, position, fixed) {
		this.name = name;
		this.type = type;
		this.radius = radius;
		this.mass = mass;
		this.velocity = velocity;
		this.position = position;
		this.fixed = fixed;
	}
 }

 export { Body };
