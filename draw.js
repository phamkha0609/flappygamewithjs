var canvas = document.getElementById('paint');
const ctx = canvas.getContext('2d');

var isGameOver = false;
var isEndSpawn = false;
var min = 100, max = 350;
var bird = {x: 300, y: canvas.height / 3, r: 20, f: 0, gravity: 6};
var pipes = [];
var scores = 0;
var boss = {x: canvas.width + 300, y: 100, width: 100, height: 200};
var bullet = {x: canvas.width - 100, y: boss.y + boss.height / 2, r: 10, color: "green", speed: 15};
var text = "GAME OVER!";
var maxField = 10;
var maxR = 100;

function drawBird(){
	//body bird
	ctx.beginPath();
	ctx.fillStyle = "yellow";
	ctx.strokeStyle = "black";
	ctx.arc(bird.x, bird.y, bird.r, 0, 2 * Math.PI);
	ctx.fill();
	ctx.stroke();
	ctx.closePath();
	//eye bird
	ctx.beginPath();
	ctx.fillStyle = "blue";
	ctx.arc(bird.x + bird.r / 3, bird.y, bird.r / 4, 0, 2 * Math.PI);
	ctx.fill();
	ctx.closePath();
	//the mouth
	ctx.beginPath();
	ctx.moveTo(bird.x + bird.r, bird.y - bird.r / 2);
	ctx.lineTo(bird.x + bird.r * 1.5, bird.y);
	ctx.lineTo(bird.x + bird.r, bird.y + bird.r / 2);
	ctx.lineTo(bird.x + bird.r, bird.y);
	ctx.strokeStyle = '#666666';
	ctx.stroke();
	ctx.fillStyle = "orange";
	ctx.fill();
	ctx.closePath();
}
function moveBird(){
	bird.y += bird.gravity - bird.f;
}
function checkBirdCollision(){
	let pointR = bird.x + bird.r;
	let pointT = bird.y - bird.r;
	let pointD = bird.y + bird.r;
	
	if(bird.y + bird.r > canvas.height || bird.y - bird.r < 0){
		isGameOver = true;
	}
	pipes.forEach(elem => {
		if((pointR >= elem.x && pointR <= elem.x + elem.width && pointT <= elem.y + elem.height) || (pointR >= elem.x && pointR <= elem.x + elem.width && pointD >= elem.y + elem.height + 150)){
			isGameOver = true;
		}else if(pointR == elem.x + elem.width && pointT >= elem.y + elem.height && pointT <= elem.y + elem.height + 150){
			scores += 1;
		}
	});
}

function drawScores(){
	ctx.beginPath();
	ctx.font = "45px Bold Arial";
	ctx.fillStyle = "red";
	ctx.fillText(`SCORES: ${scores}`, 10, 50);
	ctx.closePath();
}

function spawnBoss(){
	if(scores >= maxField){
		drawBoss();
	}
}

function drawBoss(){
	//body
	ctx.beginPath();
	ctx.fillStyle = "red";
	ctx.fillRect(boss.x, boss.y, boss.width, boss.height);
	ctx.closePath();
	//eye
	ctx.beginPath();
	ctx.fillStyle = "yellow";
	ctx.fillRect(boss.x + boss.width / 3, boss.y + boss.width / 3, boss.width / 3, boss.width / 3);
	ctx.closePath();
	//mouth
	ctx.beginPath();
	ctx.fillStyle = "orange";
	strokeStyle = "black";
	ctx.moveTo(boss.x - boss.width, boss.y);
	ctx.lineTo(boss.x, boss.y + boss.height / 3);
	ctx.lineTo(boss.x, boss.y + boss.height - boss.height / 3);
	ctx.lineTo(boss.x - boss.width, boss.y + boss.height);
	ctx.lineTo(boss.x, boss.y + boss.height - boss.height / 2);
	ctx.stroke();
	ctx.fill();	
	ctx.closePath();
}
function moveBoss(){
	//move to fight position
	if(boss.x > canvas.width - 100 && scores == maxField){
		boss.x -= 1;
	}
}

