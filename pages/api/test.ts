import { ObjectId } from "mongodb";
import {NextApiRequest, NextApiResponse} from "next"
import clientPromise from "../../lib/mongodb";
import {getToken} from "next-auth/jwt"

export async function getAvailable(req: NextApiRequest){
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB)
    //const token = await getToken({req})
    //const id:any = token.id
    //const {other_id} = req.query
    //console.log(id)
    //const rId = toString(other_id)

    const location = await db.collection("users").distinct("area")
    const product = await db.collection("products").find().project({name: 1, _id:0}).toArray()
    return {location, product}
}

export default async function test(req: NextApiRequest, res: NextApiResponse){
    
    const {location, product} = await getAvailable(req)
    res.status(200).json({location, product})
}

function toString(strarr: string | string[]){
    if(typeof strarr !== "string"){
        return strarr[0]
    }
    return strarr
}