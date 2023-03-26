import React, { useRef, useEffect, useState, useId } from "react";
import drawPong from './Pong'
import { pong_properties, KeyInfo, Player } from './Pong_types'
import { SocketContext, our_socket } from '../utils/context/SocketContext';

import { useMyContext } from '../contexts/InfoCardContext'
import { Socket } from "socket.io-client";

const Canvas = ({ userId }: { userId: string }) => {
    const { images, initial_state } = useMyContext();

    function Custmization_fields({ setMapNumber }: { setMapNumber: any }) {

        return (
            <>
                <br />
                <br />
                <button className="game_buttons" onClick={(e) => {
                    e.preventDefault();
                    setMapNumber(0);
                }}> Bulgaria </button>
                <button className="game_buttons" onClick={(e) => {
                    e.preventDefault();
                    setMapNumber(1);
                }}> Paris </button>
                <button className="game_buttons" onClick={(e) => {
                    e.preventDefault();
                    setMapNumber(2);
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
    console.log("Just user id" + userId);
    const [gameInfo, setGameInfo] = useState<pong_properties>(initial_state);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [gameActive, setGameActive] = useState(false);
    const [gameCode, setGameCode] = useState("");
    const [codeInput, setCodeInput] = useState("");
    const [playerNumber, setPlayerNumber] = useState(0);
    const [mapNumber, setMapNumber] = useState(0);
    const [animationFrameNum, setAnimationFrameNum] = useState(0);

    let ctx: any;
    function WaitingScreenCatto({ gameActive }: { gameActive: boolean }) {
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

                </>
            )
        else {
            return <>
            </>;
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

        our_socket.on("handleTooManyPlayers", () => {
            our_socket.off("handleTooManyPlayers");
            reset();
            setGameActive(false);
            alert("This game has too many players");
        })

        our_socket.on('gameOver', (data: number) => {
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
            } else {
                console.log("You lose executed\n" + userId);
                reset();
                cancelAnimationFrame(animationFrameNum);
            }
            setGameActive(false);
            our_socket.off('gameOver');
        })

    }, [gameActive])
    function handleGameCode(data: string) {
        setGameCode(data);
    }

    function reset() {
        setCodeInput("");
        setGameCode("");
        if (canvasRef.current) {
            ctx = canvasRef.current.getContext('2d');
            ctx.clearRect(0, 0, 700, 400);;
        }
    }
    useEffect(() => 
    {
        our_socket.on('invitationInit', (UserIndex_: number) => {
            setGameActive(true);
            console.log("Id of the user ", UserIndex_);
            let num: number = UserIndex_;
            setPlayerNumber(num);
            our_socket.off("init");
            
        });
    }, [gameActive])
    useEffect(() => {
        our_socket.on('init', (UserIndex_: number) => {
            if(!gameActive)
            {
                our_socket.off("init");
                return ;
            }
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
    }, [])

    useEffect(() => {
        our_socket.on('gameState', (gameState: string) => {
            if (!gameActive) {
                our_socket.off('gameState');

                return;
            }
            let animFrame: number;
            setGameInfo(JSON.parse(gameState));
            if (canvasRef.current) {
                ctx = canvasRef.current.getContext('2d');
                setAnimationFrameNum(requestAnimationFrame(() => drawPong(our_socket, ctx, gameInfo, images[mapNumber])));
            }
            our_socket.off('gameState');
        })
        // cancelAnimationFrame(animationFrameNum);
    }, [gameInfo, gameActive])

    useEffect(() => 
    {
        document.addEventListener('keydown', (e) => {
            if (!gameActive)
                return;
            let obj: KeyInfo =
            {
                key: e.keyCode,
                player_number: playerNumber
            };
            our_socket.emit('keydown', JSON.stringify(obj));
        })
        document.addEventListener('keyup', (e) => {
            if (!gameActive)
                return;
            let obj: KeyInfo =
            {
                key: e.keyCode,
                player_number: playerNumber
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


                    <WaitingScreenCatto gameActive={gameActive} />
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