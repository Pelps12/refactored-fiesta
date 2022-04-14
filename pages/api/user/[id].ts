import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from '../../../lib/mongodb'

export default async function sellerInfo(req: NextApiRequest, res: NextApiResponse){
    const {id}: any = req.query
    //console.log(id)

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB)

    switch(req.method){
        case "GET":
            const seller = await db.collection("users").findOne({_id: new ObjectId(id)}, {
                projection: {
                    password: 0, emailVerified:0, 
                }
            })
            //console.log(seller)
            res.status(200).json({data: seller})
            break;
        default:
            res.status(405)
    }
}