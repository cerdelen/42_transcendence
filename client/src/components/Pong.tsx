
import { useContext } from "react";
import { Socket } from "socket.io-client";
import { useMyGameContext } from "../contexts/GameContext";

function draw_rectangle(context: any, player: any, width: number, height: number) {
    context.fillStyle = "#fff";
    context.fillRect(player.x, player.y, width, height);
}


//Print Names
function drawGame(ctx: any, gameInfo: any, image: any) {
    // ctx.fillStyle = "#000";
    // ctx.fillRect(0,0, 700, 400);    
    // // console.log("player 1 " + name_map.get(gameInfo));
    

    ctx.clearRect(0, 0, 700, 400);;
    // const image = new Image();

    ctx.drawImage(image, 0, 0, 700, 400);
    ctx.strokeStyle = "#fff"
    ctx.strokeRect(10, 10, 700 - 20, 400 - 20);
    ctx.lineWidth = 5;

    //draw center lines
    for (var i = 0; i + 30 < 700; i += 30) {
        ctx.fillStyle = "#333";
        ctx.fillRect(700 / 2 - 10, i + 10, 15, 20);
    }
    let paddleWidth: number = 20;
    let paddleHeight: number = 60;
    var ballSize: number = 10;

    //draw scores
    ctx.fillStyle = "#940FAC";    
    ctx.font = "35px Arial";
    ctx.fillText(gameInfo.player_1_score, 280, 50);
    ctx.fillText(gameInfo.player_2_score, 390, 50);
    ctx.fillStyle = "#940FAC";    
    ctx.font = "20px Arial";
    ctx.fillText(gameInfo.player_1_nick, 50, 50);
    ctx.fillText(gameInfo.player_2_nick, 500, 50);
    draw_rectangle(ctx, gameInfo.Player1, paddleWidth, paddleHeight);
    draw_rectangle(ctx, gameInfo.Player2, paddleWidth, paddleHeight);
    draw_rectangle(ctx, gameInfo.Ball, ballSize, ballSize);
}

function drawPong(socket: Socket, ctx: any, gameInfo: any, image: any) {
    
    drawGame(ctx, gameInfo, image);
}

export default drawPong;