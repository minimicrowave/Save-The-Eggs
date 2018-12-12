/*

            THIS RUNS THE GAME LOOP & MANIPULATES ANY COMPONENTS THAT CONSTANTLY APPEARS ON THE SCREEN

 * ===========================================================================================================================================
 * ===========================================================================================================================================
 * ===========================================================================================================================================
 * ===========================================================================================================================================
 * ===========================================================================================================================================
 */


// Update Game Area

function updateGameArea() {
    gameArea.clear();
    // loads all chick stuff
    chick.newPos();
    chick.bounce();
    chick.update();

    // ALL DUCKS SHTUFFFFFFF 
    // ========================================================================================================================================
    // if chick crashes with duckiess x_x
    if (collisionFx){
        for (i = 0; i < duckies.length; i++) {
            if (chick.crashWith(duckies[i])) { // GAME OVERRRR
                // to ensure all items still remains on screen before game stops and game over sign appears
                for (var j in duckies) {
                    duckies[j].update();
                }
                score.update();
                egg.update();
    
                gameArea.stop();
                return;
            }
        }
    }

    // adds one frame to frameNo during each frame draw
    gameArea.frameNo += 1;

    // adds duck component every 140frames
    // if ducks less than 6, add one
    if (((gameArea.frameNo == 1) || everyinterval(intervalNo)) && duckies.length < 6) {
        duckies.push(new component(30, 30, "ducky.png", (Math.random() * 5), ((Math.random() * 530) + 40), "image"))
    }

    // allows only 6 ducks to appear every time
    for (var i = 0; i < duckies.length; i++) {
        duckies[i].speedX = Math.random() * duckSpeed;
        duckies[i].x += duckies[i].speedX;
        duckies[i].reset();
        duckies[i].update();
        duckies[i].newPos();
    }

    // ALL POWERUP SHTUFFFFFFF 
    // ========================================================================================================================================
    // powerups given only if score > 5, randomise a number to generate powerups
    if (currentScore > 5){
        if (powerUpArray.length === 0 && powerUpLoopDone) {
            // generates a random number for powerup
            
            console.log(randomNumForScore)
            // generates  a random number for type of powerup
            if (currentScore === randomNumForScore){
                randomNumForPowerup = Math.floor(Math.random() * powerUps.length);
                powerUpArray.push(powerUps[randomNumForPowerup].name);
                powerUpLoopDone = false;
                settingInterval = false;
                countdown = 0;
            }
        }
    }


    // only allows 1 powerup to happen at a time.
    if (powerUpArray.length === 1 && !powerUpLoopDone) {
        powerUps[randomNumForPowerup].startFunc()
        console.log(randomNumForScore);
    }


    // if chick collides with any of powerups
    if (activePowerUp.length > 0){
        for (var t in activePowerUp) {
            if (chick.crashWith(activePowerUp[t])) {
                console.log("toucheu yes!!");
                drawPowerUp = false;
                activePowerUp[t].effect();
            }
        }
    }

    // ALL EGGO SHTUFFFFFFF 
    // ========================================================================================================================================

    // when user touches the egg, respawns another one in another location
    egg.update();
    egg.newPos();
    if (chick.crashWith(egg)) {
        currentScore += 1;
        egg.x = Math.random() * 570;
        egg.y = Math.random() * 530 + 40;
        egg.update();
        egg.newPos();
    }

    // updates corrent score
    score.text = "Eggy Score: " + currentScore;
    score.update();


}