/*****************************************************************************/
//	Snake!
//	By Isaac Cormack
/*****************************************************************************/

let scale = 20; // scale = borderWidth
let startPos = 50;
let time = 0; //counter for high score text blinking

new p5();

Canvas = {
	width:scale*floor(window.innerWidth/scale)-scale,
	height:scale*floor(window.innerHeight/scale)-scale
}

function Snake(x, y) {
	this.x = x;
	this.y = y;
	this.size = scale;
	this.total = 1;
	this.tail = [];
	this.record = 0;
	this.score = 0;
	this.prevRecord = 0;

	this.show = function() {
		for (var i = 0; i < this.tail.length; i++) {
			fill(color(0,255,100));
			stroke(0);
			rectMode(CENTER);
			rect(this.tail[i].x, this.tail[i].y, this.size, this.size);
		}
	}
	this.update = function() {
		this.x += this.xSpeed;
		this.y += this.ySpeed;
		if (this.total === this.tail.length) {
			for (var i = 0; i < this.total; i++) {
				this.tail[i] = this.tail[i+1];
			}
		}

		this.tail[this.total-1] = createVector(this.x, this.y);

	}
	this.dir = function(x, y) {
		this.xSpeed = x;
		this.ySpeed = y;
	}
	this.reset = function() {
		this.reset.called = true;
		this.tail = [];
		this.x = startPos;
		this.y = startPos;
		this.xSpeed = 0;
		this.ySpeed = 0;
		this.prevRecord = this.record;
		if (this.total-1 > this.record) {
			this.record = this.total-1;
		}
		this.score = this.total-1;
		this.total = 1;
		f.move();
	}
	this.die = function() {
		for (var i = 0; i < this.tail.length-1; i++) {
			if (this.x === this.tail[i].x && this.y === this.tail[i].y) {
				this.reset();
			}
		}
		if (this.x > Canvas.width-scale || this.y > Canvas.height-scale || this.x < scale || this.y < scale) {
			this.reset();
		}
	}
}

function Food() {
	this.move = function() {
		this.x = scale*floor(random(1, (Canvas.width/scale)-2))+10;
		this.y = scale*floor(random(1, (Canvas.height/scale)-2))+10;
		this.size = scale;
		for (var i = 0; i < s.tail.length; i++) {
			if (this.x === s.tail[i].x && this.y === s.tail[i].y) {
				f.move();
			}
		}
	}
	this.show = function() {
		fill(color(255, 0, 0));
		stroke(0);
		rectMode(CENTER);
		rect(this.x, this.y, this.size, this.size);
	}
}

function eat() {
	if (s.x === f.x && s.y === f.y) {
		f.move();
		s.total += 1;
	}
}

function setup() {
	createCanvas(Canvas.width, Canvas.height);
	frameRate(10);
	s = new Snake(startPos, startPos);
	s.dir(0,0);
	f = new Food();
	f.move();
}

function draw() {
	background(color(0, 255, 255));
	preGameText();
	postGameText();
	border();
	s.show();
	f.show();
	s.update();
	eat();
	s.die();
}

function border() {
	fill(color(0,100,255));
	noStroke();
	rectMode(CORNER);
	rect(0, 0, scale, Canvas.height);
	rect(Canvas.width, 0, -scale, Canvas.height);
	rect(scale, 0, Canvas.width-2*scale, scale);
	rect(scale, Canvas.height, Canvas.width-2*scale, -scale);
}



function preGameText() {
	if (!s.reset.called && (s.xSpeed === 0 && s.ySpeed === 0)) {
		fill(0);
		textSize(Canvas.width/16);
		textAlign(CENTER);
		text("Press any Arrow Key to Start!", Canvas.width/2, Canvas.height/2);
	}
}

function postGameText() {
	if (s.reset.called && (s.xSpeed === 0 && s.ySpeed === 0)) {
		fill(0);
		fontSize = Canvas.width/6;
		textSize(fontSize);
		textAlign(CENTER);
		text("You Died!", Canvas.width/2, Canvas.height/2);
		textSize(Canvas.width/18);
		text("Your Score: " + s.score, Canvas.width/2 - Canvas.width/5, Canvas.height/2 + fontSize/3);
		text("High Score: " + s.record, Canvas.width/2 + Canvas.width/5, Canvas.height/2 + fontSize/3);
		if(s.score > s.prevRecord && time < 5) {
			fill(color(255,0,0));
			text("New High Score!", Canvas.width/2, Canvas.height/2 + 2*fontSize/3);
		}
		if (time > 8)
			time = 0;
		time += 1;
	}
}

function keyPressed() {
	if (keyCode === UP_ARROW && (s.ySpeed != scale || s.tail.length == 1)) {
		s.dir(0, -scale);
	} else if (keyCode === DOWN_ARROW && (s.ySpeed != -scale || s.tail.length == 1)) {
		s.dir(0, scale);
	} else if (keyCode === RIGHT_ARROW && (s.xSpeed != -scale || s.tail.length == 1)) {
		s.dir(scale, 0);
	} else if (keyCode === LEFT_ARROW && (s.xSpeed != scale || s.tail.length == 1)) {
		s.dir(-scale, 0);
	}
}
