//its the base analogy for the blog cards, that contains, unique id,title,image, and a small description(excerpt)
export type CardBase = {
    id: string;
    title: string;
    excerpt: string;
    image: string;
}

//for timer inside the timercard
export type TimerPreset = {
    id: string;
    label: string;
    durationSeconds: number;
}

//card1 for the timer and the presets load in an array letting us know that this contains more further items
export type TimerCard = CardBase & {
    kind: "timer";
    presets : TimerPreset[];
}

//card2 --Stopwatch and its elapsed time
type StopwatchCard = CardBase & {
    kind: "stopwatch";
}

//card3 --VoteCard likes and dislikes acts as a count 
type VoteCard = CardBase &{
    kind: "vote";
}

//not actually existing in the card display, but saved for later
type ExpandCard = CardBase & {
    kind: "expand";
    expanded: boolean;
    fullContent: string | null;
    status: "idle" | "loading" | "loaded" | "error";
}

//exports as an union and as an array
export type CardState = TimerCard | StopwatchCard | VoteCard | ExpandCard;

