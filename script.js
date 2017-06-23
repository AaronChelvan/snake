//Canvas setup. These are 2 global variables.
var canvas = document.getElementById("playingField");
var context = canvas.getContext("2d");

//Coordinate object constructor
// 0 <= x <= 31; 0 <= y <= 31; (32 x 32 grid)
function Coordinate(x,y) {
    this.x = x;
    this.y = y;
}

//Snake object constructor
function Snake() {
    this.direction = "up"; //The direction the snake is initially facing.
    this.location = [];//An array of (x,y) coordinates representing the squares the snake occupies.
                //The first item is the head.
                //The last item is the end of the tail.

    //Initialise the starting location of the snake. It is 3 squares long.
    for (var i = 0; i < 3; i++) {
        var startingLocation = new Coordinate(15, 15+i);
        this.location.push(startingLocation);
    }
}

//Given a Coordinate object, colour the corresponding square on the canvas.
function fillCoords(coordinate) {
    context.fillRect(coordinate.x*10,310-coordinate.y*10,10,10);
}

//Given a Snake object, print the entire snake onto the canvas
function printSnake(playerSnake) {
    for (var i = 0; i < playerSnake.location.length; i++) {
        fillCoords(playerSnake.location[i]);
    }
}

var playerSnake = new Snake();
printSnake(playerSnake);
