import { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";
import DOMPurify from 'isomorphic-dompurify'
import {getToken, JWT} from "next-auth/jwt"
import { connectToDatabase } from "../../../util/mongodb";
import {ObjectId} from "mongodb"
import {v4 as uuidv4} from "uuid"
import clientPromise from "../../../lib/mongodb";


export default async function handler(req: NextApiRequest, res: NextApiResponse){
    console.log()
    const session: JWT = await getToken({req})
    const referrer = req.query['referrer']
    console.log(session.id)
//POST ONLY
    if(session){
        let {amount, listingId} = req.body
        amount = DOMPurify.sanitize(amount)
        listingId = DOMPurify.sanitize(listingId)
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB)


        //I feel like a sinner
        const user = await db.collection("users").findOne({ _id: ObjectId(session.id)})
        const listing = await db.collection("listings").findOne({_id: ObjectId(listingId)})
        console.log(user);
        if(!listing){
            return res.status(404).json({error: "Listing does not exist"})
        }
        const seller = await db.collection("users").findOne({_id: ObjectId(listing.seller)})
        console.log(seller);
        console.log(listing);
        
        //console.log(JSON.stringify(seller))
        if(user && listing && seller){
            const amountFloat = parseFloat(amount)
            console.log(amountFloat)
            const extraFee = amountFloat >= 10000 ? 50 :0
            const percentage = (0.97* amountFloat)/(amountFloat - extraFee)
            console.log(percentage)
            try{
                const response = await fetch("https://api.flutterwave.com/v3/payments", {
                    method: "POST",
                    headers: {
                        'Authorization': `Bearer ${process.env.PAYMENT_TOKEN}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        tx_ref: `laslas-tx-${uuidv4()}`,
                        amount: amount,
                        currency: "NGN",
                        redirect_url: referrer ?? "http://localhost:3000/home",
                        meta: {
                            consumer_id: session.id
                        },
                        customer: {
                            email: user.email,
                            phonenumber: user.phoneNumber,
                            name: user.name
                        },
                        subaccounts:[
                            {
                                id: seller.subaccount_id,
                                transaction_charge: percentage
                            }
                        ],
                        customizations: {
                            title: "Las-Las",
                            logo: "https://ucarecdn.com/8f2cf812-203e-48af-8c69-b10f3595974b/download.jpg"
                        }
                        
                    })
                })
                const data:any = await response.json()
                res.status(200).json(data)
            }catch(err){
                res.status(500).json(err.message)
            }
            
        
    }
}
    
    else{
        res.status(403).json({error: "Forbidden"})
    }
}