var initContainer = function(){
	var container = document.getElementById("container");

	if(!container){
		var container = document.createElement("div");
	}	
	container.style.position = "relative";
	document.body.appendChild(container);
	var con = {};

	Object.defineProperties(con,{
		container: {
			value: container
		},
		resetContainer:{
			value: function(){
				while (this.container.hasChildNodes()) {
					this.container.removeChild(this.container.lastChild);
				}
			}
		}
	});
	return con;
}

var square = function(color){

	var element = document.createElement("div");
	element.style.position = "absolute";
	element.style.width = 25 + "px";
	element.style.height = 25 + "px";
	element.style.backgroundColor = "black";
	
	object = {};
	object.el = element;
	object.case = color;

	return object;
};

var globals = {
	topContainer : initContainer(),
	frames : 0,
	food : 0,
	xLength : 20,
	yLength : 20,
	available : 0,
	snake : 1,
	apple : 2,
	moveLeft  : 0,
	moveUp    : 1,
	moveRight : 2,
	moveDown  : 3,
	keyLeft  : 37,
	keyUp    : 38,
	keyRight : 39,
	keyDown  : 40
	
};

var Map = function(){
	this.test = 'test';
	Object.defineProperties(this,{
		width: {
			value: globals.xLength -1,
			writable: true
		},
		height: {
			value: globals.yLength -1,
			writable: true
		},
		elements: {
			value: []
		}
	});
};
Map.prototype.createMap = function(color){
	var width = null;
	var height = null;
	for (var x=0; x<globals.xLength; x++){
		width += 27;
		height +=27;
		this.elements[x] = [];
		for(var y=0; y<globals.yLength; y++){
			var element = square();
			element.case = color;
			element.el.style.backgroundColor = color;
			this.elements[x][y] = element;
			globals.topContainer.container.appendChild(this.elements[x][y].el);
		}
	}
	globals.topContainer.container.style.width = width + "px";
	globals.topContainer.container.style.height = height + "px";
	globals.topContainer.container.style.margin = "auto";
	globals.topContainer.container.style.border = "thick solid black";
};
Map.prototype.getColor = function(x,y){
	return this.elements[x][y];
};
Map.prototype.placeColor = function(type,x,y){
	this.elements[x][y].case =type;
};

var Snake = function(){
	this.direction = null;
	this.last = null;
	this.snakeArrayLength = null;
}
Snake.prototype.createSnake = function(direction, xPos, yPos){
	this.direction = direction;
	this.snakeArrayLength = [];
	this.addSnake(xPos,yPos);
};
Snake.prototype.addSnake = function(xPos, yPos){
	var placeNew = {};
	placeNew.x = xPos;
	placeNew.y = yPos;
	this.snakeArrayLength.unshift(placeNew);
	this.last = this.snakeArrayLength[0];
};
Snake.prototype.removeFromSnake = function(){
	return this.snakeArrayLength.pop();
};
Snake.prototype.snakeInitial = function(){
	var place = {};
	place.x = Math.floor(globals.xLength/2);
	place.y = globals.yLength-1;
	return place;
};
var map = new Map();
var snake = new Snake();

var state = {};
	document.body.addEventListener("keydown", function(eventObject) {
		state[eventObject.keyCode] = true;
	});
	document.body.addEventListener("keyup", function(eventObject) {
		state[eventObject.keyCode] = false;
	});
function applePosition() {
	var availableSpaces = [];
	for (var x=0; x < map.width; x++) {
		for (var y=0; y < map.height; y++) {
			if (map.getColor(x, y).case == 0) {
				var apple = {};
				apple.x = x;
				apple.y = y;
				availableSpaces.push(apple);
			}
		}
	}
	var randomIndex = Math.round(Math.random()*(availableSpaces.length - 1));
	var randomPosition = availableSpaces[randomIndex];
	map.placeColor(globals.apple, randomPosition.x, randomPosition.y);
}

var Result= function(){
	var endBox = document.createElement("div");
	endBox.style.width = 60 + "px";
	endBox.style.margin = "auto";
	endBox.style.marginTop = 15 + "px";
	endBox.style.backgroundColor = "black";
	endBox.style.color = "white";
	endBox.style.textAlign = "center";
	endBox.innerHTML = globals.food;
	document.body.appendChild(endBox);	

	this.box = endBox;
};
Result.prototype.setResult = function(value){
	this.box.innerHTML = value;
}
var result = new Result();
function init(){
	globals.topContainer.resetContainer();
	map.createMap(globals.available);
	snake.createSnake(globals.moveUp, snake.snakeInitial().x, snake.snakeInitial().y);
	map.placeColor(globals.snake, snake.snakeInitial().x, snake.snakeInitial().y);
	applePosition();
}

function render(){
	var counterLeft = -27;
	for(var x=0; x<globals.xLength; x++){
		counterLeft += 27;
		var counterTop = -27;
		for(var y=0; y<globals.yLength; y++){
			counterTop += 27;
			var gridObj = map.getColor(x,y);
			gridObj.el.style.top = counterTop + "px";
			gridObj.el.style.left = counterLeft + "px";
			switch(map.getColor(x,y).case){
				case 0:
					gridObj.el.style.backgroundColor = "darkGray";
					break;
				case 1:
					gridObj.el.style.backgroundColor = "white";
					break;
				case 2:
					gridObj.el.style.backgroundColor = "yellow";
					break;
			}
		}
	}
}
function update(){
	globals.frames++;
	if (state[globals.keyLeft] && snake.direction !== globals.moveRight){
		snake.direction = globals.moveLeft;
	}
	if (state[globals.keyUp] && snake.direction !== globals.moveDown){
		snake.direction = globals.moveUp;
	}
	if (state[globals.keyRight] && snake.direction !== globals.moveLeft){
		snake.direction = globals.moveRight;
	}
	if (state[globals.keyDown] && snake.direction !== globals.moveUp){
		snake.direction = globals.moveDown;
	}
	if (globals.frames%4 === 0){
		var posX = snake.last.x;
		var posY = snake.last.y;
		switch (snake.direction){
			case globals.moveLeft:
				posX--;
				break;
			case globals.moveUp:
				posY--;
				break;
			case globals.moveRight:
				posX++;
				break;
			case globals.moveDown:
				posY++;
				break;
		}
		if (0 > posX || posX > map.width  || 0 > posY || posY > map.height || map.getColor(posX, posY).case === 1){
			globals.food = 0;
			result.setResult(globals.food);
			return init();
		}
		if (map.getColor(posX, posY).case === 2){
			globals.food ++;
			result.setResult(globals.food);
			applePosition();
		}else{
			var last = snake.removeFromSnake();
			map.placeColor(globals.available,last.x, last.y);
		}
		map.placeColor(globals.snake, posX, posY);
		snake.addSnake(posX, posY);
	}
}
function rafLoop(){
	update();
	render();
	window.requestAnimationFrame(rafLoop, globals.topContainer.container);
}
function main(){
	init();
	rafLoop();
}
main();