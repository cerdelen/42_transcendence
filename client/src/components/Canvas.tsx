import React ,{ useRef, useEffect, useState, useId}from "react";
import drawPong from './Pong'
import {pong_properties, KeyInfo, Player} from './Pong_types'
import { SocketContext, our_socket } from '../utils/context/SocketContext';


const Canvas = ({userId} : {userId: string}) =>
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
    function ButtonShow({userId, GameActive ,init, setGameActive, setCodeInput} : 
        { userId: string, GameActive: boolean, init :any, setGameActive: any, setCodeInput : any}) 
    {
        if(!GameActive)
        {
            return (<button onClick={() => {
                if(!userId)
                {
                    our_socket.emit("joinGame", "1");
                }else{
                    console.log('this is joingame userid' + userId);
                    our_socket.emit("joinGame", userId);
                }
                init();
                setGameActive(true);
            }} > Join Game </button>)
        }else{
            return (
                <>
                </>
            )
        }
        
    }

    const [gameInfo, setGameInfo] = useState<pong_properties>(initial_state);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [inLobby, setInLobby] = useState(false);
    const [gameActive, setGameActive] = useState(false);
	const [gameCode, setGameCode] = useState("");
	const [codeInput, setCodeInput] = useState("");
    const [playerNumber, setPlayerNumber] = useState(0);
    let ctx : any;


    function handleGameCode(data: string)
    {
        setGameCode(data);
    }
 
    function reset() 
    {
        setPlayerNumber(0);
        setCodeInput("");
        setGameCode("");
        setInLobby(false);

    }
    function init () 
    {
            setInLobby(true);
    }
    useEffect(() => 
    {

        our_socket.on('sameUser', () =>
        {
            reset();
            setGameActive(false);
            alert("Same user wanted to connect to one game");
        })

        our_socket.on("handleTooManyPlayers", () =>
        {
            reset();
            setGameActive(false);
            alert("This game has too many players");
        })
      
        our_socket.on('gameCode', handleGameCode);
    }, [gameActive])

    useEffect(() =>
    {
        our_socket.on('init', (UserIndex_ : number) => {
            let num : number = UserIndex_;
            setPlayerNumber(num);
          });
       
    }, [playerNumber])
    useEffect(() => 
    {
        our_socket.on('gameOver', (data: number) => 
        {
            if(!gameActive)
            {
                return ;
            }
            let num : number = data;
            if(num == Number.parseInt(userId))
            {
              reset();
                alert("You win!");
            }else{
              reset();
                alert("You lose :( ");
            }
            setGameActive(false);
        })
    }, [gameActive])
   
    useEffect( () => 
    {
        our_socket.on('gameState', (gameState: string) => 
        {
            if(!gameActive)
            {
                return ; 
            }
            setGameInfo(JSON.parse(gameState));
            if(canvasRef.current)
            {
                ctx =  canvasRef.current.getContext('2d');
                requestAnimationFrame(() => drawPong(our_socket, ctx, gameInfo));
            }
        })
    }, [gameInfo, gameActive])

    document.addEventListener('keydown', (e) => 
    {
        if(!gameActive)
        {
            return ;
        }
        let obj : KeyInfo =
        {
            key: e.keyCode,
            player_number: playerNumber
        };
        our_socket.emit('keydown', JSON.stringify(obj));
    })
    document.addEventListener('keyup', (e) =>
    {
        if(!gameActive)
        {
            return ;
        }
        let obj : KeyInfo =
        {
            key: e.keyCode,
            player_number: playerNumber
        };
        our_socket.emit('keyup', JSON.stringify(obj));
    })

    
    return (
        <>
            <center>
            <h1> Welcome to Pong </h1>
            <br/>
            <br/>
            <ButtonShow userId={userId} GameActive={gameActive} init={init} setGameActive={setGameActive} setCodeInput={setCodeInput}/>
        </center>
            <canvas 
            ref={canvasRef}
            width={700}
            height={400}/>
        </>
    )
}
export default Canvas;