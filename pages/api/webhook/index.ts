import {NextApiRequest, NextApiResponse} from "next"
import clientPromise from "../../../lib/mongodb"
import fetch from "node-fetch"

export default async function webhook(req:NextApiRequest, res:NextApiResponse){
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB)
    const response = await fetch("https://maps.googleapis.com/maps/api/geocode/json?result_type=neighborhood&key=AIzaSyDt22qu7cx0tcwYRcgKFE0cAYE7ce85mmg&latlng=6.526400556014318,3.392211612870637");
    const result:any = await response.json()

    const query = {
        location:{
            $nearSphere: {
                $geometry:{
                    type: "Point",
                    coordinates:[-96.75421206593323, 32.98646947174256]
                },
                $maxDistance: 1000
            }
        }
    }

    const users = await db.collection("users").find(query).toArray()

    return res.status(200).json(result.results[0].address_components[0].long_name)
}