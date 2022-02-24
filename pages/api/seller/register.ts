import {NextApiRequest, NextApiResponse}from 'next'
import DOMPurify from 'isomorphic-dompurify'
import {connectToDatabase} from "../../../util/mongodb"
import {  Prisma } from '@prisma/client'
import {getSession} from "next-auth/react"
import {getToken} from "next-auth/jwt"
import {prisma} from "../../prisma"
import fetch from "node-fetch"
import {redis} from "../../redis"
import jwt from 'jsonwebtoken'
import { checkToken } from '../token'
import getCookies from '../cookies'
import { ObjectId } from 'mongodb'

//SALT FOR PASSWORD HASH
const saltRounds = 10





/*!!!!!DO NOT FORGET TO CHANGE THIS */
const KEY = process.env.JWT_SECRET
console.log(KEY)
export default async function sellerReg(req: NextApiRequest, res:NextApiResponse){
    switch(req.method){
        case "POST":
            const session:any = await getSession({req})
            const token = await getToken({req})
            const {db} = await connectToDatabase();
            console.log(token.roles)
            if(token.roles === "seller"){
                /*If no request body provided */
                if(!req.body){
                    res.statusCode = 404
                    res.json({
                        success: false
                    })
                    res.end("Error!")
                    return
                }
                

                let {storename,long, lat, alt, startTime, closingTime, accountBank, accountNumber} = req.body

                //NEVER TRUST THE CLIENT
                storename = DOMPurify.sanitize(storename)
                long = DOMPurify.sanitize(long)
                lat = DOMPurify.sanitize(lat)
                alt = DOMPurify.sanitize(alt)
                if(!alt){
                    alt = 0.0
                }
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
                    const result = await db.collection("users").findOneAndUpdate({"_id": ObjectId(session.id)}, 
                        {$set: {"storename": storename, 
                                "location": [parseFloat(long), parseFloat(lat), parseFloat(alt)],
                                "startingTime": startTime,
                                "closingTime": closingTime,
                                "roles": "seller",
                                "accountBank": accountBank,
                                "accountNumber": accountNumber,}})
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
                    const flData:any = await flRes.json()
                    console.log(result)
                    if(flData.status === "success"){
                        const addSellerId = await db.collection("users").findOneAndUpdate({"_id": ObjectId(session.id)}, 
                        {$set: {"sellerId": flData.data.id,
                                "subaccount_id": flData.data.subaccount_id}})
                        return res.status(201).json({result})
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
                


                /*If successful, return a JWT */

                res.status(201).json({
                    success: true,                    
                })
            }
            else{
                res.status(403).json({error: "Forbidden"})
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