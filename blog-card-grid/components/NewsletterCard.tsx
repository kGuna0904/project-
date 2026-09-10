//use client for re-rendering on the clien side
'use client';

//states for the changes in the input fields
import {useState} from 'react';

export default function NewsletterCard({id}:{id?:string}) {//destructuring the id explicitly 
    const [name, setName] = useState('');//for name
    const [email, setEmail] = useState('');//for email
    const [status, setStatus]  = useState<"idle" | "success" | "failed">("idle");//status of the input
    const [message, setMessage] = useState('');//message that stores from server

    //handling the submit button and using async function and fetching the subscriber action with its body 
    const handleSubmit = async () => {
        const res = await fetch('http://localhost:4000/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({name, email})//stringifies the json from the server
        });
        const data = await res.json();//awaits on the message from the server
        setMessage(data.message);//stores the message from server, later can be used to call on the frontend
        console.log("server response:", data);//loggs the server response/message to the console for debugging process later

        //setting the server status accorgin to the message from the server
        if(data.message === "Subscription successful!") {
            setStatus("success");
        } else {
            setStatus("failed");
        }
    }

    //setting the status of the card on the frontend
    //if the status is success from the server side then state changes to success
    if (status === "success"){
        return (
            <>
            <div className="bg-amber-50 rounded-xl border border-black p-15 shadow-[9px_9px_0px_0px_rgba(0,0,0,1)] flex my-15 transition-transform duration-200 hover:scale-[1.04]" title="Newsletter Subscription">
                <div className="flex flex-col mx-auto">
                    <h2 className="text-4xl self-center text-green-900 flex-1 font-bold mb-4" title="Newsletter Subscription">Subscribed!!</h2>    
                    <p className="text-black w-full mt-5 text-xl self-center">{message}. Thank you for your amazing support :)</p> 
                </div>     
            </div>
            </>
        );
    }

    //if the status is failed from the server side then state changes to failed
    if (status === "failed"){
    return (
            <>
            <div className="bg-amber-50 rounded-xl border border-black p-15 shadow-[9px_9px_0px_0px_rgba(0,0,0,1)] flex my-15 transition-transform duration-200 hover:scale-[1.04]" title="Newsletter Subscription">
                <div className="flex flex-col mx-auto">
                    <h2 className="text-4xl self-center text-red-900 flex-1 font-bold mb-4" title="Newsletter Subscription">Subscription Failed!!</h2>    
                    <p className="text-black w-full mt-5 text-xl self-center">{message}</p> 
                </div>     
            </div>
            </>
        );
    }
    
    //returns the initial state before the other states 
    return (
        <>
        <div id={id} className="rounded-xl border border-black bg-white p-6 shadow-[9px_9px_0px_0px_rgba(0,0,0,1)] flex w-full my-15 transition-transform duration-200 hover:scale-[1.04]" title="Newsletter Subscription">
            <div className="flex flex-col ml-[2rem] mr-[3rem] text-center">
            <h2 className=" text-4xl font-bold text-black flex-1 font-bold">Subscribe to <span className = "text-yellow-400"> Newsletter </span></h2>    
            <p className="text-gray-500 w-100 mt-4">Recive updates and news directly in your inbox!</p> 
            
            <div className="text-black my-4  ">
                <form className="flex flex-col gap-4 mt-4 ">

                        <input type="name" value= {name} placeholder = "Full name" className="ml-2 text-xl bg-amber-100 text-center rounded-lg py-2" onChange= {(e) => setName(e.target.value)} />                  
                        <input type="email" value= {email} placeholder = "example@gmail.com" className="ml-2 text-xl bg-amber-100 text-center rounded-lg py-2 mb-3" onChange= {(e) => setEmail(e.target.value)} />
                
                    {/*on click the handleSubmit function takes place */} 
                    <button type="button" className="shimmer shimmer-bg-spread-50 shimmer-duration-2000 shimmer-repeat-delay-0 shimmer-color-yellow-300 shimmer-bg shimmer-speed-500/10 self-center my-auto text-black bg-yellow-400 rounded-lg py-2 px-6 self-center font-bold hover:bg-yellow-500" onClick={handleSubmit}>Subscribe</button>
                </form>
            </div>  
            </div>
            <img src="/blog-preview-card-main/assets/images/NewsletterCard.png" alt="Newsletter Subscription" className="rounded-lg my-auto mx-auto h-60 object-cover" />          
        </div>
        </>
    )
}