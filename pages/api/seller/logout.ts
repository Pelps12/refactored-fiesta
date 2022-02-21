import {NextApiRequest, NextApiResponse}from 'next'
import getCookies from '../cookies'
import {redis} from "../../redis"

export default async function (req: NextApiRequest, res: NextApiResponse){
   
   //Find the jwt in cookies
    const jwt = getCookies(req, 'jwt')

    //Set its value to false
   try{
       redis.set(jwt, "invalidSeller", "EX", 1213200)
   }
   catch(err){
       console.log(err)
   }
}
