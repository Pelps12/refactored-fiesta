import {NextApiRequest, NextApiResponse}from 'next'
import clientPromise from "../../../lib/mongodb"
import {getSession} from "next-auth/react"
import { getToken } from 'next-auth/jwt'
import DOMPurify from 'isomorphic-dompurify'
import { ObjectId } from 'mongodb'
var parser = require("ua-parser-js")
var Mixpanel = require('mixpanel');

import {encode} from "js-base64"
import {v4 as uuidv4} from "uuid"


export default async function(req:NextApiRequest, res:NextApiResponse){
    
    const url:URL = new URL(req.url, `http://${req.headers.host}`)
    const token:any = await getToken({req})
    const seller:string = url.searchParams.get('with')
    if(!seller){
        return res.status(400).json({error: "Please include correspondant"})
    }
    var mixpanel = Mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN);
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB)
    var ua = parser(req.headers["user-agent"])
        console.log(ua)
        var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        console.log(ip)
    switch(req.method){
        case "GET":
            const session:any = await getSession({req})
                if(session){
                    try{
                
                        let messages:any
                        const per_page:number = parseInt(url.searchParams.get("per_page"))
                        const page_no:number = parseInt(url.searchParams.get("page"))
                        const start:string = url.searchParams.get("start")
                        console.log(start)
                        if(!page_no && !per_page && !start){
                            return res.status(400).json({error: "Please include per_page, page_no, and start queries"})
                        }
                        const offset:number = per_page *(page_no - 1)
                        const query = {$and: [{$or:[{sender:ObjectId(seller), receiver: ObjectId(session.id)},
                                            {sender:ObjectId(session.id), receiver: ObjectId(seller)}]}, 
                                            {createdAt: {$lt: new Date(start)}}]}
                        console.log(query)
                        messages = await db
                                    .collection("messages")
                                    .find(query)
                                    .sort({createdAt: -1})
                                    .limit(per_page ?? 10)
                                    .skip(offset ?? 1)
                                    .project({ _id: 0})
                                    .toArray()
                        //console.log("Hello");
                        console.log("Listings: "+messages)              
                        var mixpanel = Mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN);
                        mixpanel.track("logged in", {
                            distinct_id: session?.id ?? uuidv4(),
                            $insert_id: uuidv4(),
                            ip: ip,
                            $os: ua.os.name,
                            $browser: ua.browser.name,
                            $browser_version: ua.browser.major,
        
                        })
                        
                        if(messages){
                            res.status(200).json({status: "success", "messages":messages, ...(page_no && {"page": page_no})})
                        }
                        else{
                            res.status(404).json({status: "success", "messages":messages, ...(page_no && {"page": page_no})})
                        }
        
                          
                        
                        mixpanel.track("logged in", {
                            distinct_id: session?.id ?? uuidv4(),
                            $insert_id: uuidv4(),
                            ip: ip,
                            $os: ua.os.name,
                            $browser: ua.browser.name,
                            $browser_version: ua.browser.major,
        
                        })
                        console.log(ua)
                        
                    
                    
                    }catch(error){
                        res.status(500).json(error.message)
                    }
                }
            else{
                res.status(403).json({error: "Forbidden"})
            }
        break;
        default:
            res.status(400).json({error: "Only GET requests are allowed"})
    }
}