/*global document*/
/*global window*/
/*global setInterval*/
/*eslint no-unused-vars: "off"*/

var paddleMaxSpeed = 5;

var paddlePosLeft;
var paddleSpeedLeft = 0;
var paddlePosRight;
var paddlePosRightX;
var paddleSpeedRight = 0;
var paddleMaxPos;

var ballPosX;
var ballPosY;
var ballSpeedX;
var ballSpeedY;
var ballMaxPosX;
var ballMaxPosY;
var ballMoving = false;
var canBounce = true;

var paddleSizeX;
var paddleSizeY;
var ballSize;


var wDown;
var sDown;
var upDown;
var downDown;

var scoreLeft = 0;
var scoreRight = 0;
var leftScoreBoard;
var rightScoreBoard;
var myCanvas;
var ctx;

function Start() {
    myCanvas = document.getElementById("myCanvas");
    ctx = myCanvas.getContext("2d");

    paddleSizeX = myCanvas.width * .05;
    paddleSizeY = myCanvas.height * .15;
    paddlePosLeft = (myCanvas.height - paddleSizeY) * .5;
    paddlePosRight = paddlePosLeft;
    paddlePosRightX = myCanvas.width - 3 - paddleSizeX;
    paddleMaxPos = myCanvas.height - paddleSizeY;
    ballSize = myCanvas.width * .05;

    SetBall(true);
    setTimeout("LaunchBall()", 2000);

    ballMaxPosX = myCanvas.width - ballSize;
    ballMaxPosY = myCanvas.height - ballSize;
    leftScoreBoard = document.getElementById("leftScore");
    rightScoreBoard = document.getElementById("rightScore");
    window.setInterval("Update()", 17);

}

function Update() {
    CheckKeys();
    CheckWallsPaddles();
    CheckBallPaddles();
    CheckWallsBall();
    UpdatePositions();
    DrawScreen();
}

function CheckKeys() {
    if (wDown) {
        if (sDown) {
            paddleSpeedLeft = 0;
        } else {
            paddleSpeedLeft = -1 * paddleMaxSpeed;
        }
    } else if (sDown) {
        paddleSpeedLeft = paddleMaxSpeed;
    } else {
        paddleSpeedLeft = 0;
    }

    if (upDown) {
        if (downDown) {
            paddleSpeedRight = 0;
        } else {
            paddleSpeedRight = -1 * paddleMaxSpeed;
        }
    } else if (downDown) {
        paddleSpeedRight = paddleMaxSpeed;
    } else {
        paddleSpeedRight = 0;
    }
}

function CheckWallsPaddles() {
    if (paddleSpeedLeft > 0) {
        if (paddlePosLeft == paddleMaxPos) {
            paddleSpeedLeft = 0;
        } else if (paddlePosLeft > paddleMaxPos) {
            paddleSpeedLeft = -1;
        }
    } else if (paddleSpeedLeft < 0) {
        if (paddlePosLeft == 0) {
            paddleSpeedLeft = 0;
        } else if (paddlePosLeft < 0) {
            paddleSpeedLeft = 1;
        }
    }

    if (paddleSpeedRight > 0) {
        if (paddlePosRight == paddleMaxPos) {
            paddleSpeedRight = 0;
        } else if (paddlePosRight > paddleMaxPos) {
            paddleSpeedRight = -1;
        }
    } else if (paddleSpeedRight < 0) {
        if (paddlePosRight == 0) {
            paddleSpeedRight = 0;
        } else if (paddlePosRight < 0) {
            paddleSpeedRight = 1;
        }
    }
}

function CheckBallPaddles() {
    if (canBounce) {
        if (ballPosX <= (paddleSizeX + 3)) {
            //Check the left paddle
            if ((ballPosY - paddlePosLeft) < paddleSizeY) {
                if ((paddlePosLeft - ballPosY) < ballSize) {
                    // pong
                    Bounce((ballPosY + .5 * ballSize)-(paddlePosLeft + .5 * paddleSizeY));
                }
            }
        } else if (ballPosX >= (myCanvas.width - (3 + paddleSizeX + ballSize))) {
            //Check the right paddle
            if ((ballPosY - paddlePosRight) < paddleSizeY) {
                if ((paddlePosRight - ballPosY) < ballSize) {
                    // pong
                    Bounce((ballPosY + .5 * ballSize)-(paddlePosRight + .5 * paddleSizeY));
                }
            }
        }
    }
}

function Bounce(bob) {
    ballSpeedX *= -1;
    ballSpeedY += .1 * bob;
    canBounce = false;
    setTimeout("EnableBouncing()", 1000);
}

function EnableBouncing() {
    canBounce = true;
}

function CheckWallsBall() {
    if (ballPosY <= 0 || ballPosY >= ballMaxPosY) {
        ballSpeedY *= -1;
    }

    if (ballPosX <= -1 * ballSize) {
        // right player scored
        Score(false);
    } else if (ballPosX >= myCanvas.width) {
        // left player scored
        Score(true);
    }
}

function Score(isLeftPlayer) {
    if (isLeftPlayer) {
        scoreLeft += 1;
        leftScoreBoard.innerHTML = scoreLeft;
    } else {
        scoreRight += 1;
        rightScoreBoard.innerHTML = scoreRight;
    }
    ballMoving = false;
    SetBall(!isLeftPlayer);
    setTimeout("LaunchBall()", 1000);
}

function SetBall(toLeft) {
    ballPosX = (myCanvas.width - ballSize) * .5;
    if (toLeft) {
        ballSpeedX = -1 * myCanvas.width / 180;
    } else {
        ballSpeedX = myCanvas.width / 180;
    }

    ballPosY = 200; //random
    ballSpeedY = 5; //random

}

function LaunchBall() {
    ballMoving = true;
}

function UpdatePositions() {
    paddlePosLeft += paddleSpeedLeft;
    paddlePosRight += paddleSpeedRight;
    if (ballMoving) {
        ballPosX += ballSpeedX;
        ballPosY += ballSpeedY;
    }
}

function DrawScreen() {
    ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
    //draw left paddle
    ctx.fillRect(3, paddlePosLeft, paddleSizeX, paddleSizeY);
    //draw right paddle
    ctx.fillRect(paddlePosRightX, paddlePosRight, paddleSizeX, paddleSizeY);
    //draw ball
    ctx.fillRect(ballPosX, ballPosY, ballSize, ballSize);
}

function KeyDown(event) {
    if (event.key == "w") {
        wDown = true;
    } else if (event.key == "s") {
        sDown = true;
    } else if (event.key == "ArrowUp") {
        upDown = true;
    } else if (event.key == "ArrowDown") {
        downDown = true;
    }
}

function KeyUp(event) {
    if (event.key == "w") {
        wDown = false;
    } else if (event.key == "s") {
        sDown = false;
    } else if (event.key == "ArrowUp") {
        upDown = false;
    } else if (event.key == "ArrowDown") {
        downDown = false;
    }
}
