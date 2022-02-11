import {NextApiRequest, NextApiResponse}from 'next'
import {prisma} from "../../prisma"


//Get sellers selling Product id in location
export default async function handler(req:NextApiRequest, res:NextApiResponse){
    const {id} = req.query
    const url:URL = new URL(req.url)
    const location:string = url.searchParams.get('location')

    switch(req.method){
        case "GET":
            const list = await prisma.listing.findMany({
                where:{
                    AND:[
                        {
                            productId:{
                                equals: typeof id === "string" ? parseInt(id): parseInt(id[0])
                            } 
                        },
                        {
    
                            seller:{
                                tempLocation: location
                            }
                        }
                    ]
                },
                select:{
                    id:true,
                    expiresAt:true,
                    startingPrice:true,
                    seller:{
                        select:{
                            storeName:true,
                            location:true,
                            profilePic: true,
                        }
                    }
                }

            })
            res.statusCode = 200
            res.json({
                sellersNearby: list
            })
            return
        break;
        default:
            res.statusCode = 405
            return
    }
}