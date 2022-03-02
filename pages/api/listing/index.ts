import {NextApiRequest, NextApiResponse}from 'next'
import {connectToDatabase, disconnect} from "../../../util/mongodb"
import {getSession} from "next-auth/react"
import DOMPurify from 'isomorphic-dompurify'
import { getToken } from 'next-auth/jwt'
import { ObjectId } from 'mongodb'


export default async function(req:NextApiRequest, res:NextApiResponse){
    
    const url:URL = new URL(req.url, `http://${req.headers.host}`)
    //const session:any = await getSession({req})
    const product:string = url.searchParams.get('product')
    const sellerQ:string = url.searchParams.get('seller')
    const area:string = url.searchParams.get("area")
    const {db, client} = await connectToDatabase();
    switch(req.method){
        case "GET":
            try{
                let listings:any
                console.log(sellerQ, product)
                console.log(area)
                const per_page:number = parseInt(url.searchParams.get("per_page"))
                const page_no:number = parseInt(url.searchParams.get("page"))
                const offset:number = per_page *(page_no - 1)
                const query = {...(sellerQ && {seller: ObjectId(sellerQ)}),
                            ...(product && {productId: ObjectId(product)}),
                            ...(area && {area: area})}
                console.log(query)
                listings = await db
                .collection("listings")
                .find(query)
                .limit(per_page ?? 10)
                .skip(offset ?? 1)
                .toArray()
                    //console.log("Hello");
                
                
                //console.log("Listings: "+listings)
            res.status(200).json({status: "success", "listings":listings, ...(page_no && {"page": page_no})})
            disconnect(client)
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
                    const seller = await db.collection("users").findOne({_id: ObjectId(session.id)})
                    expiresAt = DOMPurify.sanitize(expiresAt)
                    startingPrice = DOMPurify.sanitize(startingPrice)
                    productId = DOMPurify.sanitize(productId)
                    //console.log(40)
                    const listing = await db
                    .collection("listings") //Remember to sanitize the body
                    .insertOne({expiresAt: convertToDateTime(expiresAt), 
                                startingPrice: parseFloat(startingPrice),
                                productId: ObjectId(productId),
                                seller: ObjectId(session.id),
                                area: seller.area,
                                createdAt: new Date() })
                    //console.log(listing);
                    res.status(201).json(listing)
                }catch(error){
                    res.status(500).json({error: error})
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
        throw "Invalid Date Format"
    }
    const [hours, minutes]:string[] = expiresAt.split(":")

    let time:Date = new Date()
    time.setMinutes(parseInt(minutes))
    time.setHours(parseInt(hours))
    return time

}