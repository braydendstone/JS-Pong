var canvas; //info on dimensions
var canvasContext; // underlying graphical information
var ballX = 50;
var ballY = 50;
var ballRadius = 5;
var ballSpeedX = 10;
var ballSpeedY = 5;
var paddle1Y = 250;
const PADDLE_HEIGHT = 100;
const PADDLE_WIDTH = 10;
var paddle2Y = 250;

var player1Score = 0;
var player2Score = 0;
const WINNING_SCORE = 5;

var showWinScreen = false;

function calculateMousePos(evt) {
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    var mouseX = evt.clientX - rect.left - root.scrollLeft;
    var mouseY = evt.clientY - rect.top - root.scrollTop;
    return {
        x: mouseX,
        y: mouseY
    };
}

function handleMouseClick(evt)
{
    if (showWinScreen) {
        player1Score = 0;
        player2Score = 0;
        showWinScreen = false;
    }
}

window.onload = function () {
    console.log('hello game world');
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');

    var framesPerSecond = 30;
    setInterval(function () {
        moveEverything();
        drawEverything();
    }, 1000 / framesPerSecond);

    canvas.addEventListener('mousemove', function (evt)
    {
        var mousePos = calculateMousePos(evt);
        paddle1Y = mousePos.y - (PADDLE_HEIGHT / 2);
    })

    canvas.addEventListener('mousedown', handleMouseClick);
}

function ballReset() {
    if (player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE)
    {
        showWinScreen = true;
    }
    ballSpeedX = -ballSpeedX;
    ballSpeedY = 5;
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
}

function computerMovement() {
    var paddle2YCenter = paddle2Y + (PADDLE_HEIGHT / 2);
    if (paddle2YCenter < ballY - 35) {
        paddle2Y += 5;
    }
    else if(paddle2YCenter > ballY + 35){
        paddle2Y -= 5;
    }
}

function drawNet() 
{
    for (var i = 0; i < canvas.height; i += 40) {
        colorRect((canvas.width / 2) - 1, i, 2, 20, 'white');
    }
}

function moveEverything() {

    if (showWinScreen)
    {
        return;
    }

    computerMovement();

    if (ballX < ballRadius + PADDLE_WIDTH)
    {
        if (ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGHT) {
            ballSpeedX = -ballSpeedX;
            var deltaY = ballY - (paddle1Y + (PADDLE_HEIGHT / 2));
            ballSpeedY = deltaY * .35;
        }
        else {
            player2Score++; // increment score BEFORE ball reset
            ballReset();
        }

    }
    if (ballX > canvas.width - ballRadius - PADDLE_WIDTH)
    {
        if (ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT) {
            ballSpeedX = -ballSpeedX;
            var deltaY = ballY - (paddle2Y + (PADDLE_HEIGHT / 2));
            ballSpeedY = deltaY * .35;
        }
        else {
            player1Score++; // increment score BEFORE ball reset
            ballReset();
        }
    }

    ballX += ballSpeedX;

    if (ballY < ballRadius || ballY > canvas.height - ballRadius) {
        ballSpeedY = -ballSpeedY;
    }

    ballY += ballSpeedY;
}


function drawEverything() {
    colorRect(0, 0, canvas.width, canvas.height, 'black'); // draw background
    colorCircle(ballX, ballY, ballRadius, 'white'); // draw ball
    drawNet();
    colorRect(0, paddle1Y, PADDLE_WIDTH, PADDLE_HEIGHT, 'white'); // draw left (player) paddle
    colorRect(canvas.width - PADDLE_WIDTH, paddle2Y, PADDLE_WIDTH, PADDLE_HEIGHT, 'white'); // draw right (computer) paddle
    canvasContext.fillText("Score: " + player1Score, 100, 100); // display player 1 score
    canvasContext.fillText("Score: " + player2Score, canvas.width - 100, 100); // display player 2 score

    if (showWinScreen)
    {
        if (player1Score >= WINNING_SCORE)
        {
            canvasContext.fillStyle = 'white';
            canvasContext.fillText("Left Player Won!", 360, 200);
        }
        else if (player2Score >= WINNING_SCORE)
        {
            canvasContext.fillStyle = 'white';
            canvasContext.fillText("Right Player Won!", 360, 200);
        }

        canvasContext.fillStyle = 'white';
        canvasContext.fillText("- click to play again -", 360, 500);
        
    }
}

function colorRect(leftX, topY, width, height, drawColor) {
    canvasContext.fillStyle = drawColor;
    canvasContext.fillRect(leftX, topY, width, height);
}

function colorCircle(centerX, centerY, radius, drawColor)
{
    canvasContext.fillStyle = drawColor;
    canvasContext.beginPath();
    canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
    canvasContext.fill();
}

