"use client"

//mapping the card grid layout
//getting the cards data from the mocked data
import BlogCard from "./BlogCard";
import {useState, useEffect} from "react";
import { CardState } from "@/types/cards";

//mapping out the grids for displaying the cards on the page
export default function CardGrids({id}: {id?:string}) {
    const [cards, setCards] = useState<CardState[]>([]);

    useEffect (() => {
        fetch("/api/cards")
            .then((res) => res.json())
            .then((data) => setCards(data))
            .catch((err) => console.error("Failed to fetch data", err))
    }, [])
    return (
        <div id={id} className = "grid grid-cols-2 md:grid-cols-3 gap-15 ">
            {/*mapping the cards one at a time */}
            {/*passing the props to the component and each card having an unique id */}
            {/* this can only return one item, so writing a comment inside the map breaks the function*/}
            {cards.map(card => ( 
                <BlogCard key={card.id} card= {card} /> 
            ))}
        </div>
    );
}