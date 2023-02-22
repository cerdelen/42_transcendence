import React ,{ useRef, useEffect}from "react";
import PropTypes, {InferProps} from 'prop-types'

const CanvasTypes = {
    draw: PropTypes.any,
    // height: PropTypes.number,
    // width: PropTypes.number,
};

type CanvasPropTypes = InferProps<typeof CanvasTypes>;

const Canvas = ({draw} : CanvasPropTypes) =>
{
    let canvasRef = useRef<HTMLCanvasElement | null>(null);
    let canvasCtxRef = React.useRef<CanvasRenderingContext2D | null>(null);
    // console.log("Chujnia")
    useEffect( () => 
    {
        if(canvasRef.current)
        {
            
            canvasCtxRef.current = canvasRef.current.getContext('2d');
            let ctx =  canvasCtxRef.current;
            draw(canvasRef.current, ctx)    
            
        }
    }, []);

    return (
        <>
        <canvas 
        ref={canvasRef}
        width={600}
        height={400}/>
        </>
    )
}
Canvas.propTypes = CanvasTypes;
export default Canvas;