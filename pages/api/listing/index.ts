import {NextApiRequest, NextApiResponse}from 'next'
import clientPromise from "../../../lib/mongodb"
import {getSession} from "next-auth/react"
import { getToken } from 'next-auth/jwt'
import DOMPurify from 'isomorphic-dompurify'
import { ObjectId } from 'mongodb'
var parser = require("ua-parser-js")
var Mixpanel = require('mixpanel');
import {v4 as uuidv4} from "uuid"


export default async function(req:NextApiRequest, res:NextApiResponse){
    
    const url:URL = new URL(req.url, `http://${req.headers.host}`)
    const token:any = await getToken({req})
    const product:string = url.searchParams.get('product')
    var mixpanel = Mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN);
    const sellerQ:string = url.searchParams.get('seller')
    const area:string = url.searchParams.get("area")
    const near:string = url.searchParams.get("near")
    const distance:string = url.searchParams.get("distance")
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB)
    var ua = parser(req.headers["user-agent"])
        console.log(ua)
        var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        console.log(ip)
    switch(req.method){
        case "GET":
            try{
                const session:any = await getSession({req})
                
                let listings:any
                console.log(sellerQ, product)
                console.log(area)
                const per_page:number = parseInt(url.searchParams.get("per_page"))
                const page_no:number = parseInt(url.searchParams.get("page"))
                const offset:number = per_page *(page_no - 1)
                console.log([...near.split(',').map(coord => parseFloat(coord))])
                const query = {...(sellerQ && {seller: ObjectId(sellerQ)}),
                            ...(product && {productId: product === "mine" ?  ObjectId(token.id) :  ObjectId(product)}),
                            ...(area && {area: area}),
                            ...(near && {location:{
                                $nearSphere: {
                                    $geometry:{
                                        type: "Point",
                                        coordinates: [...near.split(',').map(coord => parseFloat(coord))]
                                    },
                                    $maxDistance: parseInt(distance)
                                }
                            }})}
                console.log(query)
                listings = await db
                .collection("listings")
                .find(query)
                .limit(per_page ?? 10)
                .skip(offset ?? 1)
                .toArray()
                //console.log("Hello");
                console.log("Listings: "+listings)
                
                if(listings){
                    res.status(200).json({status: "success", "listings":listings, ...(page_no && {"page": page_no})})
                }
                else{
                    res.status(404).json({status: "success", "listings":listings, ...(page_no && {"page": page_no})})
                }      
            }catch(error){
                res.status(500).json(error.message)
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
                                location: {
                                    type: "Point",
                                    coordinates: [...seller.location.coordinates]
                                },
                                area: seller.area,
                                createdAt: new Date() })
                    //console.log(listing);
                    res.status(201).json(listing)

                    mixpanel.track("listing posted", {
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