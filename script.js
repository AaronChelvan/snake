//Coordinate object constructor
//0 <= x <= 31; 0 <= y <= 31; (32 x 32 grid)
function Coordinate(x,y) {
    this.x = x;
    this.y = y;
    this.getX = function() {
        return this.x;
    };
    this.getY = function() {
        return this.y;
    }
    this.setX = function(x) {
        this.x = x;
        return;
    }
    this.setY = function(y) {
        this.y = y;
        return;
    }
}

//Snake object constructor
function Snake() {
    this.direction = "up"; //The direction the snake is initially facing.
    this.getDirection = function() {
        return this.direction;
    };
    this.location = [];//An array of (x,y) coordinates representing the squares the snake occupies.
                //The first item is the head.
                //The last item is the end of the tail.

    //Initialise the starting location of the snake. It is initially 3 squares long.
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
        if (this.head.getY()+1 > 31) { //If the snake moves past the top boundary
            var newHeadLocation = new Coordinate(this.head.getX(), this.head.getY()-31);
            //Update the head
            this.head.setY(this.head.getY()-31);
        } else {
            var newHeadLocation = new Coordinate(this.head.getX(), this.head.getY()+1);
            //Update the head
            this.head.setY(this.head.getY()+1);
        }
        this.location.unshift(newHeadLocation);
    };
    this.moveDown = function() {
        this.direction = "down";
        this.location.pop(); //Remove the end of the tail.
        //Add the new location to the beginning of the location array.
        if (this.head.getY()-1 < 0) {
            var newHeadLocation = new Coordinate(this.head.getX(), this.head.getY()+31);
            //Update the head
            this.head.setY(this.head.getY()+31);
        } else {
            var newHeadLocation = new Coordinate(this.head.getX(), this.head.getY()-1);
            //Update the head
            this.head.setY(this.head.getY()-1);
        }
        this.location.unshift(newHeadLocation);
    };
    this.moveLeft= function() {
        this.direction = "left";
        this.location.pop(); //Remove the end of the tail.
        //Add the new location to the beginning of the location array.
        if (this.head.getX()-1 < 0) {
            var newHeadLocation = new Coordinate(this.head.getX()+31, this.head.getY());
            //Update the head
            this.head.setX(this.head.getX()+31);
        } else {
            var newHeadLocation = new Coordinate(this.head.getX()-1, this.head.getY());
            //Update the head
            this.head.setX(this.head.getX()-1);
        }
        this.location.unshift(newHeadLocation);
    }
    this.moveRight = function() {
        this.direction = "right";
        this.location.pop(); //Remove the end of the tail.
        //Add the new location to the beginning of the location array.
        if (this.head.getX() + 1 > 31) {
            var newHeadLocation = new Coordinate(this.head.getX()-31, this.head.getY());
            //Update the head
            this.head.setX(this.head.getX()-31);
        } else {
            var newHeadLocation = new Coordinate(this.head.getX()+1, this.head.getY());
            //Update the head
            this.head.setX(this.head.getX()+1);
        }
        this.location.unshift(newHeadLocation);
    };
}

//Given a Coordinate object, colour the corresponding square on the canvas.
function fillCoords(coordinate) {
    var canvas = document.getElementById("playingField");
    var context = canvas.getContext("2d");
    context.fillRect(coordinate.getX()*10,310-coordinate.getY()*10,10,10);
}

//Print the entire snake onto the canvas
function printSnake() {
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

//Update the game state
function updateGame() {
    console.log("X = " + playerSnake.head.getX() + "; Y = " + playerSnake.head.getY());
    switch (lastKeyPress) {
        case null: //If a non-arrow key was pressed, keep moving in the direction the snake is currently facing
            if (playerSnake.getDirection() == "left") {
                playerSnake.moveLeft();
            } else if (playerSnake.getDirection() == "up") {
                playerSnake.moveUp();
            } else if (playerSnake.getDirection() == "right") {
                playerSnake.moveRight();
            } else if (playerSnake.getDirection() == "down") {
                playerSnake.moveDown();
            }
            break;
        case "left": //Left arrow
            if (playerSnake.getDirection() == "right") { //Can't move left if facing right
                playerSnake.moveRight(); //Keep moving right
                break;
            }
            playerSnake.moveLeft();
            break;
        case "up": //Up arrow
            if (playerSnake.getDirection() == "down") { //Can't move up if facing down
                playerSnake.moveDown(); //Keep moving down
                break;
            }
            playerSnake.moveUp();
            break;
        case "right": //Right arrow;
            if (playerSnake.getDirection() == "left") { //Can't move right if facing left
                playerSnake.moveLeft(); //Keep moving left
                break;
            }
            playerSnake.moveRight();
            break;
        case "down": //Down arrow;
            if (playerSnake.getDirection() == "up") { //Can't move down if facing up
                playerSnake.moveUp();//Keep moving up
                break;
            }
            playerSnake.moveDown();
            break;
    }
    clearCanvas(); //Clear the canvas
    printSnake(playerSnake); //Print the snake onto the new updated location
    lastKeyPress = null; //Clear the last key press
}

//Create the player and print it
var playerSnake = new Snake(); //Global variable
printSnake(playerSnake);

//Global variable containing a string describing the last key press. "up", "left", etc.
//Contains null if a non-arrow key.
var lastKeyPress = null;

//Listen for key presses
document.onkeydown = function checkKeyPressed(key) {
    switch (key.keyCode) {
        case 37: //Left arrow
            console.log("Key press recorded: left arrow");
            lastKeyPress = "left";
            break;
        case 38: //Up arrow
            console.log("Key press recorded: up arrow");
            lastKeyPress = "up";
            break;
        case 39: //Right arrow
            console.log("Key press recorded: right arrow");
            lastKeyPress = "right";
            break;
        case 40: //Down arrow
            console.log("Key press recorded: down arrow");
            lastKeyPress = "down";
            break;
        default:
            console.log("Key press recorded: not an arrow key");
            lastKeyPress = null;
            break;
    }
    return;
}

setInterval(updateGame, 200); //Refresh the game state at a specified time interval
