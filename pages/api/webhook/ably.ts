import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/mongodb";
import bcrypt from "bcrypt"
import { ObjectId } from "mongodb";

interface AblyReq {
    channel: string,
    messages: any
}
export default async function ably(req: NextApiRequest, res: NextApiResponse){
    switch(req.method){
        case "POST":
            const client = await clientPromise;
            const db = client.db(process.env.MONGODB_DB)

            console.log(req.body)
            const hash:string = toString(req.headers['verif-hash'])

            const match = await bcrypt.compare(process.env.ABLY_HASH, hash)
            if(!match){
                return res.send(401)
            }
            const {channel, messages}:AblyReq = req.body

            const receiver = channel.split(':')[1]
            const sender = messages[0].clientId
            const timestamp = messages[0].timestamp
            const message = JSON.parse(messages[0].data)
            res.send(200)
            try{
                db.collection("messages")
                .insertOne({
                sender: new ObjectId(sender),
                receiver: new ObjectId(receiver),
                message: message,
                createdAt: new Date(timestamp)
                })
                
            }catch (error) {
                console.log(error)
            }
            break;
        default:
            res.send(405)
    }
}

function toString(strarr: string | string[]){
    if(typeof strarr !== "string"){
        return strarr[0]
    }
    return strarr
}