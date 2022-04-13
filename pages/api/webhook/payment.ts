import { NextApiRequest, NextApiResponse } from "next";
import Flutterwave from "flutterwave-node-v3"
import {v4 as uuidv4} from "uuid"
import Mixpanel from "mixpanel";
import bcrypt from "bcrypt"

/*This webhook endpoint verifies flutterwave payment info and sends it to Mixpanel */
export default async function payment(req: NextApiRequest, res: NextApiResponse){
    switch(req.method){
        case "POST":
            
            const flw = new Flutterwave(process.env.FLW_PUBLIC_KEY, process.env.PAYMENT_TOKEN)
            const mixpanel = Mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN);

            const hash:string = toString(req.headers['verif-hash'])

            const match = await bcrypt.compare(process.env.FLW_HASH, hash)
            if(!match){
                return res.send(401)
            }
            const {id} = req.body
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
                  const query= {...(meta.os && {$os: meta.os}),
                  ...(meta.browser && {$browser: meta.browser}),
                  ...(meta.browser_version && {$browser_version: meta.browser_version}),}
                  console.log(meta?.consumer_id);
                  
                
                    mixpanel.track("item purchased", {
                      distinct_id: meta?.consumer_id,
                      $insert_id: uuidv4(),
                      seller_id: meta?.seller_id,
                      price: response?.data.charged_amount,
                      volume: meta?.volume,
                      bargain: meta?.bargain === "true",
                      ip: meta?.ip,
                      query,
                
                    })
                  
                  
                  
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