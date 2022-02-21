import {NextApiRequest, NextApiResponse}from 'next'
import {connectToDatabase} from "../../../util/mongodb"
import {getSession} from "next-auth/react"
import { Timestamp } from 'mongodb'


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

            //If the user has seller privileges
            if(session?.token?.roles === "seller"){
                try{
                    const listing = await db
                    .collection("listings") //Remember to sanitize the body
                    .insertOne({...req.body, seller: `ObjectId(\"${session.id}\")`, createdAt: new Date() })
                    res.status(201).json(listing)
                }catch(error){
                    res.status(500).json(error)
                }
            }
            else{
                res.status(403).json({error: "Not a seller"})
            }
            
    }

}