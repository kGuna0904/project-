"use client"

import {useState, useEffect} from "react";
import { format } from "@/lib/format";


//typescript annotation to define the total as a number 
//total = total number of seconds
export default function StopWatchCard() {
    //numbers the ellapsed seconds
    const [elapsed, setElapsed] = useState(0);
    //state that defines that if the stopwatch is running or not
    const [running, setRunning] = useState(false);
    
    //useEffect will function after the render, so re runs everytime the running state changes from true to false and vice versa
    useEffect(() => {
        if(!running) return;//if running is false and not active, returns and does nothing much
        const id = setInterval(() => setElapsed(e => e + 1), 1000); //repeating timer and sets an interval of 1000ms, e -elapsed- but the current state
        return () => clearInterval(id);//stops and clears that particular interval function of the stopwatch
    }, [running]);//technically this unmounts the stopwatch 

    //running=false(reset), need to add this later
    return (
        <div className="flex flex-col mt-8">
            <p className="text-4xl font-bold text-black self-center text-6xl mb-8">{format(elapsed)}</p>
            <div className="flex gap-6 self-center mt-4">
                <button className = "bg-yellow-400 px-4 py-2 rounded-lg text-black font-bold hover:bg-yellow-500" title="Start/Pause" onClick={() => setRunning(r => !r)}>
                    {running ? "Pause" : "Start"}
                </button>
                <button className = "bg-yellow-400 px-4 py-2 rounded-lg text-black font-bold hover:bg-yellow-500" title="Reset" onClick={() => {setElapsed(0);  setRunning(false);}}>
                    Reset
                </button>
                
            </div>
            <p className="text-lg font-bold text-black self-center mt-12">
                {running ? "StopWatch is running..." : "Start when ready!" }
            </p>
        </div>
    );
}    