function spawnPipeParent(){
	var fi = 0, vl = 0;
	fi = pipes.length - 1;
	if(pipes.length <= 0){
		vl = canvas.width;
	}else{
		vl = pipes[fi].x + 250;
	}
	var pipe = {
		x: vl,
		y: 0,
		width: 50, 
		height: Math.floor(Math.random() * (max - min) + min), 
		speed: -5
	};
	pipes.push(pipe);
}
function drawPipeParent(){
	pipes.forEach(elem => {
		//pipe up
		ctx.beginPath();
		ctx.fillStyle = "green";
		ctx.fillRect(elem.x, elem.y, elem.width, elem.height);
		ctx.closePath();
		//pipe down
		ctx.beginPath();
		ctx.fillStyle = "green";
		ctx.fillRect(elem.x, elem.y + elem.height + 150, elem.width, 500 - elem.height);
		ctx.closePath();
	});
	
}
function movePipe(){
	pipes.forEach(elem => {
		elem.x += elem.speed;
	});
}
function removePipe(){
	if(pipes.length >= maxField){
		isEndSpawn = true;
	}
}


function spawnBullet(){
	if(boss.x == canvas.width - 100 && bullet.r < maxR){
		drawBullet();
	}
}
function drawBullet(){
	ctx.beginPath();
	ctx.fillStyle = bullet.color;
	ctx.arc(bullet.x, bullet.y, bullet.r, 0, 2 * Math.PI);
	ctx.fill();
	ctx.closePath();
	if(bullet.x < 0){
		bullet.x = canvas.width - 100;
		bullet.r += 10;
		drawBullet();
	}
}
function moveBullet(){
	if(boss.x == canvas.width - 100){
		bullet.x -= bullet.speed;
	}
}

function handleKeyDown(){
	document.addEventListener("keydown", event => {
		if(event.keyCode == 32){
			bird.f = 3 * bird.gravity - 5;
		}
	});
	document.addEventListener("keyup", event => {
		if(event.keyCode == 32){
			bird.f = 1;
		}
	});
}
function checkBullet(){
	let bulletT = bullet.y - bullet.r;
	let bulletL = bullet.x - bullet.r;
	let bulletD = bullet.y + bullet.r;
	let bulletR = bullet.x + bullet.r;

	let inSideH = bird.x >= bulletL && bird.x <= bulletR;
	let inSideV = bird.y >= bulletT && bird.y <= bulletD;

	if(inSideH && inSideV){
		isGameOver = true;
	}
}


function winGame(){
	if(bullet.r >= maxR){
		isGameOver = true;
		text = "YOU WIN!!!";
	}
}

function gameOver(){
	ctx.beginPath();
	ctx.font = "100px Consolas";
	ctx.fillStyle = "purple";
	ctx.fillText(`${text}`, canvas.width / 2 - 250, canvas.height / 2);
	ctx.fillStyle = "black";
	ctx.font = "50px Consolas";
	ctx.fillText(`YOUR SCORES: ${scores}`, canvas.width / 2 - 180, canvas.height / 2 + 50);
	ctx.closePath();
}

document.querySelector(".restart").addEventListener("click", function (){
	window.location.reload();
}); //restart game

function draw() {
	if(!isGameOver){
		// draw
		ctx.clearRect(0, 0, canvas.width, canvas.height); // clear display
		drawBird();
		if(!isEndSpawn){
			spawnPipeParent();
		}
		drawPipeParent();
		spawnBullet();
		spawnBoss();
		drawScores();

		// process
		moveBird();
		movePipe();
		moveBoss();
		moveBullet();
		handleKeyDown();
		checkBirdCollision();
		removePipe();
		checkBullet();
		winGame();
		// repeat
		requestAnimationFrame(draw);	
	}else{
		gameOver();
	}
	
}
requestAnimationFrame(draw);