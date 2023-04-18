

interface Player{
    speed: number,
    x: number,
    y: number,
    width: number,
    height: number,
    xVel: number;
    yVel: number;
}

interface KeyInfo
{
    key: number,
    player_number: number;
    socket_id: string;
    gameActive: boolean;
    game_id: number;
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
    id: number;
    player_1_id: number,
    player_2_id: number,
    player_1_nick: string,
    player_2_nick: string,
    keysPressed: boolean[]
    player_1_score : number,
    player_2_score : number,

    Ball : Ball;
    Player1 : Player;
    Player2 : Player;
}


export type {Player, KeyInfo, pong_properties}