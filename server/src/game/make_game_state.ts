
interface Player{
    speed: number,
    x: number,
    y: number,
    width: number,
    height: number,
    xVel: number;
    yVel: number;
}

interface Ball{
    speed: number,
    x: number,
    y: number,
    width: number;
    height: number;
    xVel: number;
    yVel: number;
    direction: number;
}

interface pong_properties
{
    keysPressed_p1: boolean[],
    keysPressed_p2: boolean[],
    player_1_score : number,
    player_2_score : number,

    Ball : Ball;
    Player1 : Player;
    Player2 : Player;
}

let paddleWidth:number = 20;
let paddleHeight:number = 60;
let ballSize:number = 10;
let wallOffset:number = 20;
export function getInitialState()
{
    let initial_state : pong_properties = {
        keysPressed_p1: [],
        keysPressed_p2: [],
        player_1_score: 0,
        player_2_score: 0,
        Ball: {
            speed: 5,
            x: 700 / 2 - 10 / 2,
            y: 400 / 2 - 10 / 2,
            width: ballSize,
            height: ballSize,
            xVel: 0,
            yVel: 0,
            direction: 0,
        },
        Player1: {
            speed: 10,
            x: wallOffset,
            y: 400 / 2 - paddleHeight / 2,
            width: paddleWidth,
            height: paddleHeight,
            xVel: 0,
            yVel: 0,
        },
        Player2: {
            speed: 10,
            x: 700 - (wallOffset + paddleWidth),
            y: 400 / 2 - paddleHeight / 2,
            width: paddleWidth,
            height: paddleHeight,
            xVel: 0,
            yVel: 0,
        }
    }
    initial_state.Ball.xVel = 1;
    initial_state.Ball.yVel = 1;
    return initial_state;
}
enum KeyBindings{
    UP = 38,
    DOWN = 40
}

let CanvasHeight = 400;
let CanvasWidth = 700;

function paddle_update(paddle : Player, keysPressed : boolean[]){
    if( keysPressed[KeyBindings.UP] ){
        paddle.yVel = -1;
    if(paddle.y <= 20){
        paddle.yVel = 0
    }
    }else if(keysPressed[KeyBindings.DOWN]){
        paddle.yVel = 1;
    if(paddle.y + paddle.height >= CanvasHeight - 20){
        paddle.yVel = 0;
    }
    }else{
        paddle.yVel = 0;
    }

    paddle.y += paddle.yVel * paddle.speed;

}

function ball_update(ball: Ball,player_1 : Player, player_2 : Player,state: pong_properties){
       
            //check top canvas bounds
            if(ball.y <= 10){
                ball.yVel = 1;
            }
            
            //check bottom canvas bounds
            if(ball.y + ball.height >= CanvasHeight - 10){
                ball.yVel = -1;
            }
            
            //check left canvas bounds
            if(ball.x <= 0){  
                ball.x = CanvasWidth / 2 - ball.width / 2;
                state.player_2_score += 1;
            }
            
            //check right canvas bounds
            if(ball.x + ball.width >= CanvasWidth){
                ball.x = CanvasWidth / 2 - ball.width / 2;
                state.player_1_score += 1;
            }
            
            
            //check player collision
            if(ball.x <= player_1.x + player_1.width){
                if(ball.y >= player_1.y && ball.y + ball.height <= player_1.y + player_1.height){
                    ball.xVel = 1;
                }
            }
            
            //check computer collision
            if(ball.x + ball.width >= player_2.x){
                if(ball.y >= player_2.y && ball.y + ball.height <= player_2.y + player_2.height){
                    ball.xVel = -1;
                }
            }
           
            ball.x += ball.xVel * ball.speed;
            ball.y += ball.yVel * ball.speed;
}
export function gameLoop(state: pong_properties) : number
{
    const win_condition = 10;
    if(!state)
    {
        return 0;
    }
    paddle_update(state.Player1, state.keysPressed_p1);
    paddle_update(state.Player2, state.keysPressed_p2);
    ball_update(state.Ball,state.Player1, state.Player2 ,state);
    if(state.player_1_score === win_condition)
    {
        console.log("Player 1 won")
        return 2;
    }else if(state.player_2_score === win_condition)
    {
        console.log("Player 2 won")
        return 1;
    }
    return 0;
}