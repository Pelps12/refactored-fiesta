import {NextApiRequest, NextApiResponse}from 'next'
import clientPromise from "../../../lib/mongodb"
import {getSession} from "next-auth/react"
import { getToken } from 'next-auth/jwt'
import DOMPurify from 'isomorphic-dompurify'
import { DateTime } from 'luxon'
import { ObjectId } from 'mongodb'
var parser = require("ua-parser-js")
var Mixpanel = require('mixpanel');
import {v4 as uuidv4} from "uuid"


export default async function(req:NextApiRequest, res:NextApiResponse){
    
    const url:URL = new URL(req.url, `http://${req.headers.host}`)
    const token:any = await getToken({req})
    const product:string = url.searchParams.get('product')
    
    const sellerQ:string = url.searchParams.get('seller')
    const area:string = url.searchParams.get("area")
    const near:string = url.searchParams.get("near")
    const distance:string = url.searchParams.get("distance")
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB)
    var ua = parser(req.headers["user-agent"])
        
        var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        
    switch(req.method){
        case "GET":
            try{
                
                const session:any = await getSession({req})

                //Change later
                
                
                let listings:any
                
                const per_page:number = parseInt(url.searchParams.get("per_page"))
                const page_no:number = parseInt(url.searchParams.get("page"))
                
                
                const offset:number = per_page *(page_no - 1)
                console.log(offset)
                const query = {...(sellerQ && {seller: new ObjectId(sellerQ)}),
                            ...(product && product === "mine" && {"seller": session.id}),
                            ...(product && product !== "mine" && {"product.name" : product}),
                            ...(area && {area: area}),
                            ...(near && {location:{
                                $nearSphere: {
                                    $geometry:{
                                        type: "Point",
                                        coordinates: [...near.split(',').map(coord => parseFloat(coord))]
                                    },
                                    $maxDistance: parseInt(distance)
                                }
                            },
                            
                            }),
                            available: true}
               
                listings = await db
                .collection("listings")
                .find(query)
                .limit(isNaN(per_page) ? 2: per_page)
                .skip(isNaN(offset) ? 0 : offset)
                .toArray()
                            
                console.log(query)
                
                if(!sellerQ){
                    const sellers = new Map()
                    for await (let listing of listings) {
                        const sellerId:string = listing.seller.toString().split('\"')[0]
                            if(sellers.has(sellerId)){
                                
                                listing.seller = sellers.get(sellerId)
                            }
                            else{
                                listing.seller = await db.collection("users")
                                .findOne({_id: new ObjectId(listing.seller)}, 
                                            { projection: { password: 0 ,
                                                            area:0,
                                                            location:0,
                                                            accountBank: 0,
                                                            accountNumber: 0,
                                                            roles: 0,
                                                            sellerId: 0,
                                                            subaccount_id: 0,}})
                                
                                sellers.set(sellerId, listing.seller)
                            }
                    }
                }
                else{
                    const seller = await db.collection("users")
                                    .findOne({_id: new ObjectId(sellerQ)}, 
                                    { projection: { password: 0 ,
                                                    area:0,
                                                    location:0,
                                                    accountBank: 0,
                                                    accountNumber: 0,
                                                    roles: 0,
                                                    sellerId: 0,
                                                    subaccount_id: 0,}})
                    
                    for await (let listing of listings) {
                        listing.seller = seller
                    }
                    
                }
                
                
               

                
                
                
                if(listings){
                    res.status(200).json(listings)
                }
                else{
                    res.status(404).json({status: "success", "listings":listings, ...(page_no && {"page": page_no})})
                }      
            }catch(error){
                res.status(500).json(error.message)
            }
        break;
        case "POST":
            console.log(":)")
            //Get the session
            const session:any = await getSession()
            console.log(`SESSION ${session}`)
            const token:any = await getToken({req})
            let {expiresAt, startingPrice, productId} = req.body
            console.log(token)

            
            
            //If the user has seller privileges
            if(token?.roles === "seller"){
                try{
                    expiresAt = DOMPurify.sanitize(expiresAt)
                    startingPrice = DOMPurify.sanitize(startingPrice)
                    productId = DOMPurify.sanitize(productId)
                    console.log(147)
                    const [product, seller, sListing] = await Promise.all([
                        db.collection("products").findOne({_id: new ObjectId(productId)}),
                        db.collection("users").findOne({_id: new ObjectId(token.id)}),
                        db.collection("listings").findOne({seller: new ObjectId(token.id), "product._id": new ObjectId(productId)})
                    ])
                    console.log(153)
                    console.log(sListing);
                    if(sListing){
                        return res.status(403).json({error: "Listing already exists"})
                    }
                    
                    console.log(product)
                    
                    
                    const listing = await db
                    .collection("listings") //Remember to sanitize the body
                    .insertOne({expiresAt: convertToDateTime(expiresAt), 
                                startingPrice: parseFloat(startingPrice),
                                product: product,
                                seller: new ObjectId(session.id),
                                area: seller.area,
                                location: seller.location,
                                available:true,
                                createdAt: new Date() })
                    
                    res.status(201).json(listing)

                    var mixpanel = Mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN);

                    mixpanel.track("Listing Posted", {
                        distinct_id: session?.id,
                        $insert_id: uuidv4(),
                        starting_price: startingPrice,
                        ip:ip,
                        $os: ua.os.name,
                        $browser: ua.browser.name,
                        $browser_version: ua.browser.major,
                        
                  
                      })
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
