Controller = function() {	
	var universe = new Universe();
	var timeMod = 1000/60;
	var interval;
	
	/**
	 * testSetupAndStart Function
	 * 
	 * Function to load in the bodies and start the simulation
	 */
	this.testSetupAndStart = function() {
		var body = new Body();
		var body2 = new Body();
		var body3 = new Body();
        universe.bodies = [];

		body.position.x = 300;
		body.position.y = 300;
		body.radius = 10;
		body.mass = 0;	
		body.bodyName = "Voyager";
		body.type = "player";
		body.fixed = true;
			
		body2.position.x = 500;
		body2.position.y = 300;
		body2.radius = 50;
		body2.mass = 1000000;
		body2.bodyName = "Earth";
		body2.type = "planet";
		body2.fixed = true;
			
		body3.position.x = 1100;
		body3.position.y = 500;
		body3.radius = 100;
		body3.mass = 1000000;	
		body3.bodyName = "Saturn";
		body3.type = "planet";
		body3.fixed = true;
		
		universe.bodies.push(body);
		universe.bodies.push(body2);
		//universe.bodies.push(body3);
	
		$('body').trigger('renderUniverse', [universe.bodies]);	
		
		restart();
	};
	
	/**
	 * speedUpTime Function
	 * public
	 *
	 * Function to modify the timeMod variable and restart the simulation with the new timeMod
	 */
	this.speedUpTime = function() {
		timeMod = timeMod / 1.5;
		restart();
	};
	
	/**
	 * speedDownTime Function
	 * public
	 *
	 * Function to modify the timeMod variable and restart the simulation with the new timeMod
	 */
	this.speedDownTime = function() {
		timeMod = timeMod * 1.5;
		restart();
	};
	
	/**
	 * launch Function
	 * public
	 *
	 * @arg arg the launch velocity of the player
	 *
	 * Function to set player velocity and release from fixed position
	 */
	this.launch = function(arg) {
		universe.setPlayerVelocity(arg);
		universe.releasePlayer();
	};
	
	/**
	 * drawPath Function
	 */
	this.drawPath = function(iterations, velocity) {
		var body = new Body();
		body.position.x = universe.bodies[0].position.x;
		body.position.y = universe.bodies[0].position.y;
		body.addVelocity(velocity);
		body.addVelocity(universe.bodies[0].velocity);
		$('body').trigger('drawPath', [universe.findPathPositions(body, iterations)]);
	}
	
	/**
	 * Restart Function
	 * private
	 *
	 * This function is used to start or restart the simulation, will be called when the controller is created as well as when time is sped up
	 * or slowed down
	 */
	function restart() {
		clearInterval(interval);
		interval = setInterval(function() { 
			universe.findAndUpdatePosition();
		}, timeMod);
	}
}
