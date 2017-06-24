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

    //Contains the coordinates of the head of the snake
    //It is a reference to this.location[0]
    this.head = this.location[0];
    this.updateHead = function (){
        this.head = this.location[0];
    };

    //Print the entire snake onto the canvas
    this.printSnake = function() {
        for (var i = 0; i < this.location.length; i++) {
            fillCoords(this.location[i]);
        }
    }

    //Movement methods
    this.moveUp = function() {
        this.direction = "up";
        this.location.pop(); //Remove the end of the tail.
        //Add the new location to the beginning of the location array.
        if (this.head.getY()+1 > 31) { //If the snake moves past the top boundary
            var newHeadLocation = new Coordinate(this.head.getX(), this.head.getY()-31);
        } else {
            var newHeadLocation = new Coordinate(this.head.getX(), this.head.getY()+1);
        }
        this.location.unshift(newHeadLocation);
        this.updateHead();
    };
    this.moveDown = function() {
        this.direction = "down";
        this.location.pop(); //Remove the end of the tail.
        //Add the new location to the beginning of the location array.
        if (this.head.getY()-1 < 0) { //If the snake moves past the bottom boundary
            var newHeadLocation = new Coordinate(this.head.getX(), this.head.getY()+31);
        } else {
            var newHeadLocation = new Coordinate(this.head.getX(), this.head.getY()-1);
        }
        this.location.unshift(newHeadLocation);
        this.updateHead();
    };
    this.moveLeft = function() {
        this.direction = "left";
        this.location.pop(); //Remove the end of the tail.
        //Add the new location to the beginning of the location array.
        if (this.head.getX()-1 < 0) { //If the snake moves past the left boundary
            var newHeadLocation = new Coordinate(this.head.getX()+31, this.head.getY());
        } else {
            var newHeadLocation = new Coordinate(this.head.getX()-1, this.head.getY());
        }
        this.location.unshift(newHeadLocation);
        this.updateHead();
    };
    this.moveRight = function() {
        this.direction = "right";
        this.location.pop(); //Remove the end of the tail.
        //Add the new location to the beginning of the location array.
        if (this.head.getX() + 1 > 31) { //If the snake moves past the right boundary
            var newHeadLocation = new Coordinate(this.head.getX()-31, this.head.getY());
        } else {
            var newHeadLocation = new Coordinate(this.head.getX()+1, this.head.getY());
        }
        this.location.unshift(newHeadLocation);
        this.updateHead();
    };
}

//Given a Coordinate object, make the corresponding square on the canvas black.
function fillCoords(coordinate) {
    var canvas = document.getElementById("playingField");
    var context = canvas.getContext("2d");
    context.fillStyle = "#000000"; //Black
    context.fillRect(coordinate.getX()*10,310-coordinate.getY()*10,10,10);
}

//Given a Coordinate object, colour the corresponding square with the specified colour.
//The 'colour' parameter is a hexadecimal string representing the colour e.g. "#FF0000" for red.
function colourFillCoords(coordinate, colour) {
    var canvas = document.getElementById("playingField");
    var context = canvas.getContext("2d");
    context.fillStyle = colour;
    context.fillRect(coordinate.getX()*10,310-coordinate.getY()*10,10,10);
}

//Clears the canvas
function clearCanvas() {
    var canvas = document.getElementById("playingField");
    var context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
}

//Clear snake
/*function clearSnake() {
    var canvas = document.getElementById("playingField");
    var context = canvas.getContext("2d");
    for (var i = 0; i < playerSnake.location.length; i++) {
        context.clearRect(playerSnake.location[i].getX()*10, 310-playerSnake.location[i].getY(), 10, 10);
    }
}*/

//Return a random integer within a specified range.
//min <= int < max
function randomInteger(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

//Returns a Coordinate object giving the location of where the next food item should spawn.
function spawnFood(){
    var xCoordinate = randomInteger(0, 32); //Generate a random set of (x,y) coordinates
    var yCoordinate = randomInteger(0, 32);

    //After randomly generating a set of coordinates, scan across the grid until
    //a valid location for the food to spawn is found.
    while (true) {
        xCoordinate++;
        if (xCoordinate == 32) {
            xCoordinate = 0;
            yCoordinate++;
            if (yCoordinate == 32) {
                yCoordinate = 0;
            }
        }

        //Check if the snake's body takes up the square at the generated coordinates.
        //(We don't want food to spawn on the body of the snake)
        var collisionFound = false;
        for (var i = 0; i < playerSnake.location.length; i++) {
            if (xCoordinate == playerSnake.location[i].getX() && yCoordinate == playerSnake.location[i].getY()) {
                collisionFound = true; //If the snake does take up the generated coordinates, break early.
                break;
            }
        }

        //If a collision was found, we need to keep searching for a valid place to spawn food.
        if (collisionFound == true) {
            continue;
        } else { //If this flag is set to false, a collision was never found.
                //We've found a valid location for the food to spawn.
            break;
        }
    }

    var foodLocation = new Coordinate(xCoordinate, yCoordinate);
    return foodLocation;
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
    playerSnake.printSnake(); //Print the snake onto the new updated location
    colourFillCoords(foodLocation, "#FF0000"); //Print the food item onto the screen

    lastKeyPress = null; //Clear the last key press
}



//Create the player and print it
var playerSnake = new Snake(); //Global variable
playerSnake.printSnake();

//Global variable containing a string describing the last key press. "up", "left", etc.
//Contains null if a non-arrow key was pressed.
var lastKeyPress = null;

//Global variable containing the coordinates of where the food is currently at.
//At the start of the game, it is initialised with spawnFood()
var foodLocation = spawnFood();

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
