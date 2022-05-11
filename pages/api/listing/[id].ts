import { ObjectID } from 'bson'
import { ObjectId } from 'mongodb'
import {NextApiRequest, NextApiResponse}from 'next'
import { getToken } from 'next-auth/jwt'
import DOMPurify from 'isomorphic-dompurify'
import { getSession } from 'next-auth/react'
import clientPromise from '../../../lib/mongodb'
import { connectToDatabase } from '../../../util/mongodb'
import { DateTime } from 'luxon'


//Get sellers selling Product id in location
export default async function handler(req:NextApiRequest, res:NextApiResponse){
    const {id}: any = req.query
    
    console.log(id)
    const url:URL = new URL(req.url, `http://${req.headers.host}`)
    const area:string = url.searchParams.get('area')
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB)
    switch(req.method){
        case "GET":
            
           try{
            const listing = await db
            .collection("listings")
            .findOne({_id: new ObjectId(id)});
            console.log(listing)
            
            
            const seller = await db
            .collection("listings")
            .findOne({seller: new ObjectId(listing.seller)});

            listing.seller = seller;
            return res.status(200).json({listing: listing})
             
            
            
           }
           catch(err){
               return res.status(500).json({err})
           }
            
        break;
        case "DELETE":
            const token = await getToken({req})
            
            if(token?.roles === "admin"){
                const product = await db
                .collection("listings")
                .deleteOne({_id: new ObjectId(id)})
                return res.status(200).json(product)
            }
        break;

        case "PUT":
            const query = req.body;
            const session = await getSession({req})

            if(query.expiresAt){
                query.expiresAt = convertToDateTime(query.expiresAt);
            }

            if(session?.roles === "buyer"){
                return res.status(403);
            }
            const updatedListing = await db.
            collection("listings")
            .updateOne({_id: new ObjectId(id)}, {
                $set: query
            })
            res.status(201).json(updatedListing)
            break;
        default:
            return res.status(405).json({
                message: "Only GET and DELETE requests are allowed"
            })
            
    }
}

function convertToDateTime(expiresAt: string): DateTime{
    const regex:RegExp = /^([01]\d|2[0-3]):{1}([0-5]\d)$/
    const globalRegex:RegExp = new RegExp(regex, 'g')
    if(!globalRegex.test(expiresAt)){
        throw "Invalid Date Format"
    }
    const [hours, minutes]:string[] = expiresAt.split(":")

    let time:DateTime = DateTime.fromObject({hour: parseInt(hours), minute: parseInt(minutes)}, {zone: "Africa/Lagos"})
    
    
    
    return time

}