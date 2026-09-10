"use client"//for redering on the client side

//importing each of the cards one by one
import type { CardState } from "@/types/cards";
import { useState } from "react";//state for the buttons
import StopWatchCard from "@/components/cards/StopWatchCard";
import TimerCard from "@/components/cards/TimerCard";
import VoteCard from "@/components/cards/VoteCard";


//the elements that defines the card component
export default function BlogCard({card}: { card: CardState}) { //destructuring the props
    const [active, setActive] = useState(false);
    //
    if (active) {
        //used tailwind CSS entirely below
        return (
            <div className = "rounded-xl border border-black bg-white flex flex-col p-5 shadow-[9px_9px_0px_0px_rgba(0,0,0,1)] transition-transform duration-200 hover:scale-[1.04]" title = {card.title}  >
                <button className = "self-end px-2 py-1 text-gray-400 hover:text-black text-xl hover:bg-gray-100 hover:rounded-md hover:px-2 hover:py-1" title = "Close" onClick={() => setActive(false) }> 
                    X  
                </button>
                <p className = "text-black font-bold mt-7 mb-7 text-3xl self-center" >Card <span className="text-yellow-400">{card.title}</span></p>
                {card.kind === "timer" && <TimerCard card={card}/>}{/*passing props to the timer card*/}
                {card.kind === "stopwatch" && <StopWatchCard />}
                {card.kind === "vote" && <VoteCard />}
                
            </div>
        );
    }
    //ui/ux for the cards
    return (
        <div className = "rounded-xl border border-black bg-white shadow-2xl p-5 shadow-[9px_9px_0px_0px_rgba(0,0,0,1)] flex flex-col transition-transform duration-200 hover:scale-[1.04]" title = {card.title} onClick={() => setActive(true)}>
            <img src={card.image} alt={card.title} className = "rounded-lg w-full object-cover h-60" />
            <p className = "mt-4 text-gray-500 text-sm">Last updated: 29 Aug 2026</p>
            <h2 className = "mt-4 text-xl font-bold text-yellow-400">{card.title}</h2>
            <p className = "mt-2 text-sm text-gray-600 flex-1" >{card.excerpt}</p>
            <button className = "shimmer shimmer-bg-spread-50 shimmer-duration-2000 shimmer-repeat-delay-0 shimmer-color-yellow-300 shimmer-bg shimmer-speed-500/10 mt-4 text-black bg-yellow-400 rounded-lg py-2 px-6 self-center font-bold hover:bg-yellow-500" >Try me!</button>
        </div>
    );
}
