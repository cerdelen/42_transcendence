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

interface KeyInfo
{
    key: number,
    player_number: number;
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
    function ButtonShow({socket, GameActive ,init, setGameActive, setCodeInput} : {socket : any, GameActive: boolean, init :any, setGameActive: any, setCodeInput : any}) 
    {
        if(!GameActive)
        {
            return (<button onClick={() => {
                // if(!codeInput)
                //     return ;
                socket.emit("joinGame", codeInput);
                setCodeInput("");
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
        console.log("Setting game")
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
        socket.emit('connectToGameService', () =>{

        })

        socket.on('gameOver', (data: any) => 
        {
            if(!gameActive)
            {
                return ;
            }
            data = JSON.parse(data);

            if(data.winner === playerNumber)
            {
                alert("You win!");
            }else{
                alert("You lose :( ");
            }
            setGameActive(false);
        })

        socket.on('handleUnknownGame', () =>
        {
            reset();
            alert("Unknown Game");
        })

        socket.on("handleTooManyPlayers", () =>
        {
            reset();
            alert("This game has too many players");
        })
      
        socket.on('gameCode', handleGameCode);
    }, [gameActive])

    useEffect(() =>
    {
          socket.on('init', (UserIndex_ : number) => {
            let num : number = UserIndex_;
            setPlayerNumber(num);
          });
    }, [playerNumber])

    useEffect( () => 
    {
        socket.on('gameState', (gameState: string) => 
        {
            if(!gameActive)
            {
                return ; 
            }
            setGameInfo(JSON.parse(gameState));
            if(canvasRef.current)
            {
                ctx =  canvasRef.current.getContext('2d');
                requestAnimationFrame(() => drawPong(socket, ctx, gameInfo));
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
        
        socket.emit('keydown', JSON.stringify(obj));
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
        console.log(JSON.stringify(obj));
        socket.emit('keyup', JSON.stringify(obj));
    })

    
		return (
			<>
                <center>
				<h1> Welcome to Pong </h1>
				
				<br/>
				{/* <button onClick={() => {
                    socket.emit('newGame');
                    init();
                    setGameActive(true);
                }} > Create Game </button>
				<br/> */}
				{/* <input placeholder='GAME CODE' onChange={(e) => 
                {
                    setCodeInput(e.target.value);
                }} value={codeInput}></input> */}
				<br/>
                <ButtonShow socket={socket} GameActive={gameActive} init={init} setGameActive={setGameActive} setCodeInput={setCodeInput}/>
				
			</center>
                {/* <h1>{gameCode}</h1> */}
                <canvas 
                ref={canvasRef}
                width={700}
                height={400}/>
            </>
        )
}
Canvas.propTypes = CanvasTypes;
export default Canvas;