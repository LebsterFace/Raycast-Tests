const canv = document.getElementById("game"),
	ctx = canv.getContext("2d");

let mouseX = 0,
	mouseY = 0;

const player = {
	x: 960,
	y: 540,
	radius: 10
};

const DEGREES_PER_RAD = Math.PI * 2 / 360,
	randomInt = (min, max) => Math.floor(Math.random() * (max - min) + min),
	distanceBetween = (x1, y1, x2, y2) => {
		const A = x2 - x1,
			B = y2 - y1;
		return Math.sqrt(A * A + B * B);
	};

const FPS = Array.from({length: 50}, x => 1);

ctx.font = "800 24px monospace";
ctx.textBaseline = "top";
ctx.lineCap = "round";

function render() {
	const START = performance.now();
	ctx.fillStyle = "#2C2C2C";
	ctx.fillRect(0, 0, 1920, 1080);

	performRaycast();
	renderLevel();

	ctx.fillStyle = "#EB1D34";
	ctx.beginPath();
	ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
	ctx.fill();

	update();
	fps(START);
	requestAnimationFrame(render);
}

function update() {
	player.x = mouseX;
	player.y = mouseY;
}

function fps(START) {
	FPS.pop();
	FPS.unshift(performance.now() - START);
	let sum = 0;
	for (let i = 0; i < FPS.length; i++) sum += FPS[i];
	sum = 1000 / (sum / FPS.length);
	ctx.fillStyle = "white";
	ctx.fillText(Math.round(sum) + "FPS", 10, 10);
}

document.addEventListener("mousemove", e => {
	const boundingRect = canv.getBoundingClientRect(),
		widthRatio = canv.width / boundingRect.width,
		heightRatio = canv.height / boundingRect.height;

	mouseX = Math.max(0, Math.min(1920, (e.clientX - boundingRect.left) * widthRatio));
	mouseY = Math.max(0, Math.min(1080, (e.clientY - boundingRect.top) * heightRatio));
});

loadMode(new URLSearchParams(window.location.search).get("mode"));

function loadMode(raw) {
	const scriptTag = document.createElement("script");
	switch (raw) {
		default:
		case "box": scriptTag.src = "modes/Box.js";
		break;
		case "sbox": scriptTag.src = "modes/SimpleBox.js";
		break;
		case "line": scriptTag.src = "modes/Line.js";
		break;
		case "bline": scriptTag.src = "modes/BrokenLine.js";
		break;
	}

	document.body.appendChild(scriptTag);
}
