
//format for the timer/stopwatch calculation
export function format(total: number) {
    const hours = Math.floor(total / 3600); //will obtain the full amount of the hour
    const min = Math.floor((total % 3600)/60); //rounded down the sec to obtain the minutes (rem of hrs/60sec)
    const sec = Math.floor(total % 60);// whatever is left after the minutes (rem of mins)
    //padStart(2, "0") mans that to make this atleast 2 characters, and it is a string method so goes with "String"
    //need to revise//
    return `${String(hours).padStart(2, "0")}:${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;     
}
