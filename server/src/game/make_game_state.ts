
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
    keysPressed: boolean[],
    player_1_score : number,
    player_2_score : number,

    Ball : Ball;
    Player1 : Player;
    Player2 : Player;
}

export function getInitialState()
{
    let initial_state : pong_properties = {
        keysPressed: [],
        player_1_score: 0,
        player_2_score: 0,
        Ball: {
            speed: 5,
            x: 700 / 2 - 10 / 2,
            y: 400 / 2 - 10 / 2,
            width: 50,
            height: 50,
            xVel: 0,
            yVel: 0,
            direction: 0,
        },
        Player1: {
            speed: 10,
            x: 20,
            y: 400 / 2 - 60 / 2 ,
            width: 20,
            height: 60,
            xVel: 0,
            yVel: 0,
        },
        Player2: {
            speed: 10,
            x: 700 - (20 + 20),
            y: 400 / 2 - 60 / 2,
            width: 20,
            height: 60,
            xVel: 0,
            yVel: 0,
        }
    }
    // var randomDirection = Math.floor(Math.random() * 2) + 1; 
    // if(randomDirection % 2){
        initial_state.Ball.xVel = 1;
    // }
    // else{
        // initial_state.Ball.xVel = -1;
    // }
    
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
    if(this.y <= 20){
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
    if(!state)
    {
        return 0;
    }
    paddle_update(state.Player1, state.keysPressed);
    paddle_update(state.Player2, state.keysPressed);
    ball_update(state.Ball,state.Player1, state.Player2 ,state);
    if(state.player_1_score === 5)
    {
        // console.log("Player 1 won")
        return 2;
    }else if(state.player_2_score === 5)
    {
        // console.log("Player 2 won")
        return 1;
    }
}





// class Game{
//     private gameCanvas;
//     private gameContext;
//     public static keysPressed: boolean[] = [];
//     public static playerScore: number = 0;
//     public static computerScore: number = 0;
//     private player1: Paddle;
//     private computerPlayer: ComputerPaddle;
//     private ball: Ball;
//     constructor(){
//         this.gameCanvas = document.getElementById("game-canvas");
//         this.gameContext = this.gameCanvas.getContext("2d");
//         this.gameContext.font = "30px Orbitron";
        
//         window.addEventListener("keydown",function(e){
//            Game.keysPressed[e.which] = true;
//         });
        
//         window.addEventListener("keyup",function(e){
//             Game.keysPressed[e.which] = false;
//         });
        
//         var paddleWidth:number = 20, paddleHeight:number = 60, ballSize:number = 10, wallOffset:number = 20;
        
//         this.player1 = new Paddle(paddleWidth,paddleHeight,wallOffset,this.gameCanvas.height / 2 - paddleHeight / 2); 
//         this.computerPlayer = new ComputerPaddle(paddleWidth,paddleHeight,this.gameCanvas.width - (wallOffset + paddleWidth) ,this.gameCanvas.height / 2 - paddleHeight / 2);
//         this.ball = new Ball(ballSize,ballSize,this.gameCanvas.width / 2 - ballSize / 2, this.gameCanvas.height / 2 - ballSize / 2);    
        
//     }
//     drawBoardDetails(){
        
//         //draw court outline
//         this.gameContext.strokeStyle = "#fff";
//         this.gameContext.lineWidth = 5;
//         this.gameContext.strokeRect(10,10,this.gameCanvas.width - 20 ,this.gameCanvas.height - 20);
        
//         //draw center lines
//         for (var i = 0; i + 30 < this.gameCanvas.height; i += 30) {
//             this.gameContext.fillStyle = "#fff";
//             this.gameContext.fillRect(this.gameCanvas.width / 2 - 10, i + 10, 15, 20);
//         }
        
//         //draw scores
//         this.gameContext.fillText(Game.playerScore, 280, 50);
//         this.gameContext.fillText(Game.computerScore, 390, 50);
        
//     }
    // update(){
    //     this.player1.update(this.gameCanvas);
    //     this.computerPlayer.update(this.ball,this.gameCanvas);
    //     this.ball.update(this.player1,this.computerPlayer,this.gameCanvas);
    // }
//     draw(){
//         this.gameContext.fillStyle = "#000";
//         this.gameContext.fillRect(0,0,this.gameCanvas.width,this.gameCanvas.height);
              
//         this.drawBoardDetails();
//         this.player1.draw(this.gameContext);
//         this.computerPlayer.draw(this.gameContext);
//         this.ball.draw(this.gameContext);
//     }
    // gameLoop(){
    //     game.update();
    //     game.draw();
    //     requestAnimationFrame(game.gameLoop);
    // }
// }

// class Entity{
//     width:number;
//     height:number;
//     x:number;
//     y:number;
//     xVel:number = 0;
//     yVel:number = 0;
//     constructor(w:number,h:number,x:number,y:number){       
//         this.width = w;
//         this.height = h;
//         this.x = x;
//         this.y = y;
//     }
//     draw(context){
//         context.fillStyle = "#fff";
//         context.fillRect(this.x,this.y,this.width,this.height);
//     }
// }

// class Paddle extends Entity{
    
//     private speed:number = 10;
    
//     constructor(w:number,h:number,x:number,y:number){
//         super(w,h,x,y);
//     }
    
//
// }

// class ComputerPaddle extends Entity{
    
//     private speed:number = 10;
    
//     constructor(w:number,h:number,x:number,y:number){
//         super(w,h,x,y);        
//     }
    
//     update(ball:Ball, canvas){ 
       
//        //chase ball
//        if(ball.y < this.y && ball.xVel == 1){
//             this.yVel = -1; 
            
//             if(this.y <= 20){
//                 this.yVel = 0;
//             }
//        }
//        else if(ball.y > this.y + this.height && ball.xVel == 1){
//            this.yVel = 1;
           
//            if(this.y + this.height >= canvas.height - 20){
//                this.yVel = 0;
//            }
//        }
//        else{
//            this.yVel = 0;
//        }
       
//         this.y += this.yVel * this.speed;

//     }
    
// }

// class Ball extends Entity{
    
//     private speed:number = 5;
    
//     constructor(w:number,h:number,x:number,y:number){
//         super(w,h,x,y);
//         var randomDirection = Math.floor(Math.random() * 2) + 1; 
//         if(randomDirection % 2){
//             this.xVel = 1;
//         }else{
//             this.xVel = -1;
//         }
//         this.yVel = 1;
//     }
    
//     update(player:Paddle,computer:ComputerPaddle,canvas){
       
//         //check top canvas bounds
//         if(this.y <= 10){
//             this.yVel = 1;
//         }
        
//         //check bottom canvas bounds
//         if(this.y + this.height >= canvas.height - 10){
//             this.yVel = -1;
//         }
        
//         //check left canvas bounds
//         if(this.x <= 0){  
//             this.x = canvas.width / 2 - this.width / 2;
//             Game.computerScore += 1;
//         }
        
//         //check right canvas bounds
//         if(this.x + this.width >= canvas.width){
//             this.x = canvas.width / 2 - this.width / 2;
//             Game.playerScore += 1;
//         }
        
        
//         //check player collision
//         if(this.x <= player.x + player.width){
//             if(this.y >= player.y && this.y + this.height <= player.y + player.height){
//                 this.xVel = 1;
//             }
//         }
        
//         //check computer collision
//         if(this.x + this.width >= computer.x){
//             if(this.y >= computer.y && this.y + this.height <= computer.y + computer.height){
//                 this.xVel = -1;
//             }
//         }
       
//         this.x += this.xVel * this.speed;
//         this.y += this.yVel * this.speed;
//     }
// }
