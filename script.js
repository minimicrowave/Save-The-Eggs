var chick;
var theObstacles;
var score;

function startGame() {
    gameArea.start();
    chick = new component(30, 30, "yellow", 300, 300);
    theObstacles = new component(10, 200, "green", 500, 320);
    score = new component("20px", "Gloria Hallelujah", "black", 30, 40, "text");
    // eggs = new component(30, 30, "egg.png", );
    window.addEventListener('keydown', doKeyDown, true);
    // window.addEventListener('keyup', doKeyUp, true);
}

function component(width, height, color, x, y, type) {
    this.type = type;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.update = function () {
        ctx = gameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    };
    this.newPos = function () {
        this.x += this.speedX;
        this.y += this.speedY;
    };
    this.crashWith = function (otherobj) {
        var chickleft = this.x;
        var chickright = this.x + (this.width);
        var chicktop = this.y;
        var chickbottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((chickbottom < othertop) || (chicktop > otherbottom) || (chickright < otherleft) || (chickleft > otherright)) {
            crash = false;
        }
        return crash;
    }
    // contains chick without bouncing off walls.
    this.contain = function () {
        if (this.x < 0) {
            this.x = 0;
        } else if (this.x >= (gameArea.canvas.width - this.width)) {
            this.x = (gameArea.canvas.width - this.width);
        }
        if (this.y < 0) {
            this.y = 0;
        } else if (this.y > (gameArea.canvas.height - this.height)) {
            this.y = (gameArea.canvas.height - this.height);
        }
    }
    // contains chick by bouncing off walls.
    this.bounce = function () {
        if (this.x + this.width > gameArea.canvas.width || this.x < 0) {
            this.speedX = -this.speedX;
        }
        if (this.y + this.height > gameArea.canvas.height || this.y < 0) {
            this.speedY = -this.speedY;
        }
    }
}

// Keys Functions
function doKeyDown(evt) {
    switch (evt.keyCode) {
        case 38:
            /* Up arrow is pressed */
            if (chick.y - 2 > 0 && chick.speedY > -5) {
                chick.speedY -= 1;
            }
            break;
        case 40:
            /* Down arrow is pressed */
            if (chick.y + 2 < gameArea.canvas.height && chick.speedY < 5) {
                chick.speedY += 1;
            }
            break;
        case 37:
            /* Left arrow is pressed */
            if (chick.x - 2 > 0 && chick.speedX > -5) {
                chick.speedX -= 1;
            }
            break;
        case 39:
            /* Right arrow is pressed */
            if (chick.x + 2 < gameArea.canvas.width && chick.speedX < 5) {
                chick.speedX += 1;
            }
            break;
    }
}



// Canvas Area

var gameArea = {
    canvas: document.createElement("canvas"),
    start: function () {
        this.canvas.height = 600;
        this.canvas.width = 600;
        this.context = this.canvas.getContext("2d");
        document.querySelector("main").appendChild(this.canvas);
        this.interval = setInterval(updateGameArea, 50);
    },

    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },

    stop: function () {
        clearInterval(this.interval);
    }
}

// Update Game Area

function updateGameArea() {
    if (chick.crashWith(theObstacles)) {
        gameArea.stop();
    } else {
        gameArea.clear();
        score.text="Score: "
        score.update();
        theObstacles.update();
        chick.newPos();
        // chick.contain();
        chick.bounce();
        chick.update();
        console.log("speed x ", chick.speedX);
        console.log("speed y ", chick.speedY);
    }
}












/////////////////////////////////////////////////////////////

// function Drawable() {
//     this.init = function(x, y) {
//         // Default variables
//         this.x = x;
//         this.y = y;
//     }
//     this.speed = 0;
//     this.canvasWidth = 0;
//     this.canvasHeight = 0;
//     // Define abstract function to be implemented in child objects
//     this.draw = function() {
//     };
// }

// var imageRepository = new function() {
// 	// Define images
// 	this.background = new Image();
// 	// Set images src
//     this.background.src = "imgs/bg.png";
// // }





// // remember to add in fn that starts this 20 second timer.
// function update() {
//     var element = document.getElementById("myprogressBar");
//     var width = 100;
//     var identity = setInterval(scene, 50);

//     function scene() {
//         if (width === 0) {
//             clearInterval(identity);
//         } else {
//             width -= 0.25;
//             element.style.width = width + '%';
//         }
//     }
// }

// // startGame();
// function Game() {
// 	/*
// 	 * Gets canvas information and context and sets up all game
// 	 * objects.
// 	 * Returns true if the canvas is supported and false if it
// 	 * is not. This is to stop the animation script from constantly
// 	 * running on older browsers.
// 	 */
// 	this.init = function() {
// 		// Get the canvas element
// 		this.bgCanvas = document.getElementById('background');
// 		// Test to see if canvas is supported
// 		if (this.bgCanvas.getContext) {
// 			this.bgContext = this.bgCanvas.getContext('2d');
// 			// Initialize objects to contain their context and canvas
// 			// information
// 			Background.prototype.context = this.bgContext;
// 			Background.prototype.canvasWidth = this.bgCanvas.width;
// 			Background.prototype.canvasHeight = this.bgCanvas.height;
// 			// Initialize the background object
// 			this.background = new Background();
// 			this.background.init(0,0); // Set draw point to 0,0
// 			return true;
// 		} else {
// 			return false;
// 		}
// 	};
// 	// Start the animation loop
// 	this.start = function() {
// 		animate();
// 	};
// }

//////////////////////////////////////////////////////////////

// function doKeyUp(evt) {
//     switch (evt.keyCode) {
//         case 38:
//             /* Up arrow is released */
//             if (chick.y - 2 > 0 && chick.speedY >= 0) {
//                 chick.speedY += 0.025;
//             }
//             break;
//         case 40:
//             /* Down arrow is released */
//             if (chick.y + 2 < 300 && chick.speedY >= 0) {
//                 chick.speedY -= 0.025;
//             }
//             break;
//         case 37:
//             /* Left arrow is released */
//             if (chick.x - 2 > 0 && chick.speedX >= 0) {
//                 chick.speedX += 0.025;
//             }
//             break;
//         case 39:
//             /* Right arrow is released */
//             if (chick.x + 2 < 300 && chick.speedX >= 0) {
//                 chick.speedX -= 0.025;
//             }
//             break;
//     }
// }