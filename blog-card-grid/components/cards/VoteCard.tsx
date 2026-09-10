"use client"

import { useState } from "react";

//need to useState because the state changes according to the users actions
export default function VoteCard() {
    const [likes, setLikes] = useState(0);
    const [dislikes, setDislikes] = useState(0);
    const [userVote, setUserVote] = useState <"like" | "dislike" | null>(null);//type validataion 

    function handleVote(vote: "like" | "dislike") {

        //clicking on the same vote removes the vote
        if(userVote === vote) {
            if (vote === "like") {
                setLikes(l => l -1);//like - 1
            } else {
                setDislikes(d => d - 1);//dislike - 1
            }
            setUserVote(null);//null if user left empty

            //if there are no previous votes
        } else if(userVote === null){
            if(vote === "like") {
                setLikes(l => l + 1);                
            } else {
                setDislikes(d => d + 1);//dislike + 1
            }
            setUserVote(vote);

            //changing one vote to another vote
        } else {
            if (vote === "like") {
                setLikes(l => l + 1);//like + 1
                setDislikes(d => d - 1); //dislike - 1
            } else {
                setDislikes(d => d + 1);//dislike + 1
                setLikes(l => l - 1);//like - 1
            }
            setUserVote(vote);
        }
    }

    //content for the card and the functioning buttons
    return (
        <>
        <div>
            <img src="/blog-preview-card-main/assets/images/Vote.png" className = "rounded-lg w-full object-cover h-60" />
            <p className="font-bold mt-2 mb-2 text-black ">Do you like the Cat picture?</p>
            <button className="bg-gray-950 hover:bg-gray-800 text-white mr-4 rounded-lg py-1 px-2"  onClick={() => handleVote("like")}>
               💛 Like <span className="text-yellow-400">{likes}</span>
            </button>
            <button className="bg-gray-950 hover:bg-gray-800 text-white rounded-lg py-1 px-2"  onClick={() => handleVote("dislike")}>
               👎 Dislike <span className="text-yellow-400">{dislikes}</span>
            </button>
        </div>
        </>
    )

}