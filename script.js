// global variables
var chick;
var theObstacles;
var egg;
var duckies = [];
var score;
var currentScore = 0;
var gameStarted = false;
var titleScreen;
var titleScreenInstr;
var endGameBkg;
var endGameText;
var endGameText2;

// powerups variables
var randomNumForScore = 6; // to make sure player at least attains score of 6 before powerups starts coming in.
var powerUpLoopDone = true;
var settingInterval = false;
var randomNumForPowerup;
var countdown = 0;
var collisionFx = true;
var powerUpArray = []; // to make sure only 1 powerUp is available for user at any moment
var activePowerUp = []; // to append active powerups to find if collision +ve whilst looping through
var drawPowerUp = true; // removes power up if hovered.

// powerup
var intervalNo = 110; // default refresh interval
var slow;
var duckSpeed = 2; // default duck speed number range;

var invincibility;
var bomb;
var bucket;
var boom;



/*

            INITIALISING GAME
 * ===========================================================================================================================================
 * ===========================================================================================================================================
 * ===========================================================================================================================================
 * ===========================================================================================================================================
 * ===========================================================================================================================================
 */



// loads start menu
window.onload = function () {
    gameArea.start();
    titleScreen = new component("17px", 'Courier', "black", 85, 290, "text");
    titleScreen.text = "Avoid the rubber duckies and save the eggs!";
    titleScreenInstr = new component("14px", 'Courier', "grey", 195, 310, "text");
    titleScreenInstr.text = "Press <spacebar> to start.";
    titleScreen.update();
    titleScreenInstr.update();
    window.addEventListener("keydown", toInitialiseGame);
}


// Start game start event listener.

function toInitialiseGame(evt) {
    if (evt.keyCode == 32) {
        window.removeEventListener("keydown", toInitialiseGame);
        gameStarted = true;
        gameArea.clear();
        startGame();
    }
}

// start game & create all constant variables
function startGame() {
    gameArea.start();
    chick = new component(30, 30, "chick.png", 550, 310, "image");
    egg = new component(20, 20, "egg.png", Math.random() * 570, (Math.random() * 530 + 40), "image");
    score = new component("20px", "BenchNine", "black", 20, 30, "text");

    window.addEventListener('keydown', doKeyDown, true);
}


/*

            DEFINING COMPONENTS

 * ===========================================================================================================================================
 * ===========================================================================================================================================
 * ===========================================================================================================================================
 * ===========================================================================================================================================
 * ===========================================================================================================================================
 */



// defines component to draw texts, images, diagrams
function component(width, height, color, x, y, type) {
    this.type = type;
    if (type == "image") {
        this.image = new Image();
        this.image.src = color;
    }
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
        } else if (this.type == "image") {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    };
    this.newPos = function () {
        this.x += this.speedX;
        this.y += this.speedY;
    };

    // if chick crashes with duckies // eggs // powerup functions
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
        if (this.y + this.height > gameArea.canvas.height || this.y < 40) {
            this.speedY = -this.speedY;
        }
    }

    // ensuring there is always ducks in the frame
    this.reset = function () {
        for (var i in duckies) {
            if (duckies[i].x > gameArea.canvas.width) {
                duckies[i].y = (Math.random() * 530) + 40;
                duckies[i].x = -40;
                duckies[i].speedX = Math.random() * duckSpeed;
                duckies[i].x += duckies[i].speedX;
                console.log(duckies[i].speedX);
            }
        }
    }
}




/*

            POWERUP FUNCTIONS

 * ===========================================================================================================================================
 * ===========================================================================================================================================
 * ===========================================================================================================================================
 * ===========================================================================================================================================
 * ===========================================================================================================================================
 */


