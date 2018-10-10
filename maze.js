var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

function index(i, j){
	if(i < 0 || j < 0 || i > rows-1 || j > cols-1){
		return -1;
	}
	return j + i*cols;
}

var w = 30;
var cols = Math.floor(canvas.width/w);
var rows = Math.floor(canvas.height/w);
var stack = [];
function Cell(i, j){
	this.i = i;
	this.j = j;
	this.x = j*w;
	this.y = i*w;
	this.walls = [true, true, true ,true];
	this.visited = false;

	this.highlight = function(){
		c.rect(this.x, this.y, w, w);
		c.fillStyle = "rgba(80, 80, 80, 0.8)";
		c.fill();
	}

	this.checkNeighbour = function(){
		var neighbour = [];
		var top = grid[index(i-1, j)];
		var right = grid[index(i, j+1)];
		var bottom = grid[index(i+1, j)];
		var left = grid[index(i, j-1)];

		if(top && !top.visited){
			neighbour.push(top);
		}
		if(right && !right.visited){
			neighbour.push(right);
		}	
		if(bottom && !bottom.visited){
			neighbour.push(bottom);
		}	
		if(left && !left.visited){
			neighbour.push(left);
		}			

		if(neighbour.length > 0){
			var r = Math.floor(Math.random()*neighbour.length);
			return neighbour[r];
		} else {
			// reset();
			return undefined;
		}
	}

	this.update = function(){
		this.draw();
	}

	this.draw = function(){

		c.beginPath();
		//top
		if(this.walls[0]){
			c.moveTo(this.x, this.y);
			c.lineTo(this.x+w, this.y);
		}
		//right
		if(this.walls[1]){
			c.moveTo(this.x+w, this.y);
			c.lineTo(this.x+w, this.y+w);
		}
		//bottom
		if(this.walls[2]){
			c.moveTo(this.x, this.y+w);
			c.lineTo(this.x+w, this.y+w);
		}
		//left
		if(this.walls[3]){
			c.moveTo(this.x, this.y);
			c.lineTo(this.x, this.y+w);
		}
		c.strokeStyle = "#eee";
		c.stroke();
		c.closePath();

		if(this.visited){
			c.beginPath()
			c.rect(this.x, this.y, w, w);
			c.fillStyle = "rgba(100, 100, 100, 0.8)";
			c.fill();
			c.closePath();
		}

		
	}
}

var grid = []
for (var i = 0; i < rows; i++){
	for(var j = 0; j < cols; j++){
		grid.push(new Cell(i, j));
	}
}


function animate(){
	// requestAnimationFrame(animate);
	c.clearRect(0, 0, canvas.width, canvas.height);
	for(var i = 0; i < grid.length; i++){
		grid[i].update();
	}
	current.visited = true;
	current.highlight();
	var next = current.checkNeighbour()
	if(next){
		next.visited = true;
		stack.push(current);
		removeWalls(current, next);
		current = next;
		
	} else if(stack.length > 0) {
		current = stack.pop();

	}	
	
	setTimeout(animate, 1);
}

var current = grid[0];
animate();








function removeWalls(a, b){
	var x = b.j - a.j;
	var y = b.i - a.i;
	if(x==1){
		a.walls[1] = false;
		b.walls[3] = false;
	} else if(x == -1) {
		a.walls[3] = false;
		b.walls[1] = false;
	} else if(y == 1){
		a.walls[2] = false;
		b.walls[0] = false;
	} else if(y==-1){
		a.walls[0] = false;
		b.walls[2] = false;
	}

}

function reset(){
	for(var i = 0; i < grid.length; i++){
		grid[i].visited = false;
		grid[i].walls = [true, true, true, true];
	}
	current = grid[0]
}