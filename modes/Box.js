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
		const currentLength = this.length;
		const A = (this.x2 - this.x1) / currentLength,
			B = (this.y2 - this.y1) / currentLength;

		if (Number.isNaN(A) || Number.isNaN(B)) return false;

		this.x2 = this.x1 + A * value;
		this.y2 = this.y1 + B * value;
	}

	cast() {
		let closestPoint = null,
			lowestDistance = Infinity;

		for (const box of level) {
			const point = box.check(this);
			if (!point) continue;

			if (point.distance < lowestDistance) {
				lowestDistance = point.distance;
				closestPoint = point;
			}
		}

		if (closestPoint) {
			this.x2 = closestPoint.x;
			this.y2 = closestPoint.y;
		}
	}

	render() {
		ctx.beginPath();
		ctx.moveTo(this.x1, this.y1);
		ctx.lineTo(this.x2, this.y2);
		ctx.stroke();
	}
}

class Line {
	constructor(x1, y1, x2, y2) {
		this.x1 = x1;
		this.y1 = y1;
		this.x2 = x2;
		this.y2 = y2;
	}

	check(vector) {
		const x1 = this.x1,
			y1 = this.y1,
			x2 = this.x2,
			y2 = this.y2;

		const x3 = vector.x1,
			y3 = vector.y1,
			x4 = vector.x2,
			y4 = vector.y2;

		const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
		if (den === 0) return null;

		const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den,
			  u = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / den;

		if (0 < t && t < 1 && 0 < u) {
			const PX = x1 + t * (x2 - x1),
				  PY = y1 + t * (y2 - y1);
			return {x: PX, y: PY, distance: distanceBetween(vector.x1, vector.y1, PX, PY)};
		}

		return null;
	}
}

class Box {
	constructor(x, y, width, height) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;

		this.lines = [
			new Line(x, y, x + width, y),
			new Line(x, y, x, y + height),
			new Line(x, y + height, x + width, y + height),
			new Line(x + width, y + height, x + width, y)
		];
	}

	render() {
		ctx.fillStyle = "#1D1F29";
		ctx.fillRect(this.x, this.y, this.width, this.height);
	}

	check(vector) {
		let lowestDistance = Infinity,
			closestPoint = null;

		for (const line of this.lines) {
			const point = line.check(vector);
			if (!point) continue;

			if (point.distance < lowestDistance) {
				lowestDistance = point.distance;
				closestPoint = point;
			}
		}

		return closestPoint;
	}
}

const level = [
	new Box(randomInt(0, 1920), randomInt(0, 1080), randomInt(1, 300), randomInt(1, 300)),
	new Box(randomInt(0, 1920), randomInt(0, 1080), randomInt(1, 300), randomInt(1, 300)),
	new Box(randomInt(0, 1920), randomInt(0, 1080), randomInt(1, 300), randomInt(1, 300)),
	new Box(randomInt(0, 1920), randomInt(0, 1080), randomInt(1, 300), randomInt(1, 300)),
	new Box(randomInt(0, 1920), randomInt(0, 1080), randomInt(1, 300), randomInt(1, 300)),
	new Box(randomInt(0, 1920), randomInt(0, 1080), randomInt(1, 300), randomInt(1, 300)),
];

function renderLevel() {
	for (const box of level) box.render();
}

function performRaycast() {
	ctx.lineWidth = 1;
	for (let i = 0; i < 360; i += 0.1) {
		ctx.strokeStyle = "#FFFFFF2F";
		const ray = new Vector(player.x, player.y, DEGREES_PER_RAD * i, 2250);
		ray.cast();
		ray.render();
	}
}

requestAnimationFrame(render);