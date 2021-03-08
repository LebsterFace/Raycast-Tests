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
		this.corners = [
			{x: x, y: y},
			{x: x + width, y: y},
			{x: x + width, y: y + height},
			{x: x, y: y + height}
		];

		this.lines = [
			{from: this.corners[0], to: this.corners[1]},
			{from: this.corners[1], to: this.corners[2]},
			{from: this.corners[2], to: this.corners[3]},
			{from: this.corners[3], to: this.corners[0]}
		];
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

			if (t > 0 && 1 > t && u > 0) {
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
		ctx.strokeStyle = "#FFFFFF2F";
		ctx.beginPath();
		ctx.moveTo(this.x1, this.y1);
		ctx.lineTo(this.x2, this.y2);
		ctx.stroke();
	}

	cast() {
		let lowestDistance = Infinity,
			pointWithLD = null;

		for (const wall of level) {
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
	for (const wall of level) {
		wall.render();
		wall.renderPoints();
	}
}

function performRaycast() {
	for (let i = 0; i < 360; i += OPTIONS.RESOLUTION) {
		const ray = new Vector(player.x, player.y, i * DEGREES_PER_RAD, 0.01);
		ray.cast();
		ray.render();
	}
}

requestAnimationFrame(render);
