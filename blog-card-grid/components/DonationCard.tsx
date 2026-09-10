//donation page using nodejs and razoropay integration

'use client'

import {useState} from 'react';
import Script from 'next/script';

//need express to set up the connection with the order creation of razorpay...

export default function DonationCard({id}: {id?:string}) {
    //useState for changing the state of the card
    const [donation, setDonation] = useState<"idle" | "success" | "failed">("idle");
    //fetches the express node port, hence connecting them and then actioning to the payment integration
const handleDonate = async() => {
    const res = await fetch("http://localhost:4000/create_order", {method: 'POST'});//method post to create the order 
    const order = await res.json();//responds through the json to the browser
    console.log("Order object:", order);
    
    //instance of the 
    const rzpWindow = new window.Razorpay({
        key : process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,//key id in the .env.local file making it as a public file 
        amount: order.amount,
        currency: order.currency,
        order_id : order.id,//order id of the particular order that is being created 
        //this handles the response after the 1st event has completed and then responds accordingly (next actions)
        //handler itself can manage the async function
        handler: async (response) => {
            console.log("Full response object:", response);//displays the full response object in the console
            const res = await fetch("http://localhost:4000/verify_payment", {//fetches the action of the payment verification from the server
                method: 'POST', 
                headers: {'Content-Type':'application/json'},  
                body:JSON.stringify({
                    razorpay_signature: response.razorpay_signature, //responds with its signature
                    razorpay_payment_id: response.razorpay_payment_id, //responds with the payment id
                    razorpay_order_id: response.razorpay_order_id //responds with the order id
            }),
        });
        //awaits on the response of the payment
        const payment = await res.json();
        
        //if payment verified state will set to success
        if(payment.verified) {
            setDonation("success");
        } else {//else the state will set to failed
            setDonation("failed");
        }
        }
    });

    rzpWindow.open();//it opens the razorpay window that has been fetched
    };

    //forntend if donation success
    if (donation === "success"){
        return (
            <>
            <div className="bg-amber-50 rounded-xl border border-black p-5 shadow-[9px_9px_0px_0px_rgba(0,0,0,1)] flex my-15 transition-transform duration-200 hover:scale-[1.04]" title="Thank you for Donating">
                <div className="flex flex-col mx-auto">
                    <h2 className="text-3xl self-center text-green-900 flex-1 font-bold" title="Donation Recived">Donation Recived!!</h2>    
                    <p className="text-black w-100 mt-4  self-center">"Consider our day made. Thank you for your amazing support!!"</p> 
                </div>     
            </div>
            </>
        );
    } 

     //forntend if donation failed
    if (donation === "failed") {
        return (
            <>
            <div className="rounded-xl border border-black bg-amber-50 p-5 shadow-[9px_9px_0px_0px_rgba(0,0,0,1)] flex my-15 transition-transform duration-200 hover:scale-[1.04]" title="Donation Failed">
                <div className="flex flex-col mx-auto">
                    <h2 className=" text-3xl self-center font-bold text-red-900 flex-1 font-bold" title="Donation Failed">Donation Failed!!</h2>    
                    <p className="text-black w-100 mt-4 self-center">"Thank you so much for attempting to support our mission! We noticed that your recent donation attempt on our website wasn't able to go through due to a processing error."</p>    
                    {/*on click the handleDonate function takes place */}   
                    <button className="shimmer shimmer-bg-spread-50 shimmer-duration-2000 shimmer-repeat-delay-0 shimmer-color-yellow-300 shimmer-bg shimmer-speed-500/10 self-end my-auto text-black bg-yellow-400 rounded-lg py-2 px-6 self-center font-bold hover:bg-yellow-500 mt-4" onClick={handleDonate}>Donate again!!</button>   
                </div>
            </div>
            </>
        );
    } 
    
    

        return (
            <>
            {/*the script is a predefined line by the razorpay calling the checkout page */}
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />
            <div id={id} className="shimmer-bg shimmer-speed-120 bg-amber-50 shimmer-color-indigo-200 shimmer rounded-xl border border-black  p-5 shadow-[9px_9px_0px_0px_rgba(0,0,0,1)] flex w-full my-15 transition-transform duration-200 hover:scale-[1.04]" title="In development">
                <div className="flex flex-col mr-99">
                <h2 className="shimmer shimmer-bg shimmer-speed-120 shimmer-color-yellow-300 text-3xl self-start font-bold text-black flex-1/60 font-bold" title="Donate">Help us develop</h2>    
                <p className="text-black w-100 mt-4 shimmer-bg shimmer shimmer-speed-120 shimmer-color-yellow-300">This is free application, help us build better applications. Your donation matters!! </p> 
                </div>     
                {/*on click the handleDonate function takes place */}   
                <button className="shimmer shimmer-bg-spread-50 shimmer-duration-2000 shimmer-repeat-delay-0 shimmer-color-yellow-300 shimmer-bg shimmer-speed-500/10 self-end my-auto text-black bg-yellow-400 rounded-lg py-2 px-6 self-center font-bold hover:bg-yellow-500" onClick={handleDonate}>Donate! 1₹</button>   
            </div>
            </>
    );
} 