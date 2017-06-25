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
    //For all 4 of these methods, the parameter 'eaten' is a boolean.
    //It is set to 'true' if the head is currently on the same square as a food item.
    //If so, don't remove the end of the tail. (So that the snake can grow by 1.)
    this.moveUp = function(eaten) {
        this.direction = "up";
        if (eaten == false) {
            this.location.pop(); //Remove the end of the tail.
        }
        //Add the new location to the beginning of the location array.
        if (this.head.getY()+1 > 31) { //If the snake moves past the top boundary
            var newHeadLocation = new Coordinate(this.head.getX(), this.head.getY()-31);
        } else {
            var newHeadLocation = new Coordinate(this.head.getX(), this.head.getY()+1);
        }
        this.location.unshift(newHeadLocation);
        this.updateHead();
    };
    this.moveDown = function(eaten) {
        this.direction = "down";
        if (eaten == false) {
            this.location.pop(); //Remove the end of the tail.
        }
        //Add the new location to the beginning of the location array.
        if (this.head.getY()-1 < 0) { //If the snake moves past the bottom boundary
            var newHeadLocation = new Coordinate(this.head.getX(), this.head.getY()+31);
        } else {
            var newHeadLocation = new Coordinate(this.head.getX(), this.head.getY()-1);
        }
        this.location.unshift(newHeadLocation);
        this.updateHead();
    };
    this.moveLeft = function(eaten) {
        this.direction = "left";
        if (eaten == false) {
            this.location.pop(); //Remove the end of the tail.
        }
        //Add the new location to the beginning of the location array.
        if (this.head.getX()-1 < 0) { //If the snake moves past the left boundary
            var newHeadLocation = new Coordinate(this.head.getX()+31, this.head.getY());
        } else {
            var newHeadLocation = new Coordinate(this.head.getX()-1, this.head.getY());
        }
        this.location.unshift(newHeadLocation);
        this.updateHead();
    };
    this.moveRight = function(eaten) {
        this.direction = "right";
        if (eaten == false) {
            this.location.pop(); //Remove the end of the tail.
        }
        //Add the new location to the beginning of the location array.
        if (this.head.getX() + 1 > 31) { //If the snake moves past the right boundary
            var newHeadLocation = new Coordinate(this.head.getX()-31, this.head.getY());
        } else {
            var newHeadLocation = new Coordinate(this.head.getX()+1, this.head.getY());
        }
        this.location.unshift(newHeadLocation);
        this.updateHead();
    };
    this.keepMoving = function(eaten) { //Move in whatever direction the snake is currently facing
        if (this.getDirection() == "left") {
            this.moveLeft(eaten);
        } else if (this.getDirection() == "up") {
            this.moveUp(eaten);
        } else if (this.getDirection() == "right") {
            this.moveRight(eaten);
        } else if (this.getDirection() == "down") {
            this.moveDown(eaten);
        }
    }
    //Returns a boolean that states whether or not the snake has eaten itself
    this.checkEatenItself = function() {
        var eatenItself = false;
        //Start from i = 1, because we don't want to compare the head to itself
        for (var i = 1; i < this.location.length; i++) {
            if (this.head.getX() == this.location[i].getX() &&
                this.head.getY() == this.location[i].getY()) {
                eatenItself = true;
                break;
            }
        }
        return eatenItself;
    }
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

