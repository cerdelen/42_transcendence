import React, { useRef, useContext ,useEffect, useState, useId, Fragment } from "react";
import drawPong from './Pong'
import { pong_properties, KeyInfo, Player } from './Pong_types'
import {our_socket} from '../utils/context/SocketContext';
import { CounterContext } from "../utils/context/CounterContext";
import { useMyContext } from '../contexts/InfoCardContext'

import { useUserContext } from "../contexts/UserContext";
import { useMyGameContext } from "../contexts/GameContext";

import Bulgaria from "../images/bulgaria-nice.jpeg";
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
    const [gameId, setGameId] = useState<number>(0);
    function Custmization_fields({ setMapNumber }: { setMapNumber: any }) {

        return (
            <>
                <br />
                <br />
                <button className="game_buttons" onClick={(e) => {
                    e.preventDefault();
                    // console.log("Map number is " + mapNumber);
                    setMapNumber(0);
                    setImageIdx(1);
                }}> Bulgaria </button>
                <button className="game_buttons" onClick={(e) => {
                    e.preventDefault();
                    setMapNumber(1);
                    setImageIdx(2);
                    // console.log("Map number is " + mapNumber);
                }}> Paris </button>
                <button className="game_buttons" onClick={(e) => {
                    e.preventDefault();
                    // console.log("Map number is " + mapNumber);
                    setMapNumber(2);
                    setImageIdx(3);
                }}> Cat Valley </button>
            </>
        )
    }
    const {gameActive, setGameActive, gameStarted, setGameStarted, gameInvited ,setGameInvited} = useUserContext();

    function ButtonShow({ userId, GameActive, setGameActive, setCodeInput }:
        { userId: string, GameActive: boolean, setGameActive: any, setCodeInput: any }) {
        if (!GameActive) {
            return (<button className="game-page-button" id="joinButton" onClick={() => {
                if (!userId) {
                    our_socket.emit("joinGame", "1");
                } else {
                    // console.log('this is joingame userid' + userId);
                    our_socket.emit("joinGame", userId);
                }
                setGameActive(true);
                // console.log("Game active", gameActive);
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
    const [gameCode, setGameCode] = useState("");
    const {mapNumber, setMapNumber} = useContext(CounterContext);
    const [codeInput, setCodeInput] = useState("");
    const [playerNumber, setPlayerNumber] = useState(0);
    const [animationFrameNum, setAnimationFrameNum] = useState(0);

    let ctx: any;
    function WaitingScreenCatto({ gameInvited ,gameActive , gameStarted}: {gameInvited: any, gameActive: boolean, gameStarted: boolean }) {
        if(gameInvited)
        {
            return (<>
            <h1>Waiting for other player</h1>
            </>
            )
        }
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
                // console.log("Make game visible ");
            }
        } else {
            if (canvasRef.current) {
                ctx = canvasRef.current.getContext('2d');
                // ctx.canvas.hidden = false;
                ctx.canvas.style.display = "none";
            }

        }  
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

        our_socket.on("handleTooManyPlayers", () => {
            our_socket.off("handleTooManyPlayers");
            reset();
            setGameActive(false);
            alert("This game has too many players");
        })

        our_socket.on("gameCancelled", (rejectedUserName) => 
        {
            setGameInvited(false);
            // console.log("Game cancelled invoked");   
            alert("Game has been cancelled by " + rejectedUserName);
            setPlayerNumber(0);
            setGameActive(false);
        
        })
        our_socket.on('invitationInit', (UserIndex_: number) => {
            
            setGameInvited(true);
            setGameActive(true);
            setGameStarted(false);
            // console.log("Id of the user ", UserIndex_);
            let num: number = UserIndex_;
            setPlayerNumber(num);
            // our_socket.off("invitationInit");
            // console.log("Invitation init");
        });
        
        our_socket.on('gameOver', (data: number) => {
            if (!gameActive) {
                return;
            }
            let num: number = data;
            if (num == Number.parseInt(userId)) {
                reset();
                // console.log("Winner");
                cancelAnimationFrame(animationFrameNum);
                // console.log("You win executed " + userId);
                alert("You won 15 mmr! Congratulations!")
            } else {
                // console.log("You lose executed\n" + userId);
                alert("You lost 15 mmr! NOOB! How can you lose in Pong?!?!?!")
                reset();
                cancelAnimationFrame(animationFrameNum);
            }
            setGameActive(false);
        })

        our_socket.on('sameUser', () => {
            reset();
            setGameActive(false);
            alert("Same user wanted to connect to one game");
        })     

        our_socket.on('init', (UserIndex_: number) => {
            // if(!gameActive)
            // {
            //     our_socket.off("init");
            //     return ;
            // }
            setGameStarted(false);
            // console.log("Id of the user ", UserIndex_);
            let num: number = UserIndex_;
            setPlayerNumber(num);

        });

        our_socket.on('gameState', (gameState: string) => {
            if (!gameActive) {
                return;
            }
            let animFrame: number;
            if(!gameStarted)
            {
                setGameId(JSON.parse(gameState).id);
                setGameStarted(true);
            }
            setGameInfo(JSON.parse(gameState));
            // console.log("Game state id " , gameInfo.id);
            setGameInvited(false);
            if (canvasRef.current) {
                // // console.log("rendering");
                ctx = canvasRef.current.getContext('2d');

                
                setAnimationFrameNum(requestAnimationFrame(() => drawPong(our_socket, ctx, gameInfo, images[mapNumber])));
            }
            
        })

        our_socket.on('gameCode', handleGameCode);
        return () => {
            // before the component is destroyed
            // unbind all event handlers used in this component
            our_socket.off("gameCancelled");
            our_socket.off("invitationInit");
            our_socket.off("gameOver");
            our_socket.off("sameUser");
            our_socket.off("handleTooManyPlayers");
            our_socket.off("init");
            our_socket.off("gameCode");
            our_socket.off('gameState');
        };


        
    }, [gameInfo, gameStarted,gameActive])

    useEffect(() => {
        if (canvasRef.current) {
            ctx = canvasRef.current.getContext('2d');
            ctx.canvas.hidden = true;
        }
        
        // our_socket.on('unknownGame', () => 
        // {
        //     alert("client socket id not known refresh the page");
        // })
    }, [])


    useEffect(() => 
    {
        document.addEventListener('keydown', (e) => {
            // e.preventDefault();
            // console.log("Emmititng stuff");
            // if (!gameActive)
            //     return;
            let obj: KeyInfo =
            {
                key: e.keyCode,
                player_number: playerNumber,
                socket_id: our_socket.id,
                gameActive: gameActive,
                game_id: gameId,
            };
            
            our_socket.emit('keydown', JSON.stringify(obj));
        })
        document.addEventListener('keyup', (e) => {
            // e.preventDefault();
            // if (!gameActive)
            //     return;
            let obj: KeyInfo =
            {
                key: e.keyCode,
                player_number: playerNumber,
                socket_id: our_socket.id,
                gameActive: gameActive,
                game_id: gameId,
            };
            // console.log("What the fuck ", obj.game_id);
            our_socket.emit('keyup', JSON.stringify(obj));
        })
    }, [playerNumber, gameId])


    return (
        <>
            <div className="gameStuff">
                <center>
                    <h1> Welcome to Pong </h1>
                    <br />
                    <br />


                    <WaitingScreenCatto gameInvited={gameInvited} gameActive={gameActive} gameStarted={gameStarted}/>
                    
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