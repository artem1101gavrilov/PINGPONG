var finishgame = false;

// класс определяющий параметры игрового прямоугольника и метод для его отрисовки
function rect(color, x, y, width, height) {
    this.color = color;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.draw = function() {
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.width, this.height);
    };
}
// движение игрока
function playerMove(e) {
    var x = e.pageX;
    if (player.width / 2 + 10 < x && x < game.width - player.width / 2 - 10) {
        player.x = x - player.width / 2;
    }
}

function collision(objA, objB) {
if (objA.x+objA.width  > objB.x &&
	objA.x             < objB.x+objB.width &&
	objA.y+objA.height > objB.y &&
	objA.y             < objB.y+objB.height) {
		return true;
	}
	else {
		return false;
		}
}

// отрисовка игры
function draw() {
    game.draw(); // рисуем игровое поле
    // рисуем на поле счёт
    context.font = 'bold 128px courier';
    context.textAlign = 'center';
    context.textBaseline = 'top';
    context.fillStyle = '#ccc';
    context.fillText(ai.scores, 100, game.height / 4 );
    context.fillText(player.scores, game.width - 100, 3* game.height / 4-128);
    for (var i = 10; i < game.height; i += 45)
    // линия разделяющая игровое поле на две части
    {
        context.fillStyle = "#ccc";
        context.fillRect(i, game.height / 2 - 5, 30, 10);
    }
    ai.draw(); // рисуем левого игрока
    player.draw(); // правого игрока
    ball.draw(); // шарик
}

function aiMove() {
	var x;
	// делаем скорость оппонента на две единицы меньше чем скорость шарика
	var vX = Math.abs(ball.vX)*0.80;
	if (ball.x < ai.x + ai.width/2) {
		x = ai.x - vX;
	}
	else {
		x = ai.x + vX;
	}
	if (10 < x && x < game.width - ai.width - 10) {
		ai.x = x;
	}
}

function update() {
	// меняем координаты шарика
	if (ball.x<0 || ball.x+ball.width>game.width) {
		ball.vX = -ball.vX;
	}
	if (ball.y<0) {
		ball.vY = -ball.vY;
		player.scores ++;
		if(player.scores == 10) finishgame = true;
		
		kuda = Math.floor(Math.random()*2);
		if (kuda == 0)  ball.vX = Math.random()*2; // скорость по оси х
		else ball.vX = -1*Math.random()*2; // скорость по оси х
		kuda = Math.floor(Math.random()*2);
		//if (kuda == 0) ball.vY = Math.random()*2; // скорость по оси у
		//else ball.vY = -1*Math.random()*2;
		ball.vY = -1*Math.random()*2;
		
		ball.x = game.height / 2 - 10;
		ball.y = game.height / 2 - 10;
		
		player.width = 80;
		ai.width = 80;
		ball.width = 20;
		ball.height = 20;
	}
	if (ball.y+ball.height>game.height) {
		// столкновение с правой
		ball.vY = -ball.vY;
		ai.scores ++;
		if(ai.scores == 10) finishgame = true;
		
		kuda = Math.floor(Math.random()*2);
		if (kuda == 0)  ball.vX = Math.random()*2; // скорость по оси х
		else 
		kuda = Math.floor(Math.random()*2);
		//if (kuda == 0) ball.vY = Math.random()*2; // скорость по оси у
		//else ball.vY = -1*Math.random()*2;
		ball.vY = Math.random()*2;
		
		ball.x = game.height / 2 - 10;
		ball.y = game.height / 2 - 10;
		
		player.width = 80;
		ai.width = 80;
		ball.width = 20;
		ball.height = 20;
	}
	// Соприкосновение с ракетками
	if ((collision(ai, ball) && ball.vY<0) || (collision(player, ball) && ball.vY>0)){
		ball.vY = -ball.vY;
	}
	// приращение координат
	ball.x += ball.vX;
	ball.y += ball.vY;
	if(ball.vY > 0) ball.vY += 1/120;
	else ball.vY -= 1/120;
	if (ball.vX > 0) ball.vX += 1/120;
	else ball.vX -= 1/120;
	
	aiMove();
}

var timegame = 0