var powerUps = [
    // {
    //     name: "Slow",
    //     startFunc: function () {
    //         countdown += 1;

    //         if (!settingInterval) {
    //             // sets 10 sec interval
    //             tenSecInterval = setInterval(function () {
    //                 // console.log("tensecinterval")
    //             }, 1000);

    //             // reset base settings
    //             settingInterval = true;
    //             drawPowerUp = true;
    //             randomNumForScore = Math.round(Math.random() * 7) + currentScore; // assigns random number for the next power up function
    //             // defines new slow x,y component
    //             slow = new component(20, 20, "slow.png", Math.random() * 570, (Math.random() * 530 + 40), "image");
    //             slow.effect = function () {
    //                 activePowerUp.pop();
    //                 duckSpeed = 0.4;
    //                 console.log("ducko: ", duckSpeed);
    //                 setTimeout(function () {
    //                     duckSpeed = 2;
    //                     console.log("oy mate mi done");
    //                 }, 10000);
    //             }
    //             activePowerUp.push(slow);

    //         } else if (settingInterval && drawPowerUp) {
    //             // draws powerup only during this 10s interim unless picked up by chick
    //             slow.update();
    //         }

    //         // sets the 10s timer for powerup, so that it only appears for 10s
    //         if (countdown === 400) {
    //             resetPowerUp();
    //         }
    //     }
    // },
    // {
    //     name: "Invincibility",
    //     startFunc: function () {
    //         countdown += 1;

    //         if (!settingInterval) {
    //             // sets 10 sec interval
    //             tenSecInterval = setInterval(function () {
    //                 // console.log("tensecinterval")
    //             }, 1000);

    //             // reset base settings
    //             settingInterval = true;
    //             drawPowerUp = true;
    //             randomNumForScore = Math.round(Math.random() * 7) + currentScore; // assigns random number for the next power up function

    //             // defines new slow x,y component
    //             invincibility = new component(20, 20, "invincibility.png", (Math.random() * 570), (Math.random() * 530 + 40), "image");
    //             invincibility.effect = function () {
    //                 // REMEMBER TO ADD CAPE TO CHICK!!!!
    //                 activePowerUp.pop();
    //                 collisionFx = false;
    //                 console.log("COLLISION ACTIVATED: ", collisionFx);
    //                 setTimeout(function () {
    //                     collisionFx = true;
    //                     console.log("oy mate mi done");
    //                 }, 10000);
    //             }
    //             activePowerUp.push(invincibility);

    //         } else if (settingInterval && drawPowerUp) {
    //             // draws powerup only during this 10s interim unless picked up by chick
    //             invincibility.update();
    //         }

    //         // sets the 10s timer for powerup, so that it only appears for 10s
    //         if (countdown === 400) {
    //             resetPowerUp();
    //         }
    //     }
    // },
    {
        name: "Bomb",
        startFunc: function () {
            countdown += 1;

            if (!settingInterval) {
                // sets 10 sec interval
                tenSecInterval = setInterval(function () {
                    // console.log("tensecinterval")
                }, 1000);

                // reset base settings
                settingInterval = true;
                drawPowerUp = true;
                randomNumForScore = Math.round(Math.random() * 7) + currentScore; // assigns random number for the next power up function

                // defines new slow x,y component
                bomb = new component(20, 20, "bomb.png", (Math.random() * 570), (Math.random() * 530 + 40), "image");
                bomb.effect = function () {
                    
                    console.log("wheeee");
                    setTimeout(function () {
                        console.log("oy mate mi done");
                    }, 10000);
                    
                    debugger;
                    score.update();
                    egg.update();

                    // bomb effect
                    boom = new component(20, 20, "boom.png", ((bomb.x + chick.x)/2), ((bomb.y + chick.y)/2), "image");
                    boom.update();

                    gameArea.stop();
                    // return;
                }
                activePowerUp.push(bomb);

            } else if (settingInterval && drawPowerUp) {
                // draws powerup only during this 10s interim unless picked up by chick
                bomb.update();
            }

            // sets the 10s timer for powerup, so that it only appears for 10s
            if (countdown === 400) {
                resetPowerUp();
            }
        }
    },
    // {
    //     name: "Bucket",
    //     startFunc: function () {
    //         countdown += 1;

    //         if (!settingInterval) {
    //             // sets 10 sec interval
    //             tenSecInterval = setInterval(function () {
    //                 // console.log("tensecinterval")
    //             }, 1000);

    //             // reset base settings
    //             settingInterval = true;
    //             drawPowerUp = true;
    //             randomNumForScore = Math.round(Math.random() * 7) + currentScore; // assigns random number for the next power up function

    //             // defines new slow x,y component
    //             bucket = new component(20, 20, "bucketwater.png", (Math.random() * 570), (Math.random() * 530 + 40), "image");
    //             bucket.effect = function () {

    //                 activePowerUp.pop();
    //                 duckSpeed = 4;
    //                 console.log("ducko: ", duckSpeed);
    //                 setTimeout(function () {
    //                     duckSpeed = 2;
    //                     console.log("oy mate mi done");
    //                 }, 10000);
    
    //             }
    //             activePowerUp.push(bucket);

    //         } else if (settingInterval && drawPowerUp) {
    //             // draws powerup only during this 10s interim unless picked up by chick
    //             bucket.update();
    //         }

    //         // sets the 10s timer for powerup, so that it only appears for 10s
    //         if (countdown === 400) {
    //             resetPowerUp();
    //         }
    //     }
    // },
];

