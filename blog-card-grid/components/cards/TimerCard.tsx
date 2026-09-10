"use client" //because the sate would be re-render each timer so the jsx would be shipped to the client and from there the render occurs


import {useState, useEffect} from "react";
import { format } from "@/lib/format"


import type { TimerPreset, TimerCard as TimerCardType } from "@/types/cards";

//3 presets of timers
function PresetRow({ preset }: {preset: TimerPreset}) {
    const [remaining, setRemaining] = useState(preset.durationSeconds);
    const [running, setRunning] = useState(false);
    //countdown logic
    //useEffect will function after the render, so re runs everytime the running state changes from true to false and vice versa
    useEffect(() => {
        if(!running) return;//if running is false and not active, returns and does nothing much
        const id = setInterval(() => setRemaining(r => r-1), 1000); //repeating timer and sets an interval of 1000ms, r -running but the current state
        return () => clearInterval(id);//stops and clears that particular interval function of the stopwatch
    }, [running]);//technically this unmounts the stopwatch 
    
    //if timer ends then the timer stops when set to false
    useEffect(() => {
        if (remaining <= 0) {
            return setRunning(false);//if timer == 00:00:00, then timer stops
        }
    }, [remaining]);

    return (
        <div className="flex items-center text-black justify-between gap-4 my-2">
            <span className="text-sm font-bold">{preset.label}</span>
            <span className="font-bold text-xl my-6">{format(remaining)}</span>
            <button className = "bg-yellow-400 px-2 py-1 text-sm rounded-lg text-black font-bold hover:bg-yellow-500" title="Start/Pause" onClick={() => setRunning(r => !r)}>
                {running ? "Pause" : "Start"} 
            </button>
            <button className = "bg-yellow-400 px-2 py-1 text-sm rounded-lg text-black font-bold hover:bg-yellow-500" title="Reset" onClick={() => {setRemaining(preset.durationSeconds); setRunning(false);}}>
                Reset
            </button>
        </div>
    );
}

export default function TimerCard ({card}: {card: TimerCardType}) {
    //mapping oon the presets
    return (
        <div>
            {card.presets.map(preset => (
                <PresetRow key={preset.id} preset={preset} />
            ))}
        </div>
    );
}