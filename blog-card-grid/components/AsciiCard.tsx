"use client"

import Image from "next/image";
import {useState, useRef, useEffect} from "react";

//defining the ascii characters
const RAMP = " .:-=+*#%$@";

export default function AsciiCard({id}: {id?: string}) {
    //stating that it only has two states, and using type validator
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [active, setActive] = useState(false);
    
    //to access the external dom elements
    const videoRef = useRef<HTMLVideoElement>(null);
    const sampleRef = useRef<HTMLCanvasElement>(null);
    const outputRef = useRef<HTMLCanvasElement>(null);


        //stream can carry multiple tracks such as video, audio
    useEffect(() => {
        //videoRef.current creates the <video> dom node
        //stream could be null or undefined if permissions not resolved
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;//video elements have a seperate property, srcObject specifically for the live streaming objects and destructuring the props to the stream
        }
    }, [stream]);//re runs whenever the stram changes

    //
    useEffect(() => {
    return () => { stream?.getTracks().forEach(t => t.stop()); };//using optional chaining, works as a clearInterval
    }, [stream]);

    //useEffect for the ascii frame, ascii conversion happens, from video pixels to ascii
    useEffect(() => {
        if (!stream) return;
        let frameId: number;//type notation, holds id for the request animation
        
        //function that is responsible for drawing the ascii
        function draw () {
            const video = videoRef.current;//current video of the client
            const sample = sampleRef.current;//reads the canvas element, basically the input
            const output = outputRef.current;//reads the canvas element
            if(!video || !sample || !output) return;// if none of the conditions exists then exit

            const sampleCtx = sample.getContext("2d");//contains the actual drawing
            if(!sampleCtx) return;

            //canvas is in the grid 
            sampleCtx.drawImage(video, 0, 0, 100, 75);//draws current live frame from video to the sample canvas, 100 x 75 dimensions at position 0,0
            const data = sampleCtx.getImageData(0, 0, 100, 75).data;//reads the pixel data from the video element and stored in data


            const outputCtx = output.getContext("2d");//it gets the 2d drawing context, and displays the o/p
            if(!outputCtx) return;//if not output at current then return

            //computes how many pixels wide/tall each character has to be in the canvas
            const cellW = output.width / 100;
            const cellH = output.height / 75;
            
            //fills color and the style to black
            outputCtx.fillStyle = "black";
            outputCtx.fillRect(0, 0, output.width, output.height);//draws the filled black rectangle back to the canvas
            
            //font is monospace and size equals to the cell height pixels
            outputCtx.font = `${cellH}px monospace`;
            outputCtx.textBaseline = "top";//fills text at the y value incicating vertically
            outputCtx.fillStyle = "white";//the text style being white, uses this color to draw on the canvas
            
            //y is the row top to bottom and x is the columns from left to right
            for(let y=0;y<75;y++){ //starts a loop over every row of the 75 row grid y going from 0 to 74
                for(let x=0;x<100;x++){ //loops over every column x going from 0 to 99, together contains 7,500 cells/pixels and visits each cell
                    const i = (y*100 +x) * 4;//pixel number * the RGBA

                    const r = data[i];//for red
                    const g = data[i+1];//for green
                    const b = data[i+2];//for blue 
                    //i+3 is alpha and is ignored as it is 255 always (black)


                    //according to the color theory we use this as the perceptual brightness 
                    const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
                    const index = Math.floor((brightness / 256) * RAMP.length);//according to the brightness this assings the character to that particular pixel
                    const char = RAMP[index];//maps the characters according to the brightness

                    //output on the canvas--> characters, grid colomun, grid row 
                    outputCtx.fillText(char, x * cellW, y * cellH);
                }
            }

            frameId = requestAnimationFrame(draw);//runs the function draw when requested and makes the loop continous
        }

        frameId = requestAnimationFrame(draw);//starts the animation at first when accessed the useEffect, the dom node...
        return () => cancelAnimationFrame(frameId);//depending on the live stream the animation cancles
    }, [stream]);

    //asynchronus function that helps to start the camera, where we navigate to the users camera(media) 
    async function startCamera() {
    try{
        const s = await navigator.mediaDevices.getUserMedia({ video: true });
        setStream(s);
        setError(null);//if stream null then error state would run
    } catch (err) { //catches an error if permissions arent resolved
        setError("Couldn't access the camera. Check your browser permissions and try again");
    }}

    function stopCamera() {
        stream?.getTracks().forEach(t => t.stop());//using optional chaining, works as a clearInterval
        setStream(null);        
    }


    if (active) {
            //used tailwind CSS entirely below
            return (
                <div className = "rounded-xl border border-black bg-white flex flex-col p-5 shadow-[9px_9px_0px_0px_rgba(0,0,0,1)] transition-transform duration-200 hover:scale-[1.04] my-15" >
                    <button className = "self-end px-2 py-1 text-gray-400 hover:text-black text-xl hover:bg-gray-100 hover:rounded-md hover:px-2 hover:py-1" title = "Close" onClick={() => {stopCamera(); setActive(false); }}> 
                        X  
                    </button>
                    <p className = "text-black font-bold mt-7 mb-7 text-3xl self-center" >Card <span className="text-yellow-400">ASCII Frame</span>camera</p>
                    <button className="mt-4 mb-4 text-black bg-yellow-400 rounded-lg py-2 mx-102 font-bold hover:bg-yellow-500" onClick={startCamera}>{stream ? "Camera on" : "Start Camera"}</button>
                    <button className="mt-4 mb-4  text-black bg-yellow-400 rounded-lg py-2 px-6 mx-102 font-bold hover:bg-yellow-500" onClick={() => {stopCamera(); }}>Stop Camera</button>
                        {error && <p className="text-red-600">{error}</p>}
                    <video ref={videoRef} autoPlay playsInline muted className="rounded-lg hidden" />    
                    <canvas ref={sampleRef} width={100} height={75} className="hidden" />
                    <canvas ref={outputRef} width={800} height={600} className="rounded-lg bg-black" />                   
                </div>
            );
        }


    return (
            <div id={id} className="rounded-xl border border-black bg-white p-5 shadow-[9px_9px_0px_0px_rgba(0,0,0,1)] flex flex-col w-full my-15 transition-transform duration-200 hover:scale-[1.04]" onClick={() => setActive(true)} title="ASCII Camera">
                <Image src="/blog-preview-card-main/assets/images/AsciiCard.png" alt="" className="rounded-lg w-full object-cover h-60" width={800} height={600} />
                <p className="mt-4 text-gray-500 text-sm">Last updated: 29 Aug 2026</p>
                <h2 className="mt-4 text-xl font-bold text-yellow-400">ASCII Camera</h2>
                <p className="mt-2 text-sm text-gray-600 flex-1">See yourself rendered as live ASCII art.</p>
                <button className="shimmer shimmer-bg-spread-50 shimmer-duration-2000 shimmer-repeat-delay-0 shimmer-color-yellow-300 shimmer-bg shimmer-speed-500/10 mt-4 text-black bg-yellow-400 rounded-lg py-2 px-6 self-center font-bold hover:bg-yellow-500">Try me!</button>
            </div>
    );

}

/*

i +1 +2        i +1 +2        i +1 +2
0  1  2  3     0  1  2  3     0  1  2  3
R  G  B  A  |  R  G  B  A  |  R  G  B  A
----------     ----------     ----------
  pixel 0        pixel1         pixel2

*/