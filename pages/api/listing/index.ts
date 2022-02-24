import {NextApiRequest, NextApiResponse}from 'next'
import {connectToDatabase} from "../../../util/mongodb"
import {getSession} from "next-auth/react"
import DOMPurify from 'isomorphic-dompurify'
import { getToken } from 'next-auth/jwt'
import { ObjectId } from 'mongodb'


export default async function(req:NextApiRequest, res:NextApiResponse){
    const url:URL = new URL(req.url, `http://${req.headers.host}`)
    const category:string = url.searchParams.get('product')
    const {db} = await connectToDatabase();
    switch(req.method){
        case "GET":
            try{
                const listings = await db
                .collection("listings")
                .find()
                .toArray()
            res.status(200).json(listings)
            }catch(error){
                res.status(500).json(error)
            }
        break;
        case "POST":
            //Get the session
            const session:any = await getSession({req})
            const token = await getToken({req})
            let {expiresAt, startingPrice, productId} = req.body

            
            //If the user has seller privileges
            if(token?.roles === "seller"){
                try{
                    expiresAt = DOMPurify.sanitize(expiresAt)
                    startingPrice = DOMPurify.sanitize(startingPrice)
                    productId = DOMPurify.sanitize(productId)
                    const listing = await db
                    .collection("listings") //Remember to sanitize the body
                    .insertOne({expiresAt: convertToDateTime(expiresAt), 
                                startingPrice: parseFloat(startingPrice),
                                productId: ObjectId(productId),
                                seller: ObjectId(session.id),
                                createdAt: new Date() })
                    res.status(201).json(listing)
                }catch(error){
                    res.status(500).json(error)
                }
            }
            else{
                res.status(403).json({error: "Not a seller"})
            }
        break;

    }

}

function convertToDateTime(expiresAt: string): Date{
    const regex:RegExp = /^([01]\d|2[0-3]):{1}([0-5]\d)$/
    const globalRegex:RegExp = new RegExp(regex, 'g')
    if(!globalRegex.test(expiresAt)){
        throw "Invalid Format"
    }
    const [hours, minutes]:string[] = expiresAt.split(":")

    let time:Date = new Date()
    time.setMinutes(parseInt(minutes))
    time.setHours(parseInt(hours))
    return time

}