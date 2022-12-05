import { NextApiRequest, NextApiResponse } from "next";
import Flutterwave from "flutterwave-node-v3"
import {v4 as uuidv4} from "uuid"
import Mixpanel from "mixpanel";
import bcrypt from "bcrypt"
import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

/*This webhook endpoint verifies flutterwave payment info and sends it to Mixpanel */
export default async function payment(req: NextApiRequest, res: NextApiResponse){
    switch(req.method){
        case "POST":
            
            const flw = new Flutterwave(process.env.FLW_PUBLIC_KEY, process.env.PAYMENT_TOKEN)
            const mixpanel = Mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN);

            const hash:string = toString(req.headers['verif-hash'])

            const match = await bcrypt.compare(process.env.FLW_HASH, hash)
            console.log(match);
            if(!match){
                return res.send(401)
            }
            const {data} = req.body
            const {id} = data
            console.log(id)
            res.send(200)
            try{
                const response = await flw.Transaction.verify({
                    "id": `${id}`
                  })
                  
                  // It's a good idea to log all received events.
                if(response.status === "success"){
                  console.log("Hello 39");
                  //console.log(mixpanel);
                  const meta = response.data.meta;
                  console.log(meta.os)
                  const query= {...(meta.os && {$os: meta.os}),
                  ...(meta.browser && {$browser: meta.browser}),
                  ...(meta.browser_version && {$browser_version: meta.browser_version}),}
                  console.log(meta?.consumer_id);
                  
                
                    mixpanel.track("Item Purchase", {
                      distinct_id: meta?.consumer_id,
                      $insert_id: uuidv4(),
                      seller_id: meta?.seller_id,
                      price: response?.data.charged_amount,
                      volume: meta?.volume,
                      bargain: meta?.bargain === "true",
                      ip: meta?.ip,
                      ...query,
                
                    })
                    const client = await clientPromise;
                    const db = client.db(process.env.MONGODB_DB)

                    //STORE TRANSACTION DATA IN DATABASE
                    try{
                      db.collection("purchases")
                      .insertOne({
                      buyer: new ObjectId(meta?.consumer_id),
                      seller: new ObjectId(meta?.seller_id),
                      listing: new ObjectId(meta?.listing_id),
                      createdAt: new Date(response.data.created_at)
                      })
                      
                  }catch (error) {
                      console.log(error)
                  }
                  
                  
                }else{
                  console.log("FFFFFF")
                }
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