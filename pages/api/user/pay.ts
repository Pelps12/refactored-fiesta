import { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";
import DOMPurify from 'isomorphic-dompurify'
import {getToken, JWT} from "next-auth/jwt"
import {ObjectId} from "mongodb"
import {v4 as uuidv4} from "uuid"
import clientPromise from "../../../lib/mongodb";
import { getSession } from "next-auth/react";
var parser = require("ua-parser-js")
var Mixpanel = require('mixpanel');

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    console.log()
    const session: any = await getSession({req})
    const referer = req.headers['referer']
    console.log(referer)
//POST ONLY
    if(session){
        let {amount, listingId, bargain} = req.body
        amount = DOMPurify.sanitize(amount)
        console.log(typeof amount)
        listingId = DOMPurify.sanitize(listingId)
        bargain =DOMPurify.sanitize(bargain)
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB)


        //I don't feel like a sinner
        const [user, listing] = await Promise.all([
            db.collection("users").findOne({ _id: new ObjectId(session.id)}),
            db.collection("listings").findOne({_id: new ObjectId(listingId)})
        ])
        console.log(user);
        if(!listing){
            return res.status(404).json({error: "Listing does not exist"})
        }
        const seller = await db.collection("users").findOne({_id: new ObjectId(listing.seller)})
        console.log(seller);
        console.log(listing);
        
        //console.log(JSON.stringify(seller))
        if(user && listing && listing?.available===true && seller){
            const amountFloat = parseFloat(amount)
            if(isNaN(amountFloat)){
                return res.status(400).json({error: "Amount must be a number string"})
            }
            var ua = parser(req.headers["user-agent"])
            var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            
            const seller_portion = 0.97* amountFloat;
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
                        redirect_url: referer ?? "http://localhost:3000/home",
                        meta: {
                            consumer_id: `${session.id}` ,
                            seller_id: `${seller._id}`,
                            ip: ip,
                             os:ua.os.name || "N/A",
                            browser: ua.browser.name || "N/A",
                            browser_version: ua.browser.major || "N/A",
                            bargain: bargain,

                        },
                        customer: {
                            email: user.email,
                            phonenumber: user.phoneNumber,
                            name: user.name
                        },
                        subaccounts:[
                            {
                                id: seller.subaccount_id,
                                transaction_charge_type: "flat-subaccount",
                                transaction_charge: seller_portion
                            }
                        ],
                        customizations: {
                            title: seller.storename,
                            logo: seller.image
                        }
                        
                    })
                })
                const data:any = await response.json()
                res.status(200).json(data)

                
            }catch(err){
                res.status(500).json(err.message)
            }
            
        
    }else{
        res.status(404).json({error: "Not found"})
    }
}
    
    else{
        res.status(403).json({error: "Forbidden"})
    }
}