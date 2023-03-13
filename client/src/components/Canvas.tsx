import React ,{ useRef, useEffect, useState}from "react";
import PropTypes, {InferProps} from 'prop-types'
import drawPong from './Pong'

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
    keysPressed: boolean[]
    player_1_score : number,
    player_2_score : number,

    Ball : Ball;
    Player1 : Player;
    Player2 : Player;
}

const CanvasTypes = {
    socket: PropTypes.any,
};

type CanvasPropTypes = InferProps<typeof CanvasTypes>;

const Canvas = ({socket} : CanvasPropTypes) =>
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
            xVel: 1,
            yVel: 1,
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
    
    const [gameInfo, setGameInfo] = useState<pong_properties>(initial_state);

    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    let ctx : any;

    useEffect(() => 
    {
        socket.emit('connectToGameService', () =>{})
    }, [])

    useEffect( () => 
    {
        

        socket.on('gameState', (gameState: string) => 
        {
            setGameInfo(JSON.parse(gameState));
            if(canvasRef.current)
            {
                ctx =  canvasRef.current.getContext('2d');
                requestAnimationFrame(() => drawPong(socket, ctx, gameInfo));
            }
        })
    }, [gameInfo])

    document.addEventListener('keydown', (e) => 
    {
        socket.emit('keydown', e.keyCode);
    })
    document.addEventListener('keyup', (e) =>
    {
        socket.emit('keyup', e.keyCode);
    })
    return (
        <>
        <canvas 
        ref={canvasRef}
        width={700}
        height={400}/>
        </>
    )
}
Canvas.propTypes = CanvasTypes;
export default Canvas;