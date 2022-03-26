import Ably from "ably/promises"
import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";

export default async function ably(req: NextApiRequest, res: NextApiResponse){
    
    if(req.method === "GET"){
        const token = await getToken({req})
        if(token){
            const id: any = token.id
            const client = new Ably.Realtime(process.env.ABLY_API_KEY)
            const tokenRequestData = await client.auth.createTokenRequest({clientId: id})
            //console.log(tokenRequestData)
            res.status(200).json(tokenRequestData)
        }else{
            res.send(403)
        }
        

    }else{
        res.send(405)
    }
    
}