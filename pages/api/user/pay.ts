import { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";
import {getToken} from "next-auth/jwt"
import { connectToDatabase } from "../../../util/mongodb";
import {ObjectId} from "mongodb"
import {v4 as uuidv4} from "uuid"


export default async function handler(req: NextApiRequest, res: NextApiResponse){
    const session = await getToken({req})
    console.log(session.id)
//POST ONLY
    if(session){
        const {amount, listingId} = req.body
        const {db} = await connectToDatabase();


        //I feel like a sinner
        const user = await db.collection("users").findOne({ _id: ObjectId(session.id)})
        const listing = await db.collection("listings").findOne({_id: ObjectId(listingId)})
        console.log(JSON.stringify(listing));
        const seller = await db.collection("users").findOne({_id: ObjectId(listing.seller)})
        //console.log(JSON.stringify(seller))
        if(user){
            const amountFloat = parseFloat(amount)
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
                        amount: amountFloat,
                        currency: "NGN",
                        redirect_url: "http://localhost:3000/home",
                        meta: {
                            consumer_id: session.id,
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
                res.status(500).json(err)
            }
            
        
    }
}
    
    else{
        res.status(403).json({error: "Forbidden"})
    }
}