import React ,{ useRef, useEffect, useState, useId}from "react";
import drawPong from './Pong'
import {pong_properties, KeyInfo, Player} from './Pong_types'
import { SocketContext, our_socket } from '../utils/context/SocketContext';


function WaitingScreenCatto ({gameActive} : {gameActive: boolean})
{
    if(!gameActive)
    return (
        <>
        <div className="outer_wrapper">
    <div className="wrapper">

      <div className="cat_wrapper">
        <div className="cat first_pose">
          <div className="cat_head">
            <svg x="0px" y="0px" width="100%" height="100%" viewBox="0 0 76.4 61.2">
              <polygon className="eyes" points="63.8,54.1 50.7,54.1 50.7,59.6 27.1,59.6 27.1,54.1 12.4,54.1 12.4,31.8 63.8,31.8 " />
              <path d="M15.3,45.9h5.1V35.7h-5.1C15.3,35.7,15.3,45.9,15.3,45.9z M45.8,56.1V51H30.6v5.1H45.8z M61.1,35.7H56v10.2h5.1
                V35.7z M10.2,61.2v-5.1H5.1V51H0V25.5h5.1V15.3h5.1V5.1h5.1V0h5.1v5.1h5.1v5.1h5.1v5.1c0,0,15.2,0,15.2,0v-5.1h5.1V5.1H56V0h5.1v5.1
                h5.1v10.2h5.1v10.2h5.1l0,25.5h-5.1v5.1h-5.1v5.1H10.2z" />
            </svg>

          </div>
          <div className="body">
            <svg x="0px" y="0px" width="100%" height="100%" viewBox="0 0 91.7 40.8">
              <path className="st0" d="M91.7,40.8H0V10.2h5.1V5.1h5.1V0h66.2v5.1h10.2v5.1h5.1L91.7,40.8z" />
            </svg>

            <div className="tail">
              <svg x="0px" y="0px" width="100%" height="100%" viewBox="0 0 25.5 61.1">
                <polygon className="st0" points="10.2,56 10.2,50.9 5.1,50.9 5.1,40.7 0,40.7 0,20.4 5.1,20.4 5.1,10.2 10.2,10.2 10.2,5.1 15.3,5.1 
                  15.3,0 25.5,0 25.5,10.2 20.4,10.2 20.4,15.3 15.3,15.3 15.3,20.4 10.2,20.4 10.2,40.7 15.3,40.7 15.3,45.8 20.4,45.8 20.4,50.9 
                  25.5,50.9 25.5,61.1 15.3,61.1 15.3,56 " />
              </svg>
            </div>
          </div>

          <div className="front_legs">
            <div className="leg one">
              <svg x="0px" y="0px" width="100%" height="100%" viewBox="0 0 14 30.5">
                <polygon points="15.3,30.5 5.1,30.5 5.1,25.4 0,25.4 0,0 15.3,0 " />
              </svg>
            </div>
            <div className="leg two">
              <svg x="0px" y="0px" width="100%" height="100%" viewBox="0 0 14 30.5">
                <polygon points="15.3,30.5 5.1,30.5 5.1,25.4 0,25.4 0,0 15.3,0 " />
              </svg>
            </div>
          </div>

          <div className="back_legs">
            <div className="leg three">
              <svg x="0px" y="0px" width="100%" height="100%" viewBox="0 0 14 30.5">
                <polygon points="15.3,30.5 5.1,30.5 5.1,25.4 0,25.4 0,0 15.3,0 " />
              </svg>
            </div>
            <div className="leg four">
              <svg x="0px" y="0px" width="100%" height="100%" viewBox="0 0 14 30.5">
                <polygon points="15.3,30.5 5.1,30.5 5.1,25.4 0,25.4 0,0 15.3,0 " />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="ground"></div>

  </div>
        </>
    )
    else{
        return <>
        </>;
    }
}

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
    function Custmization_fields ({setMapNumber} : {setMapNumber: any})
    {
        
        return  (
            <>
            <br/>
            <br/>
            <button className="game_buttons" onClick={() => 
            {
                setMapNumber(0);
            }}> Cat Valley </button>
            <button className="game_buttons" onClick={() => 
            {
                setMapNumber(1);
            }}> Paris </button>
            <button className="game_buttons" onClick={() => 
            {
                setMapNumber(2);
            }}> Bulgaria </button>
            </>
        )
    }
    
    function ButtonShow({userId, GameActive, setGameActive, setCodeInput} : 
        { userId: string, GameActive: boolean, setGameActive: any, setCodeInput : any}) 
    {
        if(!GameActive)
        {
            return (<button id="joinButton" onClick={() => {
                if(!userId)
                {
                    our_socket.emit("joinGame", "1");
                }else{
                    console.log('this is joingame userid' + userId);
                    our_socket.emit("joinGame", userId);
                }
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
    const [gameActive, setGameActive] = useState(false);
	const [gameCode, setGameCode] = useState("");
	const [codeInput, setCodeInput] = useState("");
    const [playerNumber, setPlayerNumber] = useState(0);
    const [mapNumber, setMapNumber] = useState(0);
    let ctx : any;

    useEffect(() => 
    {
        if(gameActive)
        {
            if(canvasRef.current)
            {
                ctx =  canvasRef.current.getContext('2d');
                ctx.canvas.hidden = false;
                ctx.canvas.display = "block";
            }
        }
    }, [gameActive])
    function handleGameCode(data: string)
    {
        setGameCode(data);
    }
 
    function reset() 
    {
        setPlayerNumber(0);
        setCodeInput("");
        setGameCode("");
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
    useEffect(() => 
    {
        if(canvasRef.current)
        {
            ctx =  canvasRef.current.getContext('2d');
            ctx.canvas.hidden = true;
        }
    }, [])
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
            <div className="gameStuff">
            <center>
            <h1> Welcome to Pong </h1>
            <br/>
            <br/>
            <ButtonShow userId={userId} GameActive={gameActive} 
                setGameActive={setGameActive}
                setCodeInput={setCodeInput}
                />
            <Custmization_fields setMapNumber={setMapNumber}/>
            
        </center>
        <WaitingScreenCatto gameActive={gameActive} />
        </div>
            <canvas 
            ref={canvasRef}
            width={700}
            height={400}/>
        </>
    )
}
export default Canvas;