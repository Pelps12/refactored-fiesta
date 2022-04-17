import {NextApiRequest, NextApiResponse}from 'next'
import DOMPurify from 'isomorphic-dompurify'
import {getSession} from "next-auth/react"
import {getToken} from "next-auth/jwt"
import fetch from "node-fetch"
import { Long, ObjectId } from 'mongodb'
import clientPromise from '../../../lib/mongodb'
var parser = require("ua-parser-js")
const Mixpanel = require('mixpanel');
import {v4 as uuidv4} from "uuid"
const mixpanel = Mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN);

/*!!!!!DO NOT FORGET TO CHANGE THIS */
const KEY = process.env.JWT_SECRET
console.log(KEY)
export default async function sellerReg(req: NextApiRequest, res:NextApiResponse){
    switch(req.method){
        case "POST":
            var ua = parser(req.headers["user-agent"])
            console.log(ua)
            var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            console.log(ip)
            const session:any = await getSession({req})
            const token = await getToken({req})
            const client = await clientPromise;
            const db = client.db(process.env.MONGODB_DB)
            console.log(token.roles)
            if(token.roles === "buyer"){
                /*If no request body provided */
                if(!req.body){
                    res.statusCode = 404
                    res.json({
                        success: false
                    })
                    res.end("Error!")
                    return
                }
                

                let {storename,long, lat, startTime, closingTime, accountBank, accountNumber} = req.body
                console.log(req.body);
                //NEVER TRUST THE CLIENT
                storename = DOMPurify.sanitize(storename)
                long = DOMPurify.sanitize(long)
                lat = DOMPurify.sanitize(lat)
                accountBank = DOMPurify.sanitize(accountBank)
                accountNumber = DOMPurify.sanitize(accountNumber)
                startTime = DOMPurify.sanitize(startTime)
                closingTime = DOMPurify.sanitize(closingTime)

                /*Search for user */
                //Call checkUser
                

                /*If the user already exist in the database */
                if(! await checkSeller(storename, db)){
                    res.statusCode = 409
                    res.json({
                        success: false,
                        error: "Seller already exists"
                    })
                    return
                }

                //PLACEHOLDER FOR DATABASE
                
                let createSeller: any;
                try{
                    console.log(`Session ID: ${session.id}`)
                    const result = await db.collection("users").findOne({"_id": new ObjectId(session.id)})
                    console.log(result);
                    if(result.matchedCount < 1){
                        return res.status(409).json({
                            success: false,
                            error: "User does not exist"
                        })
                        
                    }
                    //Call flutterwave
                    const flRes = await fetch('https://api.flutterwave.com/v3/subaccounts', {
                        method: "POST",
                        body: JSON.stringify({
                            account_bank: accountBank,
                            account_number: accountNumber,
                            business_name: storename,
                            business_mobile: result.phoneNumber,
                            business_email: result.email ?? "oluwapelps@gmail.com",
                            country: "NG",
                            split_type: "percentage",
                            split_value: 0.016,
                        }),
                        headers: {'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${process.env.PAYMENT_TOKEN}`
                                }
                    })
                    console.log(flRes);
                    const flData:any = await flRes.json()
                    console.log(flData)
                    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?result_type=neighborhood&key=${process.env.GOOGLE_MAPS_SECRET}&latlng=${lat},${long}`);
                    console.log(response);
                    const google_res:any = await response.json()
                    console.log(google_res);
                    if(flData.status === "success"){
                        const addSellerId = await db.collection("users").findOneAndUpdate({"_id": new ObjectId(session.id)},
                        {$set: {"storename": storename, 
                                "location": {
                                    "type": "Point",
                                    "coordinates": [parseFloat(long), parseFloat(lat)]
                                },
                                "startingTime": startTime,
                                "closingTime": closingTime,
                                "roles": "seller",
                                "accountBank": accountBank,
                                "accountNumber": accountNumber, 
                                "sellerId": flData.data.id,
                                "subaccount_id": flData.data.subaccount_id,
                                "area": google_res.results[0]?.address_components[0]?.long_name}})
                        res.status(201).json({addSellerId})
                        
                        mixpanel.people.set(addSellerId.insertedId, {
                            role: "seller"
                        })
                        
                        mixpanel.track("Seller Created", {
                            distinct_id: session?.id ?? uuidv4(),
                            $insert_id: uuidv4(),
                            ip: ip,
                            $os: ua.os.name,
                            $browser: ua.browser.name,
                            $browser_version: ua.browser.major,

                        })
                        return
                    }else{
                        return res.status(500).json({error: "Immediately contact developers"})
                    }
                    
                }
                catch(err){
                     return res.status(404).json({
                        error: err.message
                    })
                    //console.log(err.message)
                }
                
            }
            else if(token?.roles === "seller"){
                res.status(403).json({error: "Already a seller"})
            }
            else{
                res.status(403).json({error: "Already a seller"})
            }

            
           
            break;
            default:
                res.status(405).json({
                    message: "Only POST requests are allowed"
                })
    }
    
    
}


async function checkSeller(storename: string, db:any){
    const user = await db.collection("users").findOne({storename: storename})
    console.log("User: " +user)
    //If the storename already exists
    if(user){
        return false
    }
    console.log("False")
    return true
}