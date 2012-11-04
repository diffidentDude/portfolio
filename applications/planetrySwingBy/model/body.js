/**
 * Body, the fundamental object of the universe. Every physical thing within the world is a body object
 * @author nate
 */
Body = function () {
	var radius = 0, 
		mass = 0,
		velocity = {x:0, y:0},
		position = {x:0, y:0},
		acceleration = {x:0, y:0},
		bodyName = "",
		type = "",
		fixed = false;
	
	/**
	 * move Function
	 * public
	 *
	 * This function moves the body the x and y specified in the arg then triggers 'bodyMove' which tells the view to update the body position
	 *
	 * @arg: arg An object with x and y distance
	 */	
	this.move = function(arg) {
		position.x = position.x + arg.x;
		position.y = position.y + arg.y;
		$('body').trigger('bodyMove', [this]);
	}
	
	/**
	 * addVelocity Function
	 * public
	 *
	 * This function adds the x and y velocity in the arg to the x and y velocity of the body
	 *
	 * @arg: arg An object with x and y velocity
	 */
	this.addVelocity = function(arg) {
		velocity.x = velocity.x + arg.x;
		velocity.y = velocity.y + arg.y;
	}
	
	/**
	 * addAcceleration Function
	 * public
	 *
	 * This function adds the x and y acceleration in the arg to the x and y acceleration of the body
	 *
	 * @arg: arg An object with x and y acceleration
	 */
	this.addAcceleration = function(arg) {
		acceleration.x = acceleration.x + arg.x;
		acceleration.y = acceleration.y + arg.y;
	}
	
	this.__defineGetter__("acceleration", function () {
		return acceleration;
	});
	
	this.__defineSetter__("acceleration", function (arg) {
		acceleration = arg;
	});
		
	this.__defineGetter__("fixed", function () {
		return fixed;
	});
	
	this.__defineSetter__("fixed", function (arg) {
		fixed = arg;
	});
		
	this.__defineGetter__("bodyName", function () {
		return bodyName;
	});
	
	this.__defineSetter__("bodyName", function (arg) {
		bodyName = arg;
	});
	
	this.__defineGetter__("velocity", function () {
		return velocity;
	});
	
	this.__defineSetter__("velocity", function (arg) {
		velocity = arg;
	});  
	
	this.__defineSetter__("type", function (arg) {
		type = arg;
	});
	
	this.__defineGetter__("type", function () {
		return type;
	});
	
	this.__defineGetter__("radius", function () {
		return radius;
	});
	
	this.__defineSetter__("radius", function (arg) {
		radius = arg;
	});
	
	this.__defineGetter__("position", function () {
		return position;
	});
	
	this.__defineSetter__("position", function (arg) {
		position = arg;
	});
	
	this.__defineGetter__("mass", function () {
		return mass;
	});
	
	this.__defineSetter__("mass", function (arg) {
		mass = arg;
	});
};
