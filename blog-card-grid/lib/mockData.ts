import { CardState } from "@/types/cards";

//a typescript annotation that indicates that it is an array 
export const initialCards: CardState[] = [
    //timerCard
    //images are generated using ai
    {
        id: "Timer_Card",
        title: "Preset Timers",
        excerpt: "Counts down from an existing duration, click on any preset timer",
        image: "/blog-preview-card-main/assets/images/Timer.png", //need to verify if path is right
        kind: "timer",
        presets: [
            //10 min timer
            {
                id: "10_min",
                label: "10 Min",
                durationSeconds: 600,
            },

            //1 min timer
            {
                id: "1_min",
                label: "1 Min",
                durationSeconds: 60
            },

            //1 hour timer
            {
                id: "1_hr",
                label: "1 Hr",
                durationSeconds: 3600,
            },
        ]
    },

    //StopwatchCard
    {
        id: "Stopwatch_card",
        title: "StopWatch",
        excerpt: "It is a tool that can start and stop to measure the exact amount of time that passes during an event.",
        image: "/blog-preview-card-main/assets/images/Stopwatch.png", //need to verify if path is right
        kind: "stopwatch",
    },

    //VoteCard
    {
        id: "Vote_card",
        title: "Voting",
        excerpt: "It is a card that allows you to like or dislike a post/blog",
        image: "/blog-preview-card-main/assets/images/Vote.png", //need to verify if path is right""
        kind: "vote",
    }
]