function Ball(x, y, radius) {
	var self = this;
	this.radius = radius;
	this.x = x;
	this.y = y;

	this.acceleration = {
		x: 0, // right-to-left tilt: 0 = level, 1 = way left, -1 = way right
		y: 0, // front-to-back tilt: 0 = level, 1 = backward, -1 = forward
		z: 0  // vertical acceleration: moving device upward makes this go down, 1 = standard earth gravity
	};

	this.speed = {
		x: 0,
		y: 0,
		z: 0
	};

	this.setAcceleration = function(event) {
		self.acceleration = event.acceleration;
	};

	this.setAccelerationFromOrientation = function(event) {
		self.acceleration = { x: Math.sin(event.gamma*Math.PI/180), y: Math.sin(event.beta*Math.PI/180), z: 1 };
	};

	this.updateSpeeds = function() {
		for(var dimension in self.speed) {
			self.speed[dimension] += self.acceleration[dimension];
		}
	};

	this.move = function() {
		self.updateSpeeds();
		var canvas = $("#canvas").get(0);

		self.x -= self.speed.x;
		// check bounds
		if(self.x - self.radius < 0) {
			self.x = self.radius;
			self.speed.x = 0;
		} else if(self.x + self.radius > canvas.width) {
			self.x = canvas.width - self.radius;
			self.speed.x = 0;
		}

		self.y -= self.speed.y;
		if(self.y - self.radius < 0) {
			self.y = self.radius;
			self.speed.y = 0;
		} else if(self.y + self.radius > canvas.height) {
			self.y = canvas.height - self.radius;
			self.speed.y = 0;
		}

		self.draw();
	};

	this.draw = function() {
		var canvas = $("#canvas").get(0);
		var ctx = canvas.getContext("2d");
		canvas.width = canvas.width; // clear canvas

		ctx.beginPath();
		ctx.fillStyle = "#000";
		ctx.arc(self.x, self.y, self.radius, 0, Math.PI*2, true);
		ctx.closePath();
		ctx.fill();
	};
}

$(function() {
	var FRAMES_PER_SECOND = 40;
	var BALL_RADIUS = 50;

	var canvas = $("#canvas").get(0);
	canvas.width = $(window).width() - 5;
	canvas.height = $(window).height() - 5;

	var ball = new Ball(canvas.width/2, 0, BALL_RADIUS);


	window.addEventListener("MozOrientation", ball.setAcceleration, true);  
	// Webkit (Chrome)
	window.addEventListener("deviceorientation", ball.setAccelerationFromOrientation, true);  
	setInterval(ball.move, 1000 / FRAMES_PER_SECOND);
});
