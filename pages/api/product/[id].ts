import { ObjectID } from 'bson'
import { ObjectId } from 'mongodb'
import {NextApiRequest, NextApiResponse}from 'next'
import { getToken } from 'next-auth/jwt'
import { getSession } from 'next-auth/react'
import { connectToDatabase } from '../../../util/mongodb'
import {prisma} from "../../prisma"


//Get sellers selling Product id in location
export default async function handler(req:NextApiRequest, res:NextApiResponse){
    const {id} = req.query
    
    console.log(id)
    const url:URL = new URL(req.url, `http://${req.headers.host}`)
    const area:string = url.searchParams.get('area')
    const {db} = await connectToDatabase()
    switch(req.method){
        case "GET":
            console.log(` Line 20 Please Work: ${JSON.stringify(await getToken({req}))}`)
           try{
            const product = await db
            .collection("products")
            .find({_id: ObjectId(id)})
            .toArray();
            console.log(product)
            
            const listings = await db
            .collection("listings")
            .find({productId: ObjectId(id), ...(area && {area: area})})
            .toArray();
            return res.status(200).json({product: product[0], listings: listings})
             
            
            
           }
           catch(err){
               return res.status(500).json({err})
           }
            
        break;
        case "DELETE":
            const token = await getToken({req})
            
            if(token?.roles === "admin"){
                const product = await db
                .collection("products")
                .deleteOne({_id: ObjectId(id)})
                return res.status(200).json(product)
            }
        default:
            return res.status(405).json({
                message: "Only GET and DELETE requests are allowed"
            })
            
    }
}