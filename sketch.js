var G = .0002; //Gravitational Constant
var totalBalls = 80;
var e = 1; //elasticity
var backgroundColor = [255,255,255];
var minRad = 3;
var maxRad = 66;
var minInVel = -.2;
var maxInVel = .2;
var maxTrailLength = 50;

var balls = [];
function ball(x,y,r){
	this.x = x;
	this.y = y;
	this.r = r;
	this.velx = random(minInVel,maxInVel);
	this.vely = random(minInVel,maxInVel);
	this.mass = r*r;
	this.forcex = 0;
	this.forcey = 0;
	this.history = [createVector(this.x, this.y)];
	this.color = [random(0,255), random(0,255), random(0,255)];
	this.isOverlap = function(otherBall){
		if(dist(this.x, this.y, otherBall.x, otherBall.y) < this.r + otherBall.r || 
			this.x - this.r <= 0 || 
			this.x + this.r >= width || 
			this.y - this.r <= 0 || 
			this.y + this.r >= height
		){
			return true;
		}
		return false;
	}

}
function setup() {
	createCanvas(window.innerWidth,window.innerHeight);
	for (; balls.length < totalBalls;) {
		newBall = new ball(random(width), random(height), random(minRad,maxRad));
		isGood = true;
		for (j = 0; j < balls.length; j++){
			if(newBall.isOverlap(balls[j])){
				isGood = false;
				break;
			}
		}
		if (isGood){
			balls.push(newBall);
		}
	}
	maxTrailLength = Math.sqrt(width*height)/20;
}

function drawTail(history, c){
	noFill();
	//beginShape();
	for(var i = 0; i < history.length-1; i++){
		var alpha = map(i, 0, history.length-2, 0, 255);
		stroke(c[0], c[1], c[2], alpha);
		line(history[i].x, history[i].y, history[i+1].x, history[i+1].y);
		//vertex(history[i].x, history[i].y);
	}
	//endShape();
}

function draw() {
	background(backgroundColor);
	update();
	for(i = 0; i < balls.length; i++){
		drawTail(balls[i].history, balls[i].color);
		fill(balls[i].color);
		noStroke();
		ellipse(balls[i].x, balls[i].y, 2*balls[i].r, 2*balls[i].r);
	}
	console.log(balls.length);
}
function update(){


	for(i = 0; i < balls.length - 1; i++){
		for(j = i+1; j < balls.length; j++){
			var f12 = G*balls[i].mass*balls[j].mass/pow((pow(balls[i].x-balls[j].x, 2) + pow(balls[i].y-balls[j].y, 2)),1);

			balls[i].forcex = -f12*(balls[i].x-balls[j].x);
			balls[i].forcey = -f12*(balls[i].y-balls[j].y);

			balls[j].forcex = f12*(balls[i].x-balls[j].x);
			balls[j].forcey = f12*(balls[i].y-balls[j].y);

			balls[i].velx += balls[i].forcex/balls[i].mass;
			balls[i].vely += balls[i].forcey/balls[i].mass;

			balls[j].velx += balls[j].forcex/balls[j].mass;
			balls[j].vely += balls[j].forcey/balls[j].mass;



			if (balls[i].x - balls[i].r <= 0 || balls[i].x + balls[i].r >= width) {
				balls[i].velx *= -e;
				balls[i].x += balls[i].velx/e;
			}
			if (balls[i].y - balls[i].r <= 0 || balls[i].y + balls[i].r >= height){
				balls[i].vely *= -e;
				balls[i].y += balls[i].vely/e;
			}
			if (balls[j].x - balls[j].r <= 0 || balls[j].x + balls[j].r >= width) {
				balls[j].velx *= -e;
				balls[j].x += balls[j].velx/e;
			}
			if (balls[j].y - balls[j].r <= 0 || balls[j].y + balls[j].r >= height){
				balls[j].vely *= -e;
				balls[j].y += balls[j].vely/e;
			}

			

			balls[i].x += balls[i].velx;
			balls[i].y += balls[i].vely;
			balls[j].x += balls[j].velx;
			balls[j].y += balls[j].vely;
			

		}

		balls[i].history.push(createVector(balls[i].x, balls[i].y));
		if(balls[i].history.length > maxTrailLength){
			balls[i].history.splice(0,1);
		}
		//println(balls[i].history);
	}

	// Adding trail of last ball
	balls[balls.length - 1].history.push(createVector(balls[balls.length - 1].x, balls[balls.length - 1].y));
	if(balls[balls.length - 1].history.length > maxTrailLength){
		balls[balls.length - 1].history.splice(0,1);
	}
	for(i = 0; i < balls.length - 1; i++){
		for(j = i+1; j < balls.length; j++){

			if(pow(pow(balls[i].x - balls[j].x, 2) + pow(balls[i].y - balls[j].y, 2), .5) < abs(balls[i].r + balls[j].r)){
				var b1 = balls[i], b2 = balls[j];
				var fm = b1.mass+b2.mass;
				var fv = [(b1.velx*b1.mass + b2.velx*b2.mass)/fm, (b1.vely*b1.mass + b2.vely*b2.mass)/fm];
				var fr = pow(fm,.5);
				var fc = [(b1.color[0]*b1.mass + b1.color[0]*b1.mass)/fm, 
						  (b1.color[1]*b1.mass + b1.color[1]*b1.mass)/fm, 
						  (b1.color[2]*b1.mass + b1.color[2]*b1.mass)/fm
				]
				var fx = (b1.x*b1.mass + b2.x*b2.mass)/fm;
				var fy = (b1.y*b1.mass + b2.y*b2.mass)/fm;
				balls[j].velx = fv[0];
				balls[j].vely = fv[1];
				balls[j].mass = fm;
				balls[j].r = fr;
				balls[j].x = fx;
				balls[j].y = fy;
				balls[j].color = fc;
				balls.splice(i, 1);
				j -= 1;
			}
		}
	}
}
