var chick;
var theObstacles;
var egg;
var duckies = [];
var score;
var currentScore = 0;

function startGame() {
    gameArea.start();
    chick = new component(30, 30, "yellow", 550, 350);
    // chick = new component(30, 30, "chick.png", 550, 350, "image");
    // theObstacles = new component(20, 20, "ducky.png", 20, 300, "image");
    egg = new component(30, 30, "orange", 400, 530);
    score = new component("20px", "BenchNine", "black", 20, 30, "text");
    window.addEventListener('keydown', doKeyDown, true);



}

function component(width, height, color, x, y, type) {
    this.type = type;
    if (type == "image") {
        this.image == new Image();
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
    // if chick crashes with duckies // egg
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
                duckies[i].x = -40;
                duckies[i].y = (Math.random() * 530) + 40;
                duckies[i].x += Math.random() * 5;
            }
        }
    }
}

function everyinterval(n) {
    if ((gameArea.frameNo / n) % 1 == 0) {
        return true;
    }
    return false;
}


// Keys Functions
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



// Canvas Area

var gameArea = {
    canvas: document.createElement("canvas"),
    start: function () {
        this.canvas.height = 600;
        this.canvas.width = 600;
        this.context = this.canvas.getContext("2d");
        document.querySelector("main").appendChild(this.canvas);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
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
    gameArea.clear();
    
    chick.newPos();
    chick.bounce();
    chick.update();
    for (i = 0; i < duckies.length; i++) {
        if (chick.crashWith(duckies[i])) {
            duckies[i].update();
            duckies[i].newPos();
            gameArea.stop();
            return;
        }
    }
    gameArea.frameNo += 1;

    // adds duck component every 140frames
    // if ducks less than 6, add one
    if (((gameArea.frameNo == 1) || everyinterval(140)) && duckies.length < 6) {
        duckies.push(new component(20, 20, "blue", (Math.random() * 5), ((Math.random() * 530) + 40)))
    }

    // allows only 6 ducks to appear every time
    for (var i = 0; i < duckies.length; i++) {
        duckies[i].x += Math.floor(Math.random() * 3 + 2.5);
        duckies[i].reset();
        duckies[i].update();
        duckies[i].newPos();
        console.log(duckies[i]);
    }


    
    egg.update();
    egg.newPos();
    if (chick.crashWith(egg)){
        currentScore += 1;
        egg.x = Math.random() * 570;
        egg.y = Math.random() * 530 + 40;
        egg.update();
        egg.newPos();
    }


    score.text = "Score: " + currentScore;
    score.update();


}

////////////////////////////////////////////////////////////////////////////////////////////
// duckyImage = new Image();

// duckyImage.onload = () => {
//     duckyReady = true;
// }

// duckyImage.src = "ducky.png";