function resetPowerUp() {
    powerUpLoopDone = true;
    powerUpArray.pop();
    activePowerUp.pop();
    settingInterval = false;
    clearInterval(tenSecInterval);
}


function everyinterval(n) {
    if ((gameArea.frameNo / n) % 1 == 0) {
        return true;
    }
    return false;
}



/*

            KEY FUNCTIONS

 * ===========================================================================================================================================
 * ===========================================================================================================================================
 * ===========================================================================================================================================
 * ===========================================================================================================================================
 * ===========================================================================================================================================
 */



function doKeyDown(evt) {
    switch (evt.keyCode) {
        case 38:
            /* Up arrow is pressed */
            if (chick.y - 2 > 0 && chick.speedY > -3) {
                chick.speedY -= 1;
            }
            break;
        case 40:
            /* Down arrow is pressed */
            if (chick.y + 2 < gameArea.canvas.height && chick.speedY < 3) {
                chick.speedY += 1;
            }
            break;
        case 37:
            /* Left arrow is pressed */
            if (chick.x - 2 > 0 && chick.speedX > -3) {
                chick.speedX -= 1;
            }
            break;
        case 39:
            /* Right arrow is pressed */
            if (chick.x + 2 < gameArea.canvas.width && chick.speedX < 3) {
                chick.speedX += 1;
            }
            break;
    }
}


/*

            CANVAS AREA

 * ===========================================================================================================================================
 * ===========================================================================================================================================
 * ===========================================================================================================================================
 * ===========================================================================================================================================
 * ===========================================================================================================================================
 */



var gameArea = {
    canvas: document.createElement("canvas"),
    start: function () {
        this.canvas.height = 600;
        this.canvas.width = 600;
        this.context = this.canvas.getContext("2d");
        document.querySelector("main").appendChild(this.canvas);
        this.frameNo = 0;

        console.log(gameStarted);
        if (gameStarted == true) {
            this.interval = setInterval(updateGameArea, 20);
        } else {
            return;
        }
    },

    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },

    stop: function () {
        clearInterval(this.interval);
        resetGame();
    }
}

/*

            THIS RESETS GAME

 * ===========================================================================================================================================
 * ===========================================================================================================================================
 * ===========================================================================================================================================
 * ===========================================================================================================================================
 * ===========================================================================================================================================
 */



function resetGame() {
    // Game over alert
    endGameBkg = new component(600, 100, "rgba(0,0,0,0.5)", 0, 250);
    endGameBkg.update();
    endGameText = new component("19px", 'Courier', "white", 215, 285, "text");
    endGameText.text = "G A M E  O V E R";
    endGameText.update();
    endGameText2 = new component("14px", 'Courier', "white", 185, 320, "text");
    endGameText2.text = "Press <spacebar> to try again.";
    endGameText2.update();

    // To reset game conditions
    randomNumForScore = 6;
    randomNumForPowerup;
    powerUpLoopDone = true;
    settingInterval = false;
    countdown = 0;
    currentScore = 0;
    powerUpArray = [];
    activePowerUp = [];
    duckies = [];
    drawPowerUp = true;
    collisionFx = true;
    duckSpeed = 2;
    window.addEventListener("keydown", toInitialiseGame);
}