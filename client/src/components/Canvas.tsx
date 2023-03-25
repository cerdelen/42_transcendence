import React, { useRef, useEffect, useState, useId } from "react";
import drawPong from './Pong'
import { pong_properties, KeyInfo, Player } from './Pong_types'
import { SocketContext, our_socket } from '../utils/context/SocketContext';
import Bulgaria from "../images/tochka.jpg"



const Canvas = ({ userId }: { userId: string }) => {
    let initial_state: pong_properties = {
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
            y: 400 / 2 - 60 / 2,
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
    function Custmization_fields({ setMapNumber }: { setMapNumber: any }) {

        return (
            <>
                <br />
                <br />
                <button className="game_buttons" onClick={() => {
                    setMapNumber(0);
                }}> Cat Valley </button>
                <button className="game_buttons" onClick={() => {
                    setMapNumber(1);
                }}> Paris </button>
                <button className="game_buttons" onClick={() => {
                    setMapNumber(2);
                }}> Bulgaria </button>
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
    const [gameActive, setGameActive] = useState(false);
    const [gameCode, setGameCode] = useState("");
    const [codeInput, setCodeInput] = useState("");
    const [playerNumber, setPlayerNumber] = useState(0);
    const [mapNumber, setMapNumber] = useState(0);
    const [images, setImages] = useState<any[]>([]);
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
    }, [gameActive])
    function handleGameCode(data: string) {
        setGameCode(data);
    }

    function reset() {
        setPlayerNumber(0);
        setCodeInput("");
        setGameCode("");
    }

    useEffect(() => {

        our_socket.on('sameUser', () => {
            reset();
            setGameActive(false);
            alert("Same user wanted to connect to one game");
        })

        our_socket.on("handleTooManyPlayers", () => {
            reset();
            setGameActive(false);
            alert("This game has too many players");
        })

        our_socket.on('gameCode', handleGameCode);
    }, [gameActive])

    useEffect(() => {
        our_socket.on('init', (UserIndex_: number) => {
            let num: number = UserIndex_;
            setPlayerNumber(num);
        });

    }, [playerNumber])
    useEffect(() => {
        our_socket.on('gameOver', (data: number) => {
            if (!gameActive) {
                return;
            }
            let num: number = data;
            if (num == Number.parseInt(userId)) {
                reset();
                alert("You win!");
            } else {
                reset();
                alert("You lose :( ");
            }
            setGameActive(false);
        })
    }, [gameActive])
    useEffect(() => {
        if (canvasRef.current) {
            ctx = canvasRef.current.getContext('2d');
            ctx.canvas.hidden = true;
        }
        
        let pic = new Image();
        pic.src = Bulgaria
        let pic_ : any[] = [...images];
        pic_.push(pic);
        setImages(pic_)
    }, [])
    useEffect(() => {
        our_socket.on('gameState', (gameState: string) => {
            if (!gameActive) {
                return;
            }
            setGameInfo(JSON.parse(gameState));
            if (canvasRef.current) {
                ctx = canvasRef.current.getContext('2d');

                requestAnimationFrame(() => drawPong(our_socket, ctx, gameInfo, images));
            }
        })
    }, [gameInfo, gameActive])

    document.addEventListener('keydown', (e) => {
        if (!gameActive) {
            return;
        }
        let obj: KeyInfo =
        {
            key: e.keyCode,
            player_number: playerNumber
        };
        our_socket.emit('keydown', JSON.stringify(obj));
    })
    document.addEventListener('keyup', (e) => {
        if (!gameActive) {
            return;
        }
        let obj: KeyInfo =
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