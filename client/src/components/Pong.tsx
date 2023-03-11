import React from "react";


//Canvas 
//Ctx

class Ball 
{
    x: number;
    y: number;
    radius: number;
    velocityX: number;
    velocityY: number;
    speed: number;
    color: string;
    bottom: number;
    top: number;
    left: number;
    right: number;

    constructor(canvas : any)
    {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.radius = 10;
        this.velocityX = 5;
        this.velocityY = 5;
        this.speed = 7;
        this.color = "WHITE"
        this.bottom = 0
        this.top = 0
        this.left = 0
        this.right = 0
    }
}


class Player{

    x: number; // left side of canvas
    y: number; // -100 the height of paddle
    width: number;
    height: number;
    score: number;
    color: string;
    bottom: number;
    top: number;
    left: number;
    right: number;
    constructor (canvas: any, x: number, y:number)
    {
        this.x = x;
        this.y = y;
        this.width = 10;
        this.height = 100;
        this.score = 0;
        this.color = "WHITE"
        this.bottom = 0
        this.top = 0
        this.left = 0
        this.right = 0
    }
}



class Net
{
    x: number;
    y: number;
    height: number;
    width: number;
    color: string;
    constructor(canvas: any)
    {
        this.x = (canvas.width - 2) / 2;
        this.y = 0;
        this.height = 10;
        this.width = 2;
        this.color = "WHITE";
    }
}

function drawRectangle(ctx: any,x: number, y: number, w: number, h: number, color: string)
{
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawCircle(ctx:any, x: number, y:number, r: number, color: string)
{
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
}

// Add event listener 

function getMousePos(event : any, canvas: any, p : Player)
{
    let rect = canvas.getBoundingClientRect();

    p.y = event.clientY - rect.top - p.height / 2;
}

//When someone scores reset the ball
function resetBall(canvas: any, ball : Ball)
{
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.velocityX = -ball.velocityX;
    ball.speed = 7;
}

function drawNet(ctx: any, canvas: any, net: Net)
{
    for(let i = 0; i <= canvas.height; i += 15)
    {
        drawRectangle(ctx ,net.x, net.y + i, net.width, net.height, net.color);
    }
}

function drawText(ctx: any, text : string, x: number, y: number)
{
    ctx.fillStyle = "#FFF";
    ctx.font = "75px fantasy"
    ctx.fillText(text, x, y);
}

function checkColission(ball: Ball, paddle : Player)
{
    paddle.top = paddle.y;
    paddle.bottom = paddle.y + paddle.height;
    paddle.left = paddle.x;
    paddle.right = paddle.x + paddle.width;

    ball.top = ball.y - ball.radius;
    ball.bottom = ball.y + ball.radius;
    ball.left = ball.x - ball.radius;
    ball.right = ball.x + ball.radius;

    return (
        paddle.left < ball.right && paddle.top < ball.bottom && paddle.right > ball.left && paddle.bottom > ball.top
    );
}


function update(canvas: any,ball : Ball, player: Player, computer_p : Player)
{
    if(ball.x - ball.radius < 0)
    {
        computer_p.score++;
        resetBall(canvas, ball);
    }else if (ball.x + ball.radius > canvas.width)
    {
        player.score++;
        resetBall(canvas, ball);
    }
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    Math.random()

    computer_p.y += (ball.y -(computer_p.y + computer_p.height / 2)) * 0.1;
    if(ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height)
    {
        //Wall hit
        ball.velocityY = -ball.velocityY;
    }
    let check_if_paddle_hit : any
    if(ball.x + ball.radius < canvas.width / 2)
    {
        check_if_paddle_hit =  player;
    }else{
        console.log("Computer thingy")
        check_if_paddle_hit =  computer_p;
    }
    if(checkColission(ball, check_if_paddle_hit))
    {
        let collidePoint : number = ball.y - (check_if_paddle_hit.y + check_if_paddle_hit.height / 2);
        collidePoint = collidePoint / (check_if_paddle_hit.height / 2);

        let angleRad = (Math.PI / 4) * collidePoint;

        let dir = ball.x + ball.radius < canvas.width / 2 ? 1 : -1;

        ball.velocityX = dir * ball.speed * Math.cos(angleRad);
        console.log("Direction ", dir);
        ball.velocityY = ball.speed * Math.sin(angleRad);

        ball.speed += 0.1;
    }

}

function render(canvas: any, ctx: any, player: Player, computer: Player, net: Net, ball: Ball)
{
    drawRectangle(ctx, 0, 0, canvas.width, canvas.height, '#000');

    drawText(ctx ,String(player.score) , canvas.width / 4, canvas.height / 5);

    drawText(ctx ,String(computer.score) , (3 * canvas.width) / 4, canvas.height / 5);

    drawNet(ctx, canvas, net);

    drawRectangle(ctx ,player.x, player.y, player.width, player.height, player.color);

    drawRectangle(ctx ,computer.x, computer.y, computer.width, computer.height, computer.color);

    drawCircle(ctx, ball.x, ball.y, ball.radius, ball.color);
}



function game(canvas: any, ctx: any, player: Player, computer: Player, net: Net, ball: Ball)
{
    update(canvas, ball, player, computer);
    render(canvas, ctx, player, computer, net, ball);
}

let framesPerSecond = 50;


function Pong(start: boolean, canvas: any, ctx:any)
{
    
    let ball : Ball = new Ball(canvas);
    let Player_1 : Player = new Player(canvas, 0, (canvas.height - 100) / 2);
    let Player_2 : Player = new Player(canvas, canvas.width - 10, (canvas.height - 100) / 2);
    let net : Net = new Net(canvas);
    if(start)
    {
        canvas.addEventListener("mousemove", (e : any) => 
        {
            getMousePos(e, canvas, Player_1)
        } );
        let loop = setInterval(() => game(canvas, ctx, Player_1, Player_2, net, ball), 1000 / framesPerSecond);
    }


}

export default Pong