//Draw the playing field onto the canvas
function drawPlayingField() {
    clearCanvas(); //Clear the canvas
    if (foodLocation != null) {
        colourFillCoords(foodLocation, "#FF0000"); //Print the food item onto the screen
    }
    playerSnake.printSnake(); //Print the snake onto the canvas
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

//Listen for key presses
document.onkeydown = function checkKeyPressed(key) {
    switch (key.keyCode) {
        case 32: //Spacebar
            console.log("Key press recorded: spacebar");
            lastKeyPress = "space";
            if (gameOver == true) {
                newGame();
            }
            break;
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
            console.log("Key press recorded: other");
            lastKeyPress = null;
            break;
    }
    return;
}

//Increments the current score and modifies the score display.
//Also increments the best score if the current score is the new best score.
function incrementScore() {
    document.querySelector("#currentScore").innerText++; //Increment currentScore
    var currentScore = Number(document.querySelector("#currentScore").innerText);
    var bestScore = Number(document.querySelector("#bestScore").innerText);
    if (currentScore > bestScore) { //If currentScore is higher than bestScore, increment bestScore too.
        document.querySelector("#bestScore").innerText++;
    }
    //console.log("currentScore = " + currentScore);
    //console.log("bestScore = " + bestScore);
}

/*function printGameOver() {
    var canvas = document.getElementById("playingField");
    var ctx = canvas.getContext("2d");
    ctx.font = "30px Montserrat";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER",160,160);
}*/

//Create a new game by reinitialising the global variables, and running the updateGame function
function newGame() {
    playerSnake = new Snake();
    lastKeyPress = null;
    foodLocation = spawnFood();
    gameOver = false;
    document.querySelector("#currentScore").innerText = 0; //Reset the displayed score
    $("#startInstructions").fadeOut(); //Hide the start instructions
    $("#gameOverText").fadeOut(); //Hide the gameOver instructions
    gameplay = setInterval(updateGame, 100); //Start the running the game
}

//Update the game state
function updateGame() {
    //console.log("X = " + playerSnake.head.getX() + "; Y = " + playerSnake.head.getY());

    //Boolean containing whether the snake's head is on the same square
    //as the food item (true) or not (false).
    var eaten = false;

    //Check if the snake has eaten the food
    if (playerSnake.head.getX() == foodLocation.getX() &&
        playerSnake.head.getY() == foodLocation.getY()) {
        console.log("The snake ate");
        eaten = true; //Set 'eaten' to true
        foodLocation = spawnFood(); //Generate a new location for the next food item
        incrementScore();
    }

    //Check if the snake has eaten itself
    if (playerSnake.checkEatenItself() == true) {
        clearInterval(gameplay);
        gameOver = true;
        $("#gameOverText").fadeIn();
        return; //Return early so that the snake does not appear to move one space after it dies.
    }

    switch (lastKeyPress) {
        case "left": //Left arrow
            if (playerSnake.getDirection() == "right") { //Can't move left if facing right
                playerSnake.moveRight(eaten); //Keep moving right
                break;
            }
            playerSnake.moveLeft(eaten);
            break;
        case "up": //Up arrow
            if (playerSnake.getDirection() == "down") { //Can't move up if facing down
                playerSnake.moveDown(eaten); //Keep moving down
                break;
            }
            playerSnake.moveUp(eaten);
            break;
        case "right": //Right arrow;
            if (playerSnake.getDirection() == "left") { //Can't move right if facing left
                playerSnake.moveLeft(eaten); //Keep moving left
                break;
            }
            playerSnake.moveRight(eaten);
            break;
        case "down": //Down arrow;
            if (playerSnake.getDirection() == "up") { //Can't move down if facing up
                playerSnake.moveUp(eaten);//Keep moving up
                break;
            }
            playerSnake.moveDown(eaten);
            break;
        default: //If a non-arrow key was pressed, keep moving in the direction the snake is currently facing
            playerSnake.keepMoving(eaten);
            break;
    }

    drawPlayingField();
    lastKeyPress = null; //Clear the last key press
}

//Create the player and print it
var playerSnake = new Snake(); //Global variable

//Global variable containing a string describing the last key press. "up", "left", etc.
//Contains null if a non-arrow key was pressed.
var lastKeyPress = null;

//Global variable containing the coordinates of where the food is currently at.
//At the start of the game, it is initialised with spawnFood()
var foodLocation;

//Global variable containing a boolean describing if the game is currently
//in play (false), or not (true). Initially, set to 'true'.
var gameOver = true;

//Global variable which is later assigned to setInterval(updateGame, 200);
//This refreshes the game state at a specified time interval.
//clearInterval(gameplay) can then be used to freeze the game when the player loses.
var gameplay;

//As soons as the page is loaded, the snake is be drawn onto the page.
drawPlayingField();

//The gameOverText div should be initially hidden
$(document).ready(function(){
    $("#gameOverText").hide();
});
