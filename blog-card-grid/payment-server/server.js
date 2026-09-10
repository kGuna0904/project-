//using express framework
'use server'

import express from 'express';
import cors from 'cors';//to set rules to the browser and to avoid the cross origin error
import dotenv from 'dotenv';
import Razorpay from 'razorpay';//razorpay package for integration, contains in-built SDK
import crypto from 'crypto';//crypto is a built-in module in node js, used to generate the signature for the payment verification
import mongoose from 'mongoose';//to connect to the mongodb database

dotenv.config();//to read the keys in the .env file 

//connecting mongoDB to the server/project
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))//if connected to the DB the it logs the Connection message
    .catch((err) => console.error("MongoDb connection error:", err));//else it logs the error message if error in connection
//mongoose schema for the inputs of the subcribers, defines the structure and the data ype of the data that is being stored in the DB
const subscriberSchema = new mongoose.Schema({
    name: {type: String, required: true},//for name
    email: {type: String, required: true, unique: true},//for email, and is unique(indexed)
    subscribedAt: {type: Date, default: Date.now}//date/time of the subscription. (built-in for mongoDB)
});

//data modelling the schema
const Subscriber = mongoose.model('Subscriber', subscriberSchema);

//instancing to the .env file, and from the razorpay import
//goes as key: value
//instances of the class
const razorpayClient = new Razorpay ({key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET});

const app = express();

app.use(cors());//application using cors

app.use(express.json());//using express.json to respond and request, and is a middleware listening to the ports 


//[---1---] payment server
//creation of the order
app.post('/create_order', async (req, res) =>  {   
    const order = await razorpayClient.orders.create({amount: 100, currency: 'INR'});//razorpay sdk need defining amt and currency
    res.status(201).json(order);//status saying that the order state is created  
});

//runs after the payment capture and then verifies the payment as required 
app.post("/verify_payment", (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature} = req.body ;//destructuring the request body to get the order id, payment id and signature from the request 

    const generatedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)//creates a hash-based message authentication code (HMAC) using the SHA-256 hashing algorithm and the Razorpay key secret. This is used to verify the authenticity of the payment.
        .update(razorpay_order_id + "|" + razorpay_payment_id)//this is the data that is being hashed
        .digest('hex')

    if (generatedSignature === razorpay_signature) {
        res.status(200).json({verified: true});//if the generated signature matches the payment signature, then the status of the payment is verified
    } else {
        res.status(400).json({verified: false});//if the generated signature does not match the payment signature, then the status of the payment is not verified
    }
    
console.log("Generated:", generatedSignature);
console.log("Received:", razorpay_signature);
console.log("Order ID used:", razorpay_order_id);
console.log("Payment ID used:", razorpay_payment_id);
});


//[---2---] newsletter server
//using the subscriber schema and the model to create a new subscriber accordingly W.R.T the staus of the subscription
app.post("/subscribe", async (req, res) => {//post as we are sending, which creates the data in the DB
    const {name, email} = req.body;
    try {
        const newSubscriber = new Subscriber({name, email});//defining the subscriber with the name and email fields
        await newSubscriber.save();//built in .save() method to save in the DB just like a submit button but stores in the DB
        res.status(201).json({message: "Subscription successful!"});//201-created 
    }
    catch (error){
        if (error.code === 11000) {//error code for duplicate key in mongoDB
            res.status(400).json({message: "You've already subscribed to our newsletter!"});//responds if the user already exists
            console.log(error);//logs the error in the console
        } else {
            res.status(500).json({message: "Something went wrong with the subscription. please try again later."});//responds an internal server error if the subscription rfails
            console.log(error);//logs the error in the console
        }
        
    }
        
});


app.listen(4000, () => console.log("Express running on port 4000"));//express listen on a new port:4000, as 3000 is being using by next js already

