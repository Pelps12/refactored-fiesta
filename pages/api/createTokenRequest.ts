import Ably from "ably/promises"
import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";

const client = new Ably.Realtime({key: process.env.ABLY_API_KEY})
            
export default async function ably(req: NextApiRequest, res: NextApiResponse){
    
    if(req.method === "GET"){
        //console.log(req);
        const token = await getToken({req})
        
        if(token){
            const id: any = token.id
            const userChannel = "chat:".concat(id)
            console.log(userChannel)
            let permissions:any = {
                "chat:*": ["publish"],

            }
            permissions[`chat:${id}`] = ["subscribe"]
            //console.log(permissions)
            const tokenRequestData = await client.auth.createTokenRequest({clientId: id, capability:
                permissions
            })
            console.log(tokenRequestData)
            client.close()
            res.status(200).json(tokenRequestData)
        }else{
            res.send(403)
        }
        

    }else{
        res.send(405)
    }
    
}