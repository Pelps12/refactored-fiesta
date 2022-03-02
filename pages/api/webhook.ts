import {NextApiRequest, NextApiResponse} from "next"

export async function webhook(req:NextApiRequest, res:NextApiResponse){
    const hash = req.headers["verif-hash"]

    if(!hash){
        res.statusCode = 400
        res.json({
            error: "Not from Flutterwave"
        })
        return
    }

    const secret_hash = process.env.WEBHOOK_HASH;

    if(secret_hash !== secret_hash){
        res.statusCode = 400
        res.json({
            error: "Invalid Signature"
        })
        return
    }

    const request_json = JSON.parse(req.body);
    //Do API shit here
    console.log(request_json)
    res.send(200)
    return
}