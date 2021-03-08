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
	RESOLUTION: 0.1,
	CAST_PRECISION: 7,
	WALLS_FIRST: false,
	MAX_DISTANCE: 2000
};
	
const degreesToRad = d => Math.PI * 2 / 360 * (d % 360),
	circle = (x, y, r) => {
		ctx.beginPath();
		ctx.arc(x, y, r, 0, Math.PI * 2);
		ctx.fill();
	},
	randomInt = (min, max) => Math.floor(Math.random() * (max - min) + min);
	
class Wall {
	constructor(x, y, width, height) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}
	
	render() {
		ctx.fillStyle = "#1D1F29";
		ctx.fillRect(this.x, this.y, this.width, this.height);
	}
	
	renderPoints() {
		ctx.fillStyle = "orange";
		circle(this.x, this.y, 5);
		circle(this.x + this.width, this.y, 5);
		circle(this.x + this.width, this.y + this.height, 5);
		circle(this.x, this.y + this.height, 5);
	}
	
	contains(x, y) {
		return this.x <= x && this.x + this.width >= x && this.y <= y && this.y + this.height >= y;
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
		const A = this.x2 - this.x1,
			B = this.y2 - this.y1;
	
		return Math.sqrt(A * A + B * B);
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
		ctx.strokeStyle = "#FFFFFF4F";
		ctx.beginPath();
		ctx.moveTo(this.x1, this.y1);
		ctx.lineTo(this.x2, this.y2);
		ctx.stroke();
	}
	
	cast() {
		while (true) {
			for (const wall of walls) if (wall.contains(this.x2, this.y2)) return;
			this.length += OPTIONS.CAST_PRECISION;
			if (this.length > OPTIONS.MAX_DISTANCE) return;
		}
	}
}
	
const walls = [
	new Wall(0, 0, 1920, 10),
	new Wall(0, 0, 10, 1080),
	new Wall(1910, 0, 10, 1080),
	new Wall(0, 1070, 1920, 10),
	new Wall(randomInt(10, 1900), randomInt(10, 1060), randomInt(1, 300), randomInt(1, 300)),
	new Wall(randomInt(10, 1900), randomInt(10, 1060), randomInt(1, 300), randomInt(1, 300)),
	new Wall(randomInt(10, 1900), randomInt(10, 1060), randomInt(1, 300), randomInt(1, 300)),
	new Wall(randomInt(10, 1900), randomInt(10, 1060), randomInt(1, 300), randomInt(1, 300)),
	new Wall(randomInt(10, 1900), randomInt(10, 1060), randomInt(1, 300), randomInt(1, 300)),
	new Wall(randomInt(10, 1900), randomInt(10, 1060), randomInt(1, 300), randomInt(1, 300)),
	new Wall(randomInt(10, 1900), randomInt(10, 1060), randomInt(1, 300), randomInt(1, 300)),
	new Wall(randomInt(10, 1900), randomInt(10, 1060), randomInt(1, 300), randomInt(1, 300))
];
	
ctx.font = "800 32px monospace";
ctx.textBaseline = "top";
	
const lastFPS = Array.from({length: 30}, x => 0);
	
function renderWalls() {
	for (const wall of walls) wall.render();
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