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

		for (const line of level) {
			const point = line.check(this);
			if (!point) continue;

			const A = (point.x - this.x1),
					B = (point.y - this.y1),
					currentDistance = Math.sqrt(A * A + B * B);
			
			if (currentDistance < lowestDistance) {
				lowestDistance = currentDistance;
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

	check(line) {
		const x1 = this.x1,
			y1 = this.y1,
			x2 = this.x2,
			y2 = this.y2;

		const x3 = line.x1,
			y3 = line.y1,
			x4 = line.x2,
			y4 = line.y2;

		const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
		if (den === 0) return false;
		
		const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den,
			  u = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / den;

		const doesIntersect = (0 < t && t < 1 && 0 < u);
		if (doesIntersect) {
			const PX = x1 + t * (x2 - x1),
				  PY = y1 + t * (y2 - y1);
			return {x: PX, y: PY};
		} else {
			return false;
		}
	}

	render() {
		ctx.beginPath();
		ctx.moveTo(this.x1, this.y1);
		ctx.lineTo(this.x2, this.y2);
		ctx.stroke();
	}
}

const level = [
	new Line(0, 0, 1920, 0),
	new Line(0, 0, 0, 1080),
	new Line(0, 1080, 1920, 1080),
	new Line(1920, 0, 1920, 1080),

	new Line(200, 200, 500, 800),
	new Line(600, 900, 1200, 400)
];

function performRaycast() {
	ctx.lineWidth = 1;
	ctx.strokeStyle = "#FFFFFF2F";
	for (let i = 0; i < 360; i += 0.08) {
		const ray = new Vector(player.x, player.y, DEGREES_PER_RAD * i, 0.0001);
		ray.cast();
		ray.render();
	}
}

function renderLevel() {
	ctx.strokeStyle = "#1E90FF";
	ctx.lineWidth = 8;
	for (const line of level) line.render();
}

requestAnimationFrame(render);