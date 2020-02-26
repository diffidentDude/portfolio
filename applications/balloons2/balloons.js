const canvas = document.createElement('canvas');
	canvas.height = window.innerHeight
	canvas.width = window.innerWidth;
	document.querySelector('body').appendChild(canvas);


var ctx = canvas.getContext('2d');

function draw(ctx, balls) {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	balls.forEach(ball => {
		ctx.fillStyle = ball.colour;
		ctx.beginPath();
		ctx.arc(ball.position.x, ball.position.y, ball.radius.x, 0, Math.PI * 2, true);
		ctx.fill();
	});
    ctx.closePath();
}

const worker = new Worker('worker.js');
const renderTimes = [];
worker.onmessage = ({ data }) => {
	if (data.type === 'balls') {
		draw(ctx, data.balls);
	}
	if (data.type === 'renderTime') {
		renderTimes.push(data.time);
		const average = renderTimes.reduce((acc, next) => {
			return acc + next;
		}, 0) / renderTimes.length;
		console.log(`Frame took ${data.time}ms, average ${average}ms to render`);
	}
};

const dimensions = {
	type: 'dimensions',
	dimensions: {
		x: canvas.width, 
		y: canvas.height
	}
}

worker.postMessage(dimensions);
