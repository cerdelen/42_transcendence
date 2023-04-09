import React, { useRef, useContext ,useEffect, useState, useId, Fragment } from "react";
import drawPong from './Pong'
import { pong_properties, KeyInfo, Player } from './Pong_types'
import {our_socket} from '../utils/context/SocketContext';
import { CounterContext } from "../utils/context/CounterContext";
import { useMyContext } from '../contexts/InfoCardContext'

import { useUserContext } from "../contexts/UserContext";
import { useMyGameContext } from "../contexts/GameContext";

import Bulgaria from "../images/bulgaria.jpeg";
import Paris from "../images/paris.jpeg";
import Cat_valley from "../images/Cat_valley.jpeg";
// import { gameContext } from '../contexts/gameContext'
interface GameInfo_t
{
  player_id: string,
  gameCode: string
}

type gameBackgroundPreviewType = {
    idx: number
}

const gameBackgroundPreview = ({idx}: gameBackgroundPreviewType) => {

    return (
        <div className="game-page-images-container">
            <img className={`game-page-background ${idx === 1 && "active"}`} src={Bulgaria} alt="" />
            <img className={`game-page-background ${idx === 2 && "active"}`} src={Paris} alt="" />
            <img className={`game-page-background ${idx === 3 && "active"}`} src={Cat_valley} alt="" />
        </div>
    )
}
const Canvas = ({ userId }: { userId: string }) => {
    const { initial_state } = useMyGameContext();
    const {images} = useMyContext();
    const [imageIdx, setImageIdx] = useState<number>(1);
    function Custmization_fields({ setMapNumber }: { setMapNumber: any }) {

        return (
            <>
                <br />
                <br />
                <button className="game_buttons" onClick={(e) => {
                    e.preventDefault();
                    console.log("Map number is " + mapNumber);
                    setMapNumber(0);
                    setImageIdx(1);
                }}> Bulgaria </button>
                <button className="game_buttons" onClick={(e) => {
                    e.preventDefault();
                    setMapNumber(1);
                    setImageIdx(2);
                    console.log("Map number is " + mapNumber);
                }}> Paris </button>
                <button className="game_buttons" onClick={(e) => {
                    e.preventDefault();
                    console.log("Map number is " + mapNumber);
                    setMapNumber(2);
                    setImageIdx(3);
                }}> Cat Valley </button>
            </>
        )
    }

    function ButtonShow({ userId, GameActive, setGameActive, setCodeInput }:
        { userId: string, GameActive: boolean, setGameActive: any, setCodeInput: any }) {
        if (!GameActive) {
            return (<button className="game-page-button" id="joinButton" onClick={() => {
                if (!userId) {
                    our_socket.emit("joinGame", "1");
                } else {
                    console.log('this is joingame userid' + userId);
                    our_socket.emit("joinGame", userId);
                }
                setGameActive(true);
            }} > Join Game </button>)
        } else {

            return (
                <>
                </>
            )
        }

    }
    const [gameInfo, setGameInfo] = useState<pong_properties>(initial_state);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const {gameActive, setGameActive, gameStarted, setGameStarted} = useUserContext();
    const [gameCode, setGameCode] = useState("");
    const {mapNumber, setMapNumber} = useContext(CounterContext);
    const [codeInput, setCodeInput] = useState("");
    const [playerNumber, setPlayerNumber] = useState(0);
    const [animationFrameNum, setAnimationFrameNum] = useState(0);

    let ctx: any;
    function WaitingScreenCatto({ gameActive , gameStarted}: { gameActive: boolean, gameStarted: boolean }) {
        if (!gameActive)
            return (
                <>
                    <ButtonShow userId={userId} GameActive={gameActive} setGameActive={setGameActive} setCodeInput={setCodeInput} />
                    <Custmization_fields setMapNumber={setMapNumber} />

                    <br />
                    <div className="cat">
                        <div className="ear ear--left"></div>
                        <div className="ear ear--right"></div>
                        <div className="face">
                            <div className="eye eye--left">
                                <div className="eye-pupil"></div>
                            </div>
                            <div className="eye eye--right">
                                <div className="eye-pupil"></div>
                            </div>
                            <div className="muzzle"></div>
                        </div>
                    </div>
       
                    {gameBackgroundPreview({ idx: imageIdx })
}

                </>
            )
        else if(gameActive && !gameStarted){
            return <>
            <h1>Waiting for other player</h1>
            </>;
        }else{
            return <>
            </>
        }
    }

    useEffect(() => {
        if (gameActive) {
            if (canvasRef.current) {
                ctx = canvasRef.current.getContext('2d');
                // ctx.canvas.hidden = false;
                ctx.canvas.style.display = "block";
                console.log("Make game visible ");
            }
        } else {
            if (canvasRef.current) {
                ctx = canvasRef.current.getContext('2d');
                // ctx.canvas.hidden = false;
                ctx.canvas.style.display = "none";
            }

        }
        our_socket.on('sameUser', () => {
            our_socket.off('sameUser');    
            reset();
            setGameActive(false);
            alert("Same user wanted to connect to one game");
        })       
    }, [gameActive])

    
    useEffect(() => 
    {
        our_socket.on("handleTooManyPlayers", () => {
            our_socket.off("handleTooManyPlayers");
            reset();
            setGameActive(false);
            alert("This game has too many players");
        })
    }, [gameActive])
    useEffect(() => 
    {
        our_socket.on('gameOver', (data: number) => {
            our_socket.off('gameOver');
            if (!gameActive) {
                our_socket.off('gameOver');
                return;
            }
            let num: number = data;
            if (num == Number.parseInt(userId)) {
                console.log("Winner");
                reset();
                console.log("You win executed " + userId);
                cancelAnimationFrame(animationFrameNum);
                alert("You won 15 mmr! Congratulations!")
            } else {
                alert("You lost 15 mmr! NOOB! How can you lose in Pong?!?!?!")
                console.log("You lose executed\n" + userId);
                reset();
                cancelAnimationFrame(animationFrameNum);
            }
            setGameActive(false);
            
        })
    }, [gameActive])
    function handleGameCode(data: string) {
        setGameCode(data);
    }

    function reset() {
        setCodeInput("");
        setGameCode("");
        setGameStarted(false);
        if (canvasRef.current) {
            ctx = canvasRef.current.getContext('2d');
            ctx.clearRect(0, 0, 700, 400);;
        }
    }
    useEffect(() => 
    {
        our_socket.on('invitationInit', (UserIndex_: number) => {
            our_socket.off("invitationInit");
            setGameActive(true);
            setGameStarted(false);
            console.log("Id of the user ", UserIndex_);
            let num: number = UserIndex_;
            setPlayerNumber(num);
            // our_socket.off("invitationInit");
            console.log("Invitation init");
        });
   
    }, [gameActive])

    useEffect(() => 
    {
        our_socket.on("gameCancelled", (rejectedUserName) => 
        {
            our_socket.off("gameCancelled");
            console.log("Game cancelled invoked");   
            alert("Game has been cancelled by " + rejectedUserName);
            setPlayerNumber(0);
            setGameActive(false);
            
        })
    }, [gameActive])
    
    useEffect(() => {
        our_socket.on('init', (UserIndex_: number) => {
            if(!gameActive)
            {
                our_socket.off("init");
                return ;
            }
            setGameStarted(false);
            console.log("Id of the user ", UserIndex_);
            let num: number = UserIndex_;
            setPlayerNumber(num);
            our_socket.off("init");

        });
    }, [gameActive])

    useEffect(() => {
        if (canvasRef.current) {
            ctx = canvasRef.current.getContext('2d');
            ctx.canvas.hidden = true;
        }
        our_socket.on('gameCode', handleGameCode);
        // our_socket.on('unknownGame', () => 
        // {
        //     alert("client socket id not known refresh the page");
        // })
    }, [])

    useEffect(() => {
        our_socket.on('gameState', (gameState: string) => {
            if (!gameActive) {
                our_socket.off('gameState');
                return;
            }
            let animFrame: number;
            if(!gameStarted)
            {
                setGameStarted(true);
            }
            setGameInfo(JSON.parse(gameState));

            if (canvasRef.current) {
                // console.log("rendering");
                ctx = canvasRef.current.getContext('2d');

                
                setAnimationFrameNum(requestAnimationFrame(() => drawPong(our_socket, ctx, gameInfo, images[mapNumber])));
            }
            our_socket.off('gameState');
        })
        // cancelAnimationFrame(animationFrameNum);
    }, [gameInfo, gameActive, gameStarted])

    useEffect(() => 
    {
        document.addEventListener('keydown', (e) => {
            // e.preventDefault();
            if (!gameActive)
                return;
            let obj: KeyInfo =
            {
                key: e.keyCode,
                player_number: playerNumber,
                socket_id: our_socket.id,
                gameActive: gameActive
            };
            our_socket.emit('keydown', JSON.stringify(obj));
        })
        document.addEventListener('keyup', (e) => {
            // e.preventDefault();
            if (!gameActive)
                return;
            let obj: KeyInfo =
            {
                key: e.keyCode,
                player_number: playerNumber,
                socket_id: our_socket.id,
                gameActive: gameActive
            };
            our_socket.emit('keyup', JSON.stringify(obj));
        })
    }, [playerNumber])


    return (
        <>
            <div className="gameStuff">
                <center>
                    <h1> Welcome to Pong </h1>
                    <br />
                    <br />


                    <WaitingScreenCatto gameActive={gameActive} gameStarted={gameStarted}/>
                    
                </center>
                
            </div>

            <canvas
                ref={canvasRef}
                width={700}
                height={400} />
        </>
    )
}
export default Canvas;