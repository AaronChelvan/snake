//Coordinate object constructor
//0 <= x <= 31; 0 <= y <= 31; (32 x 32 grid)
function Coordinate(x,y) {
    this.x = x;
    this.y = y;
    this.getX = function () {
        return this.x;
    };
    this.getY = function () {
        return this.y;
    }
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
        this.location.unshift(startingLocation);
    }

    //The coordinates of the head of the snake (i.e. this.location[0])
    this.head = new Coordinate(this.location[0].getX(), this.location[0].getY());

    //Movement methods
    this.moveUp = function() {
        this.direction = "up";
        this.location.pop(); //Remove the end of the tail.
        //Add the new location to the beginning of the location array.
        var newHeadLocation = new Coordinate(this.head.getX(), this.head.getY()+1);
        this.location.unshift(newHeadLocation);
        //Update the head
        this.head = new Coordinate(this.head.getX(), this.head.getY()+1);
    };
    this.moveDown = function() {
        this.direction = "down";
        this.location.pop(); //Remove the end of the tail.
        //Add the new location to the beginning of the location array.
        var newHeadLocation = new Coordinate(this.head.getX(), this.head.getY()-1);
        this.location.unshift(newHeadLocation);
        //Update the head
        this.head = new Coordinate(this.head.getX(), this.head.getY()-1);
    }
    this.moveLeft= function() {
        this.direction = "left";
        this.location.pop(); //Remove the end of the tail.
        //Add the new location to the beginning of the location array.
        var newHeadLocation = new Coordinate(this.head.getX()-1, this.head.getY());
        this.location.unshift(newHeadLocation);
        //Update the head
        this.head = new Coordinate(this.head.getX()-1, this.head.getY());
    }
    this.moveRight = function() {
        this.direction = "right";
        this.location.pop(); //Remove the end of the tail.
        //Add the new location to the beginning of the location array.
        var newHeadLocation = new Coordinate(this.head.getX()+1, this.head.getY());
        this.location.unshift(newHeadLocation);
        //Update the head
        this.head = new Coordinate(this.head.getX()+1, this.head.getY());
    }
}

//Given a Coordinate object, colour the corresponding square on the canvas.
function fillCoords(coordinate) {
    var canvas = document.getElementById("playingField");
    var context = canvas.getContext("2d");
    context.fillRect(coordinate.getX()*10,310-coordinate.getY()*10,10,10);
}

//Given a Snake object, print the entire snake onto the canvas
function printSnake(playerSnake) {
    for (var i = 0; i < playerSnake.location.length; i++) {
        fillCoords(playerSnake.location[i]);
    }
}

//Clears the canvas
function clearCanvas() {
    var canvas = document.getElementById("playingField");
    var context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
}

//Create the player and print it
var playerSnake = new Snake();
printSnake(playerSnake);

//Start listening for key presses
document.onkeydown = function checkKeyPressed(key) {
    switch (key.keyCode) {
        case 37:
            console.log("Key press recorded: left arrow");
            clearCanvas();
            playerSnake.moveLeft();
            printSnake(playerSnake);
            return "left";
        case 38:
            console.log("Key press recorded: up arrow");
            clearCanvas();
            playerSnake.moveUp();
            printSnake(playerSnake);
            return "up";
        case 39:
            console.log("Key press recorded: right arrow");
            clearCanvas();
            playerSnake.moveRight();
            printSnake(playerSnake);
            return "right";
        case 40:
            console.log("Key press recorded: down arrow");
            clearCanvas();
            playerSnake.moveDown();
            printSnake(playerSnake);
            return "down";
        default:
            console.log("Key press recorded: not an arrow key"); //debug
            return null;
    }
}
