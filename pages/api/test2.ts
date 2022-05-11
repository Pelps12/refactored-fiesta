import { ObjectId } from "mongodb";
import {NextApiRequest, NextApiResponse} from "next"
import { getToken } from "next-auth/jwt";
import { getSession } from "next-auth/react";
import clientPromise from "../../lib/mongodb";



export default async function test(req: NextApiRequest, res: NextApiResponse){
    
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB)

    const session:any = await getToken({req});
    console.log(db.collection("messages"))

    const ans = db.collection("messages").find().limit(1).sort({$natural:-1})

    const result = db.collection("messages").aggregate([
        { 
            $match: {
                          $or: [
                                    {receiver: new ObjectId("6217e1d4c973b0c66e4c6dac")},
                                    {sender: new ObjectId("6217e1d4c973b0c66e4c6dac")}
                           ]
            }
        },
        {
          $addFields: {
            duration: {
                $divide: 
                [{
                    $subtract: ["$$NOW", "$createdAt"]}, 36000]
            }
          }
        },
        
        {$sort: {duration: 1}},
        /* {$limit: 1}, */

/*         {
            $group: {
                _id: "$_id", mess
            }
        } */
        {
            $project: {
                message: 1, duration: 1, _id: 0, createdAt: 1}
        }
        ]);

        
        let message: any;
        for await (const doc of result){
            message = doc
            console.log(doc)
        }
        res.status(200).json(message)
}