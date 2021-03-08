const OPTIONS = {
	RESOLUTION: 0.1,
	CAST_PRECISION: 7,
	MAX_DISTANCE: 2250
};
	
const circle = (x, y, r) => {
	ctx.beginPath();
	ctx.arc(x, y, r, 0, Math.PI * 2);
	ctx.fill();
};
	
class Box {
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
		ctx.strokeStyle = "#FFFFFF2F";
		ctx.beginPath();
		ctx.moveTo(this.x1, this.y1);
		ctx.lineTo(this.x2, this.y2);
		ctx.stroke();
	}
	
	cast() {
		while (true) {
			for (const wall of level) if (wall.contains(this.x2, this.y2)) return;
			this.length += OPTIONS.CAST_PRECISION;
			if (this.length > OPTIONS.MAX_DISTANCE) return;
		}
	}
}
	
const level = [
	new Box(0, 0, 1920, 10),
	new Box(0, 0, 10, 1080),
	new Box(1910, 0, 10, 1080),
	new Box(0, 1070, 1920, 10),
	
	new Box(randomInt(10, 1900), randomInt(10, 1060), randomInt(1, 300), randomInt(1, 300)),
	new Box(randomInt(10, 1900), randomInt(10, 1060), randomInt(1, 300), randomInt(1, 300)),
	new Box(randomInt(10, 1900), randomInt(10, 1060), randomInt(1, 300), randomInt(1, 300)),
	new Box(randomInt(10, 1900), randomInt(10, 1060), randomInt(1, 300), randomInt(1, 300)),
	new Box(randomInt(10, 1900), randomInt(10, 1060), randomInt(1, 300), randomInt(1, 300)),
	new Box(randomInt(10, 1900), randomInt(10, 1060), randomInt(1, 300), randomInt(1, 300)),
	new Box(randomInt(10, 1900), randomInt(10, 1060), randomInt(1, 300), randomInt(1, 300)),
	new Box(randomInt(10, 1900), randomInt(10, 1060), randomInt(1, 300), randomInt(1, 300))
];

function renderLevel() {
	for (const wall of level) wall.render();
}
	
function performRaycast() {
	for (let i = 0; i < 360; i += OPTIONS.RESOLUTION) {
		const ray = new Vector(player.x, player.y, i * DEGREES_PER_RAD, 0.01);
		ray.cast();
		ray.render();
	}
}

requestAnimationFrame(render);