function play() {
    draw(); // отрисовываем всё на холсте
	if (finishgame == false) update(); // обновляем координаты
	else {
		context2.font = 'bold 200px courier';
		context2.textAlign = 'center';
		context2.textBaseline = 'top';
		if(player.scores == 10) context2.fillStyle = '#0f0';
		else context2.fillStyle = '#f00';
		context2.fillText("WIN", 250, 100);
	}
	
	if (collision(effect1, ball)){
		if (massivEf[0] == 1) player.width = 120;
		if (massivEf[0] == 2) player.width = 40;
		if (massivEf[0] == 3) ai.width = 120;
		if (massivEf[0] == 4) ai.width = 40;
		if (massivEf[0] == 5){
			ball.width = 40;
			ball.height = 40;
		}
		if (massivEf[0] == 6){
			ball.width = 10;
			ball.height = 10;
		}
		if (massivEf[0] == 7){
			if(ball.vY > 0) ball.vY = 10;
			else ball.vY = -10;
			if (ball.vX > 0) ball.vX = 10;
			else ball.vX = -10;
		}
		if (massivEf[0] > 7){
			if(ball.vY > 0) ball.vY = 1;
			else ball.vY = -1;
			if (ball.vX > 0) ball.vX = 1;
			else ball.vX = -1;
		}
		massivEf[0] = 0;
		
		effect1.x = -10;
		effect1.y = -10;
	}
	
	if (collision(effect2, ball)){
		if (massivEf[1] == 1) player.width = 120;
		if (massivEf[1] == 2) player.width = 40;
		if (massivEf[1] == 3) ai.width = 120;
		if (massivEf[1] == 4) ai.width = 40;
		if (massivEf[1] == 5){
			ball.width = 40;
			ball.height = 40;
		}
		if (massivEf[1] == 6){
			ball.width = 10;
			ball.height = 10;
		}
		if (massivEf[1] == 7){
			if(ball.vY > 0) ball.vY = 10;
			else ball.vY = -10;
			if (ball.vX > 0) ball.vX = 10;
			else ball.vX = -10;
		}
		if (massivEf[1] > 7){
			if(ball.vY > 0) ball.vY = 1;
			else ball.vY = -1;
			if (ball.vX > 0) ball.vX = 1;
			else ball.vX = -1;
		}
		
		massivEf[1] = 0;
		effect2.x = -10;
		effect2.y = -10;
	}
	
	if (collision(effect3, ball)){
		if (massivEf[2] == 1) player.width = 120;
		if (massivEf[2] == 2) player.width = 40;
		if (massivEf[2] == 3) ai.width = 120;
		if (massivEf[2] == 4) ai.width = 40;
		if (massivEf[2] == 5){
			ball.width = 40;
			ball.height = 40;
		}
		if (massivEf[2] == 6){
			ball.width = 10;
			ball.height = 10;
		}
		if (massivEf[2] == 7){
			if(ball.vY > 0) ball.vY = 10;
			else ball.vY = -10;
			if (ball.vX > 0) ball.vX = 10;
			else ball.vX = -10;
		}
		if (massivEf[2] > 7){
			if(ball.vY > 0) ball.vY = 1;
			else ball.vY = -1;
			if (ball.vX > 0) ball.vX = 1;
			else ball.vX = -1;
		}
	
		massivEf[2] = 0;
		effect3.x = -10;
		effect3.y = -10;
	}
	
	timegame += 1000/60;
	if (timegame > 5000){
		if (massivEf[0] == 0){
			massivEf[0] = Math.floor(Math.random()*8) + 1;
			effect1.x = Math.random()*480 + 10;
			effect1.y = Math.random()*620 + 40;
			timegame = 0;
		}
		if (massivEf[1] == 0 && timegame > 5000){
			massivEf[1] = Math.floor(Math.random()*8) + 1;
			effect2.x = Math.random()*480 + 10;
			effect2.y = Math.random()*620 + 40;
			timegame = 0;
		}
		if (massivEf[2] == 0 && timegame > 5000){
			massivEf[2] = Math.floor(Math.random()*8) + 1;
			effect3.x = Math.random()*480 + 10;
			effect3.y = Math.random()*620 + 40;
		}
	}
	if (massivEf[0] > 0) effect1.draw();
	if (massivEf[1] > 0) effect2.draw();
	if (massivEf[2] > 0) effect3.draw();
}

// Инициализация переменных
function init() {
    // объект который задаёт игровое поле
    game = new rect("#000", 0, 0, 500, 700);
    // Ракетки-игроки
    ai = new rect("#f00", game.height / 2 - 40, 10, 80, 20);
    player = new rect("#0f0", game.height / 2 - 40, game.height - 30, 80, 20);
    // количество очков
    ai.scores = 0;
    player.scores = 0;
    // наш квадратный игровой "шарик"
    ball = new rect("#00f", game.height / 2-10, game.height / 2 - 10, 20, 20);
    // скорость шарика
	var kuda = Math.floor(Math.random()*2);
	if (kuda == 0)  ball.vX = Math.random()*2; // скорость по оси х
	else ball.vX = -1*Math.random()*2; // скорость по оси х
	kuda = Math.floor(Math.random()*2);
    if (kuda == 0) ball.vY = Math.random()*2; // скорость по оси у
	else ball.vY = -1*Math.random()*2;
    
	canvas = document.getElementById("pong");
    canvas.width = game.width;
    canvas.height = game.height;
    
	context = canvas.getContext("2d");
	context2 = canvas.getContext("2d");
    
	effect1 = new rect("#ff0", -110, -110, 10, 10);
	effect2 = new rect("#ff0", -220, -220, 10, 10);
	effect3 = new rect("#ff0", -330, -330, 10, 10);
	massivEf = [0,0,0];
	
	canvas.onmousemove = playerMove;
    setInterval(play, 1000 / 60);
}