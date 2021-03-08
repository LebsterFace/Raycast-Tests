const canv = document.getElementById("game"),
	ctx = canv.getContext("2d"),
	KEYS = {};

let mouseX = 0,
	mouseY = 0;

const player = {
	x: 960,
	y: 540,
	radius: 15
};

const OPTIONS = {
	RESOLUTION: 0.5,
	CAST_PRECISION: 3,
	WALLS_FIRST: false,
	MAX_DISTANCE: 2000
};

const degreesToRad = d => Math.PI * 2 / 360 * (d % 360),
	circle = (x, y, r) => {
		ctx.beginPath();
		ctx.arc(x, y, r, 0, Math.PI * 2);
		ctx.fill();
	},
	randomInt = (min, max) => Math.floor(Math.random() * (max - min) + min),
	distanceBetween = (x1, y1, x2, y2) => {
		const A = x2 - x1,
			B = y2 - y1;

		return Math.sqrt(A * A + B * B);
	};

class Wall {
	constructor(x, y, width, height) {
		this.corners = [{x: x, y: y}, {x: x + width, y: y}, {x: x + width, y: y + height}, {x: x, y: y + height}];

		this.lines = [{from: this.corners[0], to: this.corners[1]}, {from: this.corners[1], to: this.corners[2]}, {from: this.corners[2], to: this.corners[3]}, {from: this.corners[3], to: this.corners[0]}];
	}

	render() {
		ctx.fillStyle = "#1D1F29";
		ctx.beginPath();
		ctx.moveTo(this.corners[0].x, this.corners[0].y);
		ctx.lineTo(this.corners[1].x, this.corners[1].y);
		ctx.lineTo(this.corners[2].x, this.corners[2].y);
		ctx.lineTo(this.corners[3].x, this.corners[3].y);
		ctx.fill();
	}

	renderPoints() {
		ctx.fillStyle = "orange";
		for (const {x, y} of this.corners) circle(x, y, 5);
	}

	check(vector) {
		for (const {from, to} of this.lines) {
			const den = (from.x - to.x) * (vector.y1 - vector.y2) - (from.y - to.y) * (vector.x1 - vector.x2);
			if (den == 0) continue;

			const t = ((from.x - vector.x1) * (vector.y1 - vector.y2) - (from.y - vector.y1) * (vector.x1 - vector.x2)) / den;
			const u = -((from.x - to.x) * (from.y - vector.y1) - (from.y - to.y) * (from.x - vector.x1)) / den;

			if (t > 0 && t < 1 && u > 0) {
				return {
					x: from.x + t * (to.x - from.x),
					y: from.y + t * (to.y - from.y)
				};
			}
		}

		return null;
	}
}

class Vector {
	constructor(x, y, angle, length = 1) {
		this.x1 = x;
		this.y1 = y;
		this.x2 = x - length * Math.cos(angle);
		this.y2 = y - length * Math.sin(angle);
	}

	get length() {
		return distanceBetween(this.x1, this.y1, this.x2, this.y2);
	}

	set length(value) {
		value = Math.abs(value);

		const currentLength = this.length;
		const A = (this.x2 - this.x1) / currentLength,
			B = (this.y2 - this.y1) / currentLength;

		if (Number.isNaN(A) || Number.isNaN(B)) return false;

		this.x2 = this.x1 + A * value;
		this.y2 = this.y1 + B * value;
	}

	render() {
		ctx.strokeStyle = "#e0e0e0";
		ctx.beginPath();
		ctx.moveTo(this.x1, this.y1);
		ctx.lineTo(this.x2, this.y2);
		ctx.stroke();
	}

	cast() {
		let lowestDistance = Infinity,
			pointWithLD = null;

		for (const wall of walls) {
			const point = wall.check(this);
			if (point === null) continue;
			const distance = distanceBetween(point.x, point.y, this.x1, this.x2);
			if (distance < lowestDistance) {
				pointWithLD = point;
				lowestDistance = distance;
			}
		}

		if (pointWithLD) {
			this.x2 = pointWithLD.x;
			this.y2 = pointWithLD.y;
		} else {
			this.length = 0.001;
		}
	}
}

const walls = [new Wall(0, 0, 1920, 10), new Wall(0, 0, 10, 1080), new Wall(1910, 0, 10, 1080), new Wall(0, 1070, 1920, 10), new Wall(randomInt(10, 1900), randomInt(10, 1060), randomInt(1, 300), randomInt(1, 300)), new Wall(randomInt(10, 1900), randomInt(10, 1060), randomInt(1, 300), randomInt(1, 300)), new Wall(randomInt(10, 1900), randomInt(10, 1060), randomInt(1, 300), randomInt(1, 300)), new Wall(randomInt(10, 1900), randomInt(10, 1060), randomInt(1, 300), randomInt(1, 300)), new Wall(randomInt(10, 1900), randomInt(10, 1060), randomInt(1, 300), randomInt(1, 300)), new Wall(randomInt(10, 1900), randomInt(10, 1060), randomInt(1, 300), randomInt(1, 300)), new Wall(randomInt(10, 1900), randomInt(10, 1060), randomInt(1, 300), randomInt(1, 300)), new Wall(randomInt(10, 1900), randomInt(10, 1060), randomInt(1, 300), randomInt(1, 300))];

ctx.font = "800 32px monospace";
ctx.textBaseline = "top";

const lastFPS = Array.from({length: 30}, x => 0);

function renderWalls() {
	for (const wall of walls) {
		wall.render();
		wall.renderPoints();
	}
}

function raycast() {
	for (let i = 0; i < 360; i += OPTIONS.RESOLUTION) {
		const ray = new Vector(player.x, player.y, degreesToRad(i), 0.01);
		ray.cast();
		ray.render();
	}
}

function render() {
	const START = performance.now();
	ctx.fillStyle = "#2C2C2C";
	ctx.fillRect(0, 0, 1920, 1080);

	if (OPTIONS.WALLS_FIRST) {
		renderWalls();
		raycast();
	} else {
		raycast();
		renderWalls();
	}

	ctx.fillStyle = "#EB1D34";
	ctx.beginPath();
	ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
	ctx.fill();

	update();

	ctx.fillStyle = "#FFF";
	lastFPS.pop();
	lastFPS.unshift(performance.now() - START);
	ctx.fillText((1000 / avg(lastFPS)).toFixed(1) + " FPS", 10, 10);
	requestAnimationFrame(render);
}

function avg(array) {
	let i = 0,
		result = 0;
	for (; i < array.length; i++) result += array[i];
	return result / i;
}

function update() {
	player.x = mouseX;
	player.y = mouseY;
}

document.addEventListener("keydown", e => {
	KEYS[e.code] = true;
});

document.addEventListener("keyup", e => {
	KEYS[e.code] = false;
});

document.addEventListener("mousemove", e => {
	const boundingRect = canv.getBoundingClientRect(),
		widthRatio = canv.width / boundingRect.width,
		heightRatio = canv.height / boundingRect.height;

	mouseX = (e.clientX - boundingRect.left) * widthRatio;
	mouseY = (e.clientY - boundingRect.top) * heightRatio;
});

requestAnimationFrame